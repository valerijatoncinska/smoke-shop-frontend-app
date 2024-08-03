import React, { useState } from "react"
import styles from "./styles/RegisterPage.module.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAppDispatch } from "../../app/hook"
import { login } from "../../store/redux/userSlice"

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [repeatPassword, setRepeatPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordValidation =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./]).{11,}$/

    if (!email || !emailValidation.test(email)) {
      setError("Invalid email address")
      return
    }

    if (!password || !passwordValidation.test(password)) {
      setError("Password must be at least 11 characters long, contain at least one number, one uppercase letter, and one special character")
      return
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userData = { email, password }
      const response = await axios.post(
        "/author/reg",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      dispatch(login(response.data))
      navigate("/")
    } catch (error) {
      console.log("Ошибка регистрации:", error)
      setError("An unknown error has occurred. Please try again.")
    } finally {
      setLoading(false)
    }
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
        <div className={styles.goHomeContainer}>
          <button
            type="button"
            className={styles.goHomeButton}
            onClick={handleGoHome}
          >
            Go to Home
          </button>
        </div>
        <h2 className={styles.title}>Registration</h2>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-black" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        
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
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password:
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={styles.input}
                onChange={e => setRepeatPassword(e.target.value)}
                id="confirmPassword"
                placeholder="Confirm your password..."
                required
              />
              <button
                type="button"
                className={styles.togglePasswordButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage