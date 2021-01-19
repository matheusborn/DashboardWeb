import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Home from '../Views/Home';
import AboutUs from '../Views/AboutUs';
import Login2 from '../Views/Login2';
import Login from '../Views/Login';
import { IndexLinkContainer } from 'react-router-bootstrap';
import logo from '../assets/img/logo.png';
import '../assets/css/NavbarDash.css';
import Logout from './Logout';

const NavbarDash = (props) => {
  useEffect(() => {
    localStorage.getItem('');
  }, []);

  return (
    <div>
      <div className='row'>
        <div className='col-md-12'>
          <Router>
            <Navbar
              className='navbar-dash'
              bg='light'
              variant='light'
              expand='lg'
              sticky='top'
            >
              <Navbar.Brand href='/dashboard'>
                <img
                  style={{borderRadius: '50%'}}
                  src={logo}
                  width='50'
                  height='50'
                  className='d-inline-block align-top'
                  alt='dash logo'
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav activeKey={props.activekey} className='mr-auto'>
                  <IndexLinkContainer to='/dashboard'>
                    <Nav.Link href='/'>Home</Nav.Link>
                  </IndexLinkContainer>
                  <IndexLinkContainer to='/dashboard/login2'>
                    <Nav.Link href='/login2'>Login2</Nav.Link>
                  </IndexLinkContainer>
                  <IndexLinkContainer to='/dashboard/about-us'>
                    <Nav.Link href='/about-us'>About Us</Nav.Link>
                  </IndexLinkContainer>
                  <h2 className='title'>Dashboard Web</h2>
                </Nav>
                <IndexLinkContainer to='/dashboard/logout'>
                  <Nav.Link href='/logout'>Sair</Nav.Link>
                </IndexLinkContainer>
              </Navbar.Collapse>
            </Navbar>
            <br />
            <Switch>
              <Route exact path='/dashboard'>
                <Home />
              </Route>
              <Route path='/dashboard/about-us'>
                <AboutUs />
              </Route>
              <Route path='/dashboard/login2'>
                <Login2 />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/dashboard/logout'>
                <Logout />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default NavbarDash;
