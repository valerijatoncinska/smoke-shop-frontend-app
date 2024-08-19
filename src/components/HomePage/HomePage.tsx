import { useNavigate } from "react-router-dom"
import styles from "./HomePage.module.css"
import { useSelector } from "react-redux"
import { RootState } from "store/store"

const HomePage: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const navigate = useNavigate()

  const handleCatalogClick = () => {
    navigate("/catalog")
  }

  const handleProfileClick = () => {
    navigate("/profile")
  }

  const handleRegisterClick = () => {
    navigate("/auth/register")
  }

  return (
    <>
      <img
        src="/img/unsplash_PzXqG8f2rrE.jpg"
        alt="Main Background"
        className={styles.backgroundImage}
      />
      <p className={styles.p}>Welcome to Tobacco!</p>
      <div className={styles["button-container"]}>
        <button className={styles.button} onClick={handleCatalogClick}>
          Catalog
        </button>
        {isLoggedIn ? (
          <button className={styles.button} onClick={handleProfileClick}>
            My Profile
          </button>
        ) : (
          <button className={styles.button} onClick={handleRegisterClick}>
            Registration
          </button>
        )}
      </div>
      <div className={styles.blackBottom}>
        <p className={styles.pBottom}>Have a good day!</p>
      </div>
    </>
  )
}

export default HomePage
