import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ handleLogin, isLoggedIn, isLoading }) {
  const [formValue, setFormValue] = useState({
    password: '',
    email: ''
  });

  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleLogin(formValue.password, formValue.email);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn]);

  return (
    <div className="login">
      <h1 className="login__title">Вход</h1>
      <form
        className="login__form"
        onSubmit={handleSubmit}>
        <label>
          <input
            className="login__form-input"
            placeholder="Email"
            name="email"
            id='email'
            type='email'
            value={formValue.email || ''}
            onChange={handleChange}
            required />
        </label>
        <label>
          <input
            className="login__form-input"
            type='password'
            placeholder="Пароль"
            name="password"
            id='password'
            value={formValue.password || ''}
            onChange={handleChange}
            required />
        </label>
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="login__button">
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}