import React from 'react'

function ProgressBar({ tasks, filteredTasks }) {
    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(t => t.status === 'done').length
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">
                        <i className="bi bi-bar-chart-fill me-2"></i>
                        Progress
                    </span>
                    <span className="text-muted fw-bold">{percentage}% Complete</span>
                </div>
                
                <div className="progress" style={{ height: '12px' }}>
                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ 
                            width: `${percentage}%`,
                            transition: 'width 0.5s ease'
                        }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
                
                <div className='mt-2 small text-muted'>
                    <i className="bi bi-check2-circle me-1"></i>
                    {completedTasks} of {totalTasks} tasks completed
                </div>
            </div>
        </div>
    )
}

export default ProgressBar

