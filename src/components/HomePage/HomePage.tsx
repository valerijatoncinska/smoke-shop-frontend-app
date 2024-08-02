import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <>
      <img
        src="/img/unsplash_PzXqG8f2rrE.jpg"
        alt="Main Background"
        className={styles.backgroundImage}
      />
      <p className={styles.p}>
        Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco
        Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco
        Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco Tabacco
        Tabacco Tabacco Tabacco
      </p>
      <div className={styles["button-container"]}>
        <button className={styles.button}>
          <Link to="/catalog">Catalog</Link>
        </button>
        <button className={styles.button}>
          <Link to="/auth/register">Registration</Link>
        </button>
      </div>
      <div className={styles.blackBottom}>
        <p className={styles.pBottom}>Have a good day!</p>
      </div>
    </>
  );
};

export default HomePage;