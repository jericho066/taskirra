import React from "react"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


function TaskItem({ task, onToggleComplete, onEdit, onDelete, isSelected, onSelect }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }


    const priorityColors = {
        high: 'danger',
        medium: 'warning',
        low: 'secondary'
    }

    const statusIcons = {
        todo: <i className="bi bi-circle"></i>,
        'in-progress': <i className="bi bi-arrow-repeat"></i>,
        done: <i className="bi bi-check-circle-fill"></i>
    }

    //* to check if task is overdue
    const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date()

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className={`task-item hover-lift priority-${task.priority} status-${task.status} ${isDragging ? 'dragging' : ''}`}
        >
            <div className="card-body">
                <div className="d-flex align-items-start gap-3">

                    {/* Drag Handle */}
                    <div 
                        {...attributes} 
                        {...listeners}
                        className="drag-handle d-flex align-items-center justify-content-center"
                        style={{ 
                            cursor: 'grab',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px'
                        }}
                        title="Drag to reorder"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                    >
                        <i className="bi bi-grip-vertical drag-handle text-muted"></i>
                    </div>


                    {/* Selection Checkbox */}
                    {onSelect && (
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onSelect(task.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Checkbox */}
                    <div className="form-check">
                        <input
                            className="form-check-input task-checkbox"
                            type="checkbox"
                            checked={task.status === 'done'}
                            onChange={(e) => {
                                onToggleComplete(task.id)
                                if (e.target.checked) {
                                    //* to add celebrate animation to parent
                                    const taskItem = e.target.closest('.task-item')
                                    taskItem.classList.add('celebrate')
                                    setTimeout(() => taskItem.classList.remove('celebrate'), 600)
                                }
                            }}
                            id={`task-${task.id}`}
                        />
                    </div>

                    {/* Task Content */}
                    <div className="flex-grow-1">
                        {/* Title */}
                        <h5 className={`mb-2 ${task.status === 'done' ? 'text-decoration-line-through text-muted' : ''}`}>
                            {task.title}
                        </h5>

                        {/* Description */}
                        {task.description && (
                            <p className="text-muted mb-2 small">{task.description}</p>
                        )}

                        {/* Subtask Progress */}
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <small className="text-muted">
                                        <i className="bi bi-list-check me-1"></i>
                                        Subtasks
                                    </small>

                                    <small className="text-muted">
                                        {task.subtasks.filter(s => s.done).length}/{task.subtasks.length}
                                    </small>

                                </div>

                                <div className="progress" style={{ height: '4px' }}>
                                    <div
                                        className="progress-bar bg-info"
                                        style={{
                                        width: `${(task.subtasks.filter(s => s.done).length / task.subtasks.length) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                
                            </div>
                        )}

                        {/* Meta info */}
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            {/* Priority Badge */}
                            <span className={`badge bg-${priorityColors[task.priority]}`}>
                                {task.priority}
                            </span>

                            {/* Status */}
                            <span className="badge bg-light text-dark">
                                {statusIcons[task.status]} {task.status}
                            </span>

                            {/* Due Date */}
                            {task.dueDate && (
                                <span className={`badge ${isOverdue ? 'bg-danger' : 'bg-info'}`}>
                                    <i className="bi bi-calendar3 me-1"></i> {new Date(task.dueDate).toLocaleDateString()}
                                    {isOverdue && ' (Overdue)'}
                                </span>
                            )}

                            {/* Tags */}
                            {task.tags.map(tag => (
                                <span key={tag} className="badge bg-primary">
                                    #{tag}
                                </span>
                            ))}

                            {/* Subtasks count */}
                            {task.subtasks && task.subtasks.length > 0 && (
                                <span 
                                    className="badge bg-light text-dark"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(task)
                                    }}
                                    title="Click to view subtasks"
                                >
                                    <i className="bi bi-check2 me-1"></i>
                                    {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks
                                </span>
                            )}

                            {/* Recurring Indicator */}
                            {task.recurring && (
                                <span className="badge bg-info">
                                    <i className="bi bi-arrow-repeat me-1"></i>
                                    {task.recurring.freq}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(task)}
                            title="Edit task"
                        >
                            <i className="bi bi-pencil-fill"></i>
                        </button>

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(task.id)}
                            title="Delete task"
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskItem
