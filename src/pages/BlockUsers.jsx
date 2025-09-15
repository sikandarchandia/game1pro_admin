import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegCopy } from "react-icons/fa";
import "../Css/UsersData.css";

const BlockUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        const blockedUsers = (data.users || []).filter(
          (u) => u.status === "block"
        );
        setUsers(blockedUsers);
      })
      .catch((err) => console.error("Error fetching blocked users:", err));
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { autoClose: 1500 });
  };

  // ✅ Change status
  const changeStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`User status changed to ${newStatus}`);
        setUsers((prev) => prev.filter((u) => u._id !== id)); // ✅ remove from blocked list
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userNumber?.toString().includes(search) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-container">
      <h1 className="users-title">Blocked Users</h1>

      <input
        type="text"
        placeholder="🔍 Search blocked users..."
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
              <th>Withdraw Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const shortId = user._id.slice(0, 3) + "..." + user._id.slice(-3);
                const shortUserNumber =
                  user.userNumber?.toString().slice(0, 2) + "...";

                return (
                  <tr key={user._id}>
                    <td>
                      {shortId}{" "}
                      <FaRegCopy
                        className="copy-icon"
                        onClick={() => copyToClipboard(user._id, "User ID")}
                      />
                    </td>
                    <td>
                      {shortUserNumber}{" "}
                      <FaRegCopy
                        className="copy-icon"
                        onClick={() => copyToClipboard(user.userNumber, "User Number")}
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>{user.coins || 0}</td>
                    <td>{user.withdrawals?.length || 0}</td>
                    <td>
                      <button
                        className="active-btn"
                        onClick={() => changeStatus(user._id, "active")}
                      >
                        Activate now ✅
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No blocked users found.
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

export default BlockUsers;
