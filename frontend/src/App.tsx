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

import { ClassGradebookPage } from './pages/classroom/ClassGradebookPage'

function AppRoutes() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <AuthPage />
  }

  return (
    <Routes>
      <Route path="/" element={<MainWorkspace />} />
      <Route path="/progress" element={<PersonalProgressPage />} />
      <Route path="/history" element={<SubmissionHistoryPage />} />
      <Route path="/roadmap" element={<HskRoadmapPage />} />
      <Route path="/curriculum" element={<HskCurriculumPage />} />
      <Route path="/lessons/:lessonId" element={<LessonStudyPage />} />
      <Route path="/vocab-sets" element={<TeacherVocabSetsPage />} />
      <Route path="/questions" element={<QuestionBankPage />} />
      <Route path="/exercises" element={<ExerciseManagementPage />} />
      <Route path="/classes/create" element={<CreateClassPage />} />
      <Route path="/classes/join" element={<JoinClassPage />} />
      <Route path="/classes/:classId" element={<ClassDetailPage />} />
      <Route path="/classes/:classId/gradebook" element={<ClassGradebookPage />} />
      <Route path="/classes/:classId/assignments/:assignmentId/take" element={<TakeAssignmentPage />} />
      <Route path="/classes/:classId/assignments/:assignmentId/submissions" element={<AssignmentSubmissionsPage />} />
      <Route path="/classes/:classId/assignments/:assignmentId/submissions/:submissionId" element={<StudentSubmissionDetailPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/teacher-request" element={<TeacherRequestPage />} />
      <Route path="/vocab-search" element={<VocabSearchPage />} />
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
