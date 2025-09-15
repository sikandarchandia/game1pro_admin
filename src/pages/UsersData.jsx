import React, { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/UsersData.css";

const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Copy handler
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied: ${text}`, { autoClose: 1500 });
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "block" : "active";

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();

      if (data.success) {
        // ✅ Update state
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, status: data.user.status } : u
          )
        );

        toast.success(
          `User is now ${data.user.status === "active" ? "Active ✅" : "Blocked 🚫"}`,
          { autoClose: 1500 }
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      toast.error("Server error");
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.userNumber?.toString().includes(search) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-container">
      <h1 className="users-title">Users Data</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by user number or email..."
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
              <th>Withdraws</th>
              <th>Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const shortId =
                  user._id.slice(0, 3) + "..." + user._id.slice(-3);

                return (
                  <tr key={user._id}>
                    <td>
                      {shortId}{" "}
                      <MdContentCopy
                        className="copy-icon"
                        onClick={() => handleCopy(user._id, "User ID")}
                      />
                    </td>
                    <td>
                      {user.userNumber}{" "}
                      <MdContentCopy
                        className="copy-icon"
                        onClick={() =>
                          handleCopy(user.userNumber, "User Number")
                        }
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>{user.coins || 0}</td>
                    <td>{user.withdrawals?.length || 0}</td>
                    <td>
                      <button
                        className={`btn-now ${
                          user.status === "active" ? "active-btn" : "blocked-btn"
                        }`}
                        onClick={() => toggleStatus(user._id, user.status)}
                      >
                        {user.status === "active" ? "Block 🚫" : "Activate ✅"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found.
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

export default UsersData;
