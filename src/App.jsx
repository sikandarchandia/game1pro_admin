import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Withdraw from "./pages/Withdraw";
import UsersData from "./pages/UsersData";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import ActiveUsers from "./pages/Activeusers";
import BlockUsers from "./pages/BlockUsers";
import Agents from "./pages/Agents";
import AgentsPurchasedData from "./pages/AgentsPurchasedData";
import AddCoinAgent from "./pages/AddCoinAgent";
import RemoveCoin from "./pages/RemoveCoin";
import ProtectedRoute from "./components/ProtectedRoute"; // use .jsx
import "./App.css";

const App = () => {
  return (
    <div className="withdraw-layout">
      <Sidebar />
      <div className="withdraw-content">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdraw"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <Agents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcoin"
            element={
              <ProtectedRoute>
                <AddCoinAgent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/removecoin"
            element={
              <ProtectedRoute>
                <RemoveCoin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agentpayments"
            element={
              <ProtectedRoute>
                <AgentsPurchasedData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activeusers"
            element={
              <ProtectedRoute>
                <ActiveUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blockusers"
            element={
              <ProtectedRoute>
                <BlockUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
