import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./styles/AccountActivation.module.css"
import axios from "axios"

const AccountActivation = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.get(`/api/author/account-activate/${uuid}`)
        setMessage(response.data.message || "Account successfully activated!")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "An unexpected error occurred during activation.",
          )
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (uuid) {
      activateAccount()
    } else {
      setError("Invalid activation link.")
      setLoading(false)
    }
  }, [uuid])

  const handleSignIn = () => {
    navigate("/auth/login")
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className={styles.container}>
      <img
        src="/img/unsplash_PzXqG8f2rrE.jpg"
        alt="Main Background"
        className={styles.backgroundImage}
      />
      <div className={styles.card}>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-black" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Activation Failed</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button
              type="button"
              className={styles.buttonGoHome}
              onClick={handleGoHome}
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className={styles.successContainer}>
            <h2 className={styles.successTitle}>{message}</h2>
            <p className={styles.successMessage}>
              To log into your account, go to the login page.
            </p>
            <button
              type="button"
              className={styles.buttonSignIn}
              onClick={handleSignIn}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountActivation
