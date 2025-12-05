export const sampleTasks = [
	{
		id: '1',
		title: 'Complete project proposal',
		description: 'Finish the Q4 project proposal and send to stakeholders',
		createdAt: new Date().toISOString(),
		dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
		priority: 'high',
		status: 'todo',
		tags: ['work', 'important'],
		projectId: 'project-1',
		order: 1,
		subtasks: [],
		archived: false
	},
	{
		id: '2',
		title: 'Review team feedback',
		description: 'Go through all team feedback from last sprint',
		createdAt: new Date().toISOString(),
		dueDate: new Date().toISOString().split('T')[0], // Today
		priority: 'medium',
		status: 'in-progress',
		tags: ['work', 'team'],
		projectId: 'project-1',
		order: 2,
		subtasks: [
		{ id: 'sub-1', title: 'Read all comments', done: true },
		{ id: 'sub-2', title: 'Summarize key points', done: false }
		],
		archived: false
	},
	{
		id: '3',
		title: 'Pay utility bills',
		description: 'Pay electricity and water bills before deadline',
		createdAt: new Date().toISOString(),
		dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days
		priority: 'high',
		status: 'todo',
		tags: ['personal', 'bills'],
		projectId: 'project-2',
		order: 3,
		subtasks: [],
		archived: false
	},
	{
		id: '4',
		title: 'Grocery shopping',
		description: 'Buy groceries for the week',
		createdAt: new Date().toISOString(),
		dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
		priority: 'low',
		status: 'todo',
		tags: ['personal', 'home'],
		projectId: 'project-2',
		order: 4,
		subtasks: [],
		archived: false
	},
	{
		id: '5',
		title: 'Learn React hooks',
		description: 'Complete the advanced React hooks tutorial',
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
		dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday (overdue)
		priority: 'medium',
		status: 'done',
		tags: ['learning', 'work'],
		projectId: 'project-1',
		order: 5,
		subtasks: [],
		archived: false
  	}
]

export const sampleProjects = [
	{
		id: 'project-1',
		name: 'Work',
		color: '#3b82f6'
	},
	{
		id: 'project-2',
		name: 'Personal',
		color: '#10b981'
	},
	{
		id: 'project-3',
		name: 'Learning',
		color: '#f59e0b'
	}
]

export const defaultSettings = {
	theme: 'light',
	defaultProject: 'project-1',
	lastSync: null
}

