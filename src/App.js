import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // 状态管理：任务列表、输入框内容和当前选择的图片
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // 文件输入引用
  const fileInputRef = useRef(null);

  // 处理图片选择
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件类型是否为图片
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
      }
      
      // 限制文件大小（例如5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB！');
        return;
      }
      
      // 创建文件读取器来生成预览和获取base64数据
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setSelectedImage(reader.result); // base64编码的图片数据
        setImagePreview(reader.result); // 用于预览
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 清除当前选择的图片
  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 添加任务
  const addTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        image: selectedImage || null // 存储图片的base64数据
      };
      
      setTasks([...tasks, newTask]);
      setInputValue('');
      clearSelectedImage(); // 清除选择的图片
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
          
          {/* 图片上传区域 */}
          <div className="image-upload-container">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button 
              className="upload-button" 
              onClick={() => fileInputRef.current.click()}
            >
              上传图片
            </button>
            
            {/* 显示图片预览 */}
            {imagePreview && (
              <div className="image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="预览" 
                  className="image-preview"
                />
                <button 
                  className="remove-image-button" 
                  onClick={clearSelectedImage}
                >
                  移除
                </button>
              </div>
            )}
          </div>
          
          <button onClick={addTask}>添加</button>
        </div>

        {/* 任务列表 */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-message">暂无待办事项，请添加新任务</p>
          ) : (
            <ul>
              {tasks.map(task => (
                <li key={task.id} className={task.completed ? 'completed' : ''}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <div className="task-content">
                    <span>{task.text}</span>
                    {/* 显示任务的图片 */}
                    {task.image && (
                      <img 
                        src={task.image} 
                        alt="任务图片" 
                        className="task-image"
                      />
                    )}
                  </div>
                  <button onClick={() => deleteTask(task.id)}>删除</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
