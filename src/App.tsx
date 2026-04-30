import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { paths } from './config/paths'
import LandingPage from './pages/LandingPage'

const WorkspacePage = lazy(() => import('./pages/WorkspacePage'))

export default function App() {
  return (
    <Routes>
      <Route path={paths.home} element={<LandingPage />} />
      <Route
        path={paths.workspace}
        element={
          <Suspense fallback={<div className="noto-route-fallback">불러오는 중…</div>}>
            <WorkspacePage />
          </Suspense>
        }
      />
    </Routes>
  )
}
