import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

function CalendarView({ tasks, onEditTask, onToggleComplete, onDeleteTask }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('month'); // month, week, day

    //* to get tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            return isSameDay(new Date(task.dueDate), date);
        });
    };

    //*  to get tasks for selected date
    const selectedDateTasks = getTasksForDate(selectedDate);

    //* to shows task indicators on calendar dates
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateTasks = getTasksForDate(date);
            if (dateTasks.length === 0) return null;

            const highPriority = dateTasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
            const completed = dateTasks.filter(t => t.status === 'done').length;
            const total = dateTasks.length;

            return (
                <div className="calendar-task-indicators">
                    {highPriority > 0 && (
                        <span className="task-indicator task-indicator-high" title={`${highPriority} high priority`}>
                            {highPriority}
                        </span>
                    )}
                    {completed === total && total > 0 && (
                        <span className="task-indicator task-indicator-done" title="All tasks completed">
                            <i class="bi bi-check-lg"></i>
                        </span>
                    )}
                    {completed < total && (
                        <span className="task-indicator task-indicator-pending" title={`${total - completed} pending`}>
                            {total - completed}
                        </span>
                    )}
                </div>
            );
        }

        
        return null;
    };


    // Add custom class names to tiles
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateTasks = getTasksForDate(date);
            const classes = [];

            if (dateTasks.length > 0) {
                classes.push('has-tasks');
            }

            const hasOverdue = dateTasks.some(task => 
                task.status !== 'done' && new Date(task.dueDate) < new Date()
            );

            if (hasOverdue) {
                classes.push('has-overdue');
            }

            const allDone = dateTasks.length > 0 && dateTasks.every(task => task.status === 'done');

            if (allDone) {
                classes.push('all-done');
            }

            return classes.join(' ');
        }
        return null;
    };

    // Priority color mapping
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'secondary';
            default: return 'secondary';
        }
    };

    // Calculate calendar stats
    const currentMonthTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        return taskDate >= monthStart && taskDate <= monthEnd;
    });

    const monthStats = {
        total: currentMonthTasks.length,
        completed: currentMonthTasks.filter(t => t.status === 'done').length,
        pending: currentMonthTasks.filter(t => t.status !== 'done').length,
        overdue: currentMonthTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length
    };

    return (
        <div className="calendar-view">
            {/* Header */}
            <div className="calendar-header">
                
                <div className="mb-4">
                    <h2 className="fw-bold mb-2">
                        {/* <i className="bi bi-calendar3 me-2"></i> */}
                        Calendar View
                    </h2>

                    <p className="text-muted mb-0">
                        {format(selectedDate, 'MMMM yyyy')} • {monthStats.total} tasks this month
                    </p>
                </div>

                {/* Month Stats Summary */}
                <div className="calendar-stats mb-4">
                    <div className="row g-3">
                        <div className="col-6 col-md-3">
                            <div className="stat-mini">
                                <div className="stat-mini-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                    <i className="bi bi-calendar-check"></i>
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">{monthStats.total}</div>
                                    <div className="stat-mini-label">Total</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-mini">
                                <div className="stat-mini-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">{monthStats.completed}</div>
                                    <div className="stat-mini-label">Done</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-mini">
                                <div className="stat-mini-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                                    <i className="bi bi-clock-history"></i>
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">{monthStats.pending}</div>
                                    <div className="stat-mini-label">Pending</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-mini">
                                <div className="stat-mini-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                </div>
                                <div className="stat-mini-content">
                                    <div className="stat-mini-value">{monthStats.overdue}</div>
                                    <div className="stat-mini-label">Overdue</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Calendar Side */}
                <div className="col-lg-8 mb-4">
                    <div className="card">
                        <div className="card-body p-3">
                            <Calendar
                                value={selectedDate}
                                onChange={setSelectedDate}
                                tileContent={tileContent}
                                tileClassName={tileClassName}
                                className="custom-calendar"
                                locale="en-US"
                                showNeighboringMonth={true}
                            />
                        </div>
                    </div>

                    {/* Calendar Legend */}
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                <small className="text-muted fw-semibold">Legend:</small>

                                <div className="d-flex align-items-center gap-2">
                                    <span className="task-indicator task-indicator-high">3</span>
                                    <small className="text-muted">High Priority</small>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <span className="task-indicator task-indicator-pending">2</span>
                                    <small className="text-muted">Pending Tasks</small>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <span className="task-indicator task-indicator-done">
                                        <i class="bi bi-check-lg"></i>
                                    </span>
                                    <small className="text-muted">All Completed</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks for Selected Date */}
                <div className="col-lg-4">
                    <div className="card sticky-top" style={{ top: '1rem' }}>
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="bi bi-list-task me-2"></i>
                                {format(selectedDate, 'MMMM d, yyyy')}
                            </h6>
                        </div>
                        <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {selectedDateTasks.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-calendar-x" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                    <p className="text-muted mt-3 mb-0">No tasks on this date</p>
                                    <small className="text-muted">Select a date with task indicators</small>
                                </div>
                            ) : (
                                <div className="tasks-list-compact">
                                    {selectedDateTasks.map(task => (
                                        <div key={task.id} className="task-item-compact mb-2">
                                            <div className="d-flex align-items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input mt-1"
                                                    checked={task.status === 'done'}
                                                    onChange={() => onToggleComplete(task.id)}
                                                />
                                                <div className="flex-grow-1">
                                                    <div className={`task-title-compact ${task.status === 'done' ? 'text-decoration-line-through text-muted' : ''}`}>
                                                        {task.title}
                                                    </div>
                                                    {task.description && (
                                                        <small className="text-muted d-block">{task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}</small>
                                                    )}
                                                    <div className="d-flex gap-1 mt-1 flex-wrap">
                                                        <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        {task.tags.map(tag => (
                                                            <span key={tag} className="badge bg-primary">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => onEditTask(task)}
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => onDeleteTask(task.id)}
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarView;