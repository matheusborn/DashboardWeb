import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import '../assets/css/Login.css';
import logo from '../assets/img/logo.png';
import api from '../services/api';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Alerts from '../Components/Alerts';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { register, handleSubmit, reset, errors } = useForm();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data, e) => {
    e.target.reset();
    setShowErrorMessage(false);
    // const response = api.post('login', {
    //   user: data.usuario,
    //   password: data.senha,
    // });
    // response
    //   .then((res) => localStorage.setItem('dash-token', res.data))
    //   .then(() => localStorage.removeItem('logout'))
    //   .then(() => {
    //     if (data.usuario.toUpperCase() === 'bla'.toUpperCase()) {
    //       localStorage.setItem('bla', true);
    //     }
    //   })
    //   .then(() =>
    //     history.push({
    //       pathname: '/dashboard/',
    //     })
    //   )
    //   .catch((err) => {
    //     setErrorMessage(err.data);
    //     setShowErrorMessage(true);
    //   });

    localStorage.setItem('dash-token', 'fake token');
    localStorage.removeItem('logout');
    history.push('/dashboard/')
  };

  useEffect(() => {
    if (localStorage.getItem('logout')) {
      setShowLogoutAlert(true);
    }

    localStorage.removeItem('logout');
    const timer = setTimeout(() => {
      setShowLogoutAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderErrorMessage = () => {
    return <Alerts type='simple' variant='danger' bodyText={errorMessage} />;
  };

  const renderSignIn = () => {
    return (
      <div style={{ ...styles.loginWrapper, border: '' }}>
        <div>
          <div style={styles.logo}>
            <img src={logo} style={{borderRadius: '50%'}} width='150' height='150' alt='dash logo' />
          </div>
          <h2 style={{ margin: '0px' }}>Welcome to Dashboard Web</h2>
          <h6>Author: Matheus Barros</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.inputWrapper}>
              <input
                autoFocus
                style={styles.input}
                name='usuario'
                type='text'
                placeholder='Usuário'
                defaultValue={userName}
                ref={register({ required: 'Campo usuário está vazio. Any username will do' })}
                onChange={(e) => {
                  setShowErrorMessage(false);
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                style={styles.input}
                name='senha'
                type='password'
                placeholder='Senha'
                defaultValue={password}
                ref={register({ required: 'Campo senha está vazio. Any password will do' })}
                onChange={(e) => {
                  setShowErrorMessage(false);
                  setPassword(e.target.value);
                }}
              />
            </div>

            <Button onClick={() => reset()} type='submit' style={styles.button}>
              Entrar
            </Button>

            {(errors.usuario || errors.senha) && (
              <Alerts
                type='simple'
                variant='danger'
                bodyText={
                  errors.usuario ? errors.usuario.message : errors.senha.message
                }
              />
            )}

            {showErrorMessage && renderErrorMessage()}
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <Alerts
        show={showLogoutAlert}
        type='simple'
        variant='success'
        bodyText='Thank you for utilizing our product!\We hope to see you soon =]'
      />
      {renderSignIn()}
    </div>
  );
};

export default Login;

const styles = {
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundImage: 'linear-gradient(#9ad1d4,#fa828b)',
  },

  loginWrapper: {
    position: 'relative',
    top: 'calc(20%)',
    left: 'calc(30.65%)',
    height: '430px',
    width: '600px',
    backgroundColor: 'lavender',
    boxShadow: '0px 4px 20px 4px black',
    textAlign: 'center',
    borderRadius: '3px',
  },

  input: {
    textAlign: 'center',
    marginBottom: '5px',
    borderStyle: 'inset',
    borderWidth: 'small',
    borderColor: 'lightgray',
  },

  button: {
    marginTop: '15px',
    paddingLeft: '15px',
    backgroundColor: '#fa828b',
    color: '#e6e6fa',
    borderColor: '#e6e6fa',
  },

  logo: {
    position: 'relative',
    top: '15px',
    borderRadius: '50% !important',
    marginBottom: '20px',
    marginTop: '10px'
  },

  inputWrapper: {
    marginTop: '30px',
  },
};
