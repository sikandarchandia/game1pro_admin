import React, { useState, useEffect } from "react";
import "../Css/AddCoinAgent.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCoinAgent = () => {
  const [userNumber, setUserNumber] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load all coin addition history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ Fetch user info by userNumber
  const fetchUser = async () => {
    if (!userNumber) {
      toast.error("Please enter a user number");
      return;
    }

    const userNum = Number(userNumber);
    if (isNaN(userNum)) {
      toast.error("Invalid user number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/agents/search/${userNum}`);
      const data = await res.json();

      if (data.success) {
        setUserInfo(data.user);
      } else {
        setUserInfo(null);
        toast.error(data.message || "User not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all coin addition history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/agents/history-all`);
      const data = await res.json();
      if (data.success) setRecords(data.history);
      else setRecords([]);
    } catch (err) {
      console.error(err);
      setRecords([]);
    }
  };

  // ✅ Add coins to the selected user
  const handleAddCoins = async (e) => {
    e.preventDefault();
    if (!userInfo || !coinAmount) {
      toast.error("Please select a user and enter coin amount");
      return;
    }

    const amountNum = Number(coinAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Invalid coin amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/add-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNumber: Number(userInfo.userNumber),
          amount: amountNum,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Added ${amountNum} coins to ${data.user.username}`);
        setUserInfo({ ...userInfo, coins: data.user.coins });
        setUserNumber("");
        setCoinAmount("");
        fetchHistory(); // refresh history
      } else {
        toast.error(data.message || "Failed to add coins");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addcoin-container">
      <h2>Admin Panel - Add Coins</h2>
      <form className="addcoin-form" onSubmit={handleAddCoins}>
        <div className="form-group">
          <label>User Number</label>
          <input
            type="text"
            value={userNumber}
            onChange={(e) => setUserNumber(e.target.value)}
            placeholder="Enter user number"
          />
          <button
            className="coinbutton"
            type="button"
            onClick={fetchUser}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch User"}
          </button>

          {userInfo && (
            <div className="user-preview">
              <strong>{userInfo.username}</strong> (Coins: {userInfo.coins})
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Coin Amount</label>
          <input
            type="number"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            placeholder="Enter coins to add"
          />
        </div>

        <button
          type="submit"
          className="coinbutton"
          disabled={loading || !userInfo || !coinAmount}
        >
          {loading ? "Processing..." : "Add & Confirm"}
        </button>
      </form>

      <div className="table-wrapper">
        <h3>Transaction History (All Users)</h3>
        <table>
          <thead>
            <tr>
              <th>User Number</th>
              <th>Username</th>
              <th>Coins Added</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-records">
                  No transactions yet
                </td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={idx}>
                  <td data-label="User Number">{rec.userNumber}</td>
                  <td data-label="Username">{rec.username}</td>
                  <td data-label="Coins Added">{rec.coinsAdded}</td>
                  <td data-label="Date">{new Date(rec.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCoinAgent;
