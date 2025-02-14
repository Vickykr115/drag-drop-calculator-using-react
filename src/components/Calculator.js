import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useCalculatorStore from '../store/calculatorStore';
import Button from './Button';

const Calculator = () => {
  const { input, buttons, removedButtons, setInput, updateInput, calculateResult, clearInput, moveButton, removeButton, restoreButton } = useCalculatorStore();
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  
  // History state for undo/redo functionality
  const [history, setHistory] = useState({ past: [], present: input, future: [] });

  const handleClick = (value) => {
    if (value === '=') {
      calculateResult();
    } else {
      setInput(value);
      updateHistory(value); // Update history with every input change
    }
  };

  const updateHistory = (newInput) => {
    setHistory((prevHistory) => ({
      past: [...prevHistory.past, prevHistory.present],  // Add current state to the past stack
      present: newInput,  // Set new state as the present
      future: []  // Clear the redo history when a new action is performed
    }));
  };

  const undo = () => {
    if (history.past.length > 0) {
      const previous = history.past[history.past.length - 1];
      setHistory({
        past: history.past.slice(0, -1),  // Remove last state from past stack
        present: previous,  // Set previous state as the present
        future: [history.present, ...history.future]  // Add current state to future stack
      });
      setInput(previous); // Update the input state with the undone value
    }
  };

  const redo = () => {
    if (history.future.length > 0) {
      const next = history.future[0];
      setHistory({
        past: [...history.past, history.present],  // Add current state to the past stack
        present: next,  // Set next state as the present
        future: history.future.slice(1)  // Remove the first item from future stack
      });
      setInput(next); // Update the input state with the redone value
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`flex flex-col items-center min-h-screen p-6 transition-all duration-300 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-indigo-600 to-pink-500 text-gray-700'
        }`}
      >
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 focus:outline-none"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Undo/Redo Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={undo}
            disabled={history.past.length === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg disabled:bg-gray-300 hover:bg-gray-600 transition-transform transform hover:scale-105"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={history.future.length === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg disabled:bg-gray-300 hover:bg-gray-600 transition-transform transform hover:scale-105"
          >
            Redo
          </button>
        </div>

        {/* Input field with gradient background */}
        <input
          type="text"
          value={input}
          onChange={(e) => updateInput(e.target.value)}
          className={`w-80 text-3xl p-4 border-4 rounded-lg text-right focus:outline-none focus:ring-2 transition-all duration-300 ${
            darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-700'
          }`}
        />
        
        {/* Calculator buttons */}
        <div className="grid grid-cols-4 gap-4 w-80 mb-6">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              value={btn}
              index={index}
              onClick={handleClick}
              moveButton={moveButton}
              removeButton={removeButton}
            />
          ))}
        </div>

        {/* Clear button */}
        <button
          onClick={clearInput}
          className="mt-6 px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-red-600 focus:outline-none transition-transform transform hover:scale-105"
        >
          Clear
        </button>

        {/* Removed buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {removedButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => restoreButton(btn)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              {btn.value}
            </button>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Calculator;
