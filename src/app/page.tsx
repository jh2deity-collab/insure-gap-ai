"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Shield, Download, BarChart2, RotateCcw, ArrowLeft, TrendingUp } from "lucide-react"

import { UserState, FinanceState, CoverageData, AnalysisResult, TrackedAsset } from "@/types"
import { getStandardCoverage, calculateGapScore } from "@/lib/data"

// Components
import DownloadComplete from "@/components/DownloadComplete"
import LandingSelector from "@/components/LandingSelector"
import FinanceDashboard from "@/components/FinanceDashboard"
import InsuranceDashboard from "@/components/InsuranceDashboard"
import ResetConfirmModal from "@/components/ResetConfirmModal"
import dynamic from 'next/dynamic'

const ReportPDF = dynamic(() => import("@/components/ReportPDF"), { ssr: false })

import AIConsulting from "@/components/AIConsulting"

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'insurance' | 'finance'>('landing')

  const [userState, setUserState] = useState<UserState>({
    name: "홍길동",
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
    name: "홍길동",
    age: 35,
    gender: 'male',
    retirementAge: 65,
    targetMonthlyIncome: 300,
    currentIncome: 500,
    currentExpenses: 250,
    nationalPension: 150,
    assets: {
      cash: 5000,
      stock: 3000,
      realEstate: 0,
      pension: 0,
      insurance: 0,
      crypto: 0
    }
  }

  const [financeState, setFinanceState] = useState<FinanceState>(initialFinanceState)

  // Initial State for Reset
  const initialState: UserState = {
    name: "홍길동",
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

  const [isDownloadCompleteOpen, setIsDownloadCompleteOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Reset Modal State
  const [resetConfig, setResetConfig] = useState<{
    isOpen: boolean;
    type: 'insurance' | 'finance' | null
  }>({ isOpen: false, type: null })

  const handleDownloadClick = () => {
    generatePDF()
  }

  const contentRef = useRef<HTMLDivElement>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const [isMounted, setIsMounted] = useState(false)

  // Persistence
  useEffect(() => {
    setIsMounted(true)
    const savedUser = localStorage.getItem('userState')
    const savedFinance = localStorage.getItem('financeState')
    if (savedUser) try {
      const parsed = JSON.parse(savedUser)
      setUserState({ ...initialState, ...parsed, coverages: { ...initialState.coverages, ...parsed.coverages } })
    } catch (e) { }
    if (savedFinance) try {
      const parsed = JSON.parse(savedFinance)
      setFinanceState({ ...initialFinanceState, ...parsed, assets: { ...initialFinanceState.assets, ...parsed.assets } })
    } catch (e) { }
  }, [])

  useEffect(() => {
    if (isMounted) localStorage.setItem('userState', JSON.stringify(userState))
  }, [userState, isMounted])

  useEffect(() => {
    if (isMounted) localStorage.setItem('financeState', JSON.stringify(financeState))
  }, [financeState, isMounted])


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
    setResetConfig({ isOpen: false, type: null })
  }

  const handleStateChange = (key: string, value: string | number | { key: string; value: number }) => {
    if (key === 'coverage' && typeof value === 'object' && 'key' in value) {
      setUserState(prev => ({
        ...prev,
        coverages: { ...prev.coverages, [value.key]: value.value }
      }))
    } else if (typeof value !== 'object') {
      setUserState(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleReset = () => {
    handleResetClick('insurance')
  }

  const handleFinanceStateChange = (key: string, value: string | number | { key: string; value: number | TrackedAsset[] }) => {
    if (key === 'assets' && typeof value === 'object' && 'key' in value) {
      setFinanceState(prev => ({
        ...prev,
        assets: {
          ...prev.assets,
          [value.key]: value.value
        }
      }))
    } else if (typeof value !== 'object') {
      setFinanceState(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleFinanceReset = () => {
    handleResetClick('finance')
  }

  const generatePDF = async () => {
    setIsGenerating(true)

    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default

    const targetElement = reportRef.current;

    if (targetElement) {
      try {
        // Wait a bit to ensure charts are rendered in the hidden div
        await new Promise(resolve => setTimeout(resolve, 1500));

        const pages = targetElement.querySelectorAll('.pdf-page');
        if (pages.length === 0) {
          throw new Error("보고서 페이지를 찾을 수 없습니다.");
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i] as HTMLElement;
          const canvas = await html2canvas(page, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
          });

          const imgData = canvas.toDataURL('image/png');
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        const fileName = viewMode === 'finance'
          ? `Premium_Finance_Report_${financeState.age}.pdf`
          : `Premium_InsureGap_Report_${userState.age}.pdf`

        pdf.save(fileName)
        setIsGenerating(false)
        setTimeout(() => setIsDownloadCompleteOpen(true), 500)
      } catch (err) {
        console.error(err)
        setIsGenerating(false)
        alert("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    } else {
      setIsGenerating(false)
      alert("리포트 데이터를 준비 중입니다. 잠시만 기다려주세요.")
    }
  }

  // --- Render Helpers ---

  if (viewMode === 'landing') {
    return <LandingSelector onSelect={setViewMode} />
  }

  const renderDashboard = () => {
    if (viewMode === 'finance') {
      return (
        <FinanceDashboard financeState={financeState} onStateChange={handleFinanceStateChange} />
      )
    }
    return (
      <InsuranceDashboard
        userState={userState}
        standardData={standardData}
        gapAnalysis={gapAnalysis}
        onChange={handleStateChange}
      />
    )
  }

  const renderHeader = () => {
    const isFinance = viewMode === 'finance'
    return (
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
              className="w-8 h-8 object-contain opacity-70"
            />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setViewMode('landing')}
          >
            <div className={isFinance ? "bg-emerald-600 p-2.5 rounded-lg" : "bg-blue-600 p-2.5 rounded-lg"}>
              {isFinance ? <TrendingUp className="w-[29px] h-[29px] text-white" /> : <Shield className="w-[29px] h-[29px] text-white" />}
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {isFinance ? "Financial AI" : "InsureGap AI"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={isFinance ? handleFinanceReset : handleReset}
            className="group flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-300"
            title="설정 초기화"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline font-medium">초기화</span>
          </button>
          <button
            onClick={handleDownloadClick}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${isFinance ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 hover:shadow-emerald-500/30' : 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 hover:shadow-blue-500/30'} text-white rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? '생성 중...' : '리포트 저장'}</span>
          </button>
        </div>
      </header>
    )
  }

  return (
    <main className="min-h-screen bg-[#1A1F2C] text-slate-100 pb-20 font-sans">
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
        {renderHeader()}
        {renderDashboard()}
      </div>

      {/* Hidden Report for PDF Generation */}
      {isMounted && userState && financeState && gapAnalysis && (
        <div className="absolute -left-[9999px] top-0 pointer-events-none">
          <div ref={reportRef}>
            <ReportPDF
              mode={viewMode === 'finance' ? 'finance' : 'insurance'}
              userState={userState}
              financeState={financeState}
              standardData={standardData}
              gapAnalysis={gapAnalysis}
            />
          </div>
        </div>
      )}
    </main>
  )
}
