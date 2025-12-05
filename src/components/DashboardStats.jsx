import React from 'react'
import { isToday, isThisWeek, isOverdue } from '../utils/dateUtils'

function DashboardStats({ tasks }) {
	const stats = {
		total: tasks.filter(t => !t.archived).length,
		completed: tasks.filter(t => t.status === 'done').length,
		pending: tasks.filter(t => t.status !== 'done' && !t.archived).length,
		today: tasks.filter(t => isToday(t.dueDate) && t.status !== 'done').length,
		thisWeek: tasks.filter(t => isThisWeek(t.dueDate) && t.status !== 'done').length,
		overdue: tasks.filter(t => isOverdue(t.dueDate, t.status)).length,
		high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
	}

	

	return (
		<div>
			{/* Overall Progress Bar */}
			<div className="overall-progress-card mb-4">
				<div className="overall-progress-title">Overall Progress</div>

				<div className="overall-progress-bar">
					<div 
						className="overall-progress-fill" 
						style={{ width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
					></div>
				</div>

				<div className="overall-progress-stats">
					<div className="overall-progress-percentage">
						{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
					</div>

					<div className="overall-progress-details">
						{stats.completed} of {stats.total} tasks completed
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="stats-container">
				<div className="stat-card stat-total">
					<div className="stat-icon">
						<i className="bi bi-list-task"></i>
					</div>

					<div className="stat-value animate-count">{stats.total}</div>
					<div className="stat-label">Total Tasks</div>
				</div>

				<div className="stat-card stat-done">
					<div className="stat-icon">
						<i className="bi bi-check-circle-fill"></i>
					</div>

					<div className="stat-value animate-count">{stats.completed}</div>
					<div className="stat-label">Completed</div>
				</div>

				<div className="stat-card stat-in-progress">
					<div className="stat-icon">
						<i className="bi bi-clock-history"></i>
					</div>

					<div className="stat-value animate-count">{stats.pending}</div>
					<div className="stat-label">Pending</div>
				</div>

				<div className="stat-card stat-todo">
					<div className="stat-icon">
						<i className="bi bi-calendar-day"></i>
					</div>

					<div className="stat-value animate-count">{stats.today}</div>
					<div className="stat-label">Due Today</div>
				</div>

				<div className="stat-card stat-total">
					<div className="stat-icon">
						<i className="bi bi-calendar-week"></i>
					</div>
					<div className="stat-value animate-count">{stats.thisWeek}</div>
					<div className="stat-label">This Week</div>
				</div>

				<div className="stat-card stat-in-progress">
					<div className="stat-icon">
						<i className="bi bi-exclamation-triangle-fill"></i>
					</div>
					<div className="stat-value animate-count">{stats.overdue}</div>
					<div className="stat-label">Overdue</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardStats
