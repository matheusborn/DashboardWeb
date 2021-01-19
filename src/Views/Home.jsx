import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableDash from '../Components/TableDash';
import api from '../services/api';
import { Button, Modal } from 'react-bootstrap';
import DashCard from '../Components/DashCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faTint } from '@fortawesome/free-solid-svg-icons';
import Alerts from '../Components/Alerts';
import { Chart } from 'react-google-charts';

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [showNewStationModal, setShowNewStationModal] = useState(false);
  const rainIcon = (
    <FontAwesomeIcon icon={faCloudRain} color='rgb(135, 189, 216)' />
  );
  const dropIcon = <FontAwesomeIcon icon={faTint} color='rgb(135, 189, 216)' />;
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertBodyText, setAlertBodyText] = useState('teste');
  const [showAlert, setShowAlert] = useState(false);
  const [stationCard, setStationCard] = useState({
    rain: '-',
    accMensal: '-',
    timestamp: '-',
  });
  const [showModalSelectStation, setShowModalSelectStation] = useState(false);
  const [station, setStation] = useState({
    id: '-',
    userid: '-',
    name: '',
    esn: '',
    depth: '',
  });
  const [userOptions, setUserOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);
  const [stationChanged, setStationChanged] = useState(true);
  const [showEditStationModal, setShowEditStationModal] = useState(false);
  const [userChangedEdit, setUserChangedEdit] = useState(false);
  const [stationChangedEdit, setStationChangedEdit] = useState(true);
  const [graphData, setGraphData] = useState(
    [
      { type: 'date', label: 'Tempo' },
      'Acumulado de Precipitação',
      'Média do Nível do Rio',
    ],
    [new Date(), 0, 0]
  );
  const [isMaster, setIsMaster] = useState(false);
  const [graphDataLoaded, setGraphDataLoaded] = useState(false);
  const [monthName, setMonthName] = useState('');
  const monthArray = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerClasses: 'column-title',
      editable: false,
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'esn',
      text: 'Número de série',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'data',
      text: 'Dado',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'date',
      text: 'Data',
      sort: true,
      editable: false,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
      formatter: (data) => new Date(data).toLocaleString('pt-BR'),
    },
  ];

  const columnsCerrado = [
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerClasses: 'column-title',
      editable: false,
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'esn',
      text: 'Número de série',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'data',
      text: 'Dado',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'rain',
      text: 'Precipitação',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'level',
      text: 'Nível de Água',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'date',
      text: 'Data',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
      formatter: (data) => new Date(data * 1000).toLocaleString(),
    },
  ];

  useEffect(() => {
    populateUserOptions();
    populateStationOptions();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (stationChanged) {
      setData([]);
      fetchStationData(station.id);
      if (localStorage.getItem('bla'))
        fetchCerradoTableData(station.id);
      else fetchFreeTableData();
      setStationChanged(false);
    }
    // eslint-disable-next-line
  }, [stationChanged]);

  useEffect(() => {
    if (userChangedEdit) {
      populateStationEditOptions();
      setUserChangedEdit(false);
    }
    // eslint-disable-next-line
  }, [userChangedEdit]);

  //fetch cards data {media e last rain} -> retorna dados da ultima semana
  const fetchStationData = async (stationId) => {
    await setGraphDataLoaded(false);
    if (stationId === '-') return;
    let accMensal = 0,
      accRainDay = 0,
      accNivelDay = 0,
      qntdDados = 0;
    const graphData = [
      [
        { type: 'date', label: 'Tempo' },
        'Acumulado de Precipitação',
        'Média do Nível do Rio',
      ],
    ];

    const response = api.get(`monthData/${stationId}`);
    await response
      .then(async (res) => {
        if (res.data.length === 0) {
          graphData.push([new Date(), 0, 0]);
          await setGraphData(graphData);
          await setMonthName(monthArray[new Date().getMonth()]);
          await setGraphDataLoaded(true);
          return;
        }

        let currentDay = new Date(res.data[0].date * 1000);
        setMonthName(monthArray[currentDay.getMonth()]);
        res.data.map((dado, index) => {
          // accMensal += Number(dado.rain);
          if (currentDay.getDate() === new Date(dado.date * 1000).getDate()) {
            accRainDay += dado.rain;
            accNivelDay += dado.level;
            qntdDados++;
          } else {
            accNivelDay /= qntdDados;

            const lastDate = res.data[index - qntdDados - 1];
            graphData.push([
              lastDate !== undefined
                ? new Date(lastDate.date * 1000)
                : new Date(res.data[index - qntdDados].date * 1000),
              accRainDay,
              accNivelDay,
            ]);

            currentDay.setDate(currentDay.getDate() - 1);
            accRainDay = dado.rain;
            accNivelDay = dado.level;
            qntdDados = 0;
          }

          return 0;
        });

        accNivelDay /= qntdDados + 1;

        const lastDate = res.data[res.data.length - qntdDados - 1];
        graphData.push([
          lastDate !== undefined
            ? new Date(lastDate.date * 1000)
            : new Date(res.data[res.data.length - qntdDados].date * 1000),
          accRainDay,
          accNivelDay,
        ]);
        await setGraphData(graphData);

        await setStationCard({
          level: res.data[0] === undefined ? '-' : res.data[0].level,
          accMensal: res.data[0].rain,
          timestamp: res.data[0] === undefined ? '-' : res.data[0].date,
        });

        await setTimeout(() => setGraphDataLoaded(true), 1000);
      })
      .catch((err) => console.log(err));
  };

  const populateUserOptions = () => {
    // const response = api.get('user');
    // const userOptions = [];

    // response
    //   .then((res) => {
    //     res.data.map((user, index) =>
    //       userOptions.push(
    //         <option key={index} value={user.id}>
    //           {user.user}
    //         </option>
    //       )
    //     );
    //     return res;
    //   })
    //   .then(() => setUserOptions(userOptions))
    //   .catch(async (err) => {
    //     if (err.status === 401) {
    //       history.push({
    //         pathname: '/dashboard/logout',
    //       });
    //       return;
    //     }
    //     await setAlertVariant('danger');
    //     await setAlertBodyText(`Ocorreu um erro:${'\\'}${err.data}`);
    //     await setShowAlert(true);
    //     await setTimeout(() => {
    //       setShowAlert(false);
    //     }, 5000);
    //   });
  };

  const populateStationOptions = () => {
    // const response = api.get(`userModens`);
    // const stationOptions = [];

    // response
    //   .then((res) => {
    //     res.data.map((station, index) =>
    //       stationOptions.push(
    //         <option
    //           key={index}
    //           value={station.id}
    //           userid={station.user}
    //           depth={station.depth}
    //           esn={station.esn}
    //         >
    //           {station.name}
    //         </option>
    //       )
    //     );
    //     if (res.data.length > 0) {
    //       const aux = res.data[0];
    //       setStation({
    //         id: aux.id,
    //         userid: aux.user,
    //         name: aux.name,
    //         esn: aux.esn,
    //         depth: aux.depth,
    //       });
    //     }
    //     setStationOptions(stationOptions);
    //     setStationChanged(true);
    //   })
    //   .catch((err) => console.log(err));
  };

  const populateStationEditOptions = async () => {
    const response = api.get(`modem/${station.userid}`);
    const stationEditOptions = [];
    response
      .then((res) => {
        res.data.map((station, index) =>
          stationEditOptions.push(
            <option
              key={index}
              name={station.name}
              userid={station.user}
              esn={station.esn}
              depth={station.depth}
              value={station.id}
            >
              {station.name}
            </option>
          )
        );
      })
      .then(() => setStationOptions(stationEditOptions))
      .then(() => {
        const stationDefault = stationEditOptions[0];
        if (stationDefault !== undefined) setStation(stationDefault.props);
      })
      .catch((err) => console.log(err));
  };

  const fetchFreeTableData = async () => {
    setData([]);
    let dataArray = [];
    let qntd = 35;

    while(qntd > 0){
      dataArray.push({id: qntd, esn: 'EX-1234',data: Number((Math.random()*10000).toFixed(2)).toLocaleString('pt-BR'), date: new Date().getTime() + qntd*62000})
      qntd--;
    }

    await setData(dataArray);
  };

  const fetchCerradoTableData = (stationId) => {
    if (stationId === '-') return;
    api.get(`data/${stationId}`).then(async (res) => {
      await setData(res.data);
    });

  };

  const handleChangeStation = () => {
    const stationName = stationOptions.filter(
      (st) => Number(st.props.value) === Number(station.id)
    );
    setStation({ ...station, name: stationName[0].props.children });
    setData([]);
    setStationChanged(true);
  };

  const handleSaveNewStation = () => {
    if (station.esn === '' || station.depth === '' || station.name === '') {
      alert('Modem, profundidade e nome não podem ser vazios');
      return;
    }

    const response = api.post('modem', {
      user: station.userid,
      name: station.name,
      depth: station.depth,
      esn: station.esn,
    });
    response
      .then(async (res) => {
        await setShowNewStationModal(false);
        await setAlertVariant('success');
        await setAlertBodyText('Modem criado com sucesso!');
        await setShowAlert(true);
        await setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      })
      .catch(async (err) => {
        await setShowNewStationModal(false);
        await setAlertVariant('danger');
        await setAlertBodyText(`Ocorreu um erro:${'\\'}${err.data}`);
        await setShowAlert(true);
        await setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };

  const handleStationChangedEdit = async (stationId) => {
    const station = stationOptions.filter(
      (st) => Number(st.props.value) === Number(stationId)
    );
    await setStation({
      id: station[0].props.value,
      name: station[0].props.children,
      esn: station[0].props.esn,
      depth: station[0].props.depth,
    });

    setStationChangedEdit(true);
  };

  const handleUpdateModem = () => {
    const response = api.put('modem', {
      id: station.id,
      name: station.name,
      esn: station.esn,
      depth: station.depth,
    });

    response
      .then(async (res) => {
        await setShowEditStationModal(false);
        await setAlertVariant('success');
        await setAlertBodyText('Modem atualizado com sucesso!');
        await setShowAlert(true);
        await populateStationOptions();
        await setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      })
      .catch(async (err) => {
        await setShowEditStationModal(false);
        await setAlertVariant('danger');
        await setAlertBodyText(`Ocorreu um erro:${'\\'}${err.data}`);
        await setShowAlert(true);
        await setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };

  const renderModalNewStation = () => {
    return (
      <Modal
        style={{ justifyContent: 'center' }}
        show={showNewStationModal}
        onHide={() => {
          setShowNewStationModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px' }}>Novo Modem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: '10px' }}>
            <span>Selecione o usuário: </span>
            <select
              onChange={async (e) => {
                await setStation({ ...station, userid: e.target.value });
              }}
            >
              {userOptions}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span>Nome do modem: </span>
            <input
              style={{ marginLeft: '13px' }}
              autoFocus
              name='name'
              type='text'
              placeholder='Nome do modem...'
              value={station.name}
              onChange={(e) => setStation({ ...station, name: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span>Número de série: </span>
            <input
              style={{ marginLeft: '21px' }}
              name='esn'
              type='text'
              placeholder='Número de série...'
              value={station.esn}
              onChange={(e) => setStation({ ...station, esn: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span>Profundidade: </span>
            <input
              style={{ marginLeft: '44px' }}
              min={1}
              name='depth'
              type='number'
              placeholder='Profundidade...'
              value={station.depth}
              onChange={(e) =>
                setStation({ ...station, depth: e.target.value })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowNewStationModal(false)}
            variant='outline-secondary'
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveNewStation} variant='info'>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderModalEditStation = () => {
    return (
      <Modal
        style={{ justifyContent: 'center' }}
        show={showEditStationModal}
        onHide={() => {
          setShowEditStationModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px' }}>Editar Modem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: '10px' }}>
            <span>Selecione o usuário: </span>
            <select
              style={{ marginLeft: '3px' }}
              onChange={async (e) => {
                await setStation({
                  ...station,
                  name: '',
                  depth: '',
                  esn: '',
                  userid: e.target.value,
                });
                await setUserChangedEdit(true);
              }}
            >
              {userOptions}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span>Selecione o modem: </span>
            <select
              onChange={async (e) => {
                let id = e.target.value;
                // await setStation({ ...station, id: e.target.value });
                await setStationChangedEdit(false);
                await handleStationChangedEdit(id);
              }}
            >
              {stationOptions}
            </select>
          </div>

          <hr />

          {stationChangedEdit ? (
            <React.Fragment>
              <div style={{ marginBottom: '10px' }}>
                <span>Nome do modem: </span>
                <input
                  style={{ marginLeft: '16px' }}
                  autoFocus
                  name='name'
                  type='text'
                  placeholder='Nome do modem...'
                  value={station.name}
                  onChange={(e) =>
                    setStation({ ...station, name: e.target.value })
                  }
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span>Número de série: </span>
                <input
                  style={{ marginLeft: '24px' }}
                  name='esn'
                  type='text'
                  placeholder='Número de série...'
                  value={station.esn}
                  onChange={(e) =>
                    setStation({ ...station, esn: e.target.value })
                  }
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span>Profundidade: </span>
                <input
                  style={{ marginLeft: '47px' }}
                  min={1}
                  name='depth'
                  type='number'
                  placeholder='Profundidade...'
                  value={station.depth === undefined ? 0 : station.depth}
                  onChange={(e) =>
                    setStation({ ...station, depth: e.target.value })
                  }
                />
              </div>
            </React.Fragment>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowEditStationModal(false)}
            variant='outline-secondary'
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdateModem} variant='info'>
            Atualizar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderModalSelectStation = () => {
    return (
      <Modal
        style={{ justifyContent: 'center' }}
        show={showModalSelectStation}
        onHide={() => {
          setShowModalSelectStation(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px' }}>Alterar Modem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <span>Modem: </span>
            <select
              onChange={async (e) => {
                await setStation({ ...station, id: e.target.value });
              }}
            >
              {stationOptions}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowModalSelectStation(false)}
            variant='outline-secondary'
          >
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              await setShowModalSelectStation(false);
              await handleChangeStation();
            }}
            variant='info'
          >
            Alterar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderNewModemButton = () => {
    return (
      <div
        style={{
          marginLeft: '-50px',
          marginRight: '10px',
          marginBottom: '10px',
        }}
      >
        <Button
          onClick={async () => {
            await setStation({ ...station, name: '', esn: '', depth: '' });
            setShowNewStationModal(true);
          }}
          variant='outline-info'
          style={{ width: '140px' }}
        >
          Novo Modem
        </Button>
      </div>
    );
  };

  const renderEditStationButton = () => {
    return (
      <div
        style={{
          marginLeft: '-50px',
          marginRight: '10px',
          marginBottom: '10px',
        }}
      >
        <Button
          onClick={async () => {
            await setStation({ name: '', depth: '', modem: '' });
            await populateStationOptions();
            await setShowEditStationModal(true);
          }}
          variant='outline-info'
          style={{ width: '140px' }}
        >
          Editar Modem
        </Button>
      </div>
    );
  };

  const renderStationDash = (station) => {
    return (
      <div style={styles.cardsContainer}>
        <div style={{ display: 'inline-flex' }}>
          {renderSelectStationContainer()}

          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              left: '5%',
            }}
          >
            <DashCard
              title='Acumulado Precipitação'
              value={station.accMensal}
              icon={rainIcon}
              timestamp={station.timestamp}
              unit={'mm'}
            />
            <DashCard
              title='Último Nível do Rio'
              value={station.level}
              icon={dropIcon}
              timestamp={station.timestamp}
              unit={'m'}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSelectStationContainer = () => {
    return (
      <div
        style={{
          alignSelf: 'center',
          marginRight: '73px',
          marginBottom: '10px',
        }}
      >
        <div style={{ float: 'left' }}>
          <span style={{ fontSize: '30px', float: 'left' }}>
            Estação: {station.name}
          </span>
        </div>
        <div>
          <Button
            onClick={async () => {
              await setStation({
                ...station,
                id: stationOptions[0].props.value,
              });
              setShowModalSelectStation(true);
            }}
            style={{ marginRight: '10px' }}
            variant='outline-info'
          >
            Alterar
          </Button>
          <Button
            onClick={async () => {
              await setStationCard({ ...station, rain: '-', accMensal: '-' });
              await setData([]);
              await setGraphData([]);
              fetchStationData(station.id);
              if (localStorage.getItem('bla')) {
                fetchCerradoTableData(station.id);
              } else {
                fetchFreeTableData(station.id);
              }
            }}
            variant='outline-info'
          >
            Atualizar
          </Button>
        </div>
      </div>
    );
  };

  const renderGraph = () => {
    return (
      <div style={{ margin: '50px 0px 50px 0px' }}>
        <Chart
          width={'100%'}
          height={'500'}
          chartType='Line'
          chartLanguage='pt-BR'
          loader={<div>Carregando Gráfico...</div>}
          data={graphData}
          options={{
            chart: {
              title: `Gráfico Acumulado de Precipitação e Média do Nível do Rio, do mês de ${monthName}`,
            },
            width: '100%',
            height: 500,
            series: {
              // Gives each series an axis name that matches the Y-axis below.
              0: { axis: 'rain' },
              1: { axis: 'nivel' },
            },
            axes: {
              // Adds labels to each axis; they don't have to match the axis names.
              y: {
                rain: { label: 'Acumulado Precipitação (mm)' },
                nivel: { label: 'Média do Nível do Rio(m)' },
              },
            },
          }}
          rootProps={{ 'data-testid': '4' }}
        />
      </div>
    );
  };

  return (
    <div className='container-fluid' style={{ display: 'flex' }}>
      <div
        style={{
          position: 'relative',
          left: 'calc(10%)',
          selfAlign: 'flex-right',
          width: '80%',
        }}
      >
        {showAlert && (
          <Alerts
            type='simple'
            variant={alertVariant}
            bodyText={alertBodyText}
          />
        )}

        {localStorage.getItem('bla') ? (
          <React.Fragment>
            {renderStationDash(stationCard)}
            {renderModalSelectStation()}
            {graphDataLoaded && renderGraph()}

            <TableDash
              title='Example Table'
              keyField='id'
              data={data}
              columns={columnsCerrado}
            />
          </React.Fragment>
        ) : (
          <div style={{ display: 'inline-flex' }}>
            {renderModalNewStation()}
            {renderModalEditStation()}
            <div>
              {isMaster && renderNewModemButton()}
              {isMaster && renderEditStationButton()}
            </div>
            <div></div>

            <TableDash
              title='Example Table'
              keyField='id'
              data={data}
              columns={columns}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

const styles = {
  cardsContainer: {
    position: 'relative',
    marginBottom: '5px',
  },

  header: {
    textAlign: 'center',
  },
  line: {
    borderBottom: '2px solid #449eba',
    position: 'relative',
    width: '85%',
    left: '25px',
    padding: '10px',
  },
  shadow: {
    borderBottom: '2px solid #153038',
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
