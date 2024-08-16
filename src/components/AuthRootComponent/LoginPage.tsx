import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./styles/LoginPage.module.css"
import { useAppDispatch, useAppSelector } from "../../app/hook"
import { clearError, loginUser } from "../../store/redux/userSlice"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [generalError, setGeneralError] = useState<string | null>(null)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { status } = useAppSelector(state => state.user)

  useEffect(() => {
    dispatch(clearError())
    setGeneralError(null)
  }, [dispatch])

  useEffect(() => {
    setEmailError(null)
    setGeneralError(null)
  }, [email])

  useEffect(() => {
    setPasswordError(null)
    setGeneralError(null)
  }, [password])

  // Функция для обработки отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailValidation =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const passwordValidation =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./]).{11,}$/

    setEmailError(null)
    setPasswordError(null)

    if (!emailValidation.test(String(email).toLowerCase())) {
      setEmailError(
        "Email must be in a valid format. Example: user@example.com",
      )
      return
    }

    if (!passwordValidation.test(String(password))) {
      setPasswordError(
        "Password must be at least 11 characters long, contain at least one number, one uppercase letter, and one special character",
      )
      return
    }

    try {
      const userData = await dispatch(loginUser({ email, password })).unwrap()
      console.log(userData)
      const roles = userData.roles
        .map(element => element.authority)
        .filter(element => element.includes("ROLE_ADMIN"))
      console.log(roles)

      if (roles[0] === "ROLE_ADMIN") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (error) {
      // Обработка ошибок от сервера
      const errorMessage = error as string;

      if (errorMessage === "Incorrect email or password") {
        setPasswordError("Incorrect email or password")
      } else if (
        errorMessage === "There is no such account. Please register."
      ) {
        setEmailError("Please confirm your email address.")
      } else if (errorMessage === "Email or password is incorrect") {
        setEmailError("Email or password is incorrect")
      } else {
        setGeneralError("Email must be in a valid format. Example: user@example.com")
      }
      console.log("Ошибка входа:", error)
    }
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const errors = [emailError, passwordError, generalError].filter(
    err => err !== null,
  )

  return (
    <>
      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          {errors.map((err, index) => (
            <div key={index} className={styles.error}>
              {err}
            </div>
          ))}
        </div>
      )}
      <div className={styles.container}>
        <img
          src="/img/unsplash_PzXqG8f2rrE.jpg"
          alt="Main Background"
          className={styles.backgroundImage}
        />
        <div className={styles.card}>
          <div className={styles.goHomeContainer}>
            <button
              type="button"
              className={styles.goHomeButton}
              onClick={handleGoHome}
            >
              Go to Home
            </button>
          </div>
          <h2 className={styles.title}>Login</h2>

          {status === "loading" && (
            <div className="text-center">
              <div className="spinner-border text-black" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email:
              </label>
              <input
                type="email"
                className={styles.input}
                onChange={e => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email..."
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password:
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  onChange={e => setPassword(e.target.value)}
                  id="password"
                  placeholder="Enter your password..."
                  required
                />
                <button
                  type="button"
                  className={styles.togglePasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              If you are a new user, click <Link to="/auth/register">here</Link>{" "}
              to register.
            </div>
            <button type="submit" className={styles.button}>
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
