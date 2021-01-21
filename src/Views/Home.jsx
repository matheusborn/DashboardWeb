import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableDash from '../Components/TableDash';
import api from '../services/api';
import Alerts from '../Components/Alerts';
import { Chart } from 'react-google-charts';

const Home = () => {
  const [data, setData] = useState([]);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertBodyText, setAlertBodyText] = useState('teste');
  const [showAlert, setShowAlert] = useState(false);
  const [graphData, setGraphData] = useState([]);

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
      dataField: 'name',
      text: 'Name',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'data1',
      text: 'Dada1',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
    {
      dataField: 'data2',
      text: 'Data2',
      sort: true,
      headerClasses: 'column-title',
      headerStyle: {
        resize: 'horizontal',
        overflow: 'auto',
      },
    },
  
    {
      dataField: 'date',
      text: 'Date',
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
    fetchTableData();
  }, []);

  const fetchTableData = async (stationId) => {
    if (stationId === '-') return;
    await setData([]);
    let dataArray = [];
    let qntd = 35;

    while (qntd > 0) {
      dataArray.push({
        id: qntd,
        name: 'Example1',
        data1: Math.random(),
        data2: Math.random() * 10,
        date: new Date().getTime() + qntd * 62000,
      });
      qntd--;
    }

    await setData(dataArray);
    await generateGraphData(dataArray);
  };

  const generateGraphData = async (dataArray) => {
    console.log('entrou')
    const graphData = [
      [
        { type: 'date', label: 'Tempo' },
        'data1',
        'data2',
      ],
    ];
    dataArray.map((elem) =>
      graphData.push([new Date(elem.date), elem.data1, elem.data2])
    );

    console.log(graphData)
    setGraphData(graphData)
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
              title: `Double Axis Graph`,
            },
            curveType: 'function',
            width: '100%',
            height: 500,
            series: {
              // Gives each series an axis name that matches the Y-axis below.
              0: { axis: 'data1' },
              1: { axis: 'data2' },
            },
            axes: {
              // Adds labels to each axis; they don't have to match the axis names.
              y: {
                data1: { label: 'Some Label For Data1' },
                data2: { label: 'Another Label For Data2' },
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
        {renderGraph()}

        <TableDash
          title='Example Table'
          keyField='id'
          data={data}
          columns={columns}
        />
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
