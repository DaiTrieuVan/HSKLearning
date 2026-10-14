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

function AppRoutes() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <AuthPage />
  }

  return (
    <Routes>
      <Route path="/" element={<MainWorkspace />} />
      <Route path="/roadmap" element={<HskRoadmapPage />} />
      <Route path="/curriculum" element={<HskCurriculumPage />} />
      <Route path="/lessons/:lessonId" element={<LessonStudyPage />} />
      <Route path="/vocab-sets" element={<TeacherVocabSetsPage />} />
      <Route path="/classes/create" element={<CreateClassPage />} />
      <Route path="/classes/join" element={<JoinClassPage />} />
      <Route path="/classes/:classId" element={<ClassDetailPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/teacher-request" element={<TeacherRequestPage />} />
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
