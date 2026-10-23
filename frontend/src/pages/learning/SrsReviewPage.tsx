import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SrsFlashcardView } from '../../components/srs/SrsFlashcardView'

export const SrsReviewPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <SrsFlashcardView token={user.token} onBack={() => navigate('/')} />
    </div>
  )
}
