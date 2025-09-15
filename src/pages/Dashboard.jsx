import React from "react";
import "../Css/Dashboard.css";
import { useGetDashboardStatsQuery } from "../api/dashboardApi";

const Dashboard = () => {
  const { data, error, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard</p>;

  // extract stats
  const stats = data?.stats || {};

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Game1Pro Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card users">
          <h2>Total Users</h2>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="card withdraws">
          <h2>Total Withdrawals</h2>
          <p>{stats.totalWithdrawCount}</p>
        </div>

        <div className="card today-requests">
          <h2>Today's Withdraw Requests</h2>
          <p>{stats.todayRequests}</p>
        </div>

        <div className="card processing-withdraws">
          <h2>Processing Withdraws</h2>
          <p>${stats.totalProcessingAmount}</p>
        </div>

        <div className="card success-withdraws">
          <h2>Successful Withdraws</h2>
          <p>${stats.totalSuccessfulAmount}</p>
        </div>

        <div className="card active-users">
          <h2>Active Users</h2>
          <p>{stats.activeUsers}</p>
        </div>
        <div className="card blocked-users">
          <h2>Blocked Users</h2>
          <p>{stats.blockedUsers}</p>
        </div>
        <div className="card today-requests">
          <h2>Today's Withdraw Requests</h2>
          <p>{stats.todayRequests}</p>
        </div>
        <div className="card total-earning">
          <h2>Total Earning</h2>
          <p>${stats.totalEarning}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
