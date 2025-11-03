import React, { useState, useCallback, useMemo } from 'react';
import './App.css';

function App() {
  // 状态管理：任务列表和输入框内容
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [importance, setImportance] = useState('medium');
  const [timeConsumption, setTimeConsumption] = useState('medium');
  const [dependency, setDependency] = useState('');

  // 计算优先级分数
  const calculatePriorityScore = useCallback((task) => {
    // 1. 紧急度：截止时间远近（按小时计算）
    let urgency = 0;
    if (task.deadline) {
      const now = new Date();
      const deadlineDate = new Date(task.deadline);
      const hoursDiff = (deadlineDate - now) / (1000 * 60 * 60);
      
      if (hoursDiff <= 0) {
        urgency = 1; // 已过期
      } else if (hoursDiff <= 24) {
        urgency = 0.8; // 24小时内
      } else if (hoursDiff <= 72) {
        urgency = 0.6; // 3天内
      } else if (hoursDiff <= 168) {
        urgency = 0.4; // 7天内
      } else {
        urgency = 0.2; // 超过7天
      }
    }
    
    // 2. 重要度：用户手动标记（高/中/低）
    let importanceValue = 0;
    switch (task.importance) {
      case 'high':
        importanceValue = 1;
        break;
      case 'medium':
        importanceValue = 0.6;
        break;
      case 'low':
        importanceValue = 0.3;
        break;
      default:
        importanceValue = 0.6;
    }
    
    // 3. 耗时系数：预计耗时（短:1, 中:0.7, 长:0.4）
    let timeValue = 0;
    switch (task.timeConsumption) {
      case 'short':
        timeValue = 1;
        break;
      case 'medium':
        timeValue = 0.7;
        break;
      case 'long':
        timeValue = 0.4;
        break;
      default:
        timeValue = 0.7;
    }
    
    // 4. 依赖关系：如果依赖的任务未完成，则加1
    let dependencyValue = 0;
    if (task.dependency) {
      const dependentTask = tasks.find(t => t.id === parseInt(task.dependency));
      if (dependentTask && !dependentTask.completed) {
        dependencyValue = 1;
      }
    }
    
    // 计算优先级分数
    const priorityScore = urgency * 0.4 + importanceValue * 0.3 + timeValue * 0.2 + dependencyValue * 0.1;
    return priorityScore;
  }, [tasks]);
  // 添加任务
  const addTask = useCallback(() => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        deadline: deadline,
        importance: importance,
        timeConsumption: timeConsumption,
        dependency: dependency
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      setDeadline('');
      setImportance('medium');
      setTimeConsumption('medium');
      setDependency('');
    }
  }, [inputValue, deadline, importance, timeConsumption, dependency, tasks]);
  // 删除任务
  const deleteTask = useCallback((id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }, [tasks]);

  // 切换任务完成状态
  const toggleComplete = useCallback((id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, [tasks]);

  // 处理输入框变化
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  // 处理回车键添加任务
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  }, [addTask]);

  // 按优先级排序任务
  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => {
    return calculatePriorityScore(b) - calculatePriorityScore(a);
  }), [tasks, calculatePriorityScore]);

  // 获取优先级等级
  const getPriorityLevel = (score) => {
    if (score >= 0.8) {
      return '高';
    } else if (score >= 0.5) {
      return '中';
    } else {
      return '低';
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
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="截止时间"
          />
          <select
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
          >
            <option value="high">高重要度</option>
            <option value="medium">中重要度</option>
            <option value="low">低重要度</option>
          </select>
          <select
            value={timeConsumption}
            onChange={(e) => setTimeConsumption(e.target.value)}
          >
            <option value="short">短耗时</option>
            <option value="medium">中耗时</option>
            <option value="long">长耗时</option>
          </select>
          <select
            value={dependency}
            onChange={(e) => setDependency(e.target.value)}
          >
            <option value="">无依赖</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.text}
              </option>
            ))}
          </select>
          <button onClick={addTask}>添加</button>
        </div>

        {/* 任务列表 */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-message">暂无待办事项，请添加新任务</p>
          ) : (
            <ul>
              {sortedTasks.map(task => {
                const priorityScore = calculatePriorityScore(task);
                const priorityLevel = getPriorityLevel(priorityScore);
                return (
                  <li key={task.id} className={task.completed ? 'completed' : ''}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                    />
                    <span>{task.text}</span>
                    <span className={`priority priority-${priorityLevel.toLowerCase()}`}>
                      优先级: {priorityLevel} ({priorityScore.toFixed(2)})
                    </span>
                    <button onClick={() => deleteTask(task.id)}>删除</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
