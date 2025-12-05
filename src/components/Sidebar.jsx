import React from 'react'

function Sidebar({ 
	activeFilter, 
	setActiveFilter, 
	selectedPriority, 
	setSelectedPriority,
	selectedTag,
	setSelectedTag,
	taskCounts,
	allTags
}) {

	const filters = [
		{ id: 'all', label: 'All Tasks', icon: 'bi-list-task', count: taskCounts.all },
		{ id: 'today', label: 'Today', icon: 'bi-calendar-day', count: taskCounts.today },
		{ id: 'week', label: 'This Week', icon: 'bi-calendar-week', count: taskCounts.week },
		{ id: 'overdue', label: 'Overdue', icon: 'bi-exclamation-triangle-fill', count: taskCounts.overdue },
		{ id: 'important', label: 'Important', icon: 'bi-star-fill', count: taskCounts.important },
		{ id: 'completed', label: 'Completed', icon: 'bi-check-circle-fill', count: taskCounts.completed },
	]

	const priorities = [
		{ id: 'high', label: 'High Priority', color: 'danger' },
		{ id: 'medium', label: 'Medium Priority', color: 'warning' },
		{ id: 'low', label: 'Low Priority', color: 'secondary' },
	]

	return (
		<aside className="app-sidebar" role='navigation' aria-label='Task filters and categories'>
			{/* Navigation */}
			<nav className="sidebar-nav">
				{/* Filters Section */}
				<div className="sidebar-section-title">Filters</div>
				{filters.map(filter => (
					<div
						key={filter.id}
						className={`sidebar-nav-item ${activeFilter === filter.id ? 'active' : ''}`}
						onClick={() => setActiveFilter(filter.id)}
					>
						<i className={`bi ${filter.icon} sidebar-nav-icon`}></i>
						<span className="sidebar-nav-label">{filter.label}</span>
						<span className="sidebar-nav-badge">{filter.count}</span>
					</div>
				))}

				{/* Priority Filters */}
				<div className="sidebar-section-title">
					Priority
					{selectedPriority && (
						<button 
							className="btn btn-sm btn-link p-0 text-decoration-none float-end"
							style={{ fontSize: '0.7rem' }}
							onClick={() => setSelectedPriority(null)}
						>
							Clear
						</button>
					)}
				</div>
				{priorities.map(priority => (
					<div
						key={priority.id}
						className={`sidebar-nav-item ${selectedPriority === priority.id ? 'active' : ''}`}
						onClick={() => setSelectedPriority(selectedPriority === priority.id ? null : priority.id)}
					>
						<span 
							className={`badge bg-${priority.color} sidebar-nav-icon`}
							style={{ width: '8px', height: '8px', padding: 0, borderRadius: '50%' }}
						></span>
						<span className="sidebar-nav-label">{priority.label}</span>
					</div>
				))}

				{/* Tags Section */}
				<div className="sidebar-section-title">
					Tags
					{selectedTag && (
						<button 
							className="btn btn-sm btn-link p-0 text-decoration-none float-end"
							style={{ fontSize: '0.7rem' }}
							onClick={() => setSelectedTag(null)}
						>
							Clear
						</button>
					)}
				</div>
				{allTags.length > 0 ? (
					<div className="px-3">
						<div className="d-flex flex-wrap gap-2">
							{allTags.map(tag => (
								<span
									key={tag}
									className={`task-tag ${selectedTag === tag ? 'active' : ''}`}
									onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
								>
									#{tag}
								</span>
							))}
						</div>
					</div>
				) : (
					<p className="px-3 small text-muted">No tags yet</p>
				)}
			</nav>
		</aside>
	)
}

export default Sidebar