class Api {
  constructor(data) {
    this._url = data.baseUrl;
    this._headers = data.headers;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  async getUserInfo() {
    const res = await fetch(`${this._url}/users/me`, {
      headers: this._headers,
      credentials: 'include'
    });
    return this._handleResponse(res);
  }

  async getInitialCards() {
    const res = await fetch(`${this._url}/cards`, {
      headers: this._headers
    });
    return this._handleResponse(res);
  }

  async setUserInfo(userInfo) {
    const res = await fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: userInfo.name,
        about: userInfo.about
      }),
      credentials: 'include'
    });
    return this._handleResponse(res);
  }

  async addNewCard(data) {
    const res = await fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return this._handleResponse(res);
  }

  async deleteCard(id) {
    const res = await fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    });
    return this._handleResponse(res);
  }

  async like(id) {
    const res = await fetch(`${this._url}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include'
    });
    return this._handleResponse(res);
  }

  async dislike(id) {
    const res = await fetch(`${this._url}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    });
    return this._handleResponse(res);
  }

  changeLikeCardStatus(card, variable) {
    this._status = variable ? this.like(card._id) : this.dislike(card._id);
    return this._status;
  }

  async changeAvatar(data) {
    const res = await fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      }),
      credentials: 'include'
    });
    return this._handleResponse(res);
  }
};

export const api = new Api({
  baseUrl: 'https://api.shamanka.students.nomoredomainsicu.ru',
  headers: {
    'Content-Type': 'application/json'
  }
});