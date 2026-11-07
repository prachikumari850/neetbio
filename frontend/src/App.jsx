import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ScrollToTop from '@/components/common/ScrollToTop'
import PublicLayout from '@/layouts/PublicLayout'
import StudentLayout from '@/layouts/StudentLayout'
import AILearn from '@/pages/AILearn'
import Analytics from '@/pages/Analytics'
import Bookmarks from '@/pages/Bookmarks'
import Dashboard from '@/pages/Dashboard'
import ExploreDiagrams from '@/pages/ExploreDiagrams'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import MyLearning from '@/pages/MyLearning'
import PracticeTests from '@/pages/PracticeTests'
import Settings from '@/pages/Settings'
import Signup from '@/pages/Signup'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diagrams" element={<ExploreDiagrams />} />
            <Route path="/ai-learn" element={<AILearn />} />
            <Route path="/practice" element={<PracticeTests />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App