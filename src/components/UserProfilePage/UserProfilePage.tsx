import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateUser, logoutUser, clearError } from "../../store/redux/userSlice";
import axios from "axios";
import "./UserProfilePage.css";

interface User {
  name?: string;
  email: string;
  city?: string;
  zipCode?: string;
  street?: string;
  apartmentNumber?: string;
  phone?: string;
  accessToken: string;
  refreshToken: string;
}

const UserProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const status = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(user);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (userData) {
      try {
        const response = await axios.put(
          `/api/user/profile`, // Replace with the correct endpoint
          {
            name: userData.name,
            street: userData.street,
            house: userData.apartmentNumber,
            postalCode: userData.zipCode,
            locality: userData.city,
            phone: userData.phone,
          },
          {
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          await dispatch(updateUser(userData));
          setIsEditing(false);
        } else {
          console.error("Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, [name]: value };
    });
  };

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
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={userData.name || ""}
                placeholder="Name"
                onChange={handleChange}
              />
              <input
                type="text"
                name="city"
                value={userData.city || ""}
                placeholder="City"
                onChange={handleChange}
              />
              <input
                type="text"
                name="zipCode"
                value={userData.zipCode || ""}
                placeholder="Zip Code"
                onChange={handleChange}
              />
              <input
                type="text"
                name="street"
                value={userData.street || ""}
                placeholder="Street"
                onChange={handleChange}
              />
              <input
                type="text"
                name="apartmentNumber"
                value={userData.apartmentNumber || ""}
                placeholder="Apartment Number"
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                value={userData.phone || ""}
                placeholder="Phone Number"
                onChange={handleChange}
              />
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p>Name: {userData.name || "N/A"}</p>
              <p>Email: {userData.email}</p>
              <p>City: {userData.city || "N/A"}</p>
              <p>Zip code: {userData.zipCode || "N/A"}</p>
              <p>Street: {userData.street || "N/A"}</p>
              <p>Apartment number: {userData.apartmentNumber || "N/A"}</p>
              <p>Phone number: {userData.phone || "N/A"}</p>
            </>
          )}
        </div>
      </div>
      <div className="buttons">
        <button className="edit-profile" onClick={handleEdit}>
          Edit profile
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
