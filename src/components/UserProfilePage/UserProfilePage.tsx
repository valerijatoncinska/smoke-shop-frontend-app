import React, { useEffect, useState } from 'react';
import './UserProfilePage.css';

interface User {
  name: string;
  email: string;
  address: {
    city: string;
    zipCode: string;
    street: string;
    apartmentNumber: string;
  };
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data from backend
    fetch('https://smoke-shop-68y5q.ondigitalocean.app/api/user-profile')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => 
        console.error('Error:', error));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDelete = () => {
    // Logic for deleting profile
    alert('Profile deleted');
  };

  const handleEdit = () => {
    // Logic for editing profile
    alert('Edit profile');
  };

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      <div className="profile-sections">
        <div className="profile-section">
          <h2>Details</h2>
          <label>
            Name:
            <input type="text" value={user.name} readOnly />
          </label>
          <label>
            Email:
            <input type="email" value={user.email} readOnly />
          </label>
        </div>
        <div className="profile-section">
          <h2>Address</h2>
          <label>
            City:
            <input type="text" value={user.address.city} readOnly />
          </label>
          <label>
            Zip code:
            <input type="text" value={user.address.zipCode} readOnly />
          </label>
          <label>
            Street:
            <input type="text" value={user.address.street} readOnly />
          </label>
          <label>
            Apartment number:
            <input type="text" value={user.address.apartmentNumber} readOnly />
          </label>
        </div>
      </div>
      <div className="buttons">
        <button className="delete-profile" onClick={handleDelete}>Delete Profile</button>
        <button className="edit-profile" onClick={handleEdit}>Edit Profile</button>
      </div>
    </div>
  );
}

export default UserProfilePage;