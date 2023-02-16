import React, {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from "./Header/Header"
import Main from "./Main/Main";
import Footer from "./Footer/Footer"
import ImagePopup from "./ImagePopup/ImagePopup";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup"
import AddPlacePopup from './AddPlacePopup/AddPlacePopup';
import {api} from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {CurrentCardContext} from '../contexts/CurrentCardContext';
import loading from "../images/loading.gif";
import DeleteCardQuestionPopup from './DeleteCardQuestionPopup/DeleteCardQuestionPopup';
import Register from "./Register/Register"
import Login from "./Login/Login"
import ProtectedRouteElement from "./ProtectedRoute/ProtectedRoute"

function App() {
  //состояние попапа аватара
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  //состояние попапа добавления новой карточки
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  //состояние попапа редактирования профиля
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  //состояние попапа удаления карточки
  const [isDeleteCardQuestionPopupOpen, setIsDeleteCardQuestionPopupOpen] = useState(false);
  //состояние попапа полноразмерной картинки
  const [selectedCard, setSelectedCard] = useState({});
  //данные пользователя
  const [currentUser, setCurrentUser] = useState({});
  //данные карточек
  const [currentCards, setCurrentCards] = useState([]);
  //загрузка страницы
  const [loadingBoolean, setLoadingBoolean] = useState(false);

  const [cardToBeDeleted, setCardToBeDeleted] = useState({});
  //авторизация пользователя
  const [loggedIn, isloggedIn] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getInfoUser(),
      api.getInitialCards()
    ])
      .then(([info, initialCards]) => {
        setCurrentUser(info);
        setCurrentCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        setLoadingBoolean(true);
      });
  }, [])

  function handleCardLike(card) {
    //проверяем, есть ли лайк на карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCurrentCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleUpdateUser({nameUser, activity, resetForm}, setButtonLoading){
    api.giveInfoUser(nameUser, activity)
      .then(userInfo => {
        setCurrentUser(userInfo);
        closeAllPopups();
        resetForm();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        setButtonLoading(false)
      });
  }

  function handleAddCrad({values, resetForm}, setButtonLoading){
    api.giveCard(values.cardDescription, values.linkImg)
      .then(newCard => {
        setCurrentCards([newCard, ...currentCards]);
        closeAllPopups();
        resetForm();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        setButtonLoading(false)
      });
  }

  function handleUpdateAvatar({avatar, resetForm}, setButtonLoading){
    api.giveAvatar(avatar)
      .then(userInfo => {
        setCurrentUser(userInfo);
        closeAllPopups();
        resetForm();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        setButtonLoading(false)
      });
  }

  //открытие попапов
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  function handleCardDeletClick(card){
    setIsDeleteCardQuestionPopupOpen(!isDeleteCardQuestionPopupOpen);
    setCardToBeDeleted(card);
  }

  function deleteCard(card, setButtonLoading) {
    api.deletCard(card._id)
      .then(()=>{
        setCurrentCards((state) => state.filter((item) => item._id !== card._id))
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        setButtonLoading(false)
      });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  };

  //закрытие всех попапов
  function closeAllPopups(){
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardQuestionPopupOpen(false);
    setSelectedCard({});
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <CurrentCardContext.Provider value={currentCards}>
          <Header />
          <Routes>
            {/* <Route path="/" element={
              <Main onCardLike={handleCardLike} onCardDelet={handleCardDeletClick} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}/>
            }/> */}
            <Route path="/sign-up" element={<Register />}/>
            <Route path="/sign-in" element={<Login />}/>
            <Route path="/" element={
              <ProtectedRouteElement
                  component={Main} loggedIn={loggedIn} onCardLike={handleCardLike} onCardDelet={handleCardDeletClick} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}
                  // loggedIn={loggedIn}
                  // onEditAvatar={handleEditAvatarClick}
                  // onEditProfile={handleEditProfileClick}
                  // onAddPlace={handleAddPlaceClick}
                  // onCardClick={handleCardClick}
                  // cards={cards}
                  // onClickCardDelete={handleConfimCardDelete}
                  // onCardLike={handleCardLike}
                />
            }/>
          </Routes>
          {/* {loadingBoolean ?
            <Main onCardLike={handleCardLike} onCardDelet={handleCardDeletClick} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}/>
            :
            <div className='loading-data'>
              <img className='loading-data__img' src={loading} alt='анимация загрузки'/>
            </div>
          } */}
          <Footer />
          <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
          <AddPlacePopup onAddCrad={handleAddCrad} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
          <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
          <DeleteCardQuestionPopup onDeleteCard={deleteCard} card={cardToBeDeleted} isOpen={isDeleteCardQuestionPopupOpen} onClose={closeAllPopups}/>
          <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
        </CurrentCardContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
