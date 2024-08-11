import { useEffect } from "react"
import { useAppDispatch } from "../../app/hook"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../store/store"
import { activateAccount } from "../../store/redux/userSlice"
import styles from "./styles/AccountActivation.module.css"

const AccountActivation = () => {
  const dispatch = useAppDispatch();

  const activationStatus = useSelector((state: RootState) => state.user.activationStatus);
  const activationMessage = useSelector((state: RootState) => state.user.activationMessage);
  const activationErrorMessage = useSelector((state: RootState) => state.user.activationErrorMessage);

  const navigate = useNavigate()

  const { uuid } = useParams<{ uuid: string }>()

  useEffect(() => {
    if (uuid) {
      dispatch(activateAccount(uuid))
    }
  }, [dispatch, uuid])

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
        {activationStatus === "loading" && (
          <div className="text-center">
            <div className="spinner-border text-black" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {activationStatus === "success" && (
          <div className={styles.successContainer}>
            <h2 className={styles.successTitle}>
            {activationMessage}
            </h2>
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

        {activationStatus === "error" && (
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Activation Failed</h2>
            <p className={styles.errorMessage}>
            {activationErrorMessage}
            </p>
            <button
              type="button"
              className={styles.buttonGoHome}
              onClick={handleGoHome}
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountActivation
