import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function TaskStatusPieChart({ tasks }) {
    // Calculate task counts by status
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    
    const statusData = [
        { 
            name: 'To Do', 
            value: todoCount,
            color: '#6366f1',
            displayValue: todoCount
        },
        { 
            name: 'In Progress', 
            value: inProgressCount === 0 ? 0.5 : inProgressCount, // Show minimal slice if 0
            color: '#f59e0b',
            displayValue: inProgressCount,
            isEmpty: inProgressCount === 0
        },
        { 
            name: 'Done', 
            value: doneCount,
            color: '#10b981',
            displayValue: doneCount
        }
    ];

    //* To Check if there's no data
    if (statusData.length === 0) {
        return (
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title mb-3">
                        <i className="bi bi-pie-chart-fill me-2"></i>
                        Task Status Distribution
                    </h6>

                    <div className="text-center py-5">
                        <i className="bi bi-inbox" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                        <p className="text-muted mt-3 mb-0">No tasks yet</p>
                        <small className="text-muted">Create tasks to see your distribution</small>
                    </div>
                </div>
            </div>
        );
    }

    // Custom label for the pie chart
    const renderLabel = (entry) => {
        // Only show label if not empty
        return entry.isEmpty ? '' : `${entry.displayValue}`;
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    boxShadow: 'var(--shadow-lg)'
                }}>

                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {data.name}
                    </p>
                    
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {data.displayValue} tasks
                        {tasks.length > 0 && ` (${Math.round((data.displayValue / tasks.length) * 100)}%)`}
                        {data.isEmpty && ' - Empty'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title mb-3">
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Task Status Distribution
                </h6>

                {/* Chart Container */}
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderLabel}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                            wrapperStyle={{
                                paddingTop: '1rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Summary Stats */}
                <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-around text-center">
                        <div>
                            <div className="fw-bold" style={{ color: '#6366f1', fontSize: '1.25rem' }}>
                                {todoCount}
                            </div>
                            <small className="text-muted">To Do</small>
                        </div>

                        <div style={{ opacity: inProgressCount === 0 ? 0.5 : 1 }}>
                            <div className="fw-bold" style={{ color: '#f59e0b', fontSize: '1.25rem' }}>
                                {inProgressCount}
                            </div>
                            <small className="text-muted">In Progress</small>
                        </div>

                        <div>
                            <div className="fw-bold" style={{ color: '#10b981', fontSize: '1.25rem' }}>
                                {doneCount}
                            </div>
                            <small className="text-muted">Done</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskStatusPieChart;