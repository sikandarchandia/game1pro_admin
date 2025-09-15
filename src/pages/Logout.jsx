import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

useEffect(() => {
  localStorage.removeItem("auth");
  localStorage.removeItem("adminId"); // ✅ clear id too
  navigate("/login");
}, [navigate]);


  return <h2>Logging out...</h2>;
};

export default Logout;
