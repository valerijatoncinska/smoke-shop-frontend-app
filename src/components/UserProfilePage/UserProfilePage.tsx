import React, { ChangeEvent, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { updateUser, logoutUser, clearError } from "../../store/redux/userSlice"
import "./UserProfilePage.css"

import { useAppDispatch } from "../../app/hook"
import {
  Address,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from "../../store/redux/addressSlice"
import axios from "axios"

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useSelector((state: RootState) => state.user.user)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editAddress, setEditAddress] = useState<Address | null>(null)
  const [userAddress, setUserAddress] = useState<Address | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/address", {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
  
        if (response.status === 200) {
          const address = response.data as Address;
          setUserAddress(prevAddress => prevAddress || address);
        } else {
          setApiError("Failed to fetch user data.");
        }
      } catch (error) {
        setApiError("Error fetching user data. Please try again later.");
      }
    };
  
    if (user && !userAddress) {
      fetchUserData();
    }
  }, [user, userAddress]);

  const handleEdit = () => {
    setEditAddress(userAddress)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editAddress) {
      try {
        const response = await axios.put(`/api/address/${editAddress.id}`, {
          name: editAddress.name,
          street: editAddress.street,
          house: editAddress.house,
          postalCode: editAddress.postalCode,
          locality: editAddress.locality,
          region: editAddress.region,
          email: editAddress.email,
          phone: editAddress.phone,
        })

        if (response.status === 200) {
          dispatch(updateAddress(response.data))
          setUserAddress(response.data)
          setIsEditing(false)
          setSuccessMessage("Address updated successfully!")
        } else {
          setApiError("Failed to update address.")
        }
      } catch (error) {
        setApiError("Error updating address. Please try again later.")
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditAddress(prevAddress =>
      prevAddress ? { ...prevAddress, [name]: value } : null,
    )
  }

  const handleDelete = async () => {
    try {
      if (userAddress) {
        await dispatch(deleteAddress(userAddress.id))
        setUserAddress(null)
        setSuccessMessage("Address deleted successfully!")
      }
    } catch (error) {
      setApiError("Error deleting address. Please try again later.")
    }
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
  }

  return (
    <div className="user-profile-page">
    {(apiError || successMessage) && (
      <div className="message-container">
        {apiError && <p className="error-message">{apiError}</p>}
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}
      </div>
    )}
    <h1>My Profile</h1>
    <div className="profile-container">
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={editAddress?.name || ""}
            placeholder="Name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            value={editAddress?.email || ""}
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="text"
            name="street"
            value={editAddress?.street || ""}
            placeholder="Street"
            onChange={handleChange}
          />
          <input
            type="text"
            name="house"
            value={editAddress?.house || ""}
            placeholder="House Number"
            onChange={handleChange}
          />
          <input
            type="text"
            name="postalCode"
            value={editAddress?.postalCode || ""}
            placeholder="Postal Code"
            onChange={handleChange}
          />
          <input
            type="text"
            name="locality"
            value={editAddress?.locality || ""}
            placeholder="Locality"
            onChange={handleChange}
          />
          <input
            type="text"
            name="region"
            value={editAddress?.region || ""}
            placeholder="Region"
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            value={editAddress?.phone || ""}
            placeholder="Phone Number"
            onChange={handleChange}
          />
        </>
      ) : (
        <div className="paragraph">
          <p>Name: {userAddress?.name || "Not available"}</p>
          <p>Email: {userAddress?.email || "Not available"}</p>
          <p>Street: {userAddress?.street || "Not available"}</p>
          <p>House Number: {userAddress?.house || "Not available"}</p>
          <p>Postal Code: {userAddress?.postalCode || "Not available"}</p>
          <p>Locality: {userAddress?.locality || "Not available"}</p>
          <p>Region: {userAddress?.region || "Not available"}</p>
          <p>Phone Number: {userAddress?.phone || "Not available"}</p>
        </div>
      )}
    </div>
    <div className="buttons">
      <div className="left-buttons">
        <button className="logout logout-button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
      <div className="right-buttons">
      {isEditing ? (
      <>
        <button className="save save-button" onClick={handleSave}>Save</button>
        <button className="cancel cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
      </>
    ) : (
      <>
        <button className="edit edit-button" onClick={handleEdit}>Edit</button>
        <button className="delete delete-button" onClick={handleDelete}>Delete</button>
      </>
    )}
      </div>
    </div>
  </div>

  )
}

export default UserProfilePage


// {isEditing ? (
//   <>
//     <button className="save" onClick={handleSave}>Save</button>
//     <button className="cancel" onClick={() => setIsEditing(false)}>Cancel</button>
//   </>
// ) : (
//   <>
//     <button className="edit" onClick={handleEdit}>Edit</button>
//     <button className="delete" onClick={handleDelete}>Delete</button>
//   </>
// )}

// interface User {
//   id?: string;
//   name?: string;
//   email: string;
//   city?: string;
//   postalCode?: string;
//   street?: string;
//   house?: string;
//   phone?: string;
//   accessToken: string;
//   refreshToken: string;
// }

// const UserProfilePage: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const user = useSelector((state: RootState) => state.user.user);
//   const status = useSelector((state: RootState) => state.user.status);
//   const error = useSelector((state: RootState) => state.user.error);

//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [userData, setUserData] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get("/api/address", {
//         });

//         if (response.status === 200) {
//           setUserData({
//             ...response.data,
//             email: user?.email,
//             accessToken: user?.accessToken,
//             refreshToken: user?.refreshToken,
//           });
//         } else {
//           console.error("Failed to fetch user data.");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleSave = async () => {
//     if (userData) {
//       try {
//         const response = await axios.put(
//           `/api/address/}`,
//           {
//             name: userData.name,
//             street: userData.street,
//             house: userData.house,
//             postalCode: userData.postalCode,
//             city: userData.city,
//             phone: userData.phone,
//           },
//         );

//         if (response.status === 200) {
//           const updatedUser = { ...userData, ...response.data };

//           // Обновляем состояние в Redux
//           dispatch(updateUser(updatedUser));

//           // Обновляем локальное состояние
//           setUserData(updatedUser);

//           setIsEditing(false);
//           alert("Profile updated successfully!");
//         } else {
//           console.error("Failed to update profile.");
//         }
//       } catch (error) {
//         console.error("Error updating profile:", error);
//         alert("Error updating profile. Please try again later.");
//       }
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserData((prevUser) => {
//       if (!prevUser) return null;
//       return { ...prevUser, [name]: value };
//     });
//   };

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//   };

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         Error: {error}
//         <button onClick={() => dispatch(clearError())}>Clear Error</button>
//       </div>
//     );
//   }

//   if (!userData) {
//     return <div>No user data available</div>;
//   }

//   return (
//     <div className="user-profile-page">
//       <h1>My Profile</h1>
//       <div className="profile-container">
//         <div className="profile-section">
//           <h2>Details</h2>
//           {isEditing ? (
//             <>
//               <input
//                 type="text"
//                 name="name"
//                 value={userData.name || ""}
//                 placeholder="Name"
//                 onChange={handleChange}
//               />
//               <input
//                 type="text"
//                 name="city"
//                 value={userData.city || ""}
//                 placeholder="City"
//                 onChange={handleChange}
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 value={userData.postalCode || ""}
//                 placeholder="Postal Code"
//                 onChange={handleChange}
//               />
//               <input
//                 type="text"
//                 name="street"
//                 value={userData.street || ""}
//                 placeholder="Street"
//                 onChange={handleChange}
//               />
//               <input
//                 type="text"
//                 name="house"
//                 value={userData.house || ""}
//                 placeholder="House Number"
//                 onChange={handleChange}
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 value={userData.phone || ""}
//                 placeholder="Phone Number"
//                 onChange={handleChange}
//               />
//               <button onClick={handleSave}>Save</button>
//               <button onClick={() => setIsEditing(false)}>Cancel</button>
//             </>
//           ) : (
//             <>
//               <p>Name: {userData.name || "N/A"}</p>
//               <p>Email: {userData.email}</p>
//               <p>City: {userData.city || "N/A"}</p>
//               <p>Postal code: {userData.postalCode || "N/A"}</p>
//               <p>Street: {userData.street || "N/A"}</p>
//               <p>House number: {userData.house || "N/A"}</p>
//               <p>Phone number: {userData.phone || "N/A"}</p>
//             </>
//           )}
//         </div>
//       </div>
//       <div className="buttons">
//         {!isEditing && (
//           <button className="edit-profile" onClick={handleEdit}>
//             Edit profile
//           </button>
//         )}
//         <button className="logout" onClick={handleLogout}>
//           Sign out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
