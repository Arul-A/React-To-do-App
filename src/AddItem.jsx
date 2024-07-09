import React, { useRef, useState } from 'react';
import './AddItem.css';

const AddItem = ({ handleAddTask, setShowAdd }) => {
  const [title, setTitle] = useState('');
  const [task, setTask] = useState('');
  const inputRef = useRef()

  const onSubmit = (e) => {
    e.preventDefault();
    handleAddTask(title, task);
    setTitle('');
    setTask('');
  };

  const handleCancel = () => {
    setShowAdd(false);
  };

  return (
    <div className='add'>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          autoFocus
          type='text'
          ref={inputRef}
          name='title'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="task">Task</label>
        <input
          type='text'
          name='task'
          placeholder='Task'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <div className='btns'>
          <button type='submit' onClick={() => inputRef.current.focus()}>Add</button>
          <button type='button' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
