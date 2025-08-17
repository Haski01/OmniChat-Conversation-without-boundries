import { Navigate, Route, Routes } from "react-router";
import toast, { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import PageLoader from "./components/PageLoader.jsx.jsx"; // loader icon
import useAuthUser from "./hooks/useAuthUser.js"; // custom hook to fetch auth user
import Layout from "./components/Layout.jsx";

import { useThemeStore } from "./store/useThemeStore.js"; // zustand global store

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const { theme } = useThemeStore(); //zustand themeStore hook

  const isAuthenticated = Boolean(authUser); // true false
  const isOnboarded = authUser?.isOnboarded;

  // console.log(authUser);

  if (isLoading) return <PageLoader />;

  return (
    <div className=" h-screen " data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationsPage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to={"/"} />
              )
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
