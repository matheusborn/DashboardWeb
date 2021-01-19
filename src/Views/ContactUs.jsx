import React from 'react';
import Alerts from '../Components/Alerts';

const ContactUs = () => {
  return (
    <div className='container'>
      <button>Teste</button>
      <div>
        <Alerts type='simple' variant='success' bodyText='Success alert' />
      </div>
    </div>
  );
};

export default ContactUs;
