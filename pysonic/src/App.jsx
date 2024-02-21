import React from 'react';
import './App.css'
// import custom component to embed in our application container
import { Grid } from './components/Grid';
import Compiler from './compiler/Compiler';

function App() {

  return (
    <>
      <img src="/PySonicLogo.png" alt="Description of the image" width="193" height="130"></img>
      <h1>Home Page for da Code Editor</h1>
      <div className="card">
          <div>
            <Grid/>
          </div>
        <div>
          <Compiler/>

        </div>
      </div>


    </>
  )
}

export default App
