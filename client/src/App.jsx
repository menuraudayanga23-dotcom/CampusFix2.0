import "./App.css";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { useState } from "react";

function Dashboard() {
  const { user, logout } = useAuth();
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);

  const handleLogout = async () => {
    await logout();
  };

  const handleReportCreated = () => {
    setReportsRefreshKey((currentKey) => currentKey + 1);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">
            {user.role === "administrator"
              ? "Administrator dashboard"
              : "Student dashboard"}
          </p>
          <h1>CampusFix2.0</h1>
        </div>

        <div className="user-header-actions">
          <span>
            {user.role} 
          </span>

          <button
            className="secondary-button"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="app-main">
        {user.role === "student" && (
          <section className="welcome-card">
            <p className="eyebrow">Student reporting</p>
            <h2>Report a campus problem.</h2>
            <p>
              Your reports are saved under your account and can be tracked here.
            </p>
          </section>
        )}

        {user.role === "administrator" && (
          <section className="welcome-card">
            <p className="eyebrow">Administrator management</p>
            <h2>Review reports submitted by students.</h2>
            <p>
              You can view, search, update, and delete campus infrastructure
              reports.
            </p>
          </section>
        )}

        {user.role === "student" && (
          <ReportForm onReportCreated={handleReportCreated} />
        )}

        <ReportList refreshKey={reportsRefreshKey} />
      </main>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Checking login session...</p>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
