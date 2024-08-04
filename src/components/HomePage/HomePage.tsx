import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const HomePage: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  return (
    <>
      <img
        src="/img/unsplash_PzXqG8f2rrE.jpg"
        alt="Main Background"
        className={styles.backgroundImage}
      />
      <p className={styles.p}>
        Welcome to Tobacco!
      </p>
      <div className={styles["button-container"]}>
        <button className={styles.button}>
          <Link to="/catalog">Catalog</Link>
        </button>
        {isLoggedIn ? (
          <button className={styles.button}>
            <Link to="/profile">My Profile</Link>
          </button>
        ) : (
          <button className={styles.button}>
            <Link to="/auth/register">Registration</Link>
          </button>
        )}
      </div>
      <div className={styles.blackBottom}>
        <p className={styles.pBottom}>Have a good day!</p>
      </div>
    </>
  );
};

export default HomePage;