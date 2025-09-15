import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegCopy } from "react-icons/fa";
import "../Css/UsersData.css";

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        const activeUsers = (data.users || []).filter(
          (u) => u.status === "active"
        );
        setUsers(activeUsers);
      })
      .catch((err) => console.error("Error fetching active users:", err));
  }, []);

  // ✅ Copy to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { autoClose: 1500 });
  };

  // ✅ Toggle user status (active → block)
  const blockUser = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "block" }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("User blocked 🚫", { autoClose: 1500 });
        // remove from active list instantly
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (err) {
      console.error("Error blocking user:", err);
      toast.error("Server error");
    }
  };

  // ✅ Search filter
  const filteredUsers = users.filter(
    (user) =>
      user.userNumber?.toString().includes(search) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-container">
      <h1 className="users-title">Active Users</h1>

      <input
        type="text"
        placeholder="🔍 Search active users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Number</th>
              <th>Email</th>
              <th>Coins</th>
              <th>Withdraw Count ✅</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const shortId =
                  user._id.slice(0, 3) + "..." + user._id.slice(-3);
                const shortUserNumber =
                  user.userNumber?.toString().slice(0, 2) + "...";

                const completedWithdraws =
                  user.withdrawals?.filter(
                    (w) => w.account?.status?.toLowerCase() !== "processing"
                  ).length || 0;

                return (
                  <tr key={user._id}>
                    <td>
                      {shortId}{" "}
                      <FaRegCopy
                        className="copy-icon"
                        onClick={() => copyToClipboard(user._id, "User ID")}
                        title="Copy User ID"
                      />
                    </td>
                    <td>
                      {shortUserNumber}{" "}
                      <FaRegCopy
                        className="copy-icon"
                        onClick={() =>
                          copyToClipboard(user.userNumber, "User Number")
                        }
                        title="Copy User Number"
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>{user.coins || 0}</td>
                    <td>{completedWithdraws}</td>
                    <td>
                      <button
                        className="block-btn"
                        onClick={() => blockUser(user._id)}
                      >
                        Block 🚫
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No active users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default ActiveUsers;
