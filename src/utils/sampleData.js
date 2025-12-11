
/*
?    ===============================================
?    ==== SAMPLE PROJECT DATAS FOR PROJECT DEMO ====
?    ===============================================
*/

export const sampleProjects = [
    {
        id: 'proj-1',
        name: 'Work Projects',
        description: 'Professional work-related tasks',
        color: '#6366f1',
        icon: 'bi-briefcase',
        createdAt: new Date('2024-01-01').toISOString(),
        archived: false
    },
    {
        id: 'proj-2',
        name: 'Home Renovation',
        description: 'House improvement and maintenance',
        color: '#f59e0b',
        icon: 'bi-house',
        createdAt: new Date('2024-01-15').toISOString(),
        archived: false
    },
    {
        id: 'proj-3',
        name: 'Learning Goals',
        description: 'Educational and skill development',
        color: '#10b981',
        icon: 'bi-book',
        createdAt: new Date('2024-02-01').toISOString(),
        archived: false
    },
    {
        id: 'proj-4',
        name: 'Fitness Journey',
        description: 'Health and fitness tracking',
        color: '#ef4444',
        icon: 'bi-heart-pulse',
        createdAt: new Date('2024-02-15').toISOString(),
        archived: false
    },
    {
        id: 'proj-5',
        name: 'Creative Projects',
        description: 'Art, design, and creative work',
        color: '#ec4899',
        icon: 'bi-palette',
        createdAt: new Date('2024-03-01').toISOString(),
        archived: false
    }
];


/*
?   ============================================================
?   ==== SAMPLE TASK DATAS WITH PROJECT ID FOR PROJECT DEMO ====
?   ============================================================
*/

export const sampleTasks = [
    {
        id: '1',
        title: 'Complete Q4 Sales Report',
        description: 'Prepare comprehensive sales analysis for the quarter',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['work', 'urgent', 'reports'],
        projectId: 'proj-1', // Work Projects
        subtasks: [
            { id: 's1', title: 'Gather sales data', done: true },
            { id: 's2', title: 'Create charts', done: true },
            { id: 's3', title: 'Write analysis', done: false }
        ],
        createdAt: new Date('2024-03-15').toISOString(),
        updatedAt: new Date().toISOString(),
        order: 1,
        archived: false,
        recurring: null
    },
    {
        id: '2',
        title: 'Paint Living Room',
        description: 'Choose color and paint the main living area',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['home', 'diy'],
        projectId: 'proj-2', // Home Renovation
        subtasks: [],
        createdAt: new Date('2024-03-10').toISOString(),
        updatedAt: new Date('2024-03-10').toISOString(),
        order: 2,
        archived: false,
        recurring: null
    },
    {
        id: '3',
        title: 'Learn React Hooks',
        description: 'Complete online course on advanced React patterns',
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['learning', 'coding'],
        projectId: 'proj-3', // Learning Goals
        subtasks: [
            { id: 's4', title: 'Watch tutorial videos', done: true },
            { id: 's5', title: 'Complete exercises', done: false }
        ],
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date().toISOString(),
        order: 3,
        archived: false,
        recurring: null
    },
    {
        id: '4',
        title: 'Morning Workout Routine',
        description: '30 minutes cardio + stretching',
        priority: 'high',
        status: 'done',
        dueDate: new Date().toISOString().split('T')[0],
        tags: ['fitness', 'health'],
        projectId: 'proj-4', // Fitness Journey
        subtasks: [],
        createdAt: new Date('2024-03-20').toISOString(),
        updatedAt: new Date().toISOString(),
        order: 4,
        archived: false,
        recurring: { freq: 'daily', interval: 1, nextDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    },
    {
        id: '5',
        title: 'Design Portfolio Website',
        description: 'Create mockups for personal portfolio redesign',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['design', 'portfolio'],
        projectId: 'proj-5', // Creative Projects
        subtasks: [],
        createdAt: new Date('2024-03-18').toISOString(),
        updatedAt: new Date('2024-03-18').toISOString(),
        order: 5,
        archived: false,
        recurring: null
    },
    {
        id: '6',
        title: 'Fix Kitchen Sink',
        description: 'Repair leaking faucet',
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['home', 'urgent'],
        projectId: 'proj-2', // Home Renovation
        subtasks: [],
        createdAt: new Date('2024-03-19').toISOString(),
        updatedAt: new Date('2024-03-19').toISOString(),
        order: 6,
        archived: false,
        recurring: null
    },
    {
        id: '7',
        title: 'Team Meeting Preparation',
        description: 'Prepare agenda and presentation slides',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['work', 'meetings'],
        projectId: 'proj-1', // Work Projects
        subtasks: [],
        createdAt: new Date('2024-03-21').toISOString(),
        updatedAt: new Date('2024-03-21').toISOString(),
        order: 7,
        archived: false,
        recurring: null
    },
    {
        id: '8',
        title: 'Practice Guitar',
        description: '45 minutes practice session',
        priority: 'low',
        status: 'done',
        dueDate: new Date().toISOString().split('T')[0],
        tags: ['hobby', 'music'],
        projectId: 'proj-5', // Creative Projects
        subtasks: [],
        createdAt: new Date('2024-03-22').toISOString(),
        updatedAt: new Date().toISOString(),
        order: 8,
        archived: false,
        recurring: { freq: 'weekly', interval: 1, nextDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    }
];



export const defaultSettings = {
    theme: 'light',
    defaultView: 'list',
    sortBy: 'dueDate',
    notifications: true
};