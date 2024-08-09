import React, { useEffect, useState } from "react"
import "./UserProfilePage.css"

interface Address {
  city: string
  zipCode: string
  street: string
  apartmentNumber: string
}

interface User {
  name: string
  email: string
  address: Address
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const data = await response.json()
        setUser(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [token])

  const handleDelete = async () => {
    try {
      const response = await fetch(
        "/api/user/profile",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to delete profile")
      }

      alert("Profile deleted")
      setUser(null)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(
        "/api/user/profile",
        {
          method: "PATCH", // Используем PATCH для частичного обновления данных
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user), // Отправляем обновлённые данные пользователя
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setUser(prevUser => {
      if (!prevUser) return null

      if (name.includes("address.")) {
        const addressKey = name.split(".")[1]
        return {
          ...prevUser,
          address: {
            ...prevUser.address,
            [addressKey]: value,
          },
        }
      }

      return { ...prevUser, [name]: value }
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No user data available</div>
  }

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      <div className="profile-sections">
        <div className="profile-section">
          <h2>Details</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </label>
        </div>
        <div className="profile-section">
          <h2>Address</h2>
          <label>
            City:
            <input
              type="text"
              name="address.city"
              value={user.address.city}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </label>
          <label>
            Zip code:
            <input
              type="text"
              name="address.zipCode"
              value={user.address.zipCode}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </label>
          <label>
            Street:
            <input
              type="text"
              name="address.street"
              value={user.address.street}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </label>
          <label>
            Apartment number:
            <input
              type="text"
              name="address.apartmentNumber"
              value={user.address.apartmentNumber}
              onChange={handleChange}
              readOnly={!isEditing}
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
        <button className="delete-profile" onClick={handleDelete}>
          Delete Profile
        </button>
      </div>
    </div>
  )
}

export default UserProfilePage
