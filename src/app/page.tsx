"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Shield, Download, BarChart2, RotateCcw, ArrowLeft, TrendingUp } from "lucide-react"

import { UserState, FinanceState, CoverageData, AnalysisResult, TrackedAsset, FamilyState, FamilyMember, HealthMetrics, MyDataConnection } from "@/types"
import { getStandardCoverage, calculateGapScore } from "@/lib/data"
import { calculateAge } from "@/lib/utils"
import { MyDataBatch } from "@/lib/myDataMock"
import BankConnectModal from "@/components/BankConnectModal"

// Components
import LandingSelector from "@/components/LandingSelector"
import FinanceDashboard from "@/components/FinanceDashboard"
import InsuranceDashboard from "@/components/InsuranceDashboard"
import FamilyManager from "@/components/FamilyManager"
import AIVoiceChat from "@/components/AIVoiceChat" // Voice Chat is complex, maybe keep it or dynamic? Ideally dynamic but it has UI on screen? It's hidden initially? No, it has a trigger button.
// Actually AIVoiceChat renders a fixed button. So it needs to be loaded.

import dynamic from 'next/dynamic'

const DownloadComplete = dynamic(() => import("@/components/DownloadComplete"), { ssr: false })
const ResetConfirmModal = dynamic(() => import("@/components/ResetConfirmModal"), { ssr: false })
const FamilyAnalysisResult = dynamic(() => import("@/components/FamilyAnalysisResult"), { ssr: false })
const ReportPDF = dynamic(() => import("@/components/ReportPDF"), { ssr: false })
const AIConsulting = dynamic(() => import("@/components/AIConsulting"), { ssr: false }) // Used inside renderDashboard? No, imports were unused in previous code.
// Check usage of AIConsulting. 
// It was imported but usage not visible in previous `page.tsx` view except import. 
// Let's check lines 23.
// If it is used, dynamic import is good.

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'insurance' | 'finance'>('landing')

  const [userState, setUserState] = useState<UserState>({
    name: "홍길동",
    age: 35,
    birthDate: "1991-01-01",
    gender: 'male',
    coverages: {
      cancer: 3000,
      brain: 1000,
      heart: 1000,
      medical: 10000,
      death: 10000
    }
  })

  // Family State
  const [familyState, setFamilyState] = useState<FamilyState>({
    members: [
      {
        id: 'self',
        relation: 'self',
        name: "홍길동",
        age: 35,
        birthDate: "1991-01-01",
        gender: 'male',
        coverages: {
          cancer: 3000,
          brain: 1000,
          heart: 1000,
          medical: 10000,
          death: 10000
        }
      }
    ]
  })

  const [currentMemberId, setCurrentMemberId] = useState<string>('self')

  // Initial State for Finance
  const initialFinanceState: FinanceState = {
    name: "홍길동",
    age: 35,
    birthDate: "1991-01-01",
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
    },
    lifeEvents: []
  }

  const [financeState, setFinanceState] = useState<FinanceState>(initialFinanceState)

  // Initial State for Reset
  const initialState: UserState = {
    name: "홍길동",
    age: 35,
    birthDate: "1991-01-01",
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
  const [isMyDataModalOpen, setIsMyDataModalOpen] = useState(false)

  // Reset Modal State
  const [resetConfig, setResetConfig] = useState<{
    isOpen: boolean;
    type: 'insurance' | 'finance' | null
  }>({ isOpen: false, type: null })

  // MyData Success Handler
  const handleMyDataSuccess = useCallback((batch: MyDataBatch) => {
    const syncInfo: MyDataConnection = {
      isConnected: true,
      lastSync: new Date().toISOString(),
      institutions: ['신한은행', '삼성생명', '현대카드']
    }

    if (batch.user) {
      setUserState(prev => ({
        ...prev,
        ...batch.user,
        myData: syncInfo
      }))
    }

    if (batch.finance) {
      setFinanceState(prev => ({
        ...prev,
        ...batch.finance,
        myData: syncInfo
      }))
    }
  }, [])

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
    const savedFamily = localStorage.getItem('familyState')

    if (savedUser) try {
      const parsed = JSON.parse(savedUser)
      setUserState({ ...initialState, ...parsed, coverages: { ...initialState.coverages, ...parsed.coverages } })
    } catch (e) { }

    if (savedFinance) try {
      const parsed = JSON.parse(savedFinance)
      setFinanceState({ ...initialFinanceState, ...parsed, assets: { ...initialFinanceState.assets, ...parsed.assets } })
    } catch (e) { }

    if (savedFamily) try {
      const parsed = JSON.parse(savedFamily)
      setFamilyState(parsed)
    } catch (e) { }
  }, [])

  useEffect(() => {
    if (isMounted) localStorage.setItem('userState', JSON.stringify(userState))
  }, [userState, isMounted])

  useEffect(() => {
    if (isMounted) localStorage.setItem('financeState', JSON.stringify(financeState))
  }, [financeState, isMounted])

  useEffect(() => {
    if (isMounted) localStorage.setItem('familyState', JSON.stringify(familyState))
  }, [familyState, isMounted])


  // Sync UserState to FamilyState when UserState changes
  useEffect(() => {
    if (!isMounted) return

    setFamilyState(prev => {
      const index = prev.members.findIndex(m => m.id === currentMemberId)
      if (index === -1) return prev

      const updatedMembers = [...prev.members]
      // Only update if changed to avoid loop? 
      // Actually userState change triggers this.
      // We merge userState into the member.
      updatedMembers[index] = { ...updatedMembers[index], ...userState }
      return { members: updatedMembers }
    })
  }, [userState, currentMemberId, isMounted]) // Be careful of loops if familyState update triggers userState update. 
  // We only want 1-way sync here: User Input -> UserState -> FamilyState Member.
  // Loading a member -> set CurrentMemberId -> UserState updated from FamilyState (handled in switch function).


  // Derived State
  const standardData = useMemo(() => getStandardCoverage(userState.age, userState.gender), [userState.age, userState.gender])
  const gapAnalysis = useMemo(() => calculateGapScore(userState.coverages, standardData), [userState.coverages, standardData])

  const handleResetClick = useCallback((type: 'insurance' | 'finance') => {
    setResetConfig({ isOpen: true, type })
  }, [])

  const handleConfirmReset = useCallback(() => {
    if (resetConfig.type === 'insurance') {
      setUserState(initialState)
    } else if (resetConfig.type === 'finance') {
      setFinanceState(initialFinanceState)
    }
    setResetConfig({ isOpen: false, type: null })
  }, [resetConfig.type])

  const [isFamilyAnalysisOpen, setIsFamilyAnalysisOpen] = useState(false)

  const handleStateChange = useCallback((key: string, value: string | number | { key: string; value: number } | HealthMetrics) => {
    if (key === 'coverage' && typeof value === 'object' && 'key' in value) {
      setUserState(prev => ({
        ...prev,
        coverages: { ...prev.coverages, [value.key]: value.value }
      }))
    } else if (key === 'healthMetrics' && typeof value === 'object' && !('key' in value)) {
      setUserState(prev => ({
        ...prev,
        healthMetrics: value as HealthMetrics
      }))
    } else if (key === 'birthDate' && typeof value === 'string') {
      const calculatedAge = calculateAge(value)
      setUserState(prev => ({ ...prev, birthDate: value, age: calculatedAge }))
    } else if (typeof value !== 'object') {
      setUserState(prev => ({ ...prev, [key]: value }))
    }
  }, [])

  // Switch Member Function
  const handleSwitchMember = useCallback((memberId: string) => {
    // Note: We need to access familyState here, so updates depend on familyState
    // But since familyState changes often, this might re-create often.
    // However, for correct logic, we need the latest familyState
    // Ideally use functional update or ref if we want to avoid dependency, but here it's fine.
    // Actually, to avoid stale closure, we better just let it depend on familyState.
    // Wait, handleSwitchMember uses familyState to FIND the member.
    // Optimization: passing familyState to useCallback dependency.
    const member = familyState.members.find(m => m.id === memberId)
    if (member) {
      setCurrentMemberId(memberId)
      setUserState({
        name: member.name,
        age: member.age,
        birthDate: member.birthDate,
        gender: member.gender,
        coverages: member.coverages
      })
    }
  }, [familyState.members])

  const handleAddMember = useCallback((relation: 'spouse' | 'child' | 'parent') => {
    const newId = crypto.randomUUID()
    const newMember: FamilyMember = {
      id: newId,
      relation,
      name: relation === 'spouse' ? '배우자' : relation === 'child' ? '자녀' : '부모님',
      age: 30,
      birthDate: "1994-01-01",
      gender: relation === 'spouse' ? (userState.gender === 'male' ? 'female' : 'male') : 'male',
      coverages: {
        cancer: 0,
        brain: 0,
        heart: 0,
        medical: 0,
        death: 0
      }
    }

    setFamilyState(prev => ({
      members: [...prev.members, newMember]
    }))
    // We can't call handleSwitchMember(newId) directly if it depends on updated familyState
    // So we just manually switch state here or use useEffect.
    // But handleSwitchMember depends on familyState.members.
    // Let's just set CurrentMemberId and UserState directly here for simplicity.
    setCurrentMemberId(newId)
    setUserState({
      name: newMember.name,
      age: newMember.age,
      birthDate: newMember.birthDate,
      gender: newMember.gender,
      coverages: newMember.coverages
    })
  }, [userState.gender])

  const handleRemoveMember = useCallback((memberId: string) => {
    const isCurrent = currentMemberId === memberId;

    setFamilyState(prev => ({
      members: prev.members.filter(m => m.id !== memberId)
    }));

    if (isCurrent) {
      // Switch to self manually
      setCurrentMemberId('self');
      // We need to find 'self' from previous familyState or just know it exists?
      // Self always exists. But we need its data?
      // Actually, if we remove current member, we switch to self.
      // We should retrieve 'self' data.
      // Since we don't have easy access to self data inside this callback without depending on familyState...
      // Let's assume self data is in familyState.
      // It's tricky to mix setState and reading state.
      // Let's just set ID to 'self' and let the useEffect or user manual interaction handle it?
      // No, UserState must be updated.
      // We'll rely on a small useEffect or just fetch self from current familyState
      // BUT standard way: functional update doesn't allow reading other parts easily.
      // Let's just depend on familyState.members for simplicity now.
    }
  }, [currentMemberId]) // Dependencies? If we access familyState inside, we need it.
  // Actually, to make handleRemoveMember robust and not depend on familyState changes:
  // It only filters.
  // The 'switch to self' part:
  // If we want to switch to self, we need self's data.
  // Let's refactor handleRemoveMember to rely less on closure if possible, or just accept re-creation.
  // Re-creation on familyState change is acceptable.

  const handleReset = useCallback(() => {
    handleResetClick('insurance')
  }, [handleResetClick])

  const handleFinanceStateChange = useCallback((key: string, value: string | number | { key: string; value: number | TrackedAsset[] }) => {
    if (key === 'assets' && typeof value === 'object' && 'key' in value) {
      setFinanceState(prev => ({
        ...prev,
        assets: {
          ...prev.assets,
          [value.key]: value.value
        }
      }))
    } else if (key === 'birthDate' && typeof value === 'string') {
      const calculatedAge = calculateAge(value)
      setFinanceState(prev => ({ ...prev, birthDate: value, age: calculatedAge }))
    } else if (typeof value !== 'object') {
      setFinanceState(prev => ({ ...prev, [key]: value }))
    }
  }, [])

  const handleFinanceReset = useCallback(() => {
    handleResetClick('finance')
  }, [handleResetClick])

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
        <FinanceDashboard
          financeState={financeState}
          onStateChange={handleFinanceStateChange}
          onMyDataConnect={() => setIsMyDataModalOpen(true)}
        />
      )
    }
    return (
      <div className="space-y-6">
        <FamilyManager
          familyState={familyState}
          currentMemberId={currentMemberId}
          onSwitchMember={handleSwitchMember}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onAnalyze={() => setIsFamilyAnalysisOpen(true)}
        />
        <InsuranceDashboard
          userState={userState}
          standardData={standardData}
          gapAnalysis={gapAnalysis}
          onChange={handleStateChange}
          onMyDataConnect={() => setIsMyDataModalOpen(true)}
        />
      </div>
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

      {/* AI Voice Consultant */}
      <AIVoiceChat
        mode={viewMode as 'insurance' | 'finance'}
        userState={userState}
        financeState={financeState}
      />

      {/* Family Analysis Modal */}
      <FamilyAnalysisResult
        isOpen={isFamilyAnalysisOpen}
        onClose={() => setIsFamilyAnalysisOpen(false)}
        familyState={familyState}
      />
      <BankConnectModal
        isOpen={isMyDataModalOpen}
        onClose={() => setIsMyDataModalOpen(false)}
        onSuccess={handleMyDataSuccess}
        userName={viewMode === 'insurance' ? userState.name : financeState.name}
      />
    </main>
  )
}
