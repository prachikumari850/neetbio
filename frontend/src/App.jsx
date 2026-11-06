import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from '@/components/common/ScrollToTop'
import PublicLayout from '@/layouts/PublicLayout'
import StudentLayout from '@/layouts/StudentLayout'

const AILearn = lazy(() => import('@/pages/AILearn'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Bookmarks = lazy(() => import('@/pages/Bookmarks'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ExploreDiagrams = lazy(() => import('@/pages/ExploreDiagrams'))
const Landing = lazy(() => import('@/pages/Landing'))
const Login = lazy(() => import('@/pages/Login'))
const MyLearning = lazy(() => import('@/pages/MyLearning'))
const PracticeTests = lazy(() => import('@/pages/PracticeTests'))
const Settings = lazy(() => import('@/pages/Settings'))
const Signup = lazy(() => import('@/pages/Signup'))

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <span className="text-ink-700 text-sm font-semibold">Loading page...</span>
          </div>
        }
      >
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </>
  )
}

export default App
