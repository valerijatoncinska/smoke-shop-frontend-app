import React, { ChangeEvent, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { logoutUser, clearError } from "../../store/redux/userSlice"
import "./UserProfilePage.css"

import { useAppDispatch } from "../../app/hook"
import {
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from "../../store/redux/addressSlice"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface Address {
  id?: number
  name: string
  street: string
  house: string
  postalCode: string
  locality: string
  region: string
  email: string
  phone: string
}

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  
  const user = useSelector((state: RootState) => state.user.user)
  const status = useSelector((state: RootState) => state.user.status)
  const error = useSelector((state: RootState) => state.user.error)
  const userId = useSelector((state: RootState) => state.user.user?.id)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [userData, setUserData] = useState<Address | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; // Проверка наличия ID

      try {
        const response = await axios.get(`/api/address/${userId}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          setApiError("Failed to fetch user data.");
        }
      } catch (error) {
        setApiError("Error fetching user data. Please try again later.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, user]);

  useEffect(() => {
    const fetchAddressesData = async () => {
      try {
        await dispatch(fetchAddresses()).unwrap()
      } catch (error) {
        // setApiError("Error fetching addresses. Please try again later.");
        console.log("Error fetching addresses. Please try again later.")
      }
    }

    fetchAddressesData()
  }, [dispatch])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!userData) {
      setApiError("Address data is required.")
      return
    }

    try {
      await dispatch(updateAddress({ id: userId, ...userData })).unwrap()
      setIsEditing(false)
      setSuccessMessage("Address updated successfully!")
    } catch (error) {
      console.error("Error updating address:", error)
      setApiError("Error updating address. Please try again later.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prevUser => {
      if (!prevUser) return null
      return { ...prevUser, [name]: value }
    })
  }

  const handleDelete = async () => {
    if (userId === undefined || !userData) return

    try {
      const response = await axios.delete(`/api/address/${userId}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      if (response.status === 200) {
        await dispatch(deleteAddress(userId))

        setUserData(null)
        setSuccessMessage("Address deleted successfully!")
      } else {
        setApiError("Error deleting address. Please try again later.")
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      setApiError("Error deleting address. Please try again later.")
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => dispatch(clearError())}>Clear Error</button>
      </div>
    )
  }

  if (!userData) {
    return <div>No user data available</div>
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
        <div className="profile-section">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={userData?.name || ""}
                placeholder="Name"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="email"
                value={userData?.email || ""}
                placeholder="Email"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="street"
                value={userData?.street || ""}
                placeholder="Street"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="house"
                value={userData?.house || ""}
                placeholder="House Number"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="postalCode"
                value={userData?.postalCode || ""}
                placeholder="Postal Code"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="locality"
                value={userData?.locality || ""}
                placeholder="Locality"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="region"
                value={userData?.region || ""}
                placeholder="Region"
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="text"
                name="phone"
                value={userData?.phone || ""}
                placeholder="Phone Number"
                onChange={handleChange}
                className="profile-input"
              />
            </>
          ) : (
            <div className="paragraph">
              <p>Name: {userData?.name || "Not available"}</p>
              <p>Email: {userData.email}</p>
              <p>Street: {userData?.street || "Not available"}</p>
              <p>House Number: {userData?.house || "Not available"}</p>
              <p>Postal Code: {userData?.postalCode || "Not available"}</p>
              <p>Locality: {userData?.locality || "Not available"}</p>
              <p>Region: {userData?.region || "Not available"}</p>
              <p>Phone Number: {userData?.phone || "Not available"}</p>
            </div>
          )}
        </div>
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
              <button className="save save-button" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="edit edit-button" onClick={handleEdit}>
                Edit
              </button>
              <button className="delete delete-button" onClick={handleDelete}>
                Delete
              </button>
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
