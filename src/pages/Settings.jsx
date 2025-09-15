// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../Css/Settings.css";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "https://i.pravatar.cc/150?img=3",
  });
  const [loading, setLoading] = useState(false);

  const adminId = localStorage.getItem("adminId");
  const BASE_URL = "http://localhost:5000";

  // Fetch admin profile
  useEffect(() => {
    if (!adminId) {
      toast.error("No admin ID found. Please login again.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admins/${adminId}`);
        const data = await res.json();
        if (data.success) {
          setProfile((prev) => ({
            ...prev,
            username: data.admin.username,
            email: data.admin.email,
            profilePic: data.admin.profilePic || prev.profilePic,
          }));
          toast.success("Profile loaded successfully 🎉");
        } else {
          toast.error(data.message || "Error fetching profile ❌");
        }
      } catch (err) {
        toast.error("Error fetching profile ❌");
      }
    };

    fetchProfile();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!adminId) {
      toast.error("No admin ID found. Please login again.");
      return;
    }

    if (profile.password && profile.password !== profile.confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);
      const body = { username: profile.username, email: profile.email };
      if (profile.password) body.password = profile.password;

      const res = await fetch(`${BASE_URL}/api/admins/update/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully 🎉");
        setIsEditing(false);
        setProfile((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(data.message || "Update failed ❌");
      }
    } catch (err) {
      toast.error("Error updating profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">⚙️ Profile Settings</h1>
      <div className="settings-card">
        <div className="profile-pic-container">
          <img src={profile.profilePic} alt="Profile" className="profile-pic" />
        </div>

        <div className="profile-details">
          <div className="form-group">
            <label>Username:</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.username}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password:</label>
            {isEditing ? (
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            ) : (
              <p>********</p>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            {isEditing ? (
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            ) : (
              <p>********</p>
            )}
          </div>
        </div>

        <div className="btn-group">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
