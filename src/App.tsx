import { useState, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingScreen from "@/components/common/LoadingScreen";
import PageContainer from "@/components/layout/PageContainer";
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // uncommented to re-enable
import { AuthProvider } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import RiskMapPage from "@/pages/RiskMapPage";
import Predictions from "@/pages/Predictions";
import Alerts from "@/pages/Alerts";
import Historical from "@/pages/Historical";
import DataSources from "@/pages/DataSources";
import SystemStatus from "@/pages/SystemStatus";
import Settings from "@/pages/Settings";

// AUTH TEMPORARILY DISABLED — wrap with <ProtectedRoute> again once
// login is confirmed working end-to-end against the deployed backend.
function protectedPage(el: ReactNode) {
  return <PageContainer>{el}</PageContainer>;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onDone={() => setLoading(false)} />;
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
        <Route path="/map" element={protectedPage(<RiskMapPage />)} />
        <Route path="/predictions" element={protectedPage(<Predictions />)} />
        <Route path="/alerts" element={protectedPage(<Alerts />)} />
        <Route path="/historical" element={protectedPage(<Historical />)} />
        <Route path="/data-sources" element={protectedPage(<DataSources />)} />
        <Route path="/system" element={protectedPage(<SystemStatus />)} />
        <Route path="/settings" element={protectedPage(<Settings />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
