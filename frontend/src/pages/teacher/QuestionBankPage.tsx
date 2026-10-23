import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  HelpCircle,
  FileQuestion,
  Sparkles,
  Check,
  X,
  Layers,
  Calendar,
  BookOpen,
  Edit3,
  CheckSquare,
  Link2,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Split,
  Wand2,
  BookMarked,
  Save,
  AlertTriangle,
  FileCheck,
  FileSpreadsheet,
  Upload,
  Download,
  FileUp,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyQuestions,
  createMultipleChoiceQuestion,
  createFillBlankQuestion,
  createMatchingQuestion,
  createOrderingQuestion,
  quickGeneratePreview,
  batchCreateQuestions,
  updateQuestion,
  deleteQuestion,
  importQuestions,
  downloadQuestionExcelTemplate,
  downloadQuestionCsvTemplate,
  type QuestionItem,
  type CreateQuestionOptionPayload,
  type CreateQuestionPayload,
  type UpdateQuestionPayload,
  type QuestionFormat,
  type BlankAnswerItem,
  type MatchingPairItem,
  type ImportQuestionsResult,
} from '../../api/question'
import { getMyVocabSets, type VocabSetItem } from '../../api/content'
import { ApiError } from '../../api/auth'

interface DraftOption {
  content: string
  isCorrect: boolean
}

interface DraftBlank {
  index: number
  correctAnswer: string
  acceptableAnswers: string[]
  newAcceptableInput?: string
}

export type QuestionTabType = 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'
export type QuestionFilterType = 'ALL' | 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'

export const QuestionBankPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [vocabSets, setVocabSets] = useState<VocabSetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilterType, setSelectedFilterType] = useState<QuestionFilterType>('ALL')

  // Form Drawer / Inline state (No Modal!)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<QuestionTabType>('MCQ')

  // Common fields
  const [questionContent, setQuestionContent] = useState('')
  const [explanation, setExplanation] = useState('')
  const [formErrors, setFormErrors] = useState<string[]>([])

  // MCQ state
  const [options, setOptions] = useState<DraftOption[]>([
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
  ])

  // FILL state
  const [blanks, setBlanks] = useState<DraftBlank[]>([])

  // MATCH state
  const [pairs, setPairs] = useState<MatchingPairItem[]>([
    { left: '', right: '' },
    { left: '', right: '' },
  ])

  // ORDER state
  const [orderItems, setOrderItems] = useState<string[]>(['', '', ''])
  const [quickSentenceInput, setQuickSentenceInput] = useState('')

  // Quick Generate Panel state (HTT-05-CN-004)
  const [isQuickGenOpen, setIsQuickGenOpen] = useState(false)
  const [selectedVocabSetId, setSelectedVocabSetId] = useState<number | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<QuestionFormat>('HANZI_TO_MEANING')
  const [generating, setGenerating] = useState(false)
  const [batchSaving, setBatchSaving] = useState(false)
  const [generatedDrafts, setGeneratedDrafts] = useState<CreateQuestionPayload[]>([])

  // --- Bulk Import from Excel / CSV Panel state ---
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [downloadingTemplate, setDownloadingTemplate] = useState<'excel' | 'csv' | null>(null)
  const [importResult, setImportResult] = useState<ImportQuestionsResult | null>(null)

  // --- Edit Question Drawer state (HTT-05-CN-005 / QTN-10, QTN-19) ---
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editExplanation, setEditExplanation] = useState('')
  const [editOptions, setEditOptions] = useState<DraftOption[]>([])
  const [editPayload, setEditPayload] = useState('')
  const [editErrors, setEditErrors] = useState<string[]>([])
  const [editSubmitting, setEditSubmitting] = useState(false)

  // --- Inline Delete state (HTT-05-CN-005 / QTN-14, QTN-19) ---
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const handleOpenEdit = (q: QuestionItem) => {
    setEditingQuestion(q)
    setEditContent(q.content)
    setEditExplanation(q.explanation || '')
    setEditPayload(q.payload || '')
    setEditErrors([])
    if (q.type === 'MCQ' && q.options && q.options.length > 0) {
      setEditOptions(
        q.options.map((opt) => ({
          content: opt.content,
          isCorrect: opt.isCorrect,
        }))
      )
    } else {
      setEditOptions([
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
      ])
    }
    setIsEditDrawerOpen(true)
    setIsDrawerOpen(false)
    setIsQuickGenOpen(false)
  }

  const handleCloseEdit = () => {
    setIsEditDrawerOpen(false)
    setEditingQuestion(null)
    setEditErrors([])
  }

  const handleAddEditOption = () => {
    setEditOptions([...editOptions, { content: '', isCorrect: false }])
  }

  const handleRemoveEditOption = (index: number) => {
    if (editOptions.length <= 2) {
      setEditErrors(['Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (QTN-08).'])
      return
    }
    const wasCorrect = editOptions[index].isCorrect
    const next = editOptions.filter((_, i) => i !== index)
    if (wasCorrect && next.length > 0) {
      next[0].isCorrect = true
    }
    setEditOptions(next)
  }

  const handleEditOptionChange = (index: number, val: string) => {
    const next = [...editOptions]
    next[index].content = val
    setEditOptions(next)
  }

  const handleSelectEditCorrect = (index: number) => {
    const next = editOptions.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }))
    setEditOptions(next)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingQuestion) return

    const errors: string[] = []
    if (!editContent.trim()) {
      errors.push('Nội dung câu hỏi không được để trống (TC-02).')
    }

    if (editingQuestion.type === 'MCQ') {
      if (editOptions.length < 2) {
        errors.push('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (QTN-08).')
      }
      for (let i = 0; i < editOptions.length; i++) {
        if (!editOptions[i].content.trim()) {
          errors.push(`Lựa chọn ${optionLetters[i] || i + 1} không được để trống.`)
        }
      }
      const uniqueContents = new Set<string>()
      for (const opt of editOptions) {
        const normalized = opt.content.trim().toLowerCase()
        if (normalized && uniqueContents.has(normalized)) {
          errors.push('Các lựa chọn đáp án không được trùng nhau.')
          break
        }
        uniqueContents.add(normalized)
      }
      const correctCount = editOptions.filter((opt) => opt.isCorrect).length
      if (correctCount !== 1) {
        errors.push('Phải chọn đúng 1 đáp án chính xác (QTN-08).')
      }
    }

    setEditErrors(errors)
    if (errors.length > 0) return

    setEditSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const payload: UpdateQuestionPayload = {
        content: editContent.trim(),
        explanation: editExplanation.trim() ? editExplanation.trim() : undefined,
        options:
          editingQuestion.type === 'MCQ'
            ? editOptions.map((o) => ({ content: o.content.trim(), isCorrect: o.isCorrect }))
            : undefined,
        payload: editPayload.trim() ? editPayload.trim() : undefined,
      }

      const updated = await updateQuestion(editingQuestion.id, payload, user.token)

      setQuestions((prev) =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      )
      setSuccessMessage(`Đã cập nhật thành công câu hỏi #${updated.id}!`)
      handleCloseEdit()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể cập nhật câu hỏi')
      }
    } finally {
      setEditSubmitting(false)
    }
  }

  // Handle Delete Question (Inline confirmation)
  const handleDeleteQuestion = async (questionId: number) => {
    if (!user) return
    setDeleteSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await deleteQuestion(questionId, user.token)
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      setSuccessMessage(`Đã xóa câu hỏi #${questionId} khỏi ngân hàng câu hỏi thành công!`)
      setDeletingQuestionId(null)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể xóa câu hỏi')
      }
    } finally {
      setDeleteSubmitting(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadQuestions()
      loadVocabSets()
    }
  }, [user])

  // Automatically parse blanks when in FILL tab and question content changes
  useEffect(() => {
    if (activeTab === 'FILL') {
      const regex = /_{3,}/g
      const matches = questionContent.match(regex) || []
      const blankCount = matches.length

      setBlanks((prev) => {
        const next: DraftBlank[] = []
        for (let i = 0; i < blankCount; i++) {
          const existing = prev[i]
          next.push({
            index: i,
            correctAnswer: existing ? existing.correctAnswer : '',
            acceptableAnswers: existing ? existing.acceptableAnswers : [],
            newAcceptableInput: '',
          })
        }
        return next
      })
    }
  }, [questionContent, activeTab])

  const loadQuestions = async () => {
    if (!user) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const data = await getMyQuestions(user.token)
      setQuestions(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải danh sách câu hỏi')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadVocabSets = async () => {
    if (!user) return
    try {
      const data = await getMyVocabSets(user.token)
      setVocabSets(data)
      if (data.length > 0 && !selectedVocabSetId) {
        setSelectedVocabSetId(data[0].id)
      }
    } catch {
      // silently fail if cannot load sets
    }
  }

  // --- MCQ Handlers ---
  const handleAddOption = () => {
    setOptions([...options, { content: '', isCorrect: false }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setErrorMessage('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (QTN-08).')
      return
    }
    const wasCorrect = options[index].isCorrect
    const next = options.filter((_, i) => i !== index)
    if (wasCorrect && next.length > 0) {
      next[0].isCorrect = true
    }
    setOptions(next)
  }

  const handleOptionContentChange = (index: number, val: string) => {
    const next = [...options]
    next[index].content = val
    setOptions(next)
  }

  const handleSelectCorrect = (index: number) => {
    const next = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }))
    setOptions(next)
  }

  // --- FILL Handlers ---
  const handleInsertBlankMarker = () => {
    setQuestionContent((prev) => {
      const separator = prev.endsWith(' ') || prev.length === 0 ? '' : ' '
      return prev + separator + '___ '
    })
  }

  const handleBlankCorrectChange = (index: number, val: string) => {
    setBlanks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, correctAnswer: val } : b))
    )
  }

  const handleAddAcceptableAnswer = (index: number) => {
    setBlanks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b
        const raw = (b.newAcceptableInput || '').trim()
        if (!raw) return b
        if (b.acceptableAnswers.includes(raw) || b.correctAnswer.trim() === raw) {
          return { ...b, newAcceptableInput: '' }
        }
        return {
          ...b,
          acceptableAnswers: [...b.acceptableAnswers, raw],
          newAcceptableInput: '',
        }
      })
    )
  }

  const handleRemoveAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
    setBlanks((prev) =>
      prev.map((b, i) => {
        if (i !== blankIndex) return b
        return {
          ...b,
          acceptableAnswers: b.acceptableAnswers.filter((_, idx) => idx !== answerIndex),
        }
      })
    )
  }

  // --- MATCH Handlers ---
  const handleAddPair = () => {
    setPairs([...pairs, { left: '', right: '' }])
  }

  const handleRemovePair = (index: number) => {
    if (pairs.length <= 2) {
      setErrorMessage('Câu hỏi nối từ phải có ít nhất 2 cặp từ và nghĩa (TC-03).')
      return
    }
    setPairs(pairs.filter((_, i) => i !== index))
  }

  const handlePairChange = (index: number, side: 'left' | 'right', val: string) => {
    const next = [...pairs]
    next[index] = {
      ...next[index],
      [side]: val,
    }
    setPairs(next)
  }

  // --- ORDER Handlers ---
  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, ''])
  }

  const handleRemoveOrderItem = (index: number) => {
    if (orderItems.length <= 2) {
      setErrorMessage('Câu hỏi sắp xếp câu phải có ít nhất 2 thành phần (TC-04).')
      return
    }
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const handleOrderItemChange = (index: number, val: string) => {
    const next = [...orderItems]
    next[index] = val
    setOrderItems(next)
  }

  const handleMoveOrderItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= orderItems.length) return
    const next = [...orderItems]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    setOrderItems(next)
  }

  const handleSplitQuickSentence = () => {
    const raw = quickSentenceInput.trim()
    if (!raw) return
    let segments: string[] = []
    if (raw.includes('/') || raw.includes('|')) {
      segments = raw.split(/[/|]/).map((s) => s.trim()).filter(Boolean)
    } else if (raw.includes(' ')) {
      segments = raw.split(/\s+/).map((s) => s.trim()).filter(Boolean)
    } else {
      segments = Array.from(raw).map((s) => s.trim()).filter(Boolean)
    }
    if (segments.length >= 2) {
      setOrderItems(segments)
      setQuickSentenceInput('')
    }
  }

  // --- Validation ---
  const validateDraft = (): string[] => {
    const errors: string[] = []
    if (!questionContent.trim()) {
      errors.push('Nội dung câu hỏi không được để trống.')
      return errors
    }
    if (activeTab === 'MCQ') {
      if (options.length < 2) {
        errors.push('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (TC-02 & QTN-08).')
      }
      const hasEmptyOption = options.some((opt) => !opt.content.trim())
      if (hasEmptyOption) {
        errors.push('Các lựa chọn không được để trống nội dung (TC-04).')
      }
      const seen = new Set<string>()
      let hasDuplicate = false
      for (const opt of options) {
        const clean = opt.content.trim().toLowerCase()
        if (clean) {
          if (seen.has(clean)) {
            hasDuplicate = true
            break
          }
          seen.add(clean)
        }
      }
      if (hasDuplicate) {
        errors.push('Hai lựa chọn không được có nội dung giống nhau (TC-05).')
      }
      const correctCount = options.filter((opt) => opt.isCorrect).length
      if (correctCount !== 1) {
        errors.push('Phải có đúng một đáp án được chọn là đáp án đúng (TC-03 & QTN-08).')
      }
    } else if (activeTab === 'FILL') {
      // FILL validations (TC-03, TC-04, TC-05)
      const matches = questionContent.match(/_{3,}/g) || []
      if (matches.length === 0) {
        errors.push('Câu hỏi điền từ bắt buộc phải chứa ít nhất một chỗ trống dạng ___ (TC-03).')
      }
      if (matches.length !== blanks.length) {
        errors.push('Số lượng chỗ trống không khớp với danh sách đáp án cấu hình (TC-04).')
      }
      for (let i = 0; i < blanks.length; i++) {
        if (!blanks[i].correctAnswer.trim()) {
          errors.push(`Chỗ trống #${i + 1} chưa có đáp án đúng (TC-05).`)
        }
      }
    } else if (activeTab === 'MATCH') {
      // MATCH validations (TC-03, TC-04, TC-05)
      if (pairs.length < 2) {
        errors.push('Câu hỏi nối từ phải có ít nhất 2 cặp từ và nghĩa (TC-03).')
      }
      const hasEmptySide = pairs.some(
        (p) => !p.left.trim() || !p.right.trim()
      )
      if (hasEmptySide) {
        errors.push('Các vế của cặp nối từ không được để trống (TC-04).')
      }
      const leftSet = new Set<string>()
      let hasDuplicateLeft = false
      for (const p of pairs) {
        const cleanLeft = p.left.trim().toLowerCase()
        if (cleanLeft) {
          if (leftSet.has(cleanLeft)) {
            hasDuplicateLeft = true
            break
          }
          leftSet.add(cleanLeft)
        }
      }
      if (hasDuplicateLeft) {
        errors.push('Hai cặp nối từ không được có vế trái giống nhau (TC-05).')
      }
    } else if (activeTab === 'ORDER') {
      // ORDER validations (TC-04)
      if (orderItems.length < 2) {
        errors.push('Câu hỏi sắp xếp câu phải có ít nhất 2 thành phần (TC-04).')
      }
      const hasEmptyItem = orderItems.some((item) => !item.trim())
      if (hasEmptyItem) {
        errors.push('Thành phần của câu sắp xếp không được để trống (TC-04).')
      }
    }

    return errors
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setErrorMessage(null)
    setSuccessMessage(null)

    const errors = validateDraft()
    setFormErrors(errors)
    if (errors.length > 0) {
      return
    }

    setSubmitting(true)
    try {
      if (activeTab === 'MCQ') {
        const payloadOptions: CreateQuestionOptionPayload[] = options.map((opt) => ({
          content: opt.content.trim(),
          isCorrect: opt.isCorrect,
        }))

        await createMultipleChoiceQuestion(
          {
            content: questionContent.trim(),
            explanation: explanation.trim() ? explanation.trim() : undefined,
            type: 'MCQ',
            options: payloadOptions,
          },
          user.token
        )

        setSuccessMessage('Tạo câu hỏi trắc nghiệm thành công và đã lưu vào ngân hàng!')
      } else if (activeTab === 'FILL') {
        const blankPayloads: BlankAnswerItem[] = blanks.map((b) => ({
          index: b.index,
          correctAnswer: b.correctAnswer.trim(),
          acceptableAnswers: b.acceptableAnswers.map((a) => a.trim()),
        }))

        await createFillBlankQuestion(
          {
            content: questionContent.trim(),
            explanation: explanation.trim() ? explanation.trim() : undefined,
            blanks: blankPayloads,
          },
          user.token
        )

        setSuccessMessage('Tạo câu hỏi điền từ vào chỗ trống thành công và đã lưu vào ngân hàng!')
      } else if (activeTab === 'MATCH') {
        await createMatchingQuestion(
          {
            content: questionContent.trim(),
            explanation: explanation.trim() ? explanation.trim() : undefined,
            pairs: pairs.map((p) => ({
              left: p.left.trim(),
              right: p.right.trim(),
            })),
          },
          user.token
        )

        setSuccessMessage('Tạo câu hỏi nối từ thành công và đã lưu vào ngân hàng!')
      } else if (activeTab === 'ORDER') {
        await createOrderingQuestion(
          {
            content: questionContent.trim(),
            explanation: explanation.trim() ? explanation.trim() : undefined,
            items: orderItems.map((item) => item.trim()),
          },
          user.token
        )

        setSuccessMessage('Tạo câu hỏi sắp xếp câu thành công và đã lưu vào ngân hàng!')
      }

      // Reset form
      setQuestionContent('')
      setExplanation('')
      setOptions([
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ])
      setBlanks([])
      setPairs([
        { left: '', right: '' },
        { left: '', right: '' },
      ])
      setOrderItems(['', '', ''])
      setQuickSentenceInput('')
      setIsDrawerOpen(false)
      loadQuestions()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Đã xảy ra lỗi khi tạo câu hỏi')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // HTT-05-CN-004: Handle Quick Generate Preview
  const handleQuickGenerate = async () => {
    if (!user) return
    if (!selectedVocabSetId) {
      setErrorMessage('Vui lòng chọn một bộ từ vựng để tạo câu hỏi.')
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)
    setGenerating(true)
    try {
      const drafts = await quickGeneratePreview(
        {
          vocabSetId: selectedVocabSetId,
          format: selectedFormat,
        },
        user.token
      )
      setGeneratedDrafts(drafts)
      setSuccessMessage(`Đã sinh thành công ${drafts.length} câu hỏi trắc nghiệm! Hãy kiểm tra và lưu lại.`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tạo nhanh câu hỏi từ bộ từ vựng')
      }
    } finally {
      setGenerating(false)
    }
  }

  // HTT-05-CN-004-TC-02: Remove a single draft question
  const handleRemoveDraftQuestion = (index: number) => {
    const next = generatedDrafts.filter((_, i) => i !== index)
    setGeneratedDrafts(next)
  }

  // HTT-05-CN-004-TC-02: Batch save retained questions
  const handleBatchSave = async () => {
    if (!user || generatedDrafts.length === 0) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setBatchSaving(true)
    try {
      const saved = await batchCreateQuestions(
        { questions: generatedDrafts },
        user.token
      )
      setSuccessMessage(`Đã lưu thành công ${saved.length} câu hỏi vào ngân hàng câu hỏi!`)
      setGeneratedDrafts([])
      setIsQuickGenOpen(false)
      loadQuestions()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Đã xảy ra lỗi khi lưu danh sách câu hỏi')
      }
    } finally {
      setBatchSaving(false)
    }
  }

  // --- Bulk Import Handlers ---
  const handleDownloadTemplate = async (format: 'excel' | 'csv') => {
    if (!user) return
    setDownloadingTemplate(format)
    setErrorMessage(null)
    try {
      const blob =
        format === 'excel'
          ? await downloadQuestionExcelTemplate(user.token)
          : await downloadQuestionCsvTemplate(user.token)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = format === 'excel' ? 'Mau_Cau_Hoi_HSK.xlsx' : 'Mau_Cau_Hoi_HSK.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải file mẫu. Vui lòng thử lại.')
      }
    } finally {
      setDownloadingTemplate(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const nameLower = file.name.toLowerCase()
    if (!nameLower.endsWith('.xlsx') && !nameLower.endsWith('.csv')) {
      setErrorMessage('Hệ thống chỉ hỗ trợ file định dạng Excel (.xlsx) hoặc CSV (.csv).')
      setImportFile(null)
      return
    }
    setImportFile(file)
    setImportResult(null)
    setErrorMessage(null)
  }

  const handleImportSubmit = async () => {
    if (!user || !importFile) return
    setImporting(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const res = await importQuestions(importFile, user.token)
      setImportResult(res)
      if (res.successCount > 0) {
        setSuccessMessage(`Đã nhập thành công ${res.successCount} câu hỏi vào ngân hàng câu hỏi!`)
        await loadQuestions()
      }
      if (res.errors && res.errors.length > 0) {
        setErrorMessage(
          `Có ${res.errors.length} dòng không thể nhập do dữ liệu không hợp lệ. Vui lòng xem bảng chi tiết bên dưới.`
        )
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Đã xảy ra lỗi khi nhập câu hỏi từ file.')
      }
    } finally {
      setImporting(false)
    }
  }

  const handleClearImport = () => {
    setImportFile(null)
    setImportResult(null)
  }

  const filteredQuestions = questions.filter((q) => {
    const matchSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase())
    if (selectedFilterType === 'ALL') return matchSearch
    return matchSearch && q.type === selectedFilterType
  })

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  // Helper to parse FILL payload
  const parseFillPayload = (payloadStr?: string): { blanks?: BlankAnswerItem[] } | null => {
    if (!payloadStr) return null
    try {
      return JSON.parse(payloadStr)
    } catch {
      return null
    }
  }

  // Helper to parse MATCH payload
  const parseMatchPayload = (payloadStr?: string): { pairs?: MatchingPairItem[] } | null => {
    if (!payloadStr) return null
    try {
      return JSON.parse(payloadStr)
    } catch {
      return null
    }
  }

  // Helper to parse ORDER payload
  const parseOrderPayload = (payloadStr?: string): { correctOrder?: string[] } | null => {
    if (!payloadStr) return null
    try {
      return JSON.parse(payloadStr)
    } catch {
      return null
    }
  }

  // Render preview for Fill in the Blank question
  const renderFillBlankPreview = () => {
    const parts = questionContent.split(/_{3,}/)
    return (
      <div className="space-y-4">
        <div className="text-base leading-relaxed text-slate-800 break-words font-medium">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span>{part}</span>
              {index < parts.length - 1 && (
                <span className="inline-block mx-1.5 px-3 py-1 bg-indigo-50 border-2 border-dashed border-indigo-400 rounded-lg text-indigo-700 font-bold text-sm shadow-inner">
                  {blanks[index]?.correctAnswer.trim() ? (
                    blanks[index].correctAnswer
                  ) : (
                    <span className="text-indigo-300 font-normal">Chỗ trống #{index + 1}</span>
                  )}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {blanks.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Danh sách đáp án thiết lập:
            </span>
            {blanks.map((b, i) => (
              <div
                key={i}
                className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-700">Chỗ trống #{i + 1}:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {b.correctAnswer.trim() || 'Chưa nhập'}
                  </span>
                </div>
                {b.acceptableAnswers.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-slate-600 pl-4">
                    <span className="text-slate-400">Chấp nhận khác:</span>
                    <span className="font-medium text-slate-700">
                      {b.acceptableAnswers.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render preview for Matching question
  const renderMatchingPreview = () => {
    return (
      <div className="space-y-4">
        <div className="text-base font-semibold text-slate-900 leading-snug break-words">
          {questionContent.trim() ? questionContent : (
            <span className="text-slate-300 italic">Chưa nhập yêu cầu nối từ...</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Cột trái (Từ) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Cột A (Từ / Ký tự)
            </span>
            {pairs.map((p, i) => (
              <div
                key={i}
                className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-sm font-bold text-purple-900 flex items-center justify-between shadow-xs"
              >
                <span>{p.left.trim() || `(Cặp #${i + 1} trái)`}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border-2 border-white shadow-xs" />
              </div>
            ))}
          </div>

          {/* Cột phải (Nghĩa - mô phỏng xáo trộn cho học sinh) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Cột B (Nghĩa / Dịch)
            </span>
            {/* Mô phỏng xáo trộn bằng cách đảo thứ tự hiển thị */}
            {[...pairs].reverse().map((p, i) => (
              <div
                key={i}
                className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-sm font-medium text-indigo-900 flex items-center justify-between shadow-xs"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-white shadow-xs" />
                <span>{p.right.trim() || `(Cặp #${pairs.length - i} phải)`}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center italic pt-1">
          Giao diện học sinh: Kéo hoặc nhấn chọn điểm nối giữa Cột A và Cột B.
        </p>
      </div>
    )
  }

  // Render preview for Ordering question
  const renderOrderingPreview = () => {
    return (
      <div className="space-y-4">
        <div className="text-base font-semibold text-slate-900 leading-snug break-words">
          {questionContent.trim() ? questionContent : (
            <span className="text-slate-300 italic">Chưa nhập yêu cầu sắp xếp câu...</span>
          )}
        </div>

        {/* Khung mô phỏng câu hoàn chỉnh sau khi sắp xếp đúng */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Đáp án câu hoàn chỉnh (thứ tự đúng):
          </span>
          <div className="text-base font-bold text-emerald-950 flex flex-wrap items-center gap-1.5">
            {orderItems.filter(Boolean).length > 0 ? (
              orderItems.filter(Boolean).map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg shadow-xs"
                >
                  {word}
                </span>
              ))
            ) : (
              <span className="text-emerald-400 font-normal italic text-sm">
                Chưa có từ nào được cấu hình
              </span>
            )}
          </div>
        </div>

        {/* Mô phỏng các thẻ từ xáo trộn cho học sinh ghép */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Mô phỏng các thẻ từ học sinh nhìn thấy (xáo trộn):
          </span>
          <div className="flex flex-wrap gap-2">
            {[...orderItems].filter(Boolean).reverse().map((word, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-indigo-50 border-2 border-dashed border-indigo-300 text-indigo-700 font-bold text-sm rounded-xl shadow-xs"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Quay lại bàn làm việc"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  Ngân hàng câu hỏi
                </h1>
                <p className="text-xs text-slate-500">
                  Quản lý và soạn thảo câu hỏi trắc nghiệm & điền từ của riêng bạn (QTN-19)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* HTT-05-CN-006: Go to Exercises */}
            <button
              onClick={() => navigate('/exercises')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium rounded-xl shadow-xs transition text-sm"
              title="Đóng gói câu hỏi thành bài tập hoàn chỉnh"
            >
              <FileCheck className="w-4 h-4" />
              <span>Quản lý bài tập</span>
            </button>

            {/* Bulk Import from Excel / CSV Action */}
            <button
              onClick={() => {
                setIsImportOpen(!isImportOpen)
                setIsQuickGenOpen(false)
                setIsDrawerOpen(false)
                setIsEditDrawerOpen(false)
                setErrorMessage(null)
                setFormErrors([])
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-xl shadow-xs transition text-sm ${
                isImportOpen
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Nhập danh sách câu hỏi hàng loạt từ file Excel (.xlsx) hoặc CSV (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isImportOpen ? 'Đóng nhập file' : 'Nhập từ file (Excel/CSV)'}</span>
            </button>

            {/* HTT-05-CN-004: Quick Generate Action */}
            <button
              onClick={() => {
                setIsQuickGenOpen(!isQuickGenOpen)
                setIsImportOpen(false)
                setIsDrawerOpen(false)
                setIsEditDrawerOpen(false)
                setErrorMessage(null)
                setFormErrors([])
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-xl shadow-sm transition ${
                isQuickGenOpen
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>{isQuickGenOpen ? 'Đóng tạo nhanh' : 'Tạo nhanh từ bộ từ vựng'}</span>
            </button>

            {/* Manual question creation */}
            <button
              onClick={() => {
                setIsDrawerOpen(!isDrawerOpen)
                setIsQuickGenOpen(false)
                setIsImportOpen(false)
                setIsEditDrawerOpen(false)
                setErrorMessage(null)
                setFormErrors([])
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition"
            >
              {isDrawerOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Đóng soạn thủ công</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Soạn thủ công</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Global Notifications */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{successMessage}</div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* BULK IMPORT FROM EXCEL / CSV PANEL (NO MODAL) */}
        {isImportOpen && (
          <div className="bg-white border-2 border-emerald-300 rounded-2xl shadow-lg p-6 lg:p-8 animate-fadeIn space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Nhập câu hỏi hàng loạt từ file Excel (.xlsx) hoặc CSV (.csv)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ đầy đủ 4 dạng câu hỏi: Trắc nghiệm (MCQ), Điền từ (FILL), Nối từ (MATCH) và Sắp xếp câu (ORDER).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportOpen(false)
                  handleClearImport()
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition"
                title="Đóng panel nhập file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Download & Format Guide */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <div>
                  <span className="text-sm font-bold text-emerald-950 block">
                    Tải mẫu câu hỏi chuẩn của hệ thống
                  </span>
                  <span className="text-xs text-emerald-800">
                    File mẫu đã có sẵn 4 ví dụ cụ thể cho cả 4 dạng câu hỏi kèm hướng dẫn định dạng chi tiết.
                  </span>
                </div>
                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('excel')}
                    disabled={downloadingTemplate !== null}
                    className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {downloadingTemplate === 'excel' ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Tải mẫu Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    disabled={downloadingTemplate !== null}
                    className="flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {downloadingTemplate === 'csv' ? (
                      <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Tải mẫu CSV (.csv)</span>
                  </button>
                </div>
              </div>

              {/* 4 Formats Reference Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">1. Trắc nghiệm</span>
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                      MCQ
                    </span>
                  </div>
                  <p className="text-blue-800 leading-relaxed text-[11px]">
                    <strong>Cột B:</strong> Câu hỏi<br />
                    <strong>Cột D:</strong> 4 lựa chọn cách nhau bằng dấu <code className="bg-blue-100 px-1 py-0.2 rounded font-mono">|</code><br />
                    <strong>Cột E:</strong> Đáp án đúng (khớp nội dung hoặc A/B/C/D)
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">2. Điền từ</span>
                    <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-md">
                      FILL
                    </span>
                  </div>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    <strong>Cột B:</strong> Chứa ít nhất một chỗ trống <code className="bg-amber-100 px-1 py-0.2 rounded font-mono">___</code><br />
                    <strong>Cột E:</strong> Đáp án đúng (các chỗ trống cách nhau bằng <code className="bg-amber-100 px-1 py-0.2 rounded font-mono">|</code>)<br />
                    <strong>Cột F:</strong> Đáp án chấp nhận khác (tùy chọn)
                  </p>
                </div>

                <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">3. Nối từ</span>
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md">
                      MATCH
                    </span>
                  </div>
                  <p className="text-purple-800 leading-relaxed text-[11px]">
                    <strong>Cột B:</strong> Yêu cầu bài tập<br />
                    <strong>Cột D:</strong> Danh sách cặp nối định dạng <code className="bg-purple-100 px-1 py-0.2 rounded font-mono">từ:nghĩa|từ:nghĩa</code> (tối thiểu 2 cặp)
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">4. Sắp xếp câu</span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-md">
                      ORDER
                    </span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    <strong>Cột B:</strong> Yêu cầu bài tập<br />
                    <strong>Cột D:</strong> Các từ/cụm từ theo thứ tự đúng cách nhau bằng dấu <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono">|</code> (tối thiểu 2 thành phần)
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload Dropzone */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center space-x-1.5">
                <FileUp className="w-4 h-4 text-emerald-600" />
                <span>Chọn file câu hỏi từ máy tính (.xlsx hoặc .csv)</span>
              </label>

              {!importFile ? (
                <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                    Nhấn vào đây để tải file lên hoặc kéo thả file vào khung này
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Định dạng hỗ trợ: Microsoft Excel (.xlsx) hoặc CSV (.csv) mã hóa UTF-8
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="bg-white border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 break-all">
                        {importFile.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Dung lượng: {(importFile.size / 1024).toFixed(1)} KB • Định dạng:{' '}
                        {importFile.name.endsWith('.xlsx') ? 'Excel (.xlsx)' : 'CSV (.csv)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleClearImport}
                      disabled={importing}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-200"
                    >
                      Chọn file khác
                    </button>

                    <button
                      type="button"
                      onClick={handleImportSubmit}
                      disabled={importing}
                      className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
                    >
                      {importing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang xử lý & lưu...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tiến hành nhập vào ngân hàng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Import Result Statistics & Details Area */}
            {importResult && (
              <div className="space-y-4 pt-3 border-t border-slate-100 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Tổng số dòng xử lý</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {importResult.totalRows}
                      </span>
                    </div>
                    <Layers className="w-5 h-5 text-slate-400" />
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-700 block">Nhập thành công</span>
                      <span className="text-lg font-extrabold text-emerald-800">
                        {importResult.successCount} câu
                      </span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-700 block">Dòng lỗi / Bỏ qua</span>
                      <span className="text-lg font-extrabold text-amber-800">
                        {importResult.skippedCount} dòng
                      </span>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                {/* Errors List */}
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Chi tiết các dòng không hợp lệ ({importResult.errors.length}):</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pl-6 pr-2 text-xs text-rose-700">
                      {importResult.errors.map((err, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5">
                          <span className="font-bold text-rose-800">•</span>
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Imported List Preview */}
                {importResult.importedQuestions && importResult.importedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Danh sách các câu hỏi vừa nhập mới ({importResult.importedQuestions.length}):
                    </span>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {importResult.importedQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex-shrink-0 ${
                                q.type === 'MCQ'
                                  ? 'bg-blue-100 text-blue-700'
                                  : q.type === 'FILL'
                                  ? 'bg-amber-100 text-amber-800'
                                  : q.type === 'MATCH'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {q.type}
                            </span>
                            <span className="font-semibold text-slate-800 truncate">
                              {q.content}
                            </span>
                          </div>
                          <span className="text-emerald-700 font-medium flex-shrink-0 ml-3">
                            #ID: {q.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* HTT-05-CN-004: QUICK GENERATE FROM VOCAB SET PANEL (NO MODAL) */}
        {isQuickGenOpen && (
          <div className="bg-white border-2 border-amber-300 rounded-2xl shadow-lg p-6 lg:p-8 animate-fadeIn space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tạo nhanh câu hỏi trắc nghiệm từ bộ từ vựng
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hệ thống tự động tạo câu hỏi trắc nghiệm 4 lựa chọn với phương án gây nhiễu lấy từ các từ khác trong bộ (QTN-08, QTN-19).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickGenOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selection Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
              <div className="md:col-span-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <BookMarked className="w-4 h-4 text-amber-600" />
                  <span>Chọn bộ từ vựng (QTN-19)</span>
                </label>
                {vocabSets.length === 0 ? (
                  <div className="text-xs text-slate-500 py-2">
                    Bạn chưa có bộ từ vựng nào. Hãy vào{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/vocab-sets')}
                      className="text-indigo-600 underline font-semibold"
                    >
                      Bộ từ vựng
                    </button>{' '}
                    để tạo bộ từ trước.
                  </div>
                ) : (
                  <select
                    value={selectedVocabSetId || ''}
                    onChange={(e) => setSelectedVocabSetId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {vocabSets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Dạng câu hỏi trắc nghiệm
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as QuestionFormat)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="HANZI_TO_MEANING">Chữ Hán ➔ Chọn nghĩa tiếng Việt</option>
                  <option value="MEANING_TO_HANZI">Nghĩa tiếng Việt ➔ Chọn chữ Hán</option>
                  <option value="HANZI_TO_PINYIN">Chữ Hán ➔ Chọn Pinyin</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={handleQuickGenerate}
                  disabled={generating || vocabSets.length === 0}
                  className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang sinh câu hỏi...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Sinh câu hỏi tự động</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Drafts Preview & Review Area (HTT-05-CN-004-TC-02) */}
            {generatedDrafts.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>
                        Đã sinh {generatedDrafts.length} câu hỏi trắc nghiệm
                      </span>
                    </h3>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Bạn có thể bấm biểu tượng thùng rác để bỏ bớt các câu không mong muốn trước khi lưu (TC-02).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBatchSave}
                    disabled={batchSaving}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex-shrink-0"
                  >
                    {batchSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang lưu vào ngân hàng...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lưu {generatedDrafts.length} câu vào ngân hàng</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Drafts Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedDrafts.map((draft, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                            Câu #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDraftQuestion(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Bỏ câu này khỏi danh sách lưu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-sm font-bold text-slate-900 leading-snug break-words">
                          {draft.content}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {draft.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2 ${
                                opt.isCorrect
                                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold'
                                  : 'bg-slate-50 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  opt.isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {optionLetters[oIdx] || oIdx + 1}
                              </span>
                              <span className="flex-1 truncate">{opt.content}</span>
                              {opt.isCorrect && (
                                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>

                        {draft.explanation && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                            <span className="font-semibold text-slate-700">Giải thích: </span>
                            <span>{draft.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANUAL CREATION INLINE PANEL (NO MODAL) */}
        {isDrawerOpen && (
          <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-lg p-6 lg:p-8 animate-fadeIn">
            {/* Drawer Top Navigation & Question Type Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Soạn câu hỏi mới</h2>
                  <p className="text-xs text-slate-500">
                    Chọn dạng câu hỏi và điền cấu hình đáp án tương ứng
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-start sm:self-auto">
                {/* Type Switch Tabs */}
                <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('MCQ')
                      setFormErrors([])
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'MCQ'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Trắc nghiệm (MCQ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('FILL')
                      setFormErrors([])
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'FILL'
                        ? 'bg-white text-teal-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Điền từ (FILL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('MATCH')
                      setFormErrors([])
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'MATCH'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Nối từ (MATCH)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('ORDER')
                      setFormErrors([])
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'ORDER'
                        ? 'bg-white text-amber-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sắp xếp câu (ORDER)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {formErrors.length > 0 && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-rose-700 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Vui lòng kiểm tra lại thông tin:</span>
                </div>
                <ul className="list-disc list-inside text-xs text-rose-600 pl-2 space-y-0.5">
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Columns */}
              <form onSubmit={handleSubmitQuestion} className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Nội dung câu hỏi <span className="text-rose-500">*</span>
                    </label>
                    {activeTab === 'FILL' && (
                      <button
                        type="button"
                        onClick={handleInsertBlankMarker}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Chèn chỗ trống (___)</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder={
                      activeTab === 'MCQ'
                        ? 'Ví dụ: 你好 nghĩa là gì? Hoặc nhập đoạn văn, câu đố tiếng Trung...'
                        : activeTab === 'FILL'
                        ? 'Ví dụ: 我___学生 (Nhập 3 dấu gạch dưới ___ làm chỗ trống)'
                        : activeTab === 'MATCH'
                        ? 'Ví dụ: Hãy nối các từ chào hỏi sau đây với nghĩa tiếng Việt tương ứng...'
                        : 'Ví dụ: Hãy sắp xếp các từ sau thành câu hoàn chỉnh...'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-base"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {activeTab === 'MCQ'
                      ? 'Hỗ trợ hiển thị chữ Hán, Pinyin có dấu thanh và tiếng Việt rõ nét.'
                      : activeTab === 'FILL'
                      ? 'Mẹo: Dùng 3 dấu gạch dưới (___) tại mỗi vị trí cần học sinh điền từ.'
                      : activeTab === 'MATCH'
                      ? 'Nhập yêu cầu bài tập nối từ, sau đó cấu hình các cặp từ và nghĩa tương ứng bên dưới.'
                      : 'Nhập yêu cầu bài tập, sau đó cấu hình các thành phần theo đúng thứ tự câu chuẩn bên dưới.'}
                  </p>
                </div>

                {/* MCQ Mode Options */}
                {activeTab === 'MCQ' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-700">
                        Các lựa chọn & Đáp án đúng <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm lựa chọn</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition flex items-center space-x-3 ${
                            opt.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Radio select correct answer */}
                          <label
                            className="flex items-center cursor-pointer space-x-2"
                            title="Chọn làm đáp án đúng"
                          >
                            <input
                              type="radio"
                              name="correct_answer"
                              checked={opt.isCorrect}
                              onChange={() => handleSelectCorrect(idx)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                opt.isCorrect
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {optionLetters[idx] || idx + 1}
                            </span>
                          </label>

                          {/* Input Content */}
                          <input
                            type="text"
                            value={opt.content}
                            onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                            placeholder={`Nội dung lựa chọn ${optionLetters[idx] || idx + 1}`}
                            className="flex-1 px-3 py-2 text-sm bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none text-slate-800"
                          />

                          {/* Correct badge */}
                          {opt.isCorrect && (
                            <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đáp án đúng</span>
                            </span>
                          )}

                          {/* Remove Option */}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            disabled={options.length <= 2}
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ${
                              options.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Xóa lựa chọn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FILL Mode Blanks Configuration */}
                {activeTab === 'FILL' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-700">
                        Cấu hình đáp án các chỗ trống{' '}
                        <span className="text-slate-400 font-normal">
                          (Tìm thấy: {blanks.length} chỗ trống)
                        </span>
                      </label>
                    </div>

                    {blanks.length === 0 ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          Chưa có chỗ trống nào trong câu. Vui lòng thêm ít nhất một ký hiệu{' '}
                          <code className="font-bold bg-amber-100 px-1 py-0.5 rounded">___</code>{' '}
                          (3 dấu gạch dưới) vào nội dung câu hỏi.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {blanks.map((b, idx) => (
                          <div
                            key={b.index}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1.5">
                                <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span>Chỗ trống #{idx + 1}</span>
                              </span>
                            </div>

                            {/* Correct Answer */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Đáp án chính xác <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={b.correctAnswer}
                                onChange={(e) => handleBlankCorrectChange(idx, e.target.value)}
                                placeholder="Ví dụ: 是"
                                className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                              />
                            </div>

                            {/* Acceptable Answers */}
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Các đáp án chấp nhận được khác (tùy chọn)
                              </label>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {b.acceptableAnswers.map((acc, aIdx) => (
                                  <span
                                    key={aIdx}
                                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  >
                                    <span>{acc}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAcceptableAnswer(idx, aIdx)}
                                      className="text-indigo-400 hover:text-indigo-700 ml-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={b.newAcceptableInput || ''}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setBlanks((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, newAcceptableInput: val } : item
                                      )
                                    )
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      handleAddAcceptableAnswer(idx)
                                    }
                                  }}
                                  placeholder="Nhập từ đồng nghĩa/chấp nhận rồi nhấn Thêm (hoặc Enter)"
                                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddAcceptableAnswer(idx)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* MATCH Mode Configuration */}
                {activeTab === 'MATCH' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700">
                          Các cặp từ và nghĩa cần nối <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-xs text-slate-400">
                          Tối thiểu 2 cặp (TC-01, TC-03). Vế trái và vế phải không được để trống (TC-04). Vế trái không được trùng lặp (TC-05).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPair}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 px-3 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm cặp</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {pairs.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 transition hover:border-purple-300"
                        >
                          <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {idx + 1}
                          </span>

                          {/* Left item */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={p.left}
                              onChange={(e) => handlePairChange(idx, 'left', e.target.value)}
                              placeholder={`Vế trái #${idx + 1} (Ví dụ: 你好)`}
                              className="w-full px-3 py-1.5 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-900"
                            />
                          </div>

                          <div className="text-slate-400 flex items-center justify-center">
                            <Link2 className="w-4 h-4 text-purple-500" />
                          </div>

                          {/* Right item */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={p.right}
                              onChange={(e) => handlePairChange(idx, 'right', e.target.value)}
                              placeholder={`Vế phải #${idx + 1} (Ví dụ: Xin chào)`}
                              className="w-full px-3 py-1.5 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-900"
                            />
                          </div>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePair(idx)}
                            disabled={pairs.length <= 2}
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ${
                              pairs.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Xóa cặp này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ORDER Mode Configuration */}
                {activeTab === 'ORDER' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700">
                          Thành phần câu theo thứ tự chuẩn <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-xs text-slate-400">
                          Nhập các từ hoặc cụm từ theo đúng thứ tự câu đúng (TC-02, tối thiểu 2 thành phần TC-04).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddOrderItem}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm từ</span>
                      </button>
                    </div>

                    {/* Quick split tool */}
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                        <Split className="w-4 h-4 text-amber-700" />
                        <span>Công cụ nhập nhanh câu:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={quickSentenceInput}
                          onChange={(e) => setQuickSentenceInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleSplitQuickSentence()
                            }
                          }}
                          placeholder="Ví dụ: 我 / 是 / 学生 hoặc 我 是 学生 hoặc nhập câu tiếng Trung rồi bấm Tách"
                          className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleSplitQuickSentence}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          Tách thành từ
                        </button>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div className="space-y-2">
                      {orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2.5 transition hover:border-amber-300"
                        >
                          <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {idx + 1}
                          </span>

                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleOrderItemChange(idx, e.target.value)}
                            placeholder={`Thành phần #${idx + 1}`}
                            className="flex-1 px-3 py-1.5 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                          />

                          {/* Reorder buttons */}
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveOrderItem(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed"
                              title="Di chuyển lên trước"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrderItem(idx, 'down')}
                              disabled={idx === orderItems.length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed"
                              title="Di chuyển xuống sau"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveOrderItem(idx)}
                            disabled={orderItems.length <= 2}
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ${
                              orderItems.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Xóa thành phần này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Giải thích đáp án (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Giải thích vì sao đáp án này đúng, kiến thức liên quan..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium text-sm transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-50"
                  >
                    {submitting ? 'Đang lưu câu hỏi...' : 'Lưu vào ngân hàng câu hỏi'}
                  </button>
                </div>
              </form>

              {/* LIVE STUDENT PREVIEW */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>Xem trước giao diện học sinh</span>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        ?
                      </span>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                          {activeTab === 'MCQ'
                            ? 'Câu hỏi trắc nghiệm (MCQ)'
                            : activeTab === 'FILL'
                            ? 'Câu hỏi điền từ (FILL)'
                            : activeTab === 'MATCH'
                            ? 'Câu hỏi nối từ (MATCH)'
                            : 'Câu hỏi sắp xếp câu (ORDER)'}
                        </span>
                        {activeTab === 'MCQ' ? (
                          <div className="text-base font-semibold text-slate-900 leading-snug break-words">
                            {questionContent.trim() ? (
                              questionContent
                            ) : (
                              <span className="text-slate-300 italic">
                                Chưa nhập nội dung câu hỏi...
                              </span>
                            )}
                          </div>
                        ) : activeTab === 'FILL' ? (
                          renderFillBlankPreview()
                        ) : activeTab === 'MATCH' ? (
                          renderMatchingPreview()
                        ) : (
                          renderOrderingPreview()
                        )}
                      </div>
                    </div>

                    {activeTab === 'MCQ' && (
                      <div className="space-y-2 pt-2">
                        {options.map((opt, i) => (
                          <div
                            key={i}
                            className="px-3 py-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center space-x-3 text-sm text-slate-800 transition"
                          >
                            <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-500">
                              {optionLetters[i] || i + 1}
                            </span>
                            <span className="flex-1 break-words">
                              {opt.content.trim() ? (
                                opt.content
                              ) : (
                                <span className="text-slate-300 italic">
                                  Lựa chọn {optionLetters[i] || i + 1}
                                </span>
                              )}
                            </span>
                            {opt.isCorrect && (
                              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                Đáp án
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {explanation.trim() && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-900 space-y-1">
                        <span className="font-bold flex items-center space-x-1 text-amber-800">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Giải thích chi tiết:</span>
                        </span>
                        <p>{explanation}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-400 text-center">
                  Câu hỏi sẽ được bảo vệ chỉ bạn và học sinh được giao bài mới có thể xem (QTN-19).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HTT-05-CN-005: EDIT QUESTION PANEL (NO MODAL / INLINE DRAWER) */}
        {isEditDrawerOpen && editingQuestion && (
          <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white text-sm">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold flex items-center space-x-2">
                    <span>Chỉnh sửa câu hỏi #{editingQuestion.id}</span>
                    <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                      {editingQuestion.type === 'FILL'
                        ? 'Điền từ'
                        : editingQuestion.type === 'MATCH'
                        ? 'Nối từ'
                        : editingQuestion.type === 'ORDER'
                        ? 'Sắp xếp câu'
                        : 'Trắc nghiệm (MCQ)'}
                    </span>
                  </h2>
                  <p className="text-xs text-indigo-100">
                    Sửa đổi trong ngân hàng không ảnh hưởng nội dung snapshot các lần giao bài trước (QTN-10).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEdit}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Đóng chỉnh sửa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              {editErrors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Vui lòng kiểm tra các lỗi sau:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-700 space-y-0.5 pl-1">
                    {editErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                {/* Content field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nội dung câu hỏi <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Nhập nội dung câu hỏi..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                {/* MCQ Options editing */}
                {editingQuestion.type === 'MCQ' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Các lựa chọn trả lời (QTN-08: Tối thiểu 2 lựa chọn, 1 đáp án đúng)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddEditOption}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm lựa chọn</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {editOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
                            opt.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-300'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectEditCorrect(idx)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              opt.isCorrect
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title={opt.isCorrect ? 'Đáp án đúng' : 'Đánh dấu là đáp án đúng'}
                          >
                            {optionLetters[idx] || idx + 1}
                          </button>
                          <input
                            type="text"
                            value={opt.content}
                            onChange={(e) => handleEditOptionChange(idx, e.target.value)}
                            placeholder={`Nội dung lựa chọn ${optionLetters[idx] || idx + 1}`}
                            className="flex-1 px-3 py-1.5 text-sm bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {opt.isCorrect && (
                            <span className="text-xs text-emerald-700 font-bold px-2 py-0.5 bg-emerald-100 rounded-md">
                              Đáp án đúng
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveEditOption(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                            title="Xóa lựa chọn này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Non-MCQ Payload editing if needed */}
                {editingQuestion.type !== 'MCQ' && (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Cấu hình đáp án chi tiết (JSON Payload)
                    </label>
                    <textarea
                      rows={3}
                      value={editPayload}
                      onChange={(e) => setEditPayload(e.target.value)}
                      placeholder='{"blanks":[...]}'
                      className="w-full px-4 py-2 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    />
                  </div>
                )}

                {/* Explanation field */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Giải thích chi tiết (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={editExplanation}
                    onChange={(e) => setEditExplanation(e.target.value)}
                    placeholder="Nhập giải thích củng cố kiến thức cho học sinh sau khi nộp bài..."
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={editSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {editSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm câu hỏi theo nội dung..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            {/* Filter by Type */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedFilterType('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'ALL'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterType('MCQ')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'MCQ'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Trắc nghiệm
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterType('FILL')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'FILL'
                    ? 'bg-white text-teal-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Điền từ
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterType('MATCH')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'MATCH'
                    ? 'bg-white text-purple-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Nối từ
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterType('ORDER')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'ORDER'
                    ? 'bg-white text-amber-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sắp xếp
              </button>
            </div>

            <span className="flex items-center space-x-1.5 font-medium text-xs text-slate-500">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{filteredQuestions.length} câu hỏi</span>
            </span>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Đang tải ngân hàng câu hỏi...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto mb-4">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {searchTerm ? 'Không tìm thấy câu hỏi phù hợp' : 'Ngân hàng câu hỏi trống'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {searchTerm
                ? 'Thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc sang Tất cả.'
                : 'Bạn chưa tạo câu hỏi nào trong ngân hàng. Hãy bắt đầu bằng cách soạn thủ công hoặc tạo nhanh từ một bộ từ vựng.'}
            </p>
            {!searchTerm && (
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setIsQuickGenOpen(true)
                    setIsDrawerOpen(false)
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Tạo nhanh từ bộ từ</span>
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(true)
                    setIsQuickGenOpen(false)
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Soạn thủ công</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredQuestions.map((q) => {
              const isFill = q.type === 'FILL'
              const isMatch = q.type === 'MATCH'
              const isOrder = q.type === 'ORDER'
              const fillPayload = isFill ? parseFillPayload(q.payload) : null
              const matchPayload = isMatch ? parseMatchPayload(q.payload) : null
              const orderPayload = isOrder ? parseOrderPayload(q.payload) : null

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          isFill
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : isMatch
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : isOrder
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        <span>Câu #{q.id}</span>
                        <span>•</span>
                        <span>
                          {isFill
                            ? 'Điền từ (FILL)'
                            : isMatch
                            ? 'Nối từ (MATCH)'
                            : isOrder
                            ? 'Sắp xếp (ORDER)'
                            : 'Trắc nghiệm (MCQ)'}
                        </span>
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-slate-400 flex items-center space-x-1 mr-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Sửa câu hỏi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingQuestionId(deletingQuestionId === q.id ? null : q.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-base font-bold text-slate-900 leading-snug break-words">
                      {q.content}
                    </div>

                    {/* Render according to type */}
                    {isFill ? (
                      /* Fill in blank display */
                      <div className="space-y-2 pt-1">
                        {fillPayload?.blanks && fillPayload.blanks.length > 0 ? (
                          fillPayload.blanks.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="px-3 py-2 rounded-xl text-xs bg-slate-50 text-slate-800 border border-slate-200 flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-600">
                                  Chỗ trống #{bIdx + 1}:
                                </span>
                                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                  {b.correctAnswer}
                                </span>
                              </div>
                              {b.acceptableAnswers && b.acceptableAnswers.length > 0 && (
                                <div className="text-slate-500 flex items-center space-x-1">
                                  <span>Chấp nhận khác:</span>
                                  <span className="text-slate-700 font-medium">
                                    {b.acceptableAnswers.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">
                            Chưa có dữ liệu đáp án chi tiết.
                          </div>
                        )}
                      </div>
                    ) : isMatch ? (
                      /* Matching pairs display */
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchPayload?.pairs && matchPayload.pairs.length > 0 ? (
                            matchPayload.pairs.map((p, pIdx) => (
                              <div
                                key={pIdx}
                                className="px-3 py-2 rounded-xl text-xs bg-purple-50/50 text-purple-900 border border-purple-200 flex items-center justify-between"
                              >
                                <span className="font-bold">{p.left}</span>
                                <Link2 className="w-3.5 h-3.5 text-purple-400 mx-1.5 flex-shrink-0" />
                                <span className="font-medium text-slate-700">{p.right}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-slate-400 italic">
                              Chưa có dữ liệu cặp nối từ chi tiết.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isOrder ? (
                      /* Ordering sentence display */
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-semibold text-slate-500 block">
                          Thứ tự các thành phần đúng:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {orderPayload?.correctOrder && orderPayload.correctOrder.length > 0 ? (
                            orderPayload.correctOrder.map((token, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-1 text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 rounded-lg shadow-2xs"
                              >
                                <span className="text-amber-500 mr-1 text-[10px] font-normal">
                                  {tIdx + 1}.
                                </span>
                                {token}
                              </span>
                            ))
                          ) : (
                            <div className="text-xs text-slate-400 italic">
                              Chưa có dữ liệu thứ tự câu chi tiết.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* MCQ options list */
                      <div className="space-y-2 pt-1">
                        {q.options &&
                          q.options.map((opt, oIdx) => (
                            <div
                              key={opt.id}
                              className={`px-3 py-2 rounded-xl text-xs flex items-center space-x-2.5 ${
                                opt.isCorrect
                                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium'
                                  : 'bg-slate-50 text-slate-700 border border-slate-100'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                                  opt.isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {optionLetters[oIdx] || oIdx + 1}
                              </span>
                              <span className="flex-1 break-words">{opt.content}</span>
                              {opt.isCorrect && (
                                <span className="flex items-center space-x-1 text-emerald-700 font-semibold text-xs">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Đáp án đúng</span>
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900">
                        <span className="font-bold">Giải thích: </span>
                        <span>{q.explanation}</span>
                      </div>
                    )}

                    {/* Inline Delete Confirmation (No Modal!) */}
                    {deletingQuestionId === q.id && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                        <div className="flex items-start space-x-2 text-rose-800">
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            Xác nhận xóa câu hỏi này khỏi ngân hàng? Nếu câu hỏi đã dùng trong bài tập, hệ thống sẽ ẩn để bảo toàn dữ liệu làm bài (QTN-14).
                          </span>
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setDeletingQuestionId(null)}
                            disabled={deleteSubmitting}
                            className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition font-medium"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            disabled={deleteSubmitting}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition font-medium flex items-center space-x-1"
                          >
                            {deleteSubmitting ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            <span>Xác nhận xóa</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
