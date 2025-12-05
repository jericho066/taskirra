import React, { useState } from 'react';

function SubtaskList({ subtasks, onUpdate }) {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const handleAddSubtask = () => {
		if (newSubtaskTitle.trim()) {
			const newSubtask = {
				id: Date.now().toString(),
				title: newSubtaskTitle.trim(),
				done: false,
			};
			onUpdate([...subtasks, newSubtask]);
			setNewSubtaskTitle('');
		}
    };

    const handleToggleSubtask = (subtaskId) => {
		const updated = subtasks.map((sub) =>
			sub.id === subtaskId ? { ...sub, done: !sub.done } : sub
		);
		onUpdate(updated);
    };

    const handleDeleteSubtask = (subtaskId) => {
		const updated = subtasks.filter((sub) => sub.id !== subtaskId);
		onUpdate(updated);
    };

    return (
		<div className="subtask-list">
			<h6 className="mb-3">
				<i className="bi bi-list-check me-2"></i>
				Subtasks ({subtasks.filter((s) => s.done).length}/{subtasks.length})
			</h6>

			{/* Existing Subtasks */}
			<div className="mb-3">
				{subtasks.map((subtask) => (
					<div
						key={subtask.id}
						className="d-flex align-items-center gap-2 mb-2 p-2 bg-light rounded"
					>

						<input
							type="checkbox"
							className="form-check-input"
							checked={subtask.done}
							onChange={() => handleToggleSubtask(subtask.id)}
						/>

						<span
							className={`flex-grow-1 ${
								subtask.done ? 'text-decoration-line-through text-muted' : ''
							}`}
						>
							{subtask.title}
						</span>

						<button
							type="button"
							className="btn btn-sm btn-outline-danger"
							onClick={() => handleDeleteSubtask(subtask.id)}
						>
							<i className="bi bi-x-lg"></i>
						</button>
					</div>
				))}
			</div>

			{/* Add New Subtask */}
			<div className="input-group input-group-sm">
				<input
					type="text"
					className="form-control"
					placeholder="Add a subtask..."
					value={newSubtaskTitle}
					onChange={(e) => setNewSubtaskTitle(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleAddSubtask();
						}
					}}
				/>
				<button
					className="btn btn-outline-primary"
					type="button"
					onClick={handleAddSubtask}
					disabled={!newSubtaskTitle.trim()}
				>
					<i className="bi bi-plus-lg"></i>
				</button>
			</div>
		</div>
    );
}

export default SubtaskList;
