import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';

//receives a type {simple, simpleLink, content }
//receives variant { variant: 'primary' || 'secundary' || 'sucess' || 'danger' || 'warning' || info || 'light' || 'dark' }
//receives a dismissable {false, xDismiss, buttonDismiss}

//if type is simple, receives {bodyText}
//if type is content, receives {headingText, bodyText, footerText (optional)}
//if type is simpleLink, receives {link: 'a tag with link'}

const Alerts = (props) => {
  const [show, setShow] = useState(true);
  const [alertClass, setAlertClass] = useState(styles.alert);

  const renderSimpleAlert = () => {
    const sentences = props.bodyText.split('\\');
    const pagragraphs = [];
    sentences.map((sentence, index) =>
      pagragraphs.push(
        <div key={index}>
          <span>{sentence}</span>
        </div>
      )
    );

    return (
      <div style={{ zIndex: 99, ...alertClass }}>
        <Alert show={props.show && show} variant={props.variant}>
          {props.body} {pagragraphs}
        </Alert>
      </div>
    );
  };

  useEffect(() => {
    const start = () => {
      setAlertClass({ ...styles.alert, ...styles.showAlert });

      const timer = setTimeout(() => {
        setAlertClass({ ...styles.alert });
        setShow(false);
        clearInterval(timer);
      }, 5000);
    };

    start();

    return;
  }, []);

  function AlertDismissible() {
    return (
      <div style={{ zIndex: 99, ...alertClass }}>
        <Alert show={props.show && show} variant='success'>
          <Alert.Heading>How's it going?!</Alert.Heading>
          <p>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
            eget lacinia odio sem nec elit. Cras mattis consectetur purus sit
            amet fermentum.
          </p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={() => setShow(false)} variant='outline-success'>
              Close me y'all!
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const renderAlert = (type) => {
    switch (type) {
      case 'simple':
        return renderSimpleAlert();
      case 'simpleLink':
        return 'not implemented';
      case 'content':
        return AlertDismissible();
      default:
        console.log('Wrong alert type');
    }
  };

  return <React.Fragment>{renderAlert(props.type)}</React.Fragment>;
};

export default Alerts;

const styles = {
  alert: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 20%)',

    opacity: 0,
    transition: 'opacity .5s ease-out',
  },

  showAlert: {
    opacity: 1,
    transition: 'opacity .5s ease-in',
  },
};
