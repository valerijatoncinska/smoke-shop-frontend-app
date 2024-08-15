import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser, clearError } from "../../store/redux/userSlice";
import axios from "axios";
import "./UserProfilePage.css";

interface User {
  id?: string;
  name?: string;
  street?: string;
  house?: string;
  postalCode?: string;
  locality?: string;
  region?: string;
  country?: string;
  email: string;
  phone?: string;
  accessToken: string;
  refreshToken: string;
}

const UserProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const status = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/address", {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });

        if (response.status === 200) {
          setUserData({
            ...response.data,
            email: user?.email,
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken,
          });
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => dispatch(clearError())}>Clear Error</button>
      </div>
    );
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      <div className="profile-container">
        <div className="profile-section">
          <h2>Details</h2>
          <p>Name: {userData.name || "N/A"}</p>
          <p>Email: {userData.email}</p>
          <p>Street: {userData.street || "N/A"}</p>
          <p>House number: {userData.house || "N/A"}</p>
          <p>Postal code: {userData.postalCode || "N/A"}</p>
          <p>Locality: {userData.locality || "N/A"}</p>
          <p>Region: {userData.region || "N/A"}</p>
          <p>Country: {userData.country || "N/A"}</p>
          <p>Phone number: {userData.phone || "N/A"}</p>
        </div>
      </div>
      <div className="buttons">
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
