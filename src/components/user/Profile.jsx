import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import "./profile.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ username: "username" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Cannot fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const initials = userDetails.username?.slice(0, 1).toUpperCase() || "G";

  return (
    <>
      <Navbar />
      <nav className="profile-tabs" aria-label="Profile navigation">
        <NavLink to="/profile" end className={({ isActive }) => `tab-btn${isActive ? " active" : ""}`}>
          <span aria-hidden="true">◉</span> Overview
        </NavLink>
        <NavLink to="/starred" className={({ isActive }) => `tab-btn${isActive ? " active" : ""}`}>
          <span aria-hidden="true">☆</span> Starred repositories
        </NavLink>
      </nav>

      <main className="profile-page-wrapper">
        <aside className="user-profile-section">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name">
            <h1>{userDetails.username}</h1>
            <p>{userDetails.username}</p>
          </div>
          <p className="profile-bio">Building, learning, and sharing one commit at a time.</p>
          <div className="profile-followers">
            <span><strong>10</strong> followers</span>
            <span className="follower-separator">·</span>
            <span><strong>3</strong> following</span>
          </div>
          <div className="profile-details">
            <span aria-hidden="true">⌘</span>
            <span>Developer</span>
          </div>
        </aside>

        <section className="profile-content">
          <div className="profile-welcome glass-panel">
            <p className="eyebrow">GitHub profile</p>
            <h2>Welcome to {userDetails.username}&apos;s profile</h2>
            <p>Your work, contributions, and favorite projects—all in one place.</p>
          </div>
          <div className="heat-map-section glass-panel">
            <HeatMapProfile />
          </div>
          <section className="profile-repositories glass-panel">
            <h2>Explore your GitHub</h2>
            <p>Create a repository to start sharing your work, or browse the projects you have starred.</p>
            <div className="profile-actions">
              <NavLink className="primary-action" to="/create">Create a repository</NavLink>
              <NavLink className="secondary-action" to="/starred">View starred repositories</NavLink>
            </div>
          </section>
        </section>
      </main>
    </>
  );
};

export default Profile;
