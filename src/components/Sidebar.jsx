import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="withdraw-sidebar">
      <h2>Game1Pro Pannel</h2>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
         <li>
          <Link to="/users">Users</Link>
        </li>
         <li>
          <Link to="/activeusers">Active Users</Link>
        </li>
         <li>
          <Link to="/blockusers">Block Users</Link>
        </li>
         <li>
          <Link to="/agents">Agents</Link>
        </li>
         <li>
          <Link to="/agentpayments">Agents Payment </Link>
        </li>
        <li>
          <Link to="/addcoin">Add Coin </Link>
        </li>
         <li>
          <Link to="/removecoin">Remove Coin </Link>
        </li>
        <li>
          <Link to="/withdraw">Withdraw Requests</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
          <li>
          <Link to="/logout">Log Out</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
