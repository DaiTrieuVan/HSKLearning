import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthPage } from './pages/auth/AuthPage'
import { MainWorkspace } from './pages/dashboard/MainWorkspace'
import { HskCurriculumPage } from './pages/content/HskCurriculumPage'
import { HskRoadmapPage } from './pages/content/HskRoadmapPage'
import { LessonStudyPage } from './pages/content/LessonStudyPage'
import { TeacherVocabSetsPage } from './pages/teacher/TeacherVocabSetsPage'
import { CreateClassPage } from './pages/classroom/CreateClassPage'
import { JoinClassPage } from './pages/classroom/JoinClassPage'
import { ClassDetailPage } from './pages/classroom/ClassDetailPage'
import { UserProfilePage } from './pages/profile/UserProfilePage'
import { TeacherRequestPage } from './pages/teacher/TeacherRequestPage'
import { VocabSearchPage } from './pages/content/VocabSearchPage'
import { QuestionBankPage } from './pages/teacher/QuestionBankPage'
import { ExerciseManagementPage } from './pages/teacher/ExerciseManagementPage'
import { TakeAssignmentPage } from './pages/classroom/TakeAssignmentPage'
import { AssignmentSubmissionsPage } from './pages/classroom/AssignmentSubmissionsPage'
import { StudentSubmissionDetailPage } from './pages/classroom/StudentSubmissionDetailPage'
import { PersonalProgressPage } from './pages/progress/PersonalProgressPage'
import { SubmissionHistoryPage } from './pages/progress/SubmissionHistoryPage'
import { MockExamHistoryPage } from './pages/progress/MockExamHistoryPage'

import { ClassGradebookPage } from './pages/classroom/ClassGradebookPage'
import { ClassStudentProgressPage } from './pages/classroom/ClassStudentProgressPage'
import { SrsReviewPage } from './pages/learning/SrsReviewPage'
import { ListeningPracticeListPage } from './pages/learning/ListeningPracticeListPage'
import { ListeningPracticeDetailPage } from './pages/learning/ListeningPracticeDetailPage'
import { HanziWritingPracticePage } from './pages/learning/HanziWritingPracticePage'
import { PronunciationPracticePage } from './pages/learning/PronunciationPracticePage'
import { AiLearningAssistantPage } from './pages/learning/AiLearningAssistantPage'
import { PrivateVocabManagementPage } from './pages/teacher/PrivateVocabManagementPage'
import { AddWordsToVocabSetPage } from './pages/teacher/AddWordsToVocabSetPage'
import { MockExamManagementPage } from './pages/teacher/MockExamManagementPage'
import { Hsk30ExamManagementPage } from './pages/teacher/Hsk30ExamManagementPage'
import { Hsk30TakeExamPage } from './pages/learning/Hsk30TakeExamPage'
import { StudentVocabSetsPage } from './pages/learning/StudentVocabSetsPage'
import { StudentWordsListPage } from './pages/learning/StudentWordsListPage'
import { PracticeHubPage } from './pages/learning/PracticeHubPage'
import { VocabFlashcardPracticePage } from './pages/learning/VocabFlashcardPracticePage'
import { VocabQuizPracticePage } from './pages/learning/VocabQuizPracticePage'
import { VocabMatchPracticePage } from './pages/learning/VocabMatchPracticePage'
import { VocabWritingPracticePage } from './pages/learning/VocabWritingPracticePage'
import { VocabWritingPdfPage } from './pages/learning/VocabWritingPdfPage'
import { VocabTypingPracticePage } from './pages/learning/VocabTypingPracticePage'
import { VocabDictationPracticePage } from './pages/learning/VocabDictationPracticePage'
import { AppLayout } from './layouts/AppLayout'

function AppRoutes() {
  const { isLoggedIn, user } = useAuth()

  if (!isLoggedIn) {
    return <AuthPage />
  }

  const isTeacher = user?.activeMode === 'TEACHER'

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainWorkspace />} />
        <Route path="/progress" element={<PersonalProgressPage />} />
        <Route path="/history" element={<SubmissionHistoryPage />} />
        <Route path="/roadmap" element={<HskRoadmapPage />} />
        <Route path="/srs/review" element={<SrsReviewPage />} />
        <Route path="/listening" element={<ListeningPracticeListPage />} />
        <Route path="/listening/:id" element={<ListeningPracticeDetailPage />} />
        <Route path="/writing" element={<HanziWritingPracticePage />} />
        <Route path="/pronunciation" element={<PronunciationPracticePage />} />
        <Route path="/ai-assistant" element={<AiLearningAssistantPage />} />
        <Route path="/curriculum" element={<HskCurriculumPage />} />
        <Route path="/lessons/:lessonId" element={<LessonStudyPage />} />
        <Route path="/vocab-sets" element={isTeacher ? <TeacherVocabSetsPage /> : <StudentVocabSetsPage />} />
        <Route path="/words" element={<StudentWordsListPage />} />
        <Route path="/practice" element={<PracticeHubPage />} />
        <Route path="/practice/flashcard" element={<VocabFlashcardPracticePage />} />
        <Route path="/practice/quiz" element={<VocabQuizPracticePage />} />
        <Route path="/practice/match" element={<VocabMatchPracticePage />} />
        <Route path="/practice/writing" element={<VocabWritingPracticePage />} />
        <Route path="/practice/writing/pdf" element={<VocabWritingPdfPage />} />
        <Route path="/practice/typing" element={<VocabTypingPracticePage />} />
        <Route path="/practice/dictation" element={<VocabDictationPracticePage />} />
        <Route path="/vocab-sets/:vocabSetId/add-words" element={<AddWordsToVocabSetPage />} />
        <Route path="/teacher/private-vocab" element={<PrivateVocabManagementPage />} />
        <Route path="/private-vocab" element={<PrivateVocabManagementPage />} />
        <Route path="/questions" element={<QuestionBankPage />} />
        <Route path="/exercises" element={<ExerciseManagementPage />} />
        <Route path="/mock-exams" element={<MockExamManagementPage />} />
        <Route path="/mock-exams/history" element={<MockExamHistoryPage />} />
        <Route path="/hsk30/exams" element={<Hsk30ExamManagementPage />} />
        <Route path="/hsk30/exams/:id/take" element={<Hsk30TakeExamPage />} />
        <Route path="/classes/create" element={<CreateClassPage />} />
        <Route path="/classes/join" element={<JoinClassPage />} />
        <Route path="/classes/:classId" element={<ClassDetailPage />} />
        <Route path="/classes/:classId/gradebook" element={<ClassGradebookPage />} />
        <Route path="/classes/:classId/students/:studentId" element={<ClassStudentProgressPage />} />
        <Route path="/classes/:classId/assignments/:assignmentId/take" element={<TakeAssignmentPage />} />
        <Route path="/classes/:classId/assignments/:assignmentId/submissions" element={<AssignmentSubmissionsPage />} />
        <Route path="/classes/:classId/assignments/:assignmentId/submissions/:submissionId" element={<StudentSubmissionDetailPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/teacher-request" element={<TeacherRequestPage />} />
        <Route path="/vocab-search" element={<VocabSearchPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
