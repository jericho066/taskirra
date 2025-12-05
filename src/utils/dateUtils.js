export const isToday = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export const isThisWeek = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    return date >= weekStart && date <= weekEnd
}

export const isThisMonth = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)
    return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export const isOverdue = (dateString, status) => {
    if (!dateString || status === 'done') return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
}



export const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}



