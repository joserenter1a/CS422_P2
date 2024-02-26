import * as React from 'react';
import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import axios from 'axios';

import 'prismjs/themes/prism.css';
const setHeight = 25;
const setWidth = 4;

const listener = (e, row, col) =>{
  const textInput = document.getElementById(`${row}-${col}`);
  textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // console.log('Enter key pressed!');
      if (row == setHeight-1) {
        // deal with enter on last line of text
        // console.log("in last row");
      }
      else {
        // move focus to next line
        const rowDownText = document.getElementById(`${row+1}-${0}`);
        //textInput.append('\n');
        console.log(textInput);
        rowDownText.focus();
      }
    }
    else if (event.key === 'F1' )
    {
      const rowDownText = document.getElementById(`${0}-${0}`);
      rowDownText.focus();
    }
  });
}


export const GridComponent = () => {
  const [code, setCode] = useState('');

  const [output, setOutput] = useState('');
  const [isLoadingCompile, setIsLoadingCompile] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('5'); // Default to Python (value 5)
  const [error, setError] = useState('');
  
  const handleRun = async () => {
    setIsLoadingCompile(true);
    setError(''); // Clear any previous errors

    const encodedParams = new URLSearchParams();
    encodedParams.set('LanguageChoice', selectedLanguage);
    encodedParams.set('Program', code);

    const options = {
      method: 'POST',
      url: 'https://code-compiler.p.rapidapi.com/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'c40e63ca05msh21cc53be5c61ed5p1be771jsnda85c9acad28',
        'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      const result = response.data.Result;
      const errorOutput = response.data.Errors;

      if (errorOutput) {
        setOutput(errorOutput + '\n' + result);
        setError(errorOutput);
      } else {
        setOutput(result);
        setError('');
      }
    } catch (error) {
      console.error(error);
      setError('Error compiling code. Please check your code and try again.');
    }

    setIsLoadingCompile(false);
  };

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    const userCode = code;
    const finalOutput = `There are errors on lines....${userCode}`

    // want to move user focus here to output so screen reader can announce errors

    setOutput(finalOutput)
    setIsLoadingSubmit(false)
  };
  // useState hook to push into an empty array
  const [array, setArray] = useState(() => {
      const emptyArray = [];
      for(let i = 0; i < setHeight; i ++)
      {
        emptyArray.push(Array(setWidth).fill(''));
      }
      return emptyArray;
    }
  );

  // event Handler for the array to set the empty array and map each (i,j) position to each corresponding cell
  const handleChange = (e, rowIndex, colIndex) => {
    const newArray = array.map((row, i) => 
    i === rowIndex ? row.map((cell, j) => (j === colIndex ? e.target.value : cell)) : row
    );
    setArray(newArray);
    setCode(newArray.map(row => row.join(' ')).join('\n'));

  }
  // returns the array maps to a div with a text input for each cell, with the key
  // being the difference of indices
  return (
    <div style={{display:'flex'}}>

    <div>

    {array.map((row, rowIndex) => (
      <div key={rowIndex}>
          <div style = {{float:'left'}}>{rowIndex + 1}</div>

        {row.map((cell, colIndex) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            id= {`${rowIndex}-${colIndex}`}
            type="text"
            value={cell}
            size = {10}
            onChange={(e) => handleChange(e, rowIndex, colIndex)}
            onFocus={(e) => listener(e, rowIndex, colIndex)}
          />
        ))}
      </div>
    ))}

  </div>
    <div
      style={{float:'right', paddingLeft: '10px'}}
      >        
        <Editor 
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, languages.python)}
          padding={10}
          readOnly
        
        />
    </div>
    
    <div
          className='output'
          style={{ display: 'flex', gap: '10px', width: '150px', height: '300px' }}
        >
        {/* Text area for code output */}
        <textarea
          className="output"
          id="output"
          name="output"
          readOnly
          value={output}
          style={{              
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            color: error ? 'red' : 'black',
            backgroundColor: error ? '#ffebeb' : 'white',
          }}
          />
      
      </div>
    <div className="language-buttons-container">
        <center>
          {/* Compilation Button */}
          <button 
            type="button" 
            className="CompileCheckButtons" 
            onClick={handleRun} 
            disabled={isLoadingCompile}>
            {isLoadingCompile ? 'Compiling...' : 'Compile'}
          </button>

          {/* Check Error Button */}
          <button 
            type="button" 
            className="CompileCheckButtons" 
            onClick={handleSubmit} 
            disabled={isLoadingSubmit}>
            {isLoadingSubmit ? 'Checking for errors...' : 'Check for errors'}
          </button>
        </center>
      </div>
      
    </div>
);
}

export default GridComponent;