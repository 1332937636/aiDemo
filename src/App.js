import React, { useState } from 'react';
import 'antd/dist/reset.css';
import './App.css';
import TaskTable from './TaskTable';

function App() {
  // 状态管理：任务列表和输入框内容
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // 添加任务1
  const addTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  // 删除任务
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 切换任务完成状态
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // 处理输入框变化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理回车键添加任务
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="App">
      <div className="todo-container">
        <h1>待办事项列表</h1>
        
        {/* 添加任务区域 */}
        <div className="add-task">
          <input
            type="text"
            placeholder="输入新的待办事项..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={addTask}>添加</button>
        </div>

        {/* 任务列表 */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-message">暂无待办事项，请添加新任务</p>
          ) : (
            <TaskTable
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
