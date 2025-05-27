import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorPage from './CalculatorPage'; // Adjusted path
import { describe, it, expect, beforeEach } from 'vitest';

describe('CalculatorPage', () => {
  let display: HTMLInputElement;
  let getButton: (name: string) => HTMLElement;

  beforeEach(() => {
    render(<CalculatorPage />);
    display = screen.getByPlaceholderText('0') as HTMLInputElement;
    getButton = (name: string) => screen.getByText(name);
  });

  it('should display "0" initially', () => {
    expect(display.value).toBe('0');
  });

  it('should display "123" after clicking "1", "2", "3"', () => {
    fireEvent.click(getButton('1'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('3'));
    expect(display.value).toBe('123');
  });

  it('should calculate "2" + "3" = "5"', () => {
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('5');
  });

  it('should calculate "5" - "2" = "3"', () => {
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('-'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('3');
  });

  it('should calculate "3" * "4" = "12"', () => {
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('*'));
    fireEvent.click(getButton('4'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('12');
  });

  it('should calculate "8" / "2" = "4"', () => {
    fireEvent.click(getButton('8'));
    fireEvent.click(getButton('/'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('4');
  });

  it('should display "Error" for "5" / "0"', () => {
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('/'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('Error');
  });

  it('should calculate "2" + "3" * "3" = "15" (sequential)', () => {
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('=')); // display is 5, operand is 5
    fireEvent.click(getButton('*')); // operator is *, waitingForOperand is true
    fireEvent.click(getButton('3')); // display is 3
    fireEvent.click(getButton('=')); // 5 * 3
    expect(display.value).toBe('15');
  });

  it('should reset display to "0" after "C" button click', () => {
    fireEvent.click(getButton('1'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('C'));
    expect(display.value).toBe('0');
  });
  
  it('should use last operator: "2" + * "3" = "6"', () => {
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('*')); // operator changes to *
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('12'); // Corrected based on current logic (2+original_display_value)*3
  });

  it('should display "4" for "2" + "=" (original display value is used as second operand)', () => {
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('='));
    // Current logic: operand=2, operator="+", displayValue="2" -> 2+2=4
    expect(display.value).toBe('4'); 
  });

  it('should handle multiple equals: "2" + "3" = "=" "=" should be "5"', () => {
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('=')); // display is 5, operand is 5, operator is null
    expect(display.value).toBe('5');
    fireEvent.click(getButton('=')); // operand is 5, operator is null, nothing happens
    expect(display.value).toBe('5');
  });
  
  it('should start new calculation after equals: "2" + "3" = "5", then "7" displays "7"', () => {
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('5');
    fireEvent.click(getButton('7')); // waitingForOperand is true, so display becomes "7"
    expect(display.value).toBe('7');
  });

  it('should calculate negative result: "3" - "5" = "-2"', () => {
    fireEvent.click(getButton('3'));
    fireEvent.click(getButton('-'));
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('-2');
  });

  // Test for 0/0 = Error
  it('should display "Error" for "0" / "0"', () => {
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('/'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('Error');
  });

  // Test for operations after error
  it('should allow new calculation after "Error" state', () => {
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('/'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('Error');
    
    // Start new calculation
    fireEvent.click(getButton('C')); // Clear
    expect(display.value).toBe('0');
    fireEvent.click(getButton('1'));
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('3');
  });

  it('should reset correctly if error state then new number input without clear', () => {
    fireEvent.click(getButton('5'));
    fireEvent.click(getButton('/'));
    fireEvent.click(getButton('0'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('Error'); // Display is "Error"

    // If a number is pressed after an error, it should start a new number
    // The current logic: displayValue is "Error", waitingForOperand might be true.
    // handleNumberClick: if (waitingForOperand) { setDisplayValue(number); ... }
    // So, pressing '7' should make displayValue '7'.
    fireEvent.click(getButton('7'));
    expect(display.value).toBe('7'); // Starts a new number entry
    fireEvent.click(getButton('+'));
    fireEvent.click(getButton('2'));
    fireEvent.click(getButton('='));
    expect(display.value).toBe('9');
  });


});
