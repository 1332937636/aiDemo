import React from 'react';
import { Table, Checkbox, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const TaskTable = ({ tasks, onToggleComplete, onDeleteTask }) => {
  // 定义表格列
  const columns = [
    {
      title: '完成状态',
      dataIndex: 'completed',
      key: 'completed',
      width: 100,
      render: (completed, record) => (
        <Checkbox
          checked={completed}
          onChange={() => onToggleComplete(record.id)}
        />
      )
    },
    {
      title: '任务内容',
      dataIndex: 'text',
      key: 'text',
      render: (text, record) => (
        <span className={record.completed ? 'completed-task' : ''}>
          {text}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDeleteTask(record.id)}
        >
          删除
        </Button>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="id"
      pagination={false}
      bordered
      size="middle"
    />
  );
};

export default TaskTable;