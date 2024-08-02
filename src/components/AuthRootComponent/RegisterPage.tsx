import React, { useState } from "react"
import styles from "./styles/RegisterPage.module.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAppDispatch } from "../../app/hook"
import { login } from "../../store/redux/userSlice"

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [repeatPassword, setRepeatPassword] = useState<string>("")
  const [isAdult, setIsAdult] = useState<boolean>(false)
  const [subscribe, setSubscribe] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Функция для обработки отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Регулярные выражения для валидации
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordValidation =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}[\]:";'<>?,./]).{11,}$/
    const nameValidation = /^[A-Za-z\s]{1,50}$/

    // Проверка имени
    if (!name || !nameValidation.test(name)) {
      setError(
        "Name is required and must be between 1 and 50 characters long, containing only letters and spaces.",
      ) // Устанавливаем ошибку, если имя некорректно
      setLoading(false)
      return
    }

    // Проверка электронной почты
    if (!email || !emailValidation.test(email)) {
      setError("Invalid email address") // Устанавливаем ошибку, если email некорректен
      setLoading(false)
      return
    }

    // Проверка пароля
    if (!password || !passwordValidation.test(password)) {
      setError(
        "Password must be at least 11 characters long, contain at least one number, one uppercase letter, and one special character",
      ) // Устанавливаем ошибку, если пароль не соответствует требованиям
      setLoading(false)
      return
    }

    // Проверка повторного ввода пароля
    if (password !== repeatPassword) {
      setError("Passwords do not match") // Устанавливаем ошибку, если пароли не совпадают
      setLoading(false)
      return
    }

    // Выполнение регистрации
    try {
      const userData = { name, email, password, isAdult, subscribe } // Данные пользователя для отправки на сервер
      const response = await axios.post(
        "http://localhost:8080/author/register",
        userData,
      )
      dispatch(login(response.data))
      navigate("/")
    } catch (error) {
      setError("An unknown error has occurred. Please try again.") // Обработка ошибок запроса
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
            <label htmlFor="name" className={styles.label}>
              Name:
            </label>
            <input
              type="text"
              className={styles.input}
              onChange={e => setName(e.target.value)}
              id="name"
              placeholder="Enter your name..."
              required
            />
          </div>
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
          <div className={styles.formGroupCheckbox}>
            <input
              type="checkbox"
              id="age"
              checked={isAdult}
              onChange={e => setIsAdult(e.target.checked)}
              required
            />
            <label htmlFor="age" className={styles.checkboxLabel}>
              I am 18 years old or older
            </label>
          </div>
          <div className={styles.formGroupCheckbox}>
            <input
              type="checkbox"
              id="subscribe"
              checked={subscribe}
              onChange={e => setSubscribe(e.target.checked)}
            />
            <label htmlFor="subscribe" className={styles.checkboxLabel}>
              Subscribe to newsletter
            </label>
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
