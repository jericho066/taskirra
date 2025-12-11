import React, { useState } from 'react';
import ProjectForm from './ProjectForm';


function ProjectsView({ projects, tasks, onCreateProject, onUpdateProject, onDeleteProject, onViewProjectTasks }) {
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    // Calculate project statistics
    const getProjectStats = (projectId) => {
        const projectTasks = tasks.filter(task => task.projectId === projectId);
        const completed = projectTasks.filter(t => t.status === 'done').length;
        const total = projectTasks.length;
        const overdue = projectTasks.filter(t => 
            t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()
        ).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, overdue, progress };
    };

    const handleCreateProject = () => {
        setEditingProject(null);
        setShowProjectForm(true);
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setShowProjectForm(true);
    };

    const handleSaveProject = (projectData) => {
        if (editingProject) {
            onUpdateProject({ ...editingProject, ...projectData });
        } else {
            onCreateProject(projectData);
        }
        setShowProjectForm(false);
        setEditingProject(null);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Delete this project? Tasks will not be deleted, but will become unassigned.')) {
            onDeleteProject(projectId);
        }
    };

    const activeProjects = projects.filter(p => !p.archived);
    const archivedProjects = projects.filter(p => p.archived);

    // Get tasks without project
    const unassignedTasks = tasks.filter(t => !t.projectId && !t.archived);

    return (
        <div className="projects-view">
            {/* Header */}
            <div className="projects-header mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Projects</h2>
                    <p className="text-muted mb-0">
                        Organize your tasks into projects • {activeProjects.length} active
                    </p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={handleCreateProject}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    New Project
                </button>
            </div>

            {/* Unassigned Tasks Alert */}
            {unassignedTasks.length > 0 && (
                <div className="alert alert-warning border mb-4">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <span>
                            <strong>{unassignedTasks.length}</strong> tasks not assigned to any project
                        </span>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            {activeProjects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <i className="bi bi-folder-plus"></i>
                    </div>
                    <h3 className="empty-state-title">No projects yet</h3>
                    <p className="empty-state-description">
                        Create your first project to organize your tasks
                    </p>
                    <div className="empty-state-action">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleCreateProject}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Create Your First Project
                        </button>
                    </div>
                </div>
            ) : (
                <div className="projects-grid">
                    {activeProjects.map(project => {
                        const stats = getProjectStats(project.id);
                        
                        return (
                            <div 
                                key={project.id} 
                                className="project-card"
                                style={{ '--project-color': project.color }}
                            >
                                {/* Project Header */}
                                <div className="project-card-header">
                                    <div className="project-card-icon" style={{ backgroundColor: project.color }}>
                                        <i className={`bi ${project.icon || 'bi-folder'}`}></i>
                                    </div>
                                    <div className="project-card-actions">
                                        <button 
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => handleEditProject(project)}
                                            title="Edit project"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => handleDeleteProject(project.id)}
                                            title="Delete project"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="project-card-body">
                                    <h3 className="project-card-title">{project.name}</h3>
                                    {project.description && (
                                        <p className="project-card-description">{project.description}</p>
                                    )}

                                    {/* Progress Bar */}
                                    <div className="project-progress">
                                        <div className="project-progress-info">
                                            <span className="project-progress-label">Progress</span>
                                            <span className="project-progress-percentage">{stats.progress}%</span>
                                        </div>
                                        <div className="project-progress-bar">
                                            <div 
                                                className="project-progress-fill" 
                                                style={{ 
                                                    width: `${stats.progress}%`,
                                                    backgroundColor: project.color 
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="project-stats">
                                        <div className="project-stat">
                                            <i className="bi bi-list-task"></i>
                                            <span>{stats.total} tasks</span>
                                        </div>
                                        <div className="project-stat">
                                            <i className="bi bi-check-circle-fill text-success"></i>
                                            <span>{stats.completed} done</span>
                                        </div>
                                        {stats.overdue > 0 && (
                                            <div className="project-stat text-danger">
                                                <i className="bi bi-exclamation-triangle-fill"></i>
                                                <span>{stats.overdue} overdue</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Project Footer */}
                                <div className="project-card-footer">
                                    <button 
                                        className="btn btn-sm btn-outline-primary w-100"
                                        onClick={() => onViewProjectTasks(project.id)}
                                    >
                                        <i className="bi bi-eye me-1"></i>
                                        View Tasks
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Archived Projects */}
            {archivedProjects.length > 0 && (
                <div className="mt-5">
                    <h4 className="mb-3">
                        <i className="bi bi-archive me-2"></i>
                        Archived Projects ({archivedProjects.length})
                    </h4>
                    <div className="archived-projects">
                        {archivedProjects.map(project => (
                            <div key={project.id} className="archived-project-item">
                                <div className="d-flex align-items-center gap-2">
                                    <div 
                                        className="archived-project-icon" 
                                        style={{ backgroundColor: project.color }}
                                    >
                                        <i className={`bi ${project.icon || 'bi-folder'}`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <strong>{project.name}</strong>
                                        <small className="text-muted d-block">
                                            {getProjectStats(project.id).total} tasks
                                        </small>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onUpdateProject({ ...project, archived: false })}
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                        Restore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Project Form Modal */}
            <ProjectForm
                show={showProjectForm}
                project={editingProject}
                onClose={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                }}
                onSave={handleSaveProject}
            />
        </div>
    );
}

export default ProjectsView;