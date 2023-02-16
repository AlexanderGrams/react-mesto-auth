import { Link } from 'react-router-dom';
import LoginAndRegisterForm from "../LoginAndRegisterForm/LoginAndRegisterForm";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";

function Register() {

  const {values, handleChange, errors, isValid} = useFormAndValidation()

  function handleSubmit(e, setButtonLoading) {
    e.preventDefault();

    // // Передаём значения управляемых компонентов во внешний обработчик
    // onUpdateUser({
    //   nameUser: values.nameUser,
    //   activity: values.activity,
    //   resetForm: resetForm,
    // }, setButtonLoading);
  }

  return (
    <main className="main">
      <section className="authorization">
        <h1 className="authorization__title">Регистрация</h1>
        <LoginAndRegisterForm isValid={!isValid} name={'register'} onSubmit={handleSubmit} buttonText="Зарегистрироваться">
          <fieldset className="authorization__inputs">
            <input id="name-emailUser" className={errors.emailUser ? "authorization__item authorization__item_tupe_error" : "authorization__item"} type="email" name="emailUser" required minLength="2" maxLength="40" placeholder="Email" value={values.emailUser || ''} onChange={handleChange} />
            <span id="name-emailUser-error" className="authorization__text-error">{errors.emailUser}</span>
            <input id="name-pasword" className={errors.pasword ? "authorization__item authorization__item_tupe_error" : "authorization__item"} type="pasword" name="pasword" required minLength="2" maxLength="200" placeholder="Пароль" value={values.pasword || ''} onChange={handleChange} />
            <span id="name-pasword-error" className="authorization__text-error">{errors.pasword}</span>
          </fieldset>
        </LoginAndRegisterForm>
        <Link to="/sign-in" className="authorization__link">
          Уже зарегистрированы? Войти
        </Link>
      </section>
    </main>
  );
}

export default Register;
