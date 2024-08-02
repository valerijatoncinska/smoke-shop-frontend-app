import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./styles/LoginPage.module.css"
import { useAppDispatch } from "../../app/hook"
import { login } from "../../store/redux/userSlice"

const LoginPage: React.FC = () => {

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const navigate = useNavigate() 
  const dispatch = useAppDispatch()

  // Функция для обработки отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Предотвращаем стандартное поведение формы
    setLoading(true)
    setError(null)

    // Проверка валидности email
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailValidation.test(email)) {
      setError("Invalid email address") // Устанавливаем ошибку, если email некорректен
      setLoading(false) 
      return
    }

    // Проверка валидности пароля
    const passwordValidation =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./]).{11,}$/
    if (!password || !passwordValidation.test(password)) {
      setError(
        "Password must be at least 11 characters long, contain at least one number, one uppercase letter, and one special character",
      ) // Устанавливаем ошибку, если пароль не соответствует требованиям
      setLoading(false)
      return
    }

    try {
      const userData = { email, password } // Данные пользователя для отправки на сервер
      const response = await axios.post(
        "",
        userData,
      )
      dispatch(login(response.data))
      navigate("/")
    } catch (error) {
      setError("An unknown error has occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Функция для перехода на домашнюю страницу
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
        <h2 className={styles.title}>Login</h2>
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
                type={showPassword ? "text" : "password"} // Переключение между текстом и паролем
                className={styles.input}
                onChange={e => setPassword(e.target.value)}
                id="password"
                placeholder="Enter your password..."
                required
              />
              <button
                type="button"
                className={styles.togglePasswordButton}
                onClick={() => setShowPassword(!showPassword)} // Изменение видимости пароля
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            If you are a new user, click{" "}
            <a
              href="http://localhost:5173/auth/register"
              className={styles.registerLink}
            >
              here
            </a>{" "}
            to register.
          </div>
          <button type="submit" className={styles.button}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
