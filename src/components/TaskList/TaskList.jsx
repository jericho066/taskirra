import React from 'react'
import TaskItem from './TaskItem'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

function TaskList({ tasks, onToggleComplete, onEdit, onDelete, selectedTasks = [], onSelectTask, onReorder }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex((task) => task.id === active.id)
            const newIndex = tasks.findIndex((task) => task.id === over.id)

            const newTasks = arrayMove(tasks, oldIndex, newIndex)
            onReorder(newTasks)
        }
    }


    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <i className="bi bi-inbox"></i>
                </div>
                <h3 className="empty-state-title">No tasks here</h3>
                <p className="empty-state-description">
                    Try adjusting your filters or create a new task
                </p>
            </div>
        )
    }

    return (

        
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="task-list">
                    {tasks.map((task) => (
                        <div key={task.id} className="stagger-item">
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleComplete={onToggleComplete}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                isSelected={selectedTasks.includes(task.id)}
                                onSelect={onSelectTask}
                            />
                        </div>
                    ))}
                </div>

            </SortableContext>
        </DndContext>

        
    )
}

export default TaskList
