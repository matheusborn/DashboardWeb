import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../assets/css/Login.css';
import logo from '../assets/img/logo.png';
import api from '../services/api';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Alerts from '../Components/Alerts';
import DashCard from '../Components/DashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatellite, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Login.css'

const Login2 = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { register, handleSubmit, reset, errors } = useForm();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [station1, setStation1] = useState({
    rain: '-',
    accMensal: '-',
    timestamp: '-',
  });
  const [station2, setStation2] = useState({
    rain: '-',
    accMensal: '-',
    timestamp: '-',
  });
  const [station3, setStation3] = useState({
    rain: '-',
    accMensal: '-',
    timestamp: '-',
  });
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const rainIcon = (
    <FontAwesomeIcon icon={faSatellite} color='#fa828b' />
  );
  const dropIcon = <FontAwesomeIcon icon={faSatelliteDish} color='#fa828b' />;

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
    //   .then(() =>
    //     history.push({
    //       pathname: '/dashboard/',
    //     })
    //   )
    //   .catch((err) => {
    //     setErrorMessage(err.data);
    //     setShowErrorMessage(true);
    //   });

    history.push({pathname: '/dashboard'})
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

  //fetch station 1
  useEffect(() => {
    // const serialNumber = '1';
    // const response = api.get(`monthData/${serialNumber}`);
    // response.then(async (res) => {
    //   const accMensal = res.data
    //     .reduce((acc, curr) => acc + Number(curr.rain), 0)
    //     .toFixed(2);

    //   await setStation1({
    //     rain: res.data[0] === undefined ? '-' : res.data[0].rain,
    //     accMensal: accMensal,
    //     timestamp: res.data[0] === undefined ? '-' : res.data[0].date,
    //   });
    // });
    setStation1({
      rain: Number(Math.random()*100).toFixed(2), 
      accMensal: Number(Math.random()*10).toFixed(2),
      timestamp: new Date()
    })
  }, []);

  //fetch station 2
  useEffect(() => {
    // const serialNumber = '2';
    // const response = api.get(`monthData/${serialNumber}`);
    // response.then(async (res) => {
    //   const accMensal = res.data
    //     .reduce((acc, curr) => acc + Number(curr.rain), 0)
    //     .toFixed(2);

    //   await setStation2({
    //     rain: res.data[0] === undefined ? '-' : res.data[0].rain,
    //     accMensal: accMensal || '-',
    //     timestamp: res.data[0] === undefined ? '-' : res.data[0].date,
    //   });
    // });
    setStation2({
      rain: Number(Math.random()*100).toFixed(2), 
      accMensal: Number(Math.random()*10).toFixed(2),
      timestamp: new Date()
    })
  }, []);

  //fetch station 3
  useEffect(() => {
    // const serialNumber = '1';
    // const response = api.get(`monthData/${serialNumber}`);
    // response.then(async (res) => {
    //   const accMensal = res.data
    //     .reduce((acc, curr) => acc + Number(curr.rain), 0)
    //     .toFixed(2);

    //   await setStation3({
    //     rain: res.data[0] === undefined ? '-' : res.data[0].rain,
    //     accMensal: accMensal,
    //     timestamp: res.data[0] === undefined ? '-' : res.data[0].date,
    //   });
    // });
    setStation3({
      rain: Number(Math.random()*100).toFixed(2), 
      accMensal: Number(Math.random()*10).toFixed(2),
      timestamp: new Date()
    })
      
  }, []);

  const renderErrorMessage = () => {
    return <Alerts type='simple' variant='danger' bodyText={errorMessage} />;
  };

  const renderStationDash = (title, station) => {
    return (
      <div style={styles.cardsContainer}>
        <div style={styles.header}>
          <Row>
            <Col style={{ padding: '0px' }}>
              <div style={styles.line} />
              <div style={styles.shadow} />
            </Col>
            <Col style={{ padding: '0px' }}>
              <h4 className='title' style={styles.title}>
                {title}
              </h4>
            </Col>
            <Col style={{ padding: '0px' }}>
              <div style={{ ...styles.line, left: '4px' }} />
              <div style={{ ...styles.shadow, left: '4px' }} />
            </Col>
          </Row>
        </div>
        <div style={{ display: 'inline-flex' }}>
          <DashCard
            title='Some Value'
            value={station.accMensal}
            icon={rainIcon}
            timestamp={station.timestamp}
            unit=''
          />
          <DashCard
            title='Another Value'
            value={station.rain}
            icon={dropIcon}
            timestamp={station.timestamp}
            unit=''
          />
        </div>
      </div>
    );
  };

  const renderSignIn = () => {
    return (
      <div style={{ ...styles.loginWrapper }}>
        <div>
          <div style={styles.logo}>
            <img style={{borderRadius: '50%'}} src={logo} width='200' height='130' alt='dash logo' />
          </div>
          <h3 style={{ margin: '0px' }}>Welcome to Dashboard Web</h3>
          <h6>Author: Matheus Barros </h6>
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
    <Container style={styles.container} fluid>
      <Alerts
        show={showLogoutAlert}
        type='simple'
        variant='success'
        bodyText='Thank you for utilizing our platform!\We hope to see you soon =]'
      />
      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8% 0px 0px 0px',
        }}
      >
        <Col md='auto'>{renderSignIn()}</Col>
        <Col md='auto'>
          {renderStationDash('Example 1', station1)}
          {renderStationDash('Example 2', station2)}
          {renderStationDash('Example 3', station3)}
        </Col>
      </Row>
    </Container>
  );
};

export default Login2;

const styles = {
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    backgroundImage: 'linear-gradient(#9ad1d4,#fa828b)',
  },

  loginWrapper: {
    position: 'relative',
    height: '450px',
    width: '450px',
    top: '2px',

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
    paddingTop: '20px',
    position: 'relative',
    top: '15px',
    marginBottom: '40px',
  },

  inputWrapper: {
    marginTop: '30px',
  },

  cardsContainer: {
    position: 'relative',
    marginBottom: '5px',
  },

  header: {
    textAlign: 'center',
  },
  line: {
    borderBottom: '2px solid #fa828b',
    position: 'relative',
    width: '85%',
    left: '25px',
    padding: '10px',
  },
  shadow: {
    borderBottom: '2px solid black',
    position: 'relative',
    left: '25px',
    width: '85%',
  },
  title: {
    position: 'relative',
    left: '0%',
    color: '#449eba',
    textShadow: '2px 2px #153038',
    padding: '0px',
  },
};
