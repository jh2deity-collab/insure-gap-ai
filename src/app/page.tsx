"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Shield, ChevronRight, Download, BarChart2, RotateCcw, ArrowLeft, TrendingUp } from "lucide-react"

import { UserState, FinanceState } from "@/types"
import { getStandardCoverage, calculateGapScore } from "@/lib/data"

// Components
import ReportModal from "@/components/ReportModal"
import DownloadComplete from "@/components/DownloadComplete"
import LandingSelector from "@/components/LandingSelector"
import FinanceDashboard from "@/components/FinanceDashboard"
import InsuranceDashboard from "@/components/InsuranceDashboard"
import ResetConfirmModal from "@/components/ResetConfirmModal"

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'insurance' | 'finance'>('landing')

  const [userState, setUserState] = useState<UserState>({
    age: 35,
    gender: 'male',
    coverages: {
      cancer: 3000,
      brain: 1000,
      heart: 1000,
      medical: 10000,
      death: 10000
    }
  })

  // Initial State for Finance
  const initialFinanceState: FinanceState = {
    age: 35,
    retirementAge: 65,
    targetMonthlyIncome: 300,
    currentIncome: 500,
    currentExpenses: 250,
    assets: {
      cash: 5000,
      stock: 3000,
      realEstate: 0,
      crypto: 0
    }
  }

  const [financeState, setFinanceState] = useState<FinanceState>(initialFinanceState)

  // Initial State for Reset
  const initialState: UserState = {
    age: 35,
    gender: 'male',
    coverages: {
      cancer: 3000,
      brain: 1000,
      heart: 1000,
      medical: 10000,
      death: 10000
    }
  }

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isDownloadCompleteOpen, setIsDownloadCompleteOpen] = useState(false)

  // Reset Modal State
  const [resetConfig, setResetConfig] = useState<{
    isOpen: boolean;
    type: 'insurance' | 'finance' | null
  }>({ isOpen: false, type: null })

  const contentRef = useRef<HTMLDivElement>(null)

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('userState')
    const savedFinance = localStorage.getItem('financeState')
    if (savedUser) setUserState(JSON.parse(savedUser))
    if (savedFinance) setFinanceState(JSON.parse(savedFinance))
  }, [])

  useEffect(() => {
    localStorage.setItem('userState', JSON.stringify(userState))
  }, [userState])

  useEffect(() => {
    localStorage.setItem('financeState', JSON.stringify(financeState))
  }, [financeState])


  // Derived State

  // Derived State
  const standardData = getStandardCoverage(userState.age, userState.gender)
  const gapAnalysis = calculateGapScore(userState.coverages, standardData)

  const handleResetClick = (type: 'insurance' | 'finance') => {
    setResetConfig({ isOpen: true, type })
  }

  const handleConfirmReset = () => {
    if (resetConfig.type === 'insurance') {
      setUserState(initialState)
    } else if (resetConfig.type === 'finance') {
      setFinanceState(initialFinanceState)
    }
  }

  const handleStateChange = (key: string, value: any) => {
    if (key === 'coverage') {
      setUserState(prev => ({
        ...prev,
        coverages: { ...prev.coverages, [value.key]: value.value }
      }))
    } else {
      setUserState(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleReset = () => {
    handleResetClick('insurance')
  }

  const handleFinanceStateChange = (key: string, value: any) => {
    if (key === 'assets') {
      setFinanceState(prev => ({
        ...prev,
        assets: { ...prev.assets, [value.key]: value.value }
      }))
    } else {
      setFinanceState(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleFinanceReset = () => {
    handleResetClick('finance')
  }

  const generatePDF = async () => {
    setIsReportModalOpen(false)

    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default

    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current, {
          scale: 2,
          backgroundColor: '#1A1F2C', // Deep Navy Background
          logging: false,
          useCORS: true
        })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

        const fileName = viewMode === 'finance'
          ? `Financial_Report_${financeState.age}_${financeState.currentIncome}.pdf`
          : `InsureGap_Report_${userState.age}_${userState.gender}.pdf`

        pdf.save(fileName)

        // Show Success Modal
        setTimeout(() => setIsDownloadCompleteOpen(true), 500)

      } catch (err) {
        console.error(err)
        alert("PDF 생성 중 오류가 발생했습니다.")
      }
    }
  }

  // --- Views ---

  if (viewMode === 'landing') {
    return <LandingSelector onSelect={setViewMode} />
  }

  // ... (removed)

  // ... (existing imports)

  // ... (inside component)

  if (viewMode === 'finance') {
    return (
      <main className="min-h-screen bg-[#1A1F2C] text-slate-100 pb-20 font-sans">
        {/* Monetization Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onConfirm={generatePDF}
        />

        {/* Success Modal */}
        <DownloadComplete
          isOpen={isDownloadCompleteOpen}
          onClose={() => setIsDownloadCompleteOpen(false)}
        />

        <ResetConfirmModal
          isOpen={resetConfig.isOpen}
          onClose={() => setResetConfig({ ...resetConfig, isOpen: false })}
          onConfirm={handleConfirmReset}
          title={resetConfig.type === 'finance' ? "재무 설계 초기화" : "보장 분석 초기화"}
          description="입력하신 모든 데이터가 초기화됩니다. 계속하시겠습니까?"
        />

        <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="py-8 flex justify-between items-center border-b border-slate-800 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('landing')}
                className="p-2 -ml-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/assets/back-arrow.png"
                  alt="Back"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setViewMode('landing')}
              >
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">Financial AI</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleFinanceReset}
                className="group flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-300"
                title="설정 초기화"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline font-medium">초기화</span>
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>리포트 저장</span>
              </button>
            </div>
          </header>

          <FinanceDashboard financeState={financeState} onStateChange={handleFinanceStateChange} />
        </div>
      </main>
    )
  }

  // Insurance Mode (Default Dashboard)
  return (
    <main className="min-h-screen bg-[#1A1F2C] text-slate-100 pb-20 font-sans">
      {/* Monetization Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onConfirm={generatePDF}
      />

      {/* Success Modal */}
      <DownloadComplete
        isOpen={isDownloadCompleteOpen}
        onClose={() => setIsDownloadCompleteOpen(false)}
      />

      <ResetConfirmModal
        isOpen={resetConfig.isOpen}
        onClose={() => setResetConfig({ ...resetConfig, isOpen: false })}
        onConfirm={handleConfirmReset}
        title={resetConfig.type === 'finance' ? "재무 설계 초기화" : "보장 분석 초기화"}
        description="입력하신 모든 데이터가 초기화됩니다. 계속하시겠습니까?"
      />

      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <InsuranceDashboard
          userState={userState}
          standardData={standardData}
          gapAnalysis={gapAnalysis}
          onChange={handleStateChange}
          onReset={handleReset}
          onDownload={generatePDF}
          onNavigateHome={() => setViewMode('landing')}
        />
      </div>
    </main>
  )
}
