import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CalculatorPage: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [operand, setOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const handleNumberClick = (number: string) => {
    if (waitingForOperand) {
      setDisplayValue(number);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? number : displayValue + number);
    }
  };

  const performCalculation = (op1: number, op2: number, op: string): number | string => {
    switch (op) {
      case '+':
        return op1 + op2;
      case '-':
        return op1 - op2;
      case '*':
        return op1 * op2;
      case '/':
        if (op2 === 0) {
          return "Error";
        }
        return op1 / op2;
      default:
        return op2; // Should not happen
    }
  };

  const handleOperatorClick = (op: string) => {
    const currentValue = parseFloat(displayValue);

    if (operand === null) {
      setOperand(currentValue);
    } else if (operator) {
      const result = performCalculation(operand, currentValue, operator);
      if (result === "Error") {
        setDisplayValue("Error");
        setOperand(null); // Reset operand after error
      } else {
        const numericResult = Number(result);
        setDisplayValue(numericResult.toString());
        setOperand(numericResult);
      }
    }
    setOperator(op);
    setWaitingForOperand(true);
  };

  const handleEqualsClick = () => {
    if (operand !== null && operator !== null) {
      const currentValue = parseFloat(displayValue);
      const result = performCalculation(operand, currentValue, operator);

      if (result === "Error" || isNaN(Number(result)) || !isFinite(Number(result))) {
        setDisplayValue("Error");
        setOperand(null);
      } else {
        const numericResult = Number(result);
        setDisplayValue(numericResult.toString());
        setOperand(numericResult); // Result becomes the new operand for potential chained operations
      }
      // For new calculation after equals, operator is reset, waitingForOperand allows new number input.
      // If an operator is clicked next, handleOperatorClick will use the current operand (result).
      // If a number is clicked, handleNumberClick will overwrite displayValue.
      setOperator(null); 
      setWaitingForOperand(true);
    }
  };

  const handleClearClick = () => {
    setDisplayValue("0");
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xs">
        <Input
          type="text"
          className="mb-4 text-right text-2xl font-mono py-2 px-3"
          placeholder="0"
          readOnly
          value={displayValue}
        />
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1: 7, 8, 9, / */}
          <Button className="text-xl py-3" onClick={() => handleNumberClick("7")}>7</Button>
          <Button className="text-xl py-3" onClick={() => handleNumberClick("8")}>8</Button>
          <Button className="text-xl py-3" onClick={() => handleNumberClick("9")}>9</Button>
          <Button className="text-xl py-3 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleOperatorClick("/")}>/</Button>

          {/* Row 2: 4, 5, 6, * */}
          <Button className="text-xl py-3" onClick={() => handleNumberClick("4")}>4</Button>
          <Button className="text-xl py-3" onClick={() => handleNumberClick("5")}>5</Button>
          <Button className="text-xl py-3" onClick={() => handleNumberClick("6")}>6</Button>
          <Button className="text-xl py-3 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleOperatorClick("*")}>*</Button>

          {/* Row 3: 1, 2, 3, - */}
          <Button className="text-xl py-3" onClick={() => handleNumberClick("1")}>1</Button>
          <Button className="text-xl py-3" onClick={() => handleNumberClick("2")}>2</Button>
          <Button className="text-xl py-3" onClick={() => handleNumberClick("3")}>3</Button>
          <Button className="text-xl py-3 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleOperatorClick("-")}>-</Button>

          {/* Row 4: 0, C, =, + */}
          <Button className="col-span-1 text-xl py-3" onClick={() => handleNumberClick("0")}>0</Button>
          <Button className="text-xl py-3 bg-gray-300 hover:bg-gray-400" onClick={handleClearClick}>C</Button>
          <Button className="text-xl py-3 bg-green-500 hover:bg-green-600 text-white" onClick={handleEqualsClick}>=</Button>
          <Button className="text-xl py-3 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleOperatorClick("+")}>+</Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
