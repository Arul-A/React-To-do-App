import React, { useState, useEffect } from 'react';
import './App.css';
import { FaPlus, FaTrashAlt, FaSave } from 'react-icons/fa';
import { EditableText } from '@blueprintjs/core';
import AddItem from './AddItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Load todos from local storage when the component mounts
  useEffect(() => {
    setMsg('Fetching data...');
    const fetchData = async () => {
      try {
        const savedTodos = JSON.parse(localStorage.getItem('todos'));
        if (savedTodos && savedTodos.length > 0) {
          setTodos(savedTodos);
        } else {
          setErrMsg('No data');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving todos from localStorage', error);
        setLoading(false);
        setErrMsg('Error retrieving todos, Refresh the page!');
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 2000);

    // Clean up the timer when the component unmounts or when fetchData completes
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleAddTask = (title, task) => {
    const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
    const newTodo = { id, title, task, status: 'Not started' };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    toast.success('Item added successfully', {
      style: { backgroundColor: '#071952', color: 'white' }
    });
    setErrMsg(false)
  };

  const handleStatusChange = (id, newStatus) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
    toast.success('Status changed', {
      style: { backgroundColor: '#071952', color: 'white' }
    });
  };

  const handleDelete = (id) => {
    const deletedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(deletedTodos);
    localStorage.setItem('todos', JSON.stringify(deletedTodos));
  
    // Check if todos array is empty after deletion
    if (deletedTodos.length === 0) {
      setErrMsg('No data');
    }
  
    toast.success('Item deleted', {
      style: { backgroundColor: '#071952', color: 'white' }
    });
  };
  

  const onChangeHandler = (id, key, value) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, [key]: value } : todo
      )
    );
  };

  const saveTodo = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    toast.success('Changes saved successfully', {
      style: { backgroundColor: '#071952', color: 'white' }
    });
  };

  return (
    <div className='App'>
      <div className='navbar'>
        <h3>TODO LIST APP</h3>
      </div>
      <div className='container'>
        <div className='task-container'>
          {loading ? (
            <div className='msg'>{msg}</div>
          ) : errMsg ? (
            <div className='msg'>{errMsg}</div>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <div className='header'>
                    <EditableText
                      placeholder=''
                      onChange={(value) =>
                        onChangeHandler(todo.id, 'title', value)
                      }
                      value={todo.title}
                    />
                  </div>
                  <div
                    className='para'
                    style={{
                      textDecoration:
                        todo.status === 'Completed' ? 'line-through' : 'none'
                    }}
                  >
                    <EditableText
                      placeholder=''
                      onChange={(value) =>
                        onChangeHandler(todo.id, 'task', value)
                      }
                      value={todo.task}
                    />
                  </div>
                  <div className='icons'>
                    <select
                      value={todo.status}
                      onChange={(e) =>
                        handleStatusChange(todo.id, e.target.value)
                      }
                    >
                      <option value='Not started'>Not started</option>
                      <option value='Progressing'>Progressing</option>
                      <option value='Completed'>Completed</option>
                    </select>
                    <FaSave
                      role='button'
                      tabIndex='0'
                      onClick={saveTodo}
                    />
                    <FaTrashAlt
                      role='button'
                      tabIndex='0'
                      onClick={() => handleDelete(todo.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <ToastContainer position='top-center' autoClose={1000} />
        </div>
      </div>
      {showAdd && (
        <>
          <div className='popup-overlay'></div>
          <AddItem handleAddTask={handleAddTask} setShowAdd={setShowAdd} />
        </>
      )}
      <button className='addbtn' onClick={() => setShowAdd(!showAdd)}>
        <FaPlus />
      </button>
    </div>
  );
};

export default App;
