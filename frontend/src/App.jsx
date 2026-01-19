// src/App.jsx
import Layout from "./components/layout/Layout.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import useUserStore from "./store/useUserStore.js";

// Auth Pages
import SignupPage from "./pages/auth/SignupPage.jsx";
import SignInPage from "./pages/auth/SigninPage.jsx";

// Common Pages
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";

// Admin Pages
import AdminProjectsPage from "./pages/admin/AdminProjectsPage.jsx";
import AdminProjectDetailsPage from "./pages/admin/AdminProjectDetailsPage.jsx";
import AdminTasksPage from "./pages/admin/AdminTasksPage.jsx";

// Intern Pages
import MyTasksPage from "./pages/user/MyTasksPage.jsx";
import TaskDetailsPage from "./pages/user/TaskDetailsPage.jsx";

function App() {
  const { user,isAuthenticated } = useUserStore();
  // protect from null access
  console.log("user", user?.name);

  return (
    <Layout>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signin"
          element={!isAuthenticated ? <SignInPage /> : <Navigate to="/" />}
        />

        {/* ---------- Protected Routes ---------- */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/signin" />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/signin" />}
        />

        {/* ---------- Admin Routes ---------- */}
        <Route
          path="/admin/projects"
          element={
            isAuthenticated && user?.role === "Admin" ? <AdminProjectsPage /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/projects/:projectId"
          element={
            isAuthenticated && user?.role === "Admin"
              ? <AdminProjectDetailsPage />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/tasks"
          element={
            isAuthenticated && user?.role === "Admin" ? <AdminTasksPage /> : <Navigate to="/" />
          }
        />

        {/* ---------- Intern (User) Routes ---------- */}
        <Route
          path="/my-tasks"
          element={isAuthenticated && user?.role === "User" ? <MyTasksPage /> : <Navigate to="/" />}
        />

        <Route
          path="/my-tasks/:taskId"
          element={isAuthenticated && user?.role === "User" ? <TaskDetailsPage /> : <Navigate to="/" />}
        />

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
