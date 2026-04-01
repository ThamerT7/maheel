import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import { AppLayout } from './layouts/AppLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'

// Lazy-loaded screens
const PillarsMap = lazy(() => import('./screens/PillarsMap').then((m) => ({ default: m.PillarsMap })))
const AskFreely = lazy(() => import('./screens/AskFreely').then((m) => ({ default: m.AskFreely })))
const LearnScreen = lazy(() => import('./screens/LearnScreen').then((m) => ({ default: m.LearnScreen })))
const AdhkarScreen = lazy(() => import('./screens/LearnScreen').then((m) => ({ default: m.AdhkarScreen })))
const ToolsHub = lazy(() => import('./screens/ToolsHub').then((m) => ({ default: m.ToolsHub })))
const QuickGuidesList = lazy(() => import('./screens/QuickGuides').then((m) => ({ default: m.QuickGuidesList })))
const QuickGuideView = lazy(() => import('./screens/QuickGuides').then((m) => ({ default: m.QuickGuideView })))
const SourceCompass = lazy(() => import('./screens/SourceCompass').then((m) => ({ default: m.SourceCompass })))
const ModuleLesson = lazy(() => import('./screens/ModuleLesson').then((m) => ({ default: m.ModuleLesson })))
const Settings = lazy(() => import('./screens/Settings').then((m) => ({ default: m.Settings })))
const PrayerTimes = lazy(() => import('./screens/PrayerTimes').then((m) => ({ default: m.PrayerTimes })))
const Community = lazy(() => import('./screens/Community').then((m) => ({ default: m.Community })))

function ScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40dvh]">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)

  if (!onboardingComplete) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    )
  }

  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pillars" element={<PillarsMap />} />
          <Route path="/ask" element={<AskFreely />} />
          <Route path="/learn" element={<LearnScreen />} />
          <Route path="/adhkar" element={<AdhkarScreen />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/guides" element={<QuickGuidesList />} />
          <Route path="/guides/:id" element={<QuickGuideView />} />
          <Route path="/source-compass" element={<SourceCompass />} />
          <Route path="/lesson/:id" element={<ModuleLesson />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/community" element={<Community />} />
          {/* Redirect old routes */}
          <Route path="/journey" element={<Navigate to="/pillars" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
