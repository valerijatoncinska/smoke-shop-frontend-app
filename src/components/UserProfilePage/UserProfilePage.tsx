import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { updateUser, logoutUser, clearError } from "../../store/redux/userSlice"
import "./UserProfilePage.css"
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from "../../store/redux/addressSlice"
import axios from "axios"
import { useAppDispatch } from "app/hook"


interface Address {
  id: number;
  street: string;
  house: string;
  postalCode: string;
  locality: string;
  region: string;
  country: string;
  phone: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
  addresses: Address[];
}

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const status = useSelector((state: RootState) => state.address.status);
  const error = useSelector((state: RootState) => state.address.error);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
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
          const addresses = response.data;
          setUserData(prevUserData => ({
            ...prevUserData!,
            addresses: addresses
          }));
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
      dispatch(fetchAddresses());
    }
  }, [user, dispatch]);

  const handleEdit = (address: Address) => {
    setEditAddress(address);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editAddress) {
      try {
        await dispatch(updateAddress(editAddress));
        setIsEditing(false);
        alert("Address updated successfully!");
      } catch (error) {
        console.error("Error updating address:", error);
        alert("Error updating address. Please try again later.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditAddress(prevAddress =>
      prevAddress ? { ...prevAddress, [name]: value } : null
    );
  };

  const handleDelete = async (addressId: number) => {
    try {
      await dispatch(deleteAddress(addressId));
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Error deleting address. Please try again later.");
    }
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

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      <div className="profile-container">
        <div className="profile-section">
          <h2>User Profile</h2>
          {userData && (
            <>
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
            </>
          )}
        </div>
        <div className="profile-section">
          <h2>Addresses</h2>
          {addresses.length > 0 ? (
            addresses.map(address => (
              <div key={address.id} className="address-item">
                {isEditing && address.id === editAddress?.id ? (
                  <>
                    <input
                      type="text"
                      name="street"
                      value={editAddress.street || ""}
                      placeholder="Street"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="house"
                      value={editAddress.house || ""}
                      placeholder="House Number"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={editAddress.postalCode || ""}
                      placeholder="Postal Code"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="locality"
                      value={editAddress.locality || ""}
                      placeholder="Locality"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="region"
                      value={editAddress.region || ""}
                      placeholder="Region"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="country"
                      value={editAddress.country || ""}
                      placeholder="Country"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="phone"
                      value={editAddress.phone || ""}
                      placeholder="Phone Number"
                      onChange={handleChange}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p>Street: {address.street || "N/A"}</p>
                    <p>House number: {address.house || "N/A"}</p>
                    <p>Postal code: {address.postalCode || "N/A"}</p>
                    <p>Locality: {address.locality || "N/A"}</p>
                    <p>Region: {address.region || "N/A"}</p>
                    <p>Country: {address.country || "N/A"}</p>
                    <p>Phone number: {address.phone || "N/A"}</p>
                    <button onClick={() => handleEdit(address)}>Edit</button>
                    <button onClick={() => handleDelete(address.id)}>Delete</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No addresses available</p>
          )}
        </div>
      </div>
      <div className="buttons">
        <button className="logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;


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
