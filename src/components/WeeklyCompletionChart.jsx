import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function WeeklyCompletionChart({ tasks }) {
    //* to get last seven days of completion data
    const getLast7DaysData = () => {
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            // Count tasks completed on this day
            const completedCount = tasks.filter(task => {
                if (task.status !== 'done') return false;
                
                const taskDate = new Date(task.updatedAt || task.createdAt);
                return taskDate >= date && taskDate < nextDay;
            }).length;
            
            // Get day name
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            last7Days.push({
                day: dayName,
                completed: completedCount,
                fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
        }
        
        return last7Days;
    };

    const weekData = getLast7DaysData();
    const totalCompleted = weekData.reduce((sum, day) => sum + day.completed, 0);
    const maxCompleted = Math.max(...weekData.map(d => d.completed), 1);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {payload[0].payload.fullDate}
                    </p>

                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {payload[0].value} {payload[0].value === 1 ? 'task' : 'tasks'} completed
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom bar colors - green for bars, lighter for low values
    const getBarColor = (value) => {
        if (value === 0) return '#e5e7eb'; // gray for zero
        if (value === maxCompleted) return '#10b981'; // success green for max
        return '#34d399'; // lighter green for others
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>
                        <h6 className="card-title mb-1">
                            <i className="bi bi-bar-chart-fill me-2"></i>
                            Weekly Completion
                        </h6>
                        <small className="text-muted">Last 7 days</small>
                    </div>

                    <div className="text-end">
                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#10b981' }}>
                            {totalCompleted}
                        </div>
                        <small className="text-muted">Total Completed</small>
                    </div>
                </div>

                {/* Chart Container */}
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart 
                        data={weekData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="var(--border-color)" 
                            vertical={false}
                        />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false}
                            tickLine={false}
                            style={{ 
                                fontSize: '0.75rem', 
                                fill: 'var(--text-secondary)',
                                fontWeight: 500
                            }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            style={{ 
                                fontSize: '0.75rem', 
                                fill: 'var(--text-secondary)' 
                            }}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
                        <Bar 
                            dataKey="completed" 
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        >
                            {weekData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.completed)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Insights */}
                {totalCompleted === 0 ? (
                    <div className="alert alert-light border mt-3 mb-0">
                        <small className="text-muted d-flex align-items-center">
                            <i className="bi bi-lightbulb me-2"></i>
                            Complete some tasks this week to see your progress!
                        </small>
                    </div>

                ) : (

                    <div className="alert alert-light border mt-3 mb-0">
                        <small className="text-muted d-flex align-items-center">
                            <i className="bi bi-trophy-fill me-2 text-warning"></i>
                            <strong className="me-1">{totalCompleted}</strong> 
                            {totalCompleted === 1 ? 'task' : 'tasks'} completed this week! Keep it up!
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeeklyCompletionChart;