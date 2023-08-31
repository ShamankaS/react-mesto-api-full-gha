import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { api } from '../utils/Api.js';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ConfirmDeleteCardPopup from './ConfirmDeleteCardPopup.js';
import * as Auth from '../utils/Auth.js';
import ProtectedRoute from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoToolTip from './InfoTooltip.js';

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoadingEditProfileStart, setIsLoadingEditProfileStart] = useState(false);
  const [isLoadingAddPlaceStart, setIsLoadingAddPlaceStart] = useState(false);
  const [isLoadingEditAvatarStart, setIsLoadingEditAvatarStart] = useState(false);
  const [isConfirmDeleteCardPopupopen, setIsConfirmDeleteCardPopupopen] = useState(false);
  const [isLoadingDeleteCardStart, setIsLoadingDeleteCardStart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingRegistration, setIsLoadingRegistration] = useState(false);
  const [isLoadingEnter, setIsLoadingEnter] = useState(false);
  const [infoTooltipText, setInfoTooltipText] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [jwt, setJwt] = useState('');

  const fetchCards = async () => {
    if (jwt) {
      try {
        const res = await api.getInitialCards({
          authorization: `${jwt}`,
        });
        setCards(res);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    tokenCheck();
    fetchCards();
  }, [isLoggedIn, jwt]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleConfirmDeleleCardClick(data) {
    setSelectedCard(data);
    setIsConfirmDeleteCardPopupopen(true);
  };

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsCardPopupOpen(false);
    setIsConfirmDeleteCardPopupopen(false);
    setIsInfoTooltipOpen(false);
  };

  const mouseEventType = 'click';
  const keyNameEsc = 'Escape';
  const keyEventType = 'keydown';
  const openPopupSelector = 'popup_active';

  const handleEscKey = useCallback((evt) => {
    if (evt.key === keyNameEsc) {
      closeAllPopups();
    }
  }, []);

  const handleClickOutside = useCallback((evt) => {
    if (evt.target.classList.contains(openPopupSelector)) {
      closeAllPopups();
    }
  }, []);

  const anyPopupOpen = isAddPlacePopupOpen || isCardPopupOpen || isEditAvatarPopupOpen || isEditProfilePopupOpen || isConfirmDeleteCardPopupopen || isInfoTooltipOpen;

  useEffect(() => {
    if (anyPopupOpen) {
      document.addEventListener(keyEventType, handleEscKey, true);
      document.addEventListener(mouseEventType, handleClickOutside, true);
      return () => {
        document.removeEventListener(mouseEventType, handleClickOutside, true);
        document.removeEventListener(keyEventType, handleEscKey, true);
      }
    }
  }, [anyPopupOpen, handleEscKey, handleClickOutside]);

  const handleCardClick = (data) => {
    setIsCardPopupOpen(true);
    setSelectedCard(data);
  };

  const handleCardLikeClick = async (card) => {
    const isLiked = card.likes.some(item => (item._id || item) === currentUser._id);
    try {
      const res = await api.changeLikeCardStatus(card, !isLiked);
      setCards((state) => state.map(item => item._id === card._id ? res : item));
    } catch (error) {
      console.warn(error);
    }
  };

  const handleCardDelete = async (card) => {
    setIsLoadingDeleteCardStart(true);
    try {
      await api.deleteCard(card._id);
      setCards((state) => state.filter(item => item._id !== card._id));
      closeAllPopups();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDeleteCardStart(false);
    }
  };

  const handleUpdateUser = async (data) => {
    setIsLoadingEditProfileStart(true);
    try {
      const res = await api.setUserInfo(data);
      setCurrentUser(res);
      closeAllPopups();
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoadingEditProfileStart(false);
    }
  };

  const handleUpdateAvatar = async (data) => {
    try {
      setIsLoadingEditAvatarStart(true);
      const res = await api.changeAvatar(data);
      setCurrentUser(res);
      closeAllPopups();
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoadingEditAvatarStart(false);
    }
  };

  const handleAddPlaceSubmit = async (data) => {
    setIsLoadingAddPlaceStart(true);
    try {
      const { res } = await api.addNewCard(data);
      setCards([res, ...cards]);
      closeAllPopups();
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoadingAddPlaceStart(false);
    }
  };

  const handleLogin = async (password, email) => {
    try {
      setIsLoadingEnter(true);
      const { token } = await Auth.login(password, email);
      const data = await Auth.checkToken(token);
      setUserEmail(data.email);
      console.log(token);
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (err) {
      console.warn(err);
      setIsInfoTooltipOpen(true);
      setInfoTooltipText('Что-то пошло не так!\n Попробуйте ещё раз.');
      setIsSuccess(false);
      setError(err);
    } finally {
      setIsLoadingEnter(false);
    }
  };

  const tokenCheck = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setJwt(token);
      try {
        const data = await Auth.checkToken(token);
        setCurrentUser(data);
        setUserEmail(data.email);
        setIsLoggedIn(true);
      } catch (err) {
        console.warn(err);
        setIsLoggedIn(false);
      }
    }
  };

  const handleRegister = async (password, email) => {
    try {
      setIsLoadingRegistration(true);
      await Auth.register(password, email);
      setInfoTooltipText('Вы успешно зарегистрировались!');
      setIsSuccess(true);
      setIsInfoTooltipOpen(true);
    } catch (err) {
      console.warn(err);
      setIsSuccess(false);
      setError(err);
    } finally {
      setIsLoadingRegistration(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/sign-in');
    setUserEmail('');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          signOut={signOut}
          email={userEmail} />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute
                Component={Main}
                isLoggedIn={isLoggedIn}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLikeClick}
                onCardDelete={handleConfirmDeleleCardClick} />}
          />
          <Route path='/sign-up' element={
            <Register
              handleRegister={handleRegister}
              isLoggedIn={isLoggedIn}
              isLoading={isLoadingRegistration} />} />
          <Route path='/sign-in' element={
            <Login
              handleLogin={handleLogin}
              isLoggedIn={isLoggedIn}
              isLoading={isLoadingEnter} />} />
        </Routes>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoadingEditProfileStart} />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoadingAddPlaceStart} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoadingEditAvatarStart} />
        <ImagePopup
          card={selectedCard}
          isOpen={isCardPopupOpen}
          onClose={closeAllPopups} />
        <ConfirmDeleteCardPopup
          name={'card-delete'}
          isOpen={isConfirmDeleteCardPopupopen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          isLoading={isLoadingDeleteCardStart}
          card={selectedCard} />
        <InfoToolTip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccess}
          popupText={infoTooltipText} />
      </div>
    </CurrentUserContext.Provider>
  );
}