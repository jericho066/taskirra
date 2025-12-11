import React, { useState, useEffect } from "react"
import SubtaskList from './SubtaskList'

function TaskForm({ show, onClose, onSave, task = null, projects = [] }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
        tags: "",
        projectId: "",
        subtasks: [],
        recurring: null
    })

    const [errors, setErrors] = useState({})

    // Populate form if editing existing task
    useEffect(() => {
        if(task) {
            setFormData({
                title: task.title,
                description: task.description || "",
                dueDate: task.dueDate || "",
                priority: task.priority,
                status: task.status,
                tags: task.tags.join(", "),
                projectId: task.projectId || "" ,
                subtasks: task.subtasks || [],
                recurring: task.recurring || null               
            })
        } else {
            //* to reset form for new task
            setFormData({
                title: "",
                description: "",
                dueDate: "",
                priority: "medium",
                status: "todo",
                tags: "",
                projectId: "",
                subtasks: [],
                recurring: null
            })
        }
        setErrors({})
    }, [task, show])


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error for this field
        if(errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }


    const handleSubtasksUpdate = (updatedSubtasks) => {
        setFormData(prev => ({
            ...prev,
            subtasks: updatedSubtasks
        }))
    }


    const validate = () => {
        const newErrors = {}

        if(!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (formData.title.length > 100) {
            newErrors.title = "Title must be less than 100 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        setIsSubmitting(true)

        // Process tags
        const tagsArray = formData.tags.split(", ").map(tag => tag.trim()).filter(tag => tag !== "" )

        const taskData ={
            ...formData,
            tags: tagsArray,
            createdAt: task ? task.createdAt : new Date().toISOString()
        }

        await onSave(taskData)
        setIsSubmitting(false)
    }


    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!show) return null

    
    return (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {task ? (
                                <>
                                    <i className="bi bi-pencil-fill"></i>
                                    Edit Task
                                </>
                                ) : (
                                <>
                                    <i className="bi bi-plus-circle-fill"></i>
                                    New Task
                                </>
                            )}
                        </h5>
                        
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Title */}
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    <i className="bi bi-card-text"></i>
                                    Title <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${errors.title ? 'is-invalid shake' : ''}`}
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Prepare monthly report"
                                    autoFocus
                                />
                                {errors.title && (
                                    <div className="invalid-feedback">{errors.title}</div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    <i className="bi bi-text-paragraph"></i>
                                    Description
                                </label>

                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Add context, steps, or links..."
                                ></textarea>
                            </div>

                            {/* Due Date and Priority Row */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="dueDate" className="form-label">
                                        <i className="bi bi-calendar-event"></i>
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="priority" className="form-label">
                                        <i className="bi bi-flag-fill"></i>
                                        Priority
                                    </label>
                                    <select
                                        className="form-select"
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Status (only show when editing) */}
                            {task && (
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">
                                        <i className="bi bi-arrow-repeat"></i>
                                        Status
                                    </label>
                                    <select
                                        className="form-select"
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            )}

                            {/* Projects */}
                            {projects && projects.length > 0 && (
                                <div className="mb-3">
                                    <label htmlFor="projectId" className="form-label">
                                        <i className="bi bi-folder"></i>
                                        Project
                                    </label>
                                    <select
                                        className="form-select"
                                        id="projectId"
                                        name="projectId"
                                        value={formData.projectId || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">No Project</option>
                                        {projects
                                            .filter(p => !p.archived)
                                            .map(project => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="mb-3">
                                <label htmlFor="tags" className="form-label">
                                    <i className="bi bi-tags-fill"></i>
                                    Tags
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="work, urgent, personal (comma-separated)"
                                />

                                <small className="form-text">
                                    Separate tags with commas
                                </small>
                            </div>


                            {/* Subtasks */}
                            {task && (
                                <div className="mb-3">
                                    <SubtaskList 
                                        subtasks={formData.subtasks}
                                        onUpdate={handleSubtasksUpdate}
                                    />
                                </div>
                            )}

                            {/* Recurring Task Options */}
                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    Recurring Task
                                </label>

                                <select
                                    className="form-select"
                                    value={formData.recurring ? formData.recurring.freq : 'none'}
                                    onChange={(e) => {
                                        const freq = e.target.value
                                        if (freq === 'none') {
                                            setFormData(prev => ({ ...prev, recurring: null }))
                                        } else {
                                                setFormData(prev => ({
                                                ...prev,
                                                recurring: {
                                                    freq: freq,
                                                    interval: 1,
                                                    nextDate: formData.dueDate
                                                }
                                            }))
                                        }
                                    }}
                                >
                                    <option value="none">None</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>

                                {formData.recurring && (
                                    <small className="form-text">
                                        <i className="bi bi-info-circle me-1"></i>
                                        This task will repeat {formData.recurring.freq}
                                    </small>
                                )}
                            </div>

                        </div>

                        

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button 
                                type="submit" 
                                className={`btn btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
                                disabled={isSubmitting}
                            >
                                {task ? 'Save Changes' : 'Create Task'}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TaskForm

