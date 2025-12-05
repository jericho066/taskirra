export const generateNextOccurrence = (task) => {
  if (!task.recurring || !task.dueDate) return null

  const currentDate = new Date(task.dueDate)
  let nextDate = new Date(currentDate)

  switch (task.recurring.freq) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + (task.recurring.interval || 1))
      break
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (7 * (task.recurring.interval || 1)))
      break
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + (task.recurring.interval || 1))
      break
    default:
      return null
  }

  return nextDate.toISOString().split('T')[0]
}

export const shouldGenerateNext = (task) => {
  if (!task.recurring) return false
  if (task.status !== 'done') return false
  
  // Check if next occurrence already exists
  const nextDate = generateNextOccurrence(task)
  return nextDate !== null
}

export const createRecurringTask = (originalTask) => {
  const nextDate = generateNextOccurrence(originalTask)
  
  if (!nextDate) return null

  return {
    ...originalTask,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    dueDate: nextDate,
    status: 'todo',
    order: originalTask.order + 1,
    recurring: {
      ...originalTask.recurring,
      nextDate: nextDate
    }
  }
}

