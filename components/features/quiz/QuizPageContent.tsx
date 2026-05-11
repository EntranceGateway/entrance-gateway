'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { QuizHeader } from './QuizHeader'
import { QuizCard, QuizCardGrid } from './QuizCard'
import { QuizTemplateDetailSidebar } from './QuizTemplateDetailSidebar'
import { QuizCustomPracticeSidebar } from './QuizCustomPracticeSidebar'
import { QuizHistoryTab } from './QuizHistoryTab'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { checkPurchaseStatus } from '@/services/client/payment.client'
import { addToCartAction } from '@/services/server/cart.server'
import { useToast } from '@/components/shared/Toast'
import { useAuth } from '@/hooks/auth/useAuth'
import type { Quiz, QuizListResponse } from '@/types/quiz.types'
import type { PurchaseStatus } from '@/types/payment.types'
import type { QuizTemplate } from '@/types/quizTemplate.types'
import { QuizPaymentForm } from './QuizPaymentForm'
import { QuizDetailSidebar } from './QuizDetailSidebar'
import { QuizTemplateCard } from './QuizTemplateCard'
import {
  archiveMyQuizTemplate,
  createQuizTemplates,
  fetchEntranceTypes,
  fetchMyQuizTemplates,
  fetchQuizTemplates,
  fetchQuizTemplatesByEntrance,
} from '@/services/client/quizTemplate.client'
import type { CreateQuizTemplateRequest, EntranceType, QuizTemplateType } from '@/types/quizTemplate.types'
import Link from 'next/link'

interface QuizPageContentProps {
  initialData?: QuizListResponse | null
  purchaseStatuses?: Record<number, string>
  initialPage?: number
}

export function QuizPageContent({ initialData, purchaseStatuses = {}, initialPage = 0 }: QuizPageContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { success, error: showError } = useToast()
  const { isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState<'QUIZZES' | 'TEMPLATES' | 'MY_TEMPLATES' | 'HISTORY'>('QUIZZES')
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialData?.data?.content || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('NOT_PURCHASED')
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialData?.data?.totalPages || 1)

  // Templates State
  const [templates, setTemplates] = useState<QuizTemplate[]>([])
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [templatePage, setTemplatePage] = useState(0)
  const [templateTotalPages, setTemplateTotalPages] = useState(1)
  const [templateTypeFilter, setTemplateTypeFilter] = useState<QuizTemplateType | 'ALL'>('ALL')
  const [templateEntranceFilter, setTemplateEntranceFilter] = useState<string>('ALL')
  const [templateSearch, setTemplateSearch] = useState('')
  const [templatePriceFilter, setTemplatePriceFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL')
  const [entranceTypes, setEntranceTypes] = useState<EntranceType[]>([])
  
  // Custom Generation
  const [isCustomSidebarOpen, setIsCustomSidebarOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<QuizTemplate | null>(null)
  const [isTemplateDetailOpen, setIsTemplateDetailOpen] = useState(false)

  // User Templates State
  const [myTemplates, setMyTemplates] = useState<QuizTemplate[]>([])
  const [isMyTemplatesLoading, setIsMyTemplatesLoading] = useState(false)
  const [myTemplatesError, setMyTemplatesError] = useState<string | null>(null)
  const [myTemplateSearch, setMyTemplateSearch] = useState('')
  const [myTemplatePage, setMyTemplatePage] = useState(0)
  const [myTemplateTotalPages, setMyTemplateTotalPages] = useState(1)
  const [archivingTemplateId, setArchivingTemplateId] = useState<string | null>(null)
  const [templatePendingArchive, setTemplatePendingArchive] = useState<QuizTemplate | null>(null)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [createTemplateForm, setCreateTemplateForm] = useState({
    name: '',
    description: '',
    type: 'PRACTICE' as QuizTemplateType,
    entranceSlug: '',
    totalQuestions: 10,
    totalMarks: 10,
    durationMinutes: 15,
    enableNegativeMarking: false,
    negativeMarkValue: 0.25,
    easy: 40,
    medium: 40,
    hard: 20,
  })

  useEffect(() => {
    setCurrentPage(initialPage)
    setQuizzes(initialData?.data?.content || [])
    setTotalPages(initialData?.data?.totalPages || 1)
    setIsLoading(false)
    setError(null)
  }, [initialData, initialPage])

  useEffect(() => {
    if (!isArchiveDialogOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isArchiveDialogOpen])

  const updatePageUrl = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(pageIndex + 1))
    params.set('size', '12')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Load Templates
  useEffect(() => {
    if (activeTab !== 'TEMPLATES') return

    const loadTemplates = async () => {
      setIsTemplatesLoading(true)
      setTemplatesError(null)
      try {
        const params = { page: templatePage, size: 12, sortBy: 'createdAt', sortDir: 'desc' as const }
        const response = templateEntranceFilter !== 'ALL'
          ? await fetchQuizTemplatesByEntrance(templateEntranceFilter, params)
          : templateTypeFilter === 'ALL'
            ? await Promise.all([
                fetchQuizTemplates('PRACTICE', { ...params, size: 6 }),
                fetchQuizTemplates('COMPETITIVE', { ...params, size: 6 }),
              ])
            : await fetchQuizTemplates(templateTypeFilter, params)

        if (Array.isArray(response)) {
          const [practiceResponse, competitiveResponse] = response
          const practiceTemplates = practiceResponse?.data?.content || []
          const competitiveTemplates = competitiveResponse?.data?.content || []
          setTemplates([...practiceTemplates, ...competitiveTemplates])
          setTemplateTotalPages(Math.max(practiceResponse?.data?.totalPages || 1, competitiveResponse?.data?.totalPages || 1))
        } else if (response?.data?.content) {
          setTemplates(response.data.content)
          setTemplateTotalPages(response.data.totalPages || 1)
        } else {
          setTemplates([])
          setTemplateTotalPages(0)
          setTemplatesError(null)
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'UNAUTHORIZED') {
          setTemplatesError('UNAUTHORIZED')
        } else {
          setTemplates([])
          setTemplateTotalPages(0)
          setTemplatesError(null)
        }
      } finally {
        setIsTemplatesLoading(false)
      }
    }

    loadTemplates()
  }, [activeTab, templatePage, templateTypeFilter, templateEntranceFilter])

  useEffect(() => {
    if (activeTab !== 'TEMPLATES' || entranceTypes.length > 0) return

    const loadEntranceTypes = async () => {
      try {
        setEntranceTypes(await fetchEntranceTypes())
      } catch {
        // Keep template listing usable even if reference filters fail.
        setEntranceTypes([])
      }
    }

    loadEntranceTypes()
  }, [activeTab, entranceTypes.length])

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = templateSearch.trim().toLowerCase()

    return templates.filter((template) => {
      const matchesType = templateTypeFilter === 'ALL' || template.type === templateTypeFilter
      const matchesPrice =
        templatePriceFilter === 'ALL' ||
        (templatePriceFilter === 'FREE' && (!template.entryFee || template.entryFee <= 0)) ||
        (templatePriceFilter === 'PAID' && template.entryFee > 0)
      const matchesSearch =
        !normalizedSearch ||
        template.name.toLowerCase().includes(normalizedSearch) ||
        template.description?.toLowerCase().includes(normalizedSearch)

      return matchesType && matchesPrice && matchesSearch
    })
  }, [templates, templateSearch, templateTypeFilter, templatePriceFilter])

  const resetTemplatePage = () => setTemplatePage(0)

  useEffect(() => {
    if (activeTab !== 'MY_TEMPLATES' || !isLoggedIn) return

    const loadMyTemplates = async () => {
      setIsMyTemplatesLoading(true)
      setMyTemplatesError(null)
      try {
        const response = await fetchMyQuizTemplates({ page: myTemplatePage, size: 12, sortBy: 'updatedAt', sortDir: 'desc' })
        if (response?.data?.content) {
          setMyTemplates(response.data.content)
          setMyTemplateTotalPages(response.data.totalPages || 1)
        } else {
          setMyTemplates([])
          setMyTemplateTotalPages(0)
          setMyTemplatesError(null)
        }
      } catch {
        setMyTemplates([])
        setMyTemplateTotalPages(0)
        setMyTemplatesError(null)
      } finally {
        setIsMyTemplatesLoading(false)
      }
    }

    loadMyTemplates()
  }, [activeTab, isLoggedIn, myTemplatePage])

  const filteredMyTemplates = useMemo(() => {
    const normalizedSearch = myTemplateSearch.trim().toLowerCase()
    if (!normalizedSearch) return myTemplates

    return myTemplates.filter((template) =>
      template.name.toLowerCase().includes(normalizedSearch) ||
      template.description?.toLowerCase().includes(normalizedSearch)
    )
  }, [myTemplates, myTemplateSearch])

  const handleRequestArchiveMyTemplate = (template: QuizTemplate) => {
    setTemplatePendingArchive(template)
    setIsArchiveDialogOpen(true)
  }

  const handleCancelArchiveMyTemplate = () => {
    if (archivingTemplateId) return
    setIsArchiveDialogOpen(false)
    setTemplatePendingArchive(null)
  }

  const handleConfirmArchiveMyTemplate = async () => {
    if (!templatePendingArchive) return

    const templateId = templatePendingArchive.templateId
    setArchivingTemplateId(templateId)
    try {
      const response = await archiveMyQuizTemplate(templateId)
      success(response.message || 'Template archived successfully.')
      setMyTemplates(prev => prev.filter(template => template.templateId !== templateId))
      setIsArchiveDialogOpen(false)
      setTemplatePendingArchive(null)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to archive template.')
    } finally {
      setArchivingTemplateId(null)
    }
  }

  const handleOpenCreateTemplate = async () => {
    setIsCreateTemplateOpen(true)
    if (entranceTypes.length === 0) {
      try {
        setEntranceTypes(await fetchEntranceTypes())
      } catch {
        // Form remains usable without entrance filtering.
      }
    }
  }

  const handleCreateTemplate = async () => {
    const name = createTemplateForm.name.trim()
    const difficultyTotal = createTemplateForm.easy + createTemplateForm.medium + createTemplateForm.hard

    if (!name) {
      showError('Please enter a template name.')
      return
    }

    if (difficultyTotal !== 100) {
      showError(`Difficulty distribution must total 100%. Current total is ${difficultyTotal}%.`)
      return
    }

    const entranceTypeId = createTemplateForm.entranceSlug
      ? entranceTypes.find((entrance) => entrance.slug === createTemplateForm.entranceSlug)?.entranceTypeId
      : undefined

    const payload: CreateQuizTemplateRequest = {
      name,
      description: createTemplateForm.description.trim() || undefined,
      type: createTemplateForm.type,
      entryFee: 0,
      status: 'DRAFT',
      entranceTypeId,
      config: {
        totalQuestions: createTemplateForm.totalQuestions,
        totalMarks: createTemplateForm.totalMarks,
        durationMinutes: createTemplateForm.durationMinutes,
        difficultyDistribution: {
          EASY: createTemplateForm.easy,
          MEDIUM: createTemplateForm.medium,
          HARD: createTemplateForm.hard,
        },
        enableNegativeMarking: createTemplateForm.enableNegativeMarking,
        negativeMarkValue: createTemplateForm.enableNegativeMarking ? createTemplateForm.negativeMarkValue : 0,
      },
    }

    setIsCreatingTemplate(true)
    try {
      const response = await createQuizTemplates([payload])
      success(response.message || 'Template created successfully.')
      setIsCreateTemplateOpen(false)
      setCreateTemplateForm(prev => ({ ...prev, name: '', description: '' }))
      const listResponse = await fetchMyQuizTemplates({ page: 0, size: 12, sortBy: 'updatedAt', sortDir: 'desc' })
      setMyTemplatePage(0)
      setMyTemplates(listResponse.data.content || [])
      setMyTemplateTotalPages(listResponse.data.totalPages || 1)
      setActiveTab('MY_TEMPLATES')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to create template.')
    } finally {
      setIsCreatingTemplate(false)
    }
  }

  const handleOpenTemplateDetail = (template: QuizTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateDetailOpen(true)
  }

  const handleQuizClick = async (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsSidebarOpen(true)

    const ssrStatus = purchaseStatuses[quiz.questionSetId]
    if (ssrStatus) {
      setPurchaseStatus(ssrStatus as PurchaseStatus)
    } else {
      setPurchaseStatus('NOT_PURCHASED')

      try {
        const statusResponse = await checkPurchaseStatus(quiz.questionSetId)
        setPurchaseStatus(statusResponse.data.status)
      } catch {
        // Keep default fallback state
      }
    }
  }

  const handleAddToCart = async (quiz: Quiz) => {
    if (!isLoggedIn) {
      showError('Please sign in to add items to cart')
      sessionStorage.setItem('redirectAfterLogin', '/quiz')
      router.push('/signin')
      return
    }

    if (quiz.price === 0) {
      showError('Free quizzes do not need to be added to cart')
      return
    }

    try {
      const result = await addToCartAction(quiz.questionSetId)

      if (result.success) {
        success(result.message)
        window.dispatchEvent(new Event('cartUpdated'))
        router.push(`/quiz/${quiz.slug}/payment`)
      } else {
        showError(result.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      showError(errorMessage)
    }
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => setSelectedQuiz(null), 300)
  }

  const handleClosePaymentForm = () => {
    setIsPaymentFormOpen(false)
    setTimeout(() => setSelectedQuiz(null), 300)
  }

  const handlePageChange = (pageIndex: number) => {
    updatePageUrl(pageIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div data-role="page-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <QuizHeader />

        {/* Type Toggle Tabs */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex bg-gray-100 p-1.5 rounded-xl self-start overflow-x-auto scbar-none flex-shrink-0">
            <button
              onClick={() => setActiveTab('QUIZZES')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'QUIZZES' 
                  ? 'bg-white text-brand-navy shadow-sm' 
                  : 'text-gray-500 hover:text-brand-navy hover:bg-gray-200'
              }`}
            >
              All Quizzes
            </button>
            <button
              onClick={() => setActiveTab('TEMPLATES')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'TEMPLATES' 
                  ? 'bg-white text-brand-navy shadow-sm' 
                  : 'text-gray-500 hover:text-brand-navy hover:bg-gray-200'
              }`}
            >
              Practice Templates
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('MY_TEMPLATES')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'MY_TEMPLATES'
                    ? 'bg-white text-brand-navy shadow-sm'
                    : 'text-gray-500 hover:text-brand-navy hover:bg-gray-200'
                }`}
              >
                My Templates
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('HISTORY')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === 'HISTORY' 
                    ? 'bg-white text-brand-navy shadow-sm' 
                    : 'text-gray-500 hover:text-brand-navy hover:bg-gray-200'
                }`}
              >
                My History
              </button>
            )}
          </div>

          <Link
            href="/plans"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-gold to-amber-400 px-5 py-2.5 text-sm font-black text-brand-navy shadow-lg shadow-amber-200/60 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            Subscription
          </Link>
        </div>

        <div data-role="quiz-list">
          {activeTab === 'HISTORY' ? (
            <QuizHistoryTab />
          ) : activeTab === 'TEMPLATES' ? (
            <div className="space-y-6">
              {templatesError === 'UNAUTHORIZED' ? (
                 <div className="bg-white p-6 rounded-xl border border-red-100 text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-2">lock</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Sign In Required</h3>
                    <p className="text-sm text-gray-600 mb-4">You must be signed in to view and compile practice mock sets.</p>
                    <button
                      onClick={() => {
                          sessionStorage.setItem('redirectAfterLogin', '/quiz')
                          router.push('/signin')
                      }}
                      className="bg-brand-navy hover:bg-brand-blue text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Sign In
                    </button>
                 </div>
              ) : isTemplatesLoading ? (
                 <CardGridSkeleton count={4} />
              ) : (
                <>
                  <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-bold font-heading mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-gold">psychology</span>
                        Build Your Own Setup
                      </h3>
                      <p className="text-sm opacity-90 text-gray-300">Mix and match any syllabus topics with custom constraints and negative marking.</p>
                    </div>
                    <button
                      onClick={() => setIsCustomSidebarOpen(true)}
                      className="whitespace-nowrap px-6 py-2.5 bg-white text-brand-navy font-bold rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                    >
                      Create Custom Quiz
                    </button>
                  </div>

                  <section className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm mb-6" aria-label="Template filters">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4 items-end">
                      <label className="block">
                        <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Search templates</span>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                          <input
                            id="template-search"
                            type="search"
                            value={templateSearch}
                            onChange={(event) => setTemplateSearch(event.target.value)}
                            placeholder="Search by name or description"
                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                          />
                        </div>
                      </label>

                      <label className="block min-w-[190px]">
                        <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Entrance Type</span>
                        <select
                          id="template-entrance-filter"
                          value={templateEntranceFilter}
                          onChange={(event) => {
                            setTemplateEntranceFilter(event.target.value)
                            resetTemplatePage()
                          }}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                        >
                          <option value="ALL">All Entrances</option>
                          {entranceTypes.map((entrance) => (
                            <option key={entrance.entranceTypeId} value={entrance.slug}>
                              {entrance.entranceName}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block min-w-[150px]">
                        <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Access</span>
                        <select
                          id="template-price-filter"
                          value={templatePriceFilter}
                          onChange={(event) => setTemplatePriceFilter(event.target.value as 'ALL' | 'FREE' | 'PAID')}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                        >
                          <option value="ALL">All</option>
                          <option value="FREE">Free</option>
                          <option value="PAID">Paid</option>
                        </select>
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(['ALL', 'PRACTICE', 'COMPETITIVE'] as const).map((type) => (
                        <button
                          key={type}
                          id={`template-type-${type.toLowerCase()}`}
                          onClick={() => {
                            setTemplateTypeFilter(type)
                            resetTemplatePage()
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            templateTypeFilter === type
                              ? 'bg-brand-navy text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-brand-navy'
                          }`}
                        >
                          {type === 'ALL' ? 'All Templates' : type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </section>

                  {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                      <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">folder_search</span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                      <p className="text-gray-500 text-sm">Try changing the search term or filters.</p>
                    </div>
                  ) : (
                    <QuizCardGrid>
                      {filteredTemplates.map(template => (
                        <QuizTemplateCard 
                          key={template.templateId}
                          template={template}
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsTemplateDetailOpen(true)
                          }}
                        />
                      ))}
                    </QuizCardGrid>
                  )}
                </>
              )}
            </div>
          ) : activeTab === 'MY_TEMPLATES' ? (
            <div className="space-y-6">
              {!isLoggedIn ? (
                <div className="bg-white p-6 rounded-xl border border-red-100 text-center">
                  <span className="material-symbols-outlined text-red-500 text-4xl mb-2">lock</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Sign In Required</h3>
                  <p className="text-sm text-gray-600 mb-4">You must be signed in to manage your templates.</p>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('redirectAfterLogin', '/quiz')
                      router.push('/signin')
                    }}
                    className="bg-brand-navy hover:bg-brand-blue text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              ) : isMyTemplatesLoading ? (
                <CardGridSkeleton count={4} />
              ) : (
                <>
                  <section className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-heading text-brand-navy flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-gold">folder_managed</span>
                        My Templates
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Manage your personal quiz templates and archive old drafts.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-72">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                        <input
                          id="my-template-search"
                          type="search"
                          value={myTemplateSearch}
                          onChange={(event) => setMyTemplateSearch(event.target.value)}
                          placeholder="Search my templates"
                          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenCreateTemplate}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-blue"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create
                      </button>
                    </div>
                  </section>

                  {filteredMyTemplates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                      <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">draft</span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                      <p className="text-gray-500 text-sm">{myTemplateSearch ? 'Try a different search term.' : 'Create a custom practice set to start building your template library.'}</p>
                    </div>
                  ) : (
                    <QuizCardGrid>
                      {filteredMyTemplates.map(template => (
                        <div key={template.templateId} className="relative">
                          <div className="[&>article>div:last-child>div:first-child]:pr-24">
                            <QuizTemplateCard
                              template={template}
                              onClick={() => handleOpenTemplateDetail(template)}
                            />
                          </div>
                          <div className="absolute top-4 right-4 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenTemplateDetail(template)}
                              className="inline-grid size-9 place-items-center rounded-lg bg-white/95 border border-brand-blue/20 text-brand-blue shadow-sm transition-colors hover:bg-brand-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                              aria-label={`Start ${template.name}`}
                            >
                              <span className="material-symbols-outlined text-[18px] leading-none">play_arrow</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestArchiveMyTemplate(template)}
                              disabled={archivingTemplateId === template.templateId}
                              className="inline-grid size-9 place-items-center rounded-lg bg-white/95 border border-red-100 text-red-500 shadow-sm transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:opacity-60"
                              aria-label={`Archive ${template.name}`}
                            >
                              <span className="material-symbols-outlined text-[18px] leading-none">
                                {archivingTemplateId === template.templateId ? 'hourglass_top' : 'archive'}
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </QuizCardGrid>
                  )}
                </>
              )}
            </div>
          ) : isLoading ? (
            <CardGridSkeleton count={6} />
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-16 mx-auto text-gray-300 mb-4"
              >
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes available</h3>
              <p className="text-gray-500">Check back soon for new quizzes.</p>
            </div>
          ) : (
            <QuizCardGrid>
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.questionSetId}
                  item={quiz}
                  onClick={() => handleQuizClick(quiz)}
                  onAddToCart={handleAddToCart}
                  purchaseStatus={(purchaseStatuses[quiz.questionSetId] as PurchaseStatus) || 'NOT_PURCHASED'}
                />
              ))}
            </QuizCardGrid>
          )}
        </div>

        {activeTab === 'QUIZZES' && !isLoading && totalPages > 1 && quizzes.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="quiz-pagination-prev"
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span data-role="pagination-status" className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              id="quiz-pagination-next"
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {activeTab === 'TEMPLATES' && !isTemplatesLoading && !templatesError && templateTotalPages > 1 && filteredTemplates.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="template-pagination-prev"
              onClick={() => {
                setTemplatePage(Math.max(0, templatePage - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={templatePage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span data-role="template-pagination-status" className="px-4 py-2 text-sm text-gray-600">
              Page {templatePage + 1} of {templateTotalPages}
            </span>
            <button
              id="template-pagination-next"
              onClick={() => {
                setTemplatePage(Math.min(templateTotalPages - 1, templatePage + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={templatePage >= templateTotalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {activeTab === 'MY_TEMPLATES' && !isMyTemplatesLoading && !myTemplatesError && myTemplateTotalPages > 1 && filteredMyTemplates.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="my-template-pagination-prev"
              onClick={() => {
                setMyTemplatePage(Math.max(0, myTemplatePage - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={myTemplatePage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span data-role="my-template-pagination-status" className="px-4 py-2 text-sm text-gray-600">
              Page {myTemplatePage + 1} of {myTemplateTotalPages}
            </span>
            <button
              id="my-template-pagination-next"
              onClick={() => {
                setMyTemplatePage(Math.min(myTemplateTotalPages - 1, myTemplatePage + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={myTemplatePage >= myTemplateTotalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>

      <QuizDetailSidebar
        quiz={selectedQuiz}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        purchaseStatus={purchaseStatus}
      />

      {isPaymentFormOpen && selectedQuiz && (
        <QuizPaymentForm quiz={selectedQuiz} onClose={handleClosePaymentForm} />
      )}

      {/* Template Modals */}
      <QuizCustomPracticeSidebar 
        isOpen={isCustomSidebarOpen}
        onClose={() => setIsCustomSidebarOpen(false)}
      />
      {isCreateTemplateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-brand-navy">Create Practice Template</h2>
                <p className="text-sm text-gray-500">Save reusable quiz settings for future practice.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateTemplateOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close create template modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block md:col-span-2">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Template Name *</span>
                  <input
                    id="create-template-name"
                    value={createTemplateForm.name}
                    onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, name: event.target.value }))}
                    placeholder="e.g. IOE Physics Speed Drill"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Description</span>
                  <textarea
                    id="create-template-description"
                    value={createTemplateForm.description}
                    onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, description: event.target.value }))}
                    rows={3}
                    placeholder="Describe when this template should be used."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Type</span>
                  <select
                    value={createTemplateForm.type}
                    onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, type: event.target.value as QuizTemplateType }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="PRACTICE">Practice</option>
                    <option value="COMPETITIVE">Competitive</option>
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Entrance Type</span>
                  <select
                    value={createTemplateForm.entranceSlug}
                    onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, entranceSlug: event.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">General</option>
                    {entranceTypes.map((entrance) => (
                      <option key={entrance.entranceTypeId} value={entrance.slug}>{entrance.entranceName}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ['totalQuestions', 'Total Questions'],
                  ['totalMarks', 'Total Marks'],
                  ['durationMinutes', 'Duration Minutes'],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
                    <input
                      type="number"
                      min="1"
                      value={createTemplateForm[key as 'totalQuestions' | 'totalMarks' | 'durationMinutes']}
                      onChange={(event) => setCreateTemplateForm(prev => ({
                        ...prev,
                        [key]: Math.max(1, Number(event.target.value)),
                      }))}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </label>
                ))}
              </div>

              <div className="rounded-xl border border-gray-100 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-brand-navy">Difficulty Distribution</h3>
                  <span className={`text-sm font-bold ${createTemplateForm.easy + createTemplateForm.medium + createTemplateForm.hard === 100 ? 'text-green-600' : 'text-red-500'}`}>
                    {createTemplateForm.easy + createTemplateForm.medium + createTemplateForm.hard}%
                  </span>
                </div>
                {([
                  ['easy', 'Easy'],
                  ['medium', 'Medium'],
                  ['hard', 'Hard'],
                ] as const).map(([key, label]) => (
                  <div key={key}>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>{label}</span>
                      <span>{createTemplateForm[key]}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={createTemplateForm[key]}
                      onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, [key]: Number(event.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-brand-navy">Enable Negative Marking</span>
                  <input
                    type="checkbox"
                    checked={createTemplateForm.enableNegativeMarking}
                    onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, enableNegativeMarking: event.target.checked }))}
                    className="size-5 accent-brand-blue"
                  />
                </label>
                {createTemplateForm.enableNegativeMarking && (
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Negative Mark Value</span>
                    <input
                      type="number"
                      min="0"
                      step="0.05"
                      value={createTemplateForm.negativeMarkValue}
                      onChange={(event) => setCreateTemplateForm(prev => ({ ...prev, negativeMarkValue: Math.max(0, Number(event.target.value)) }))}
                      className="w-full sm:w-40 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateTemplateOpen(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTemplate}
                disabled={isCreatingTemplate}
                className="px-5 py-2.5 rounded-lg bg-brand-navy text-sm font-bold text-white hover:bg-brand-blue disabled:opacity-60"
              >
                {isCreatingTemplate ? 'Creating...' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isArchiveDialogOpen && templatePendingArchive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-template-dialog-title"
          aria-describedby="archive-template-dialog-description"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
                  <span className="material-symbols-outlined text-[22px] leading-none">archive</span>
                </span>
                <div className="min-w-0">
                  <h2 id="archive-template-dialog-title" className="text-lg font-black text-gray-950">
                    Archive this template?
                  </h2>
                  <p id="archive-template-dialog-description" className="mt-1 text-sm leading-6 text-gray-600">
                    <span className="font-bold text-gray-900">{templatePendingArchive.name}</span> will be removed from your active templates. You can create a new template anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelArchiveMyTemplate}
                disabled={Boolean(archivingTemplateId)}
                className="min-h-11 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchiveMyTemplate}
                disabled={Boolean(archivingTemplateId)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-60"
              >
                {archivingTemplateId ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px] leading-none">progress_activity</span>
                    Archiving...
                  </>
                ) : (
                  'Archive template'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTemplate && (
        <QuizTemplateDetailSidebar 
          templateId={selectedTemplate.templateId}
          isOpen={isTemplateDetailOpen}
          onClose={() => setIsTemplateDetailOpen(false)}
        />
      )}
    </main>
  )
}
