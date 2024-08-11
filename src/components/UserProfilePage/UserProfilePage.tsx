import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateUser, logoutUser, clearError } from "../../store/redux/userSlice";
import "./UserProfilePage.css";

interface User {
  email: string;
  isAdult?: boolean;
  subscribe?: boolean;
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
      await dispatch(updateUser(userData));
      setIsEditing(false);
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
      <div className="profile-sections">
        <div className="profile-section">
          <h2>Details</h2>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </label>
          <label>
            Is Adult:
            <input
              type="checkbox"
              name="isAdult"
              checked={userData.isAdult || false}
              onChange={(e) =>
                setUserData((prevUser) =>
                  prevUser
                    ? { ...prevUser, isAdult: e.target.checked }
                    : prevUser
                )
              }
              disabled={!isEditing}
            />
          </label>
          <label>
            Subscribe:
            <input
              type="checkbox"
              name="subscribe"
              checked={userData.subscribe || false}
              onChange={(e) =>
                setUserData((prevUser) =>
                  prevUser
                    ? { ...prevUser, subscribe: e.target.checked }
                    : prevUser
                )
              }
              disabled={!isEditing}
            />
          </label>
        </div>
      </div>
      <div className="buttons">
        {isEditing ? (
          <button className="save-profile" onClick={handleSave}>
            Save Profile
          </button>
        ) : (
          <button className="edit-profile" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
        <button className="logout-profile" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
