import { useDrag, useDrop } from 'react-dnd';

const Button = ({ value, onClick, index, moveButton, removeButton }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BUTTON',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'BUTTON',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveButton(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className={`relative p-4 w-20 h-20 flex justify-center items-center bg-blue-400 text-white text-xl font-bold rounded-lg shadow-lg cursor-move transition-all duration-300 transform hover:scale-110 ${isDragging ? 'opacity-50' : ''}`}>
      <button onClick={() => onClick(value)} className="w-full h-full text-white hover:text-gray-800 bg-blue-500 hover:bg-blue-700 rounded-lg focus:outline-none transition-all duration-300">
        {value}
      </button>
      <button onClick={() => removeButton(index, value)} className="absolute top-1 right-1 text-red-500 text-sm font-bold">✖</button>
    </div>
  );
};

export default Button;