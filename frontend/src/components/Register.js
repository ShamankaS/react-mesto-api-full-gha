import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ handleRegister, isLoggedIn, isLoading }) {
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
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleRegister(formValue.password, formValue.email);
    navigate('/sign-in', {replace: true});
  }

  useEffect(() => {
    if (isLoggedIn) {
      setFormValue({
        password: '',
        email: ''
      })
    }
  }, [isLoggedIn]);

  return (
    <div className="register">
      <p className="register__title">Регистрация</p>
      <form
        className="register__form"
        onSubmit={handleSubmit}>
        <label>
          <input
            className="register__form-input"
            placeholder="Email"
            name="email"
            id="email"
            type="email"
            value={formValue.email || ''}
            onChange={handleChange}
            required />
        </label>
        <label>
          <input
            className="register__form-input"
            placeholder="Пароль"
            name="password"
            id="password"
            type="password"
            value={formValue.password || ''}
            onChange={handleChange}
            required />
        </label>
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="register__button">
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className='register__text'>Уже зарегистрированы? <Link to='/sign-in' className='register__text register__text_type_link'>Войти</Link></p>
    </div>
  )
}