import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../../layouts/MainLayout';
import AuthLayout from '../../layouts/AuthLayout';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Loaders
import Skeleton from '../../components/loaders/Skeleton';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('../../pages/LandingPage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../../pages/DashboardPage'));

// New Lazy-loaded Pages
const ResumeAnalyzerPage = lazy(() => import('../../pages/ResumeAnalyzerPage'));
const InterviewTypePage = lazy(() => import('../../pages/InterviewTypePage'));
const ChatInterviewPage = lazy(() => import('../../pages/ChatInterviewPage'));
const VoiceInterviewPage = lazy(() => import('../../pages/VoiceInterviewPage'));
const FeedbackReportPage = lazy(() => import('../../pages/FeedbackReportPage'));
const ProgressAnalyticsPage = lazy(() => import('../../pages/ProgressAnalyticsPage'));
const InterviewHistoryPage = lazy(() => import('../../pages/InterviewHistoryPage'));
const VerifyEmailPage = lazy(() => import('../../pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('../../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../../pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('../../pages/ProfilePage'));
const TranscriptPage = lazy(() => import('../../pages/TranscriptPage'));
const LearnPage = lazy(() => import('../../pages/LearnPage'));
const CompanyHubPage = lazy(() => import('../../pages/CompanyHubPage'));
const CompanyDetailPage = lazy(() => import('../../pages/CompanyDetailPage'));
const CommunityPage = lazy(() => import('../../pages/CommunityPage'));
const PostDetailPage = lazy(() => import('../../pages/PostDetailPage'));
const ApplicationTrackerPage = lazy(() => import('../../pages/ApplicationTrackerPage'));
const HRPrepPage = lazy(() => import('../../pages/HRPrepPage'));
const RoadmapPage = lazy(() => import('../../pages/RoadmapPage'));
const LeaderboardPage = lazy(() => import('../../pages/LeaderboardPage'));
const InterviewChecklistPage = lazy(() => import('../../pages/InterviewChecklistPage'));

// A full page skeleton fallback for suspense
const PageLoader = () => (
  <div className="w-full h-[60vh] flex flex-col gap-4 p-8">
    <Skeleton className="h-12 w-1/3 mb-4" />
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-3 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'verify-email',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VerifyEmailPage />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute />
    ),
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'resume',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeAnalyzerPage />
          </Suspense>
        ),
      },
      {
        path: 'interviews/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InterviewTypePage />
          </Suspense>
        ),
      },
      {
        path: 'interviews/history',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InterviewHistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'interviews/chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChatInterviewPage />
          </Suspense>
        ),
      },
      {
        path: 'interviews/voice',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VoiceInterviewPage />
          </Suspense>
        ),
      },
      {
        path: 'interviews/transcript',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TranscriptPage />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeedbackReportPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProgressAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'learn',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LearnPage />
          </Suspense>
        ),
      },
      {
        path: 'companies',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompanyHubPage />
          </Suspense>
        ),
      },
      {
        path: 'companies/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompanyDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'community',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CommunityPage />
          </Suspense>
        ),
      },
      {
        path: 'community/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PostDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'applications',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ApplicationTrackerPage />
          </Suspense>
        ),
      },
      {
        path: 'hr-prep',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HRPrepPage />
          </Suspense>
        ),
      },
      {
        path: 'roadmap',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoadmapPage />
          </Suspense>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LeaderboardPage />
          </Suspense>
        ),
      },
      {
        path: 'checklist',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InterviewChecklistPage />
          </Suspense>
        ),
      },
    ],
  },
  ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
