import React from "react";
import successImg from '../blocks/popup/Success.svg';
import rejectImg from '../blocks/popup/Reject.svg';

export default function InfoToolTip({ isOpen, onClose, isSuccess, popupText }) {
  return (
    <div className={`popup ${isOpen ? 'popup_active' : null}`}>
      <div
        className="popup__container popup__container_type_info-tooltip">
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose} />
        <img className='popup__icon' src={isSuccess ? successImg : rejectImg} />
        <p className='popup__text'>{popupText}</p>
      </div>
    </div>
  )
}