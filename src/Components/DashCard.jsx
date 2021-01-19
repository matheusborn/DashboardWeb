import React from 'react';

const DashCard = (props) => {
  return (
    <React.Fragment>
      <div style={styles.container}>
        <div>
          <h7>{props.title}</h7>
          <br />
          <div
            style={{
              ...styles.body,
              color: '#003366',
              alignItems: 'center',
              marginBottom: '0px',
            }}
          >
            <div style={styles.icon}>{props.icon}</div>
            <h4>{`${
              isNaN(props.value)
                ? '-'
                : Number(props.value).toLocaleString('pt-BR') + ` ${props.unit}`
            }`}</h4>
          </div>
          <hr
            style={{
              color: 'black',
              height: 1,
              position: 'relative',
              margin: '0px',
            }}
          />
          <span style={{ fontSize: '15px', position: 'relative' }}>
            {`Atualizado em: ${
              props.timestamp === '-'
                ? ' ' + props.timestamp
                : new Date(props.timestamp).toLocaleString('pt-BR')
            }`}
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashCard;

const styles = {
  container: {
    position: 'relative',
    height: '105px',
    width: '260px',
    backgroundColor: 'lavender',
    boxShadow: '0px 2px 10px 2px black',
    textAlign: 'center',
    borderRadius: '3px',
    margin: '0px 10px 10px',
    padding: '5px',
  },
  icon: {
    fontSize: '30px',
    marginRight: '10px',
    position: 'relative',
    top: '-2px'
  },
  body: { display: 'inline-flex' },
};
