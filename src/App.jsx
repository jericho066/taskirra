import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import TaskList from './components/TaskList/TaskList';
import TaskForm from './components/TaskForm.jsx';
import useLocalStorage from './hooks/useLocalStorage';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { sampleTasks, sampleProjects,defaultSettings,} from './utils/sampleData';
import { isToday, isThisWeek, isOverdue } from './utils/dateUtils';
import ProgressBar from './components/ProgressBar';
import DashboardStats from './components/DashboardStats';
import TaskStatusPieChart from './components/TaskStatusPieChart';
import WeeklyCompletionChart from './components/WeeklyCompletionChart';
import Toast from './components/Toast';
import { createRecurringTask, shouldGenerateNext,} from './utils/recurringTasks';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import CalendarView from './components/CalendarView.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import ProjectsView from './components/ProjectsView.jsx';


function App() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		// Check localStorage or system preference
		const saved = localStorage.getItem('taskirra-theme');
		if (saved) return saved === 'dark';
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});
	const [tasks, setTasks] = useLocalStorage('taskirra:tasks', []);
	const [projects, setProjects] = useLocalStorage('taskirra:projects', []);
	const [settings, setSettings] = useLocalStorage('taskirra:settings', []);
	const [showTaskForm, setShowTaskForm] = useState(false);
	const [editingTask, setEditingTask] = useState(null);
	const [activeFilter, setActiveFilter] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPriority, setSelectedPriority] = useState(null);
	const [selectedTag, setSelectedTag] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);

	const [toast, setToast] = useState({
		show: false,
		message: '',
		type: 'info',
		onUndo: null,
	});
	const [lastCompletedTask, setLastCompletedTask] = useState(null);

	const [selectedTasks, setSelectedTasks] = useState([]);
	// const [showBulkActions, setShowBulkActions] = useState(false);
	const [showShortcutsModal, setShowShortcutsModal] = useState(false);

	const [activeTab, setActiveTab] = useState(() => {
		return localStorage.getItem('taskirra-active-tab') || 'tasks';
	});


	// Save active tab to localStorage
	useEffect(() => {
		localStorage.setItem('taskirra-active-tab', activeTab);
	}, [activeTab]);

	// Apply theme to body
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.setAttribute('data-bs-theme', 'dark');
			document.body.classList.add('dark-mode');
		} else {
			document.documentElement.setAttribute('data-bs-theme', 'light');
			document.body.classList.remove('dark-mode');
		}

		localStorage.setItem('taskirra-theme', isDarkMode ? 'dark' : 'light');
	}, [isDarkMode]);

	// Generate recurring tasks when a recurring task is completed
	useEffect(() => {
		let hasNewTasks = false;
		const newTasks = [];

		tasks.forEach((task) => {
			if (shouldGenerateNext(task)) {
				const nextTask = createRecurringTask(task);
				if (nextTask) {
					// Check if next occurrence doesn't already exist
					const exists = tasks.some(
						(t) =>
							t.title === nextTask.title &&
							t.dueDate === nextTask.dueDate &&
							t.status === 'todo'
					);

					if (!exists) {
						newTasks.push(nextTask);
						hasNewTasks = true;
					}
				}
			}
		});

		if (hasNewTasks) {
			setTasks((prevTasks) => [...prevTasks, ...newTasks]);
			showToast(`${newTasks.length} recurring task(s) created`, 'info');
		}
	}, [tasks.filter((t) => t.status === 'done').length]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev);
	};

	//* to load demo data functions
	const loadDemoData = () => {
		setTasks(sampleTasks);
		setProjects(sampleProjects);
		setSettings(defaultSettings);
		showToast('Demo data loaded successfully', 'success');
	};

	// Filter and search logic
	const getFilteredTasks = () => {
		let filtered = [...tasks];

		// Apply date filter
		switch (activeFilter) {
			case 'today':
				filtered = filtered.filter((task) => isToday(task.dueDate));
				break;
			case 'week':
				filtered = filtered.filter((task) => isThisWeek(task.dueDate));
				break;
			case 'overdue':
				filtered = filtered.filter((task) =>
					isOverdue(task.dueDate, task.status)
				);
				break;
			case 'important':
				filtered = filtered.filter((task) => task.priority === 'high');
				break;
			case 'completed':
				filtered = filtered.filter((task) => task.status === 'done');
				break;
			case 'all':
			default:
				// Show all non-archived tasks
				filtered = filtered.filter((task) => !task.archived);
		}

		// Apply priority filter
		if (selectedPriority) {
			filtered = filtered.filter((task) => task.priority === selectedPriority);
		}

		// Apply tag filter
		if (selectedTag) {
			filtered = filtered.filter((task) => task.tags.includes(selectedTag));
		}

		// Apply search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(task) =>
					task.title.toLowerCase().includes(query) ||
					(task.description &&
						task.description.toLowerCase().includes(query)) ||
					task.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Apply project filter
		if (selectedProject) {
			filtered = filtered.filter((task) => task.projectId === selectedProject);
		}

		return filtered;
	};

	const filteredTasks = getFilteredTasks();

	// Get all unique tags from tasks
	const allTags = [...new Set(tasks.flatMap((task) => task.tags))];

	// Count tasks for each filter
	const taskCounts = {
		all: tasks.filter((t) => !t.archived).length,
		today: tasks.filter((task) => isToday(task.dueDate)).length,
		week: tasks.filter((task) => isThisWeek(task.dueDate)).length,
		overdue: tasks.filter((task) => isOverdue(task.dueDate, task.status))
			.length,
		important: tasks.filter((task) => task.priority === 'high').length,
		completed: tasks.filter((task) => task.status === 'done').length,
	};

	const showToast = (message, type = 'info', onUndo = null) => {
		setToast({
			show: true,
			message,
			type,
			onUndo,
		});
	};

	const closeToast = () => {
		setToast({
			show: false,
			message: '',
			type: 'info',
			onUndo: null,
		});
	};

	const handleToggleComplete = (taskId) => {
		const task = tasks.find((t) => t.id === taskId);
		const newStatus = task.status === 'done' ? 'todo' : 'done';

		setTasks((prevTasks) =>
			prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
		);

		if (newStatus === 'done') {
			setLastCompletedTask({ ...task });

			showToast('Task completed!', 'success', () => {
				setTasks((prevTasks) =>
					prevTasks.map((t) => (t.id === taskId ? { ...t, status: 'todo' } : t))
				);

				setLastCompletedTask(null);
				closeToast();
				showToast('Task marked as incomplete', 'info');
			});
		} else {
			showToast('Task marked as incomplete', 'info');
		}
	};

	const handleEdit = (task) => {
		setEditingTask(task);
		setShowTaskForm(true);
	};

	const handleSaveTask = (taskData) => {
		if (editingTask) {
			//* to update existing task
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === editingTask.id ? { ...task, ...taskData } : task
				)
			);
			showToast('Task updated successfully', 'success');
		} else {
			// Create new task
			const newTask = {
				id: Date.now().toString(),
				...taskData,
				order: tasks.length + 1,
				subtasks: [],
				archived: false,
			};
			setTasks((prevTasks) => [...prevTasks, newTask]);
			showToast('Task created successfully', 'success');
		}

		setShowTaskForm(false);
		setEditingTask(null);
	};

	const handleCloseForm = () => {
		setShowTaskForm(false);
		setEditingTask(null);
	};

	const handleNewTask = () => {
		setEditingTask(null);
		setShowTaskForm(true);
	};

	const handleDelete = (taskId) => {
		const taskToDelete = tasks.find((t) => t.id === taskId);

		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

		showToast('Task deleted', 'danger', () => {
			// Undo delete - use taskToDelete directly instead of stale lastDeletedTask state
			setTasks((prevTasks) =>
				[...prevTasks, taskToDelete].sort((a, b) => a.order - b.order)
			);
			closeToast();
			showToast('Task restored', 'success');
		});
	};

	const handleSelectTask = (taskId) => {
		setSelectedTasks((prev) => {
			if (prev.includes(taskId)) {
				return prev.filter((id) => id !== taskId);
			} else {
				return [...prev, taskId];
			}
		});
	};

	const handleSelectAll = () => {
		if (selectedTasks.length === filteredTasks.length) {
			setSelectedTasks([]);
		} else {
			setSelectedTasks(filteredTasks.map((t) => t.id));
		}
	};

	const handleBulkComplete = () => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.includes(task.id) ? { ...task, status: 'done' } : task
			)
		);

		showToast(`${selectedTasks.length} tasks marked as complete`, 'success');
		setSelectedTasks([]);
	};

	const handleBulkDelete = () => {
		if (
			window.confirm(
				`Delete ${selectedTasks.length} tasks? This action can be undone.`
			)
		) {
			const deletedTasks = tasks.filter((t) => selectedTasks.includes(t.id));
			setTasks((prevTasks) =>
				prevTasks.filter((task) => !selectedTasks.includes(task.id))
			);

			showToast(`${selectedTasks.length} tasks deleted`, 'danger', () => {
				setTasks((prevTasks) =>
					[...prevTasks, ...deletedTasks].sort((a, b) => a.order - b.order)
				);

				closeToast();
				showToast('Tasks restored', 'success');
			});

			setSelectedTasks([]);
		}
	};

	const handleReorder = (reorderedTasks) => {
		// Update order property for each task
		const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
			...task,
			order: index + 1,
		}));

		setTasks(tasksWithNewOrder);
		showToast('Tasks reordered', 'info');
	};

	const handleExportData = () => {
		const data = {
			tasks: tasks,
			projects: projects || [],
			settings: settings || {},
			exportDate: new Date().toISOString(),
		};

		const dataStr = JSON.stringify(data, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);

		const link = document.createElement('a');
		link.href = url;
		link.download = `taskirra-backup-${
			new Date().toISOString().split('T')[0]
		}.json`;
		link.click();

		URL.revokeObjectURL(url);
		showToast('Data exported successfully', 'success');
	};

	const handleImportData = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target.result);

				if (data.tasks) {
					setTasks(data.tasks);
				}

				if (data.projects && setProjects) {
					setProjects(data.projects);
				}

				if (data.settings && setSettings) {
					setSettings(data.settings);
				}

				showToast('Data imported successfully', 'success');
			} catch {
				showToast('Failed to import data. Invalid file format.', 'danger');
			}
		};
		reader.readAsText(file);
	};

	const handleResetData = () => {
		if (
			window.confirm(
				'Are you sure you want to delete all data? This cannot be undone.'
			)
		) {
			setTasks([]);
			setSelectedTasks([]);
			setActiveFilter('all');
			setSearchQuery('');
			setSelectedPriority(null);
			setSelectedTag(null);
			showToast('All data has been reset', 'warning');
		}
	};

	const handleShowShortcuts = () => {
		setShowShortcutsModal(true);
	};


	const handleCreateProject = (projectData) => {
		const newProject = {
			id: `proj-${Date.now()}`,
			...projectData,
			archived: false,
			createdAt: new Date().toISOString()
		};
		
		setProjects((prevProjects) => [...prevProjects, newProject]);
		showToast('Project created successfully', 'success');
	};

	const handleUpdateProject = (projectData) => {
		setProjects((prevProjects) =>
			prevProjects.map((project) =>
				project.id === projectData.id ? { ...project, ...projectData } : project
			)
		);
		showToast('Project updated successfully', 'success');
	};

	const handleDeleteProject = (projectId) => {
		// Remove project but keep tasks (they become unassigned)
		setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
		
		//* to remove projectId from tasks
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.projectId === projectId ? { ...task, projectId: null } : task
			)
		);
		
		showToast('Project deleted', 'danger');
	};



	// Keyboard shortcuts hook call
	useKeyboardShortcuts([
		{
			key: 'n',
			ctrl: true,
			callback: handleNewTask,
		},
		{
			key: 'k',
			ctrl: true,
			callback: () => {
				document.querySelector('input[type="text"]')?.focus();
			},
		},
		{
			key: '/',
			callback: () => {
				document.querySelector('input[placeholder*="Search"]')?.focus();
			},
		},
		{
			key: 'Escape',
			callback: () => {
				if (showTaskForm) {
					handleCloseForm();
				}
				setSelectedTasks([]);
			},
		},
	]);



	return (
		<div className="d-flex flex-column min-vh-100">
			{/* Skip to main content for screen readers */}
			{/* <a href="#main-content" className="skip-to-main">
				Skip to main content
			</a> */}

			{/* Header */}
			<Header
				toggleTheme={toggleTheme}
				isDarkMode={isDarkMode}
				// onNewTask={handleNewTask}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onExport={handleExportData}
				onImport={handleImportData}
				onReset={handleResetData}
				onShowShortcuts={handleShowShortcuts}
			/>

			{/* Main Layout */}
			<div className="d-flex flex-grow-1">
				{/* Sidebar */}
				<Sidebar
					activeFilter={activeFilter}
					setActiveFilter={setActiveFilter}
					selectedPriority={selectedPriority}
					setSelectedPriority={setSelectedPriority}
					selectedTag={selectedTag}
					setSelectedTag={setSelectedTag}
					taskCounts={taskCounts}
					allTags={allTags}
					projects={projects}
					tasks={tasks}
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject} 
				/>

				{/* Main Content */}
				<main className="flex-grow-1 p-4" id="main-content" role="main">
					<div className="container-fluid">
						{/* Tab Navigation */}
						<div className="tab-navigation">
							
							{/* Tasks Tab */}
							<button
								className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
								onClick={() => setActiveTab('tasks')}
							>
								<i className="bi bi-list-task"></i>
								<span>Tasks</span>
							</button>

							<button
								className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
								onClick={() => setActiveTab('projects')}
							>
								<i className="bi bi-folder"></i>
								<span>Projects</span>
							</button>

							{/* Calendar Tab */}
							<button
								className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
								onClick={() => setActiveTab('calendar')}
							>
								<i className="bi bi-calendar3"></i>
								<span>Calendar</span>
							</button>

							
							{/* Dashboard Tab */}
							<button
								className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
								onClick={() => setActiveTab('dashboard')}
							>
								<i className="bi bi-bar-chart-fill"></i>
								<span>Dashboard</span>
							</button>

							

							<button
								className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
								onClick={() => setActiveTab('analytics')}
							>
								<i className="bi bi-graph-up-arrow"></i>
								<span>Analytics</span>
							</button>


						</div>


						{/* Tab Content */}
						{activeTab === 'tasks' ? (
							<div className="tab-content">
								
								<div className='taskHeader'>
									{/* Page Title */}
									<div className="mb-4">
										<h2 className="fw-bold mb-2">
											{activeFilter === 'all' && 'All Tasks'}
											{activeFilter === 'today' && "Today's Tasks"}
											{activeFilter === 'week' && 'This Week'}
											{activeFilter === 'overdue' && 'Overdue Tasks'}
											{activeFilter === 'important' && 'Important Tasks'}
											{activeFilter === 'completed' && 'Completed Tasks'}
										</h2>

										<p className="text-muted mb-0">
											{filteredTasks.length}{' '}
											{filteredTasks.length === 1 ? 'task' : 'tasks'}
											{searchQuery && ` matching "${searchQuery}"`}
										</p>
					
									</div>


									<div className='taskHeader-actions' style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
										{/* Search - desktop */}
										<div className="header-search position-relative d-none d-md-block">
											<i className="bi bi-search header-search-icon"></i>
											<input
												type="text"
												className="form-control"
												placeholder="Search tasks..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												aria-label="Search tasks"
											/>
										</div>

										{/* Search and New Task - Mobile row */}
										<div className="d-md-none" style={{ display: 'flex', gap: '0.4rem', width: '100%', alignItems: 'center' }}>
											{/* Search - mobile */}
											<div className="header-search position-relative" style={{ flex: 1, margin: 0 }}>
												<i className="bi bi-search header-search-icon"></i>
												<input
													type="text"
													className="form-control"
													placeholder="Search..."
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
													aria-label="Search tasks"
												/>
											</div>

											{/* New Task Button - mobile */}
											<button className="btn btn-primary ripple-effect" onClick={handleNewTask} style={{ padding: '0.3rem 0.5rem', minWidth: '2rem', height: '2rem', flexShrink: 0 }}>
												<i className="bi bi-plus-lg"></i>
											</button>
										</div>

										{/* New Task Button - Desktop */}
										<button className="btn btn-primary ripple-effect d-none d-md-inline-flex" onClick={handleNewTask}>
											<i className="bi bi-plus-lg me-1"></i> New Task
										</button>
									</div>									
								</div>

															

								{/* Quick Summary Banner */}
								{tasks.length > 0 && (
									<div className="alert alert-light border mb-4" role="alert">
										<div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
											<div className="d-flex align-items-center gap-2">
												<i className="bi bi-info-circle-fill text-primary"></i>
												<span className="fw-semibold">Quick Summary</span>
											</div>

											<div className="d-flex flex-wrap gap-3 small">
												<span>
													<i className="bi bi-clock text-warning me-1"></i>
													<strong>
														{
															tasks.filter(
																(t) => isToday(t.dueDate) && t.status !== 'done'
															).length
														}
													</strong>{' '}
													due today
												</span>

												<span>
													<i className="bi bi-exclamation-triangle text-danger me-1"></i>
													<strong>
														{
															tasks.filter((t) => isOverdue(t.dueDate, t.status))
																.length
														}
													</strong>{' '}
													overdue
												</span>

												<span>
													<i className="bi bi-star-fill text-warning me-1"></i>
													<strong>
														{
															tasks.filter(
																(t) => t.priority === 'high' && t.status !== 'done'
															).length
														}
													</strong>{' '}
													high priority
												</span>
											</div>
										</div>
									</div>
								)}

								{/* Progress Bar */}
								{/* <ProgressBar tasks={tasks} filteredTasks={tasks} /> */}

								{/* Bulk Actions Toolbar */}
								{filteredTasks.length > 0 && (
									<div className="d-flex justify-content-between align-items-center mb-3">
										<div className="form-check">
											<input
												className="form-check-input"
												type="checkbox"
												id="selectAll"
												checked={
													selectedTasks.length === filteredTasks.length &&
													filteredTasks.length > 0
												}
												onChange={handleSelectAll}
											/>
											<label className="form-check-label" htmlFor="selectAll">
												Select All ({selectedTasks.length} selected)
											</label>
										</div>

										{selectedTasks.length > 0 && (
											<div className="d-flex gap-2">
												<button
													className="btn btn-sm btn-success"
													onClick={handleBulkComplete}
												>
													<i className="bi bi-check-all me-1"></i>
													Complete
												</button>

												<button
													className="btn btn-sm btn-danger"
													onClick={handleBulkDelete}
												>
													<i className="bi bi-trash me-1"></i>
													Delete
												</button>

												<button
													className="btn btn-sm btn-outline-secondary"
													onClick={() => setSelectedTasks([])}
												>
													Clear
												</button>
											</div>
										)}
									</div>
								)}

								{/* Task List */}
								{filteredTasks.length === 0 ? (
									tasks.length === 0 ? (
										// No tasks at all
										<div className="empty-state">
											<div className="empty-state-icon">
												<i className="bi bi-clipboard-check"></i>
											</div>
											<h3 className="empty-state-title">No tasks yet</h3>
											<p className="empty-state-description">
												Create your first task to get started and stay organized
											</p>
											<div className="empty-state-action">
												<button
													className="btn btn-primary btn-lg me-2"
													onClick={handleNewTask}
												>
													<i className="bi bi-plus-lg me-2"></i>
													Create Your First Task
												</button>
												<button
													className="btn btn-outline-primary btn-lg"
													onClick={loadDemoData}
												>
													<i className="bi bi-box-seam me-2"></i>
													Load Demo Data
												</button>
											</div>
										</div>
									) : (
										// Tasks exist but none match filter
										<div className="empty-state">
											<div className="empty-state-icon">
												<i className="bi bi-search"></i>
											</div>

											<h3 className="empty-state-title">No tasks found</h3>

											<p className="empty-state-description">
												No tasks match your current filters
												{searchQuery && ` or search for "${searchQuery}"`}
											</p>

											<div className="empty-state-action">
												<button
													className="btn btn-outline-primary"
													onClick={() => {
														setActiveFilter('all');
														setSearchQuery('');
														setSelectedPriority(null);
														setSelectedTag(null);
													}}
												>
													<i className="bi bi-x-circle me-2"></i>
													Clear Filters
												</button>
											</div>
										</div>
									)
								) : (
									<TaskList
										tasks={filteredTasks}
										onToggleComplete={handleToggleComplete}
										onEdit={handleEdit}
										onDelete={handleDelete}
										selectedTasks={selectedTasks}
										onSelectTask={handleSelectTask}
										onReorder={handleReorder}
									/>
								)}
							</div>

						) : activeTab === 'projects' ? (

							<div className="tab-content">
								<ProjectsView
									projects={projects}
									tasks={tasks}
									onCreateProject={handleCreateProject}
									onUpdateProject={handleUpdateProject}
									onDeleteProject={handleDeleteProject}
									onViewProjectTasks={(projectId) => {
										setSelectedProject(projectId);
										setActiveTab('tasks');
										setActiveFilter('all');
										setSearchQuery('');
										setSelectedPriority(null);
										setSelectedTag(null);
									}}
								/>
							</div>

						) : activeTab === 'calendar' ? (
							
							<div className="tab-content">
								<CalendarView
									tasks={tasks}
									onEditTask={handleEdit}
									onToggleComplete={handleToggleComplete}
									onDeleteTask={handleDelete}
								/>
							</div>
							
						) :  activeTab === 'dashboard' ? (

							<div className="tab-content">
								{/* Dashboard Tab Content */}
								<div className="mb-4">
									<h2 className="fw-bold mb-2">
										{/* <i className="bi bi-bar-chart-fill me-2"></i> */}
										Dashboard Overview
									</h2>
									<p className="text-muted mb-0">
										Track your productivity and task completion
									</p>
								</div>

								{/* Dashboard Stats */}
								<DashboardStats tasks={tasks} />

								{/* Charts */}
								<div className="charts-grid">
									<TaskStatusPieChart tasks={tasks} />
									<WeeklyCompletionChart tasks={tasks} />
								</div>

								{/* Task Distribution & Priority Breakdown */}
								{tasks.length > 0 && (
									<div className="row g-2 mb-4">
										<div className="col-md-6">
											<div className="card">
												<div className="card-body">
													<h6 className="card-title mb-3">
														<i className="bi bi-pie-chart-fill me-2"></i>
														Task Distribution
													</h6>

													<div className="d-flex flex-column gap-2">
														<div className="d-flex justify-content-between align-items-center">
															<span className="small">
																<i className="bi bi-circle-fill text-secondary me-2"></i>
																To Do
															</span>
															<span className="badge bg-secondary">
																{tasks.filter((t) => t.status === 'todo').length}
															</span>
														</div>

														<div className="d-flex justify-content-between align-items-center">
															<span className="small">
																<i className="bi bi-arrow-repeat text-warning me-2"></i>
																In Progress
															</span>

															<span className="badge bg-warning">
																{
																	tasks.filter((t) => t.status === 'in-progress')
																		.length
																}
															</span>
														</div>

														<div className="d-flex justify-content-between align-items-center">
															<span className="small">
																<i className="bi bi-check-circle-fill text-success me-2"></i>
																Done
															</span>

															<span className="badge bg-success">
																{tasks.filter((t) => t.status === 'done').length}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div className="col-md-6">
											<div className="card">
												<div className="card-body">
													<h6 className="card-title mb-3">
														<i className="bi bi-flag-fill me-2"></i>
														Priority Breakdown
													</h6>

													<div className="d-flex flex-column gap-2">
														<div className="d-flex justify-content-between align-items-center">
															<span className="small">
																<i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
																High Priority
															</span>

															<span className="badge bg-danger">
																{tasks.filter((t) => t.priority === 'high').length}
															</span>
														</div>

														<div className="d-flex justify-content-between align-items-center">
															<span className="small">
																<i className="bi bi-dash-circle-fill text-warning me-2"></i>
																Medium Priority
															</span>

															<span className="badge bg-warning">
																{
																	tasks.filter((t) => t.priority === 'medium')
																		.length
																}
															</span>
														</div>

														<div className="d-flex justify-content-between align-items-center">
															<span className="small">
																<i className="bi bi-circle text-secondary me-2"></i>
																Low Priority
															</span>

															<span className="badge bg-secondary">
																{tasks.filter((t) => t.priority === 'low').length}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

						
						) : activeTab ==='analytics' ? (
							<div className="tab-content">
								<AnalyticsView tasks={tasks} />
							</div>

						) : null}
					</div>
				</main>

				{/* Sidebar Backdrop for Mobile */}
				<div 
					className="sidebar-backdrop "
					onClick={() => {
						document.querySelector('.app-sidebar')?.classList.remove('mobile-open');
						document.querySelector('.sidebar-backdrop')?.classList.remove('show');
					}}
				></div>
			</div>

			{/* Task form modal */}
			<TaskForm
				show={showTaskForm}
				onClose={handleCloseForm}
				onSave={handleSaveTask}
				task={editingTask}
				projects={projects}
			/>

			{/* Toast Notifications */}
			<Toast
				show={toast.show}
				message={toast.message}
				type={toast.type}
				onClose={closeToast}
				onUndo={toast.onUndo}
			/>

			{/* Keyboard Shortcuts Modal */}
			<KeyboardShortcutsModal
				show={showShortcutsModal}
				onClose={() => setShowShortcutsModal(false)}
			/>
		</div>
	);
}

export default App;
