import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure you have the corresponding CSS file

function App() {
  const [taskInput, setTaskInput] = useState('');
  const [isEditTask, setIsEditTask] = useState(false);
  const [editId, setEditId] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Load todos from localStorage on component mount
    const storedTodos = JSON.parse(localStorage.getItem('todo-list'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever it changes
    localStorage.setItem('todo-list', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    const userTask = taskInput.trim();
    if (userTask) {
      if (!isEditTask) {
        const newTodo = { name: userTask, status: 'pending' };
        setTodos([...todos, newTodo]);
      } else {
        setIsEditTask(false);
        const updatedTodos = [...todos];
        updatedTodos[editId].name = userTask;
        setTodos(updatedTodos);
        setEditId(null);
      }
      setTaskInput('');
    }
  };

  const handleEditTask = (taskId, textName) => {
    setIsEditTask(true);
    setEditId(taskId);
    setTaskInput(textName);
  };

  const handleDeleteTask = (deleteId) => {
    setIsEditTask(false);
    const updatedTodos = todos.filter((todo, index) => index !== deleteId);
    setTodos(updatedTodos);
  };

  const handleUpdateStatus = (taskId, checked) => {
    const updatedTodos = [...todos];
    updatedTodos[taskId].status = checked ? 'completed' : 'pending';
    setTodos(updatedTodos);
  };

  const handleClearAll = () => {
    setIsEditTask(false);
    setTodos([]);
  };

  return (
    <div className="wrapper">
      <div className="task-input">
        <input
          type="text"
          value={taskInput}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>{isEditTask ? 'Edit Task' : 'Add Task'}</button>
      </div>
      <div className="controls">
        <div className="filters">
          <span className="active" id="all" onClick={() => showTodo('all')}>All</span>
          <span id="pending" onClick={() => showTodo('pending')}>Pending</span>
          <span id="completed" onClick={() => showTodo('completed')}>Completed</span>
        </div>
        <button className="clear-btn" onClick={handleClearAll}>Clear All</button>
      </div>
      <ul className="task-box">
        {todos.map((todo, index) => (
          <li key={index} className="task">
            <label>
              <input
                type="checkbox"
                checked={todo.status === 'completed'}
                onChange={(e) => handleUpdateStatus(index, e.target.checked)}
              />
              <p className={todo.status === 'completed' ? 'checked' : ''}>{todo.name}</p>
            </label>
            <div className="settings">
              <i onClick={() => showMenu(index)} className="uil uil-ellipsis-h"></i>
              <ul className="task-menu">
                <li onClick={() => handleEditTask(index, todo.name)}>
                  <i className="uil uil-pen"></i>Edit
                </li>
                <li onClick={() => handleDeleteTask(index)}>
                  <i className="uil uil-trash"></i>Delete
                </li>
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
