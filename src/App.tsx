import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Table from './component/Table'
import {tableColumns, generateMockData} from './mock/TableMock'

function App() {
    const [leftFixedColumns, setLeftFixedColumns] = useState(2);
    const [rightFixedColumns, setRightFixedColumns] = useState(1);

  return (
    <div className="App">
      <header className="App-header">
       <div className="headerControl">
          <img src={logo} className="App-logo" alt="logo" />
          <span className="control">
          leftFixedNum: <input value={leftFixedColumns} onChange={(e)=>{setLeftFixedColumns(parseInt(e.target.value))}} />
          RightFixedNum: <input value={rightFixedColumns} onChange={(e)=>{setRightFixedColumns(parseInt(e.target.value))}} />
         </span>
       </div>
        <Table columns={tableColumns}  data={generateMockData(100)} leftFixedColumns={leftFixedColumns} rightFixedColumns={rightFixedColumns} pageSize={10}/>
      </header>
    </div>
  );
}

export default App;
