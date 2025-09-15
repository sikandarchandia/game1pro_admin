import React, { useState, useEffect } from "react";
import "../Css/RemoveCoin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RemoveCoin = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchUserData = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/remove-coins/search/${id}`
      );
      const data = await res.json();
      if (data.success) setUserData(data.user);
      else setUserData(null);
    } catch (err) {
      console.error("Fetch user error:", err);
      setUserData(null);
    }
  };

  const handleUserIdChange = (e) => {
    const id = e.target.value;
    setUserId(id);
    if (id) fetchUserData(id);
    else setUserData(null);
  };

  // Fetch remove coin history
  const fetchHistory = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/remove-coins/history-all"
      );
      const data = await res.json();
      if (data.success) {
        setTransactions(data.history); // set your transactions state
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Fetch history error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData || !coinAmount) return;

    if (Number(coinAmount) > userData.coins) {
      toast.error("Entered amount is more than user's coins!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/remove-coins/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNumber: Number(userId),
          amount: Number(coinAmount),
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Removed ${coinAmount} coins from ${userData.username}`);
        setUserId("");
        setUserData(null);
        setCoinAmount("");
        fetchHistory(); // Refresh the table
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Remove coins error:", err);
      toast.error("Server error while removing coins!");
    }
  };

  return (
    <div className="remove-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="remove-title">Remove Coins from Agent / User</h1>

      <form className="remove-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter ID</label>
          <input
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Enter ID"
          />
        </div>

        {userData && (
          <div className="user-preview">
            <p>
              <strong>ID:</strong> {userData.userNumber}
            </p>
            <p>
              <strong>Name:</strong> {userData.username}
            </p>
            <p>
              <strong>Coins:</strong> {userData.coins}
            </p>
          </div>
        )}

        <div className="form-group">
          <label>Coin Amount</label>
          <input
            type="number"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            placeholder="Enter Coin Amount to Remove"
          />
        </div>

        <button type="submit" className="remove-btn">
          Confirm Remove
        </button>
      </form>

      {transactions.length > 0 && (
        <div className="transactions">
          <h2>Removed Coins History</h2>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Name</th>
                <th>Coins Removed</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.userNumber}</td>
                  <td>{tx.username}</td>
                  <td>{tx.coinsRemoved}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RemoveCoin;
