// Agents.jsx
import React, { useState, useEffect } from "react";
import "../Css/Agents.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all agents on load
  useEffect(() => {
    fetch("http://localhost:5000/api/agents")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAgents(data.agents || []);
      })
      .catch((err) => console.error("Error fetching agents:", err));
  }, []);

  // ✅ Fetch account details by userNumber
  const handleFetchAccount = async () => {
    if (!userNumber) {
      toast.error("Please enter a user number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/agents/search/${userNumber}`
      );
      const data = await res.json();
      if (data.success) {
        setAccountDetails(data.user);
      } else {
        setAccountDetails(null);
        toast.error(data.message || "User not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Make user → agent
  const handleMakeAgent = async () => {
    if (!accountDetails) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/agents/${accountDetails._id}/make`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "agent" }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setAgents((prev) => {
          const exists = prev.find((a) => a._id === data.user._id);
          if (exists) {
            return prev.map((a) => (a._id === data.user._id ? data.user : a));
          } else {
            return [...prev, data.user];
          }
        });
        setIsModalOpen(false);
        setUserNumber("");
        setAccountDetails(null);
        toast.success("User made agent successfully");
      } else {
        toast.error(data.message || "Failed to make agent");
      }
    } catch (error) {
      console.error("Error making agent:", error);
      toast.error("Server error");
    }
  };

  // ✅ Toggle role user <-> agent
  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "agent" ? "user" : "agent";

    try {
      const res = await fetch(`http://localhost:5000/api/agents/${id}/make`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setAgents((prev) =>
          prev.map((a) => (a._id === id ? { ...a, role: data.user.role } : a))
        );
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error toggling role:", error);
      toast.error("Server error");
    }
  };

  return (
    <div className="agents-container">
      <h1 className="agents-title">Agents Data</h1>

      <button className="add-agent-btn" onClick={() => setIsModalOpen(true)}>
        + Add Agent
      </button>

      {/* Agents Table */}
      <div className="table-wrapper">
        <table className="agents-table">
          <thead>
            <tr>
              <th>User Number</th>
              <th>Name</th>
              <th>Coins</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No agents found
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent._id}>
                  <td>{agent.userNumber}</td>
                  <td>{agent.username}</td>
                  <td>{agent.coins}</td>
                  <td>{agent.role}</td>
                  <td>
                    <button
                      className="status-btn"
                      onClick={() => toggleRole(agent._id, agent.role)}
                    >
                      {agent.role === "agent" ? "Remove Agent" : "Make Agent"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Agent</h2>

            <label>Enter User Number:</label>
            <input
              type="text"
              value={userNumber}
              onChange={(e) => setUserNumber(e.target.value)}
              placeholder="e.g. 84395188"
            />
            <button
              className="make-agent-btn"
              onClick={handleFetchAccount}
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch Account"}
            </button>

            {accountDetails && (
              <div className="account-preview">
                <p>
                  <strong>Name:</strong> {accountDetails.username}
                </p>
                <p>
                  <strong>User Number:</strong> {accountDetails.userNumber}
                </p>
                <p>
                  <strong>Coins:</strong> {accountDetails.coins}
                </p>
                <button className="make-agent-btn" onClick={handleMakeAgent}>
                  ✅ Make Agent
                </button>
              </div>
            )}

            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Agents;
