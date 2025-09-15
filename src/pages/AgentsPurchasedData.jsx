import React, { useState } from "react";
import "../Css//AgentsPurchasedData.css";

const AgentsPurchasedData = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const agentsData = [
    {
      id: "AG101",
      name: "John Doe",
      proof: "https://via.placeholder.com/150",
      amount: "$500",
      coins: "1200",
      status: "Pending",
    },
    {
      id: "AG102",
      name: "Sarah Khan",
      proof: "https://via.placeholder.com/150",
      amount: "$750",
      coins: "1800",
      status: "Approved",
    },
    {
      id: "AG103",
      name: "Ali Raza",
      proof: "https://via.placeholder.com/150",
      amount: "$320",
      coins: "900",
      status: "Rejected",
    },
  ];

  return (
    <div className="agents-data-container">
      <h2 className="agents-data-title">Agents Purchased Data</h2>

      <div className="table-wrapper">
        <table className="agents-data-table">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Agent Name</th>
              <th>Payment Proof</th>
              <th>Payment Amount</th>
              <th>Coin Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agentsData.map((agent, index) => (
              <tr key={index}>
                <td>{agent.id}</td>
                <td>{agent.name}</td>
                <td>
                  <img
                    src={agent.proof}
                    alt="proof"
                    className="proof-img"
                    onClick={() => setSelectedImage(agent.proof)}
                  />
                </td>
                <td>{agent.amount}</td>
                <td>{agent.coins}</td>
                <td>
                  <div className="status-actions">
                    <button className="status-btn approve">Approve</button>
                    <button className="status-btn reject">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fullscreen Proof Image Modal */}
      {selectedImage && (
        <div
          className="fullscreen-modal"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Full Proof" />
        </div>
      )}
    </div>
  );
};

export default AgentsPurchasedData;
