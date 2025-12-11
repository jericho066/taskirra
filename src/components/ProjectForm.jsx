import React, { useState, useEffect } from 'react';

function ProjectForm({ show, project, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#6366f1',
        icon: 'bi-folder'
    });

    const [errors, setErrors] = useState({});

    // Predefined color options
    const colorOptions = [
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Cyan', value: '#06b6d4' },
        { name: 'Green', value: '#10b981' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Orange', value: '#f59e0b' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Gray', value: '#6b7280' }
    ];

    // Predefined icon options
    const iconOptions = [
        'bi-folder',
        'bi-briefcase',
        'bi-house',
        'bi-book',
        'bi-heart-pulse',
        'bi-palette',
        'bi-code-slash',
        'bi-camera',
        'bi-music-note',
        'bi-cart',
        'bi-person',
        'bi-people',
        'bi-lightbulb',
        'bi-star',
        'bi-rocket',
        'bi-gift'
    ];

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description || '',
                color: project.color || '#6366f1',
                icon: project.icon || 'bi-folder'
            });
        } else {
            setFormData({
                name: '',
                description: '',
                color: '#6366f1',
                icon: 'bi-folder'
            });
        }
        setErrors({});
    }, [project, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (formData.name.length > 50) {
            newErrors.name = 'Project name must be less than 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSave({
            ...formData,
            createdAt: project ? project.createdAt : new Date().toISOString()
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {project ? (
                                <>
                                    <i className="bi bi-pencil-fill"></i>
                                    Edit Project
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-folder-plus"></i>
                                    New Project
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
                            {/* Project Name */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    <i className="bi bi-card-text"></i>
                                    Project Name <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Work Projects, Home Renovation"
                                    autoFocus
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
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
                                    placeholder="Brief description of this project..."
                                ></textarea>
                            </div>

                            {/* Color Selection */}
                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="bi bi-palette-fill"></i>
                                    Project Color
                                </label>
                                
                                <div className="color-selector">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            className={`color-option ${formData.color === color.value ? 'selected' : ''}`}
                                            style={{ backgroundColor: color.value }}
                                            onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                            title={color.name}
                                        >
                                            {formData.color === color.value && (
                                                <i className="bi bi-check2"></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Icon Selection */}
                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="bi bi-emoji-smile"></i>
                                    Project Icon
                                </label>
                                
                                <div className="icon-selector">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                        >
                                            <i className={`bi ${icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mb-3">
                                <label className="form-label">Preview</label>
                                <div className="project-preview" style={{ borderColor: formData.color }}>
                                    <div 
                                        className="project-preview-icon" 
                                        style={{ backgroundColor: formData.color }}
                                    >
                                        <i className={`bi ${formData.icon}`}></i>
                                    </div>
                                    <div className="project-preview-info">
                                        <strong>{formData.name || 'Project Name'}</strong>
                                        <p className="text-muted mb-0">{formData.description || 'Project description'}</p>
                                    </div>
                                </div>
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
                                className="btn btn-primary"
                            >
                                {project ? 'Save Changes' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectForm;