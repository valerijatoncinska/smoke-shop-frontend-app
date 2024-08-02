import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import { authNavItems, guestNavItems } from '../../constans/navigation';
import { RootState } from '../../store/store';

const NavBar: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  return (
    <>
      <div className={styles.blackHeader}>
        <span>Number: 0000-00000-0000</span>
        <span>Email: ooooo@gmail.com</span>
      </div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <NavLink to="/" className={styles.navLink}>Home</NavLink>
            <NavLink to="/catalog" className={styles.navLink}>Catalog</NavLink>
          </div>
          <h1 className={styles.title}>
            <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>Tobacco</Link>
          </h1>
          <div className={styles.navRight}>
            {isLoggedIn ? (
              authNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={styles.navLink}>
                  {item.label}
                </NavLink>
              ))
            ) : (
              guestNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={styles.navLink}>
                  {item.label}
                </NavLink>
              ))
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavBar;