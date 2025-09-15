import React, { useEffect, useState } from "react";
import "../Css/Withdraw.css";

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState("");

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/withdrawals", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const filteredWithdrawals = withdrawals.filter((w) => {
    const searchLower = search.toLowerCase();
    return (
      w.username.toLowerCase().includes(searchLower) ||
      w.accountNumber.includes(searchLower) ||
      w.userNumber.toString().includes(searchLower)
    );
  });

  return (
    <div className="withdraw-container">
      <h1 className="withdraw-title">Withdraw Requests</h1>

      <input
        type="text"
        placeholder="Search request..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table className="withdraw-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Bank</th>
              <th>Account No</th>
              <th>Account Holder</th>
              <th>Country</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredWithdrawals.length > 0 ? (
              filteredWithdrawals.map((w) => (
                <tr key={w._id}>
                  <td>{w.userNumber}</td>
                  <td>{w.username}</td>
                  <td>{w.bank}</td>
                  <td>{w.accountNumber}</td>
                  <td>{w.accountHolder}</td>
                  <td>{w.country}</td>
                  <td>{w.amount}</td>
                  <td>{new Date(w.createdAt).toLocaleString()}</td>
                  <td>
                    {w.status === "Processing" ? (
                      <button className="blocked-btn">Processing ⏳</button>
                    ) : (
                      <button className="active-btn">Completed ✅</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No withdraw requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Withdraw;
