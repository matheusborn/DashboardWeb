import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../assets/css/TableDash.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Card from 'react-bootstrap/Card';
import cellEditFactory from 'react-bootstrap-table2-editor';

//receives { dataField: 'qual coluna é a chave?', title: 'titulo', data: 'dados da tabela', columns: 'colunas da tabela'}

const customTotal = (from, to, size) => (
  <span className='react-bootstrap-table-pagination-total'>
    Mostrando de {from} a {to} de {size} resultados
  </span>
);

const { SearchBar } = Search;

const TableDash = (props) => {
  const [keyField, setKeyField] = useState('id');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([{ dataField: 'id' }]);
  const today = new Date();

  const defaultSorted = [
    {
      dataField: props.keyField,
      order: 'asc',
    },
  ];

  const pagination = paginationFactory({
    sizePerPageList: [
      {
        text: '10',
        value: 10,
      },
      {
        text: '25',
        value: 25,
      },
      {
        text: '50',
        value: 50,
      },
      {
        text: 'Tudo',
        value: data.length,
      },
    ],

    showTotal: true,
    paginationTotalRenderer: customTotal,
  });

  useEffect(() => {
    const update = async () => {
      await setKeyField(props.keyField);
      await setData(props.data);
      await setColumns(props.columns);
    };

    update();
  }, [props]);

  // ustom button component
  const ClearButton = (props) => {
    return (
      <Button
        style={styles.button}
        variant='outline-info'
        onClick={() => props.onClear()}
      >
        Limpar
      </Button>
    );
  };

  const ExportButton = (props) => {
    return (
      <Button
        style={styles.exportButton}
        onClick={() => props.onExport()}
        variant='info'
      >
        Exportar CSV
      </Button>
    );
  };

  return (
    <div>
      <Card style={{ borderColor: '#17a2b8' }}>
        <Card.Header as='h5'>{props.title || ''}</Card.Header>
        <Card.Body>
          <ToolkitProvider
            keyField={keyField}
            data={data}
            columns={columns}
            search={{ searchFormatted: true }}
            exportCSV={{
              fileName: `dashboard_${today.getDate()}-${
                today.getMonth() + 1
              }-${today.getFullYear()}.csv`,
            }}
          >
            {(props) => (
              <div>
                <h6 style={{ display: 'inline-flex', marginRight: '10px' }}>
                  Filtrar:
                </h6>
                <SearchBar
                  style={{ display: 'inline-flex' }}
                  placeholder={'Pesquisar'}
                  {...props.searchProps}
                />
                <ClearButton text={'Limpar'} {...props.searchProps} />
                <ExportButton {...props.csvProps}>Exportar CSV</ExportButton>
                {!localStorage.getItem('bla') ? (
                  <Button
                    onClick={() => window.location.reload()}
                    style={styles.button}
                    variant='info'
                  >
                    Atualizar
                  </Button>
                ) : null}

                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4
                  hover
                  keyField={keyField}
                  data={data}
                  columns={columns}
                  defaultSorted={defaultSorted}
                  pagination={pagination}
                  noDataIndication={() => 'Não há dados'}
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    blurToSave: true,
                  })}
                />
              </div>
            )}
          </ToolkitProvider>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TableDash;

const styles = {
  button: {
    marginLeft: '10px',
  },
  exportButton: {
    float: 'right',
  },
};
