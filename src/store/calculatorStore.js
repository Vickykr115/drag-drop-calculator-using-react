import { create } from 'zustand';

const useCalculatorStore = create((set) => ({
  input: '',
  buttons: ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '0', '.', '=', '/'],
  removedButtons: [],
  
  setInput: (newInput) => set((state) => ({ input: state.input + newInput })), // Append input
  updateInput: (newInput) => set({ input: newInput }), // Direct input change
  clearInput: () => set({ input: '' }),
  
  calculateResult: () =>
    set((state) => {
      try {
        return { input: eval(state.input).toString() }; // Evaluate safely
      } catch {
        return { input: 'Error' };
      }
    }),

  moveButton: (fromIndex, toIndex) =>
    set((state) => {
      const updatedButtons = [...state.buttons];
      const [movedButton] = updatedButtons.splice(fromIndex, 1);
      updatedButtons.splice(toIndex, 0, movedButton);
      return { buttons: updatedButtons };
    }),

  removeButton: (index, value) =>
    set((state) => ({
      removedButtons: [...state.removedButtons, { value, index }],
      buttons: state.buttons.filter((_, i) => i !== index),
    })),

  restoreButton: (btn) =>
    set((state) => {
      const updatedButtons = [...state.buttons];
      updatedButtons.splice(btn.index, 0, btn.value);
      return {
        buttons: updatedButtons,
        removedButtons: state.removedButtons.filter((b) => b.value !== btn.value),
      };
    }),
}));

export default useCalculatorStore;
