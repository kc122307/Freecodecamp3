import { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [evaluated, setEvaluated] = useState(false);
  const [decimalAdded, setDecimalAdded] = useState(false);

  // Handle number clicks
  const handleNumber = (number) => {
    if (evaluated) {
      // If previous calculation was just evaluated, start fresh
      setDisplay(number);
      setFormula(number);
      setEvaluated(false);
      setDecimalAdded(false);
    } else if (display === '0' && number === '0') {
      // Prevent leading zeros (User Story #10)
      return;
    } else if (display === '0') {
      // Replace initial zero with the number
      setDisplay(number);
      setFormula(prev => {
        // If formula ends with an operator, just append the number
        if (/[+\-*/]$/.test(prev)) {
          return prev + number;
        }
        // Otherwise replace the last number in formula
        return number;
      });
    } else {
      // Append the number to display and formula
      setDisplay(prev => prev + number);
      setFormula(prev => prev + number);
    }
  };

  // Handle operator clicks
  const handleOperator = (operator) => {
    setEvaluated(false);
    setDecimalAdded(false);

    if (evaluated) {
      // If we just evaluated, continue with the result
      setFormula(display + operator);
      setDisplay(operator);
    } else if (/[+\-*/]-$/.test(formula)) {
      // If there are already two consecutive operators with the last one being negative
      // replace both with the new operator (unless new operator is minus)
      if (operator !== '-') {
        setFormula(formula.slice(0, -2) + operator);
        setDisplay(operator);
      }
    } else if (/[+*/]$/.test(formula)) {
      // If the last character is an operator (except minus)
      if (operator === '-') {
        // Allow minus after other operators for negative numbers
        setFormula(formula + operator);
        setDisplay(operator);
      } else {
        // Replace the previous operator
        setFormula(formula.slice(0, -1) + operator);
        setDisplay(operator);
      }
    } else if (formula.endsWith('-')) {
      // If the last character is minus, replace it
      setFormula(formula.slice(0, -1) + operator);
      setDisplay(operator);
    } else {
      // Normal case: append the operator
      setFormula(formula + operator);
      setDisplay(operator);
    }
  };

  // Handle decimal point clicks
  const handleDecimal = () => {
    if (evaluated) {
      // Start a new number with decimal
      setDisplay('0.');
      setFormula('0.');
      setEvaluated(false);
      setDecimalAdded(true);
    } else if (!decimalAdded) {
      // If no decimal in current number, add it
      if (/[+\-*/]$/.test(display)) {
        // If display shows an operator, start new number with decimal
        setDisplay('0.');
        setFormula(formula + '0.');
      } else {
        // Add decimal to current number
        setDisplay(display + '.');
        setFormula(formula + '.');
      }
      setDecimalAdded(true);
    }
  };

  // Handle equals click
  const handleEquals = () => {
    if (!evaluated) {
      try {
        // Clean up the formula if it ends with an operator
        let cleanFormula = formula;
        while (/[+\-*/]$/.test(cleanFormula)) {
          cleanFormula = cleanFormula.slice(0, -1);
        }
        
        // Use Function constructor to safely evaluate the expression
        // This approach allows for order of operations (formula logic)
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${cleanFormula})`)();
        
        // Format result with appropriate precision
        const formattedResult = parseFloat(result.toFixed(10)).toString();
        
        setDisplay(formattedResult);
        setFormula(cleanFormula + '=' + formattedResult);
        setEvaluated(true);
        setDecimalAdded(formattedResult.includes('.'));
      } catch (error) {
        setDisplay('Error');
        setTimeout(() => {
          handleClear();
        }, 1500);
      }
    }
  };

  // Handle clear click
  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setEvaluated(false);
    setDecimalAdded(false);
  };

  return (
    <div className="App">
      <div className="calculator">
        <div className="formula">{formula}</div>
        <div id="display" className="display">{display}</div>
        
        <div className="buttons-grid">
          <button id="clear" className="btn wide" onClick={handleClear}>AC</button>
          <button id="divide" className="btn operator" onClick={() => handleOperator('/')}>/</button>
          <button id="multiply" className="btn operator" onClick={() => handleOperator('*')}>×</button>
          
          <button id="seven" className="btn" onClick={() => handleNumber('7')}>7</button>
          <button id="eight" className="btn" onClick={() => handleNumber('8')}>8</button>
          <button id="nine" className="btn" onClick={() => handleNumber('9')}>9</button>
          <button id="subtract" className="btn operator" onClick={() => handleOperator('-')}>−</button>
          
          <button id="four" className="btn" onClick={() => handleNumber('4')}>4</button>
          <button id="five" className="btn" onClick={() => handleNumber('5')}>5</button>
          <button id="six" className="btn" onClick={() => handleNumber('6')}>6</button>
          <button id="add" className="btn operator" onClick={() => handleOperator('+')}>+</button>
          
          <button id="one" className="btn" onClick={() => handleNumber('1')}>1</button>
          <button id="two" className="btn" onClick={() => handleNumber('2')}>2</button>
          <button id="three" className="btn" onClick={() => handleNumber('3')}>3</button>
          <button id="equals" className="btn equals" onClick={handleEquals}>=</button>
          
          <button id="zero" className="btn wide" onClick={() => handleNumber('0')}>0</button>
          <button id="decimal" className="btn" onClick={handleDecimal}>.</button>
        </div>
      </div>
      <div className="footer">
        <p>JavaScript Calculator - Kunal Chandel</p>
      </div>
    </div>
  );
}

export default App;