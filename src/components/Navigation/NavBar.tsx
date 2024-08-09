import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import { authNavItems, guestNavItems } from '../../constans/navigation';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../app/hook';
import { logoutUser } from '../../store/redux/userSlice';

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <>
      <div className={styles.blackHeader}></div>
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
              <>
                {authNavItems.map((item) => (
                  item.isButton ? (
                    <button key={item.to} className={styles.navLink} onClick={handleLogout} style={{ 
                      background: 'none', 
                      color: '#000',
                      border: 'none',
                      padding: '0',
                      margin: '0',
                      fontSize: '15px',
                      fontFamily: 'Inria Serif',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '20px'
                    }}>
                      {item.label}
                    </button>
                  ) : (
                    <NavLink key={item.to} to={item.to} className={styles.navLink}>
                      {item.label}
                    </NavLink>
                  )
                ))}
              </>
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