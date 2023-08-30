import React, { useEffect, useState } from 'react';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import logoPath from '../blocks/header/__logo/header__logo.svg';
import iconPath from '../blocks/header/Icon.svg';
import closeIconPath from '../blocks/header/CloseIcon.svg';

export default function Header({ signOut, email }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      {
        isOpen && (
          <div className='header__menu'>
            <p className='header__email_type_menu'>{email}</p>
            <Link
              to='/sign-in'
              className={`header__login header__login_type_signout-in-menu ${location.pathname === '/' ? '' : 'header__login_hidden'}`}
              onClick={() => {
                toggleOpen();
                signOut();
              }}>
              Выйти
            </Link>
          </div>
        )
      }

      <header className="header">
        <img className="header__logo" src={logoPath} alt="логотип Mesto" />
        <div className='header__container'>
          <p className='header__email'>{email}</p>
          <Routes>
            <Route path='/sign-in' element={
              <Link
                to='/sign-up'
                className={`header__login ${location.pathname === '/' ? 'header__login_hidden' : ''}`}>
                Регистрация
              </Link>} />
            <Route path='/sign-up' element={
              <Link
                to='/sign-in'
                className={`header__login ${location.pathname === '/' ? 'header__login_hidden' : ''}`}>
                Войти
              </Link>} />
            <Route path='/' element={
              <Link
                to='/sign-in'
                className={`header__login header__login_type_signout ${location.pathname === '/' ? '' : 'header__login_hidden'}`}
                onClick={signOut}>
                Выйти
              </Link>} />
          </Routes>
          <button className={`header__button ${isOpen ? 'header__button_type_close-icon' : 'header__button_type_icon'}`} onClick={toggleOpen}>
            <img className='header__button-icon' src={isOpen ? closeIconPath : iconPath} />
          </button>
        </div>
      </header>
    </>
  );
};