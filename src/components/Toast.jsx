import React, { useEffect, useState } from 'react'

function Toast({ show, message, type = 'info', onClose, onUndo, duration = 5000 }) {
	const [progress, setProgress] = useState(100)
	const [isHiding, setIsHiding] = useState(false)

	useEffect(() => {
		if (show && !onUndo) {
			// Progress bar animation
			const startTime = Date.now()
			const progressInterval = setInterval(() => {
				const elapsed = Date.now() - startTime
				const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
				setProgress(remaining)
			}, 50)

			// Auto-close timer
			const timer = setTimeout(() => {
				handleClose()
			}, duration)
			
			return () => {
				clearTimeout(timer)
				clearInterval(progressInterval)
			}
		} else if (show) {
			// Reset progress when undo is available
			setProgress(100)
		}
	}, [show, onClose, onUndo, duration])

	const handleClose = () => {
		setIsHiding(true)
		setTimeout(() => {
			onClose()
			setIsHiding(false)
			setProgress(100)
		}, 300) // Match animation duration
	}

	if (!show) return null

	const toastTypes = {
		success: {
			class: 'toast-success',
			icon: 'bi-check-circle-fill',
			title: 'Success'
		},
		danger: {
			class: 'toast-error',
			icon: 'bi-x-circle-fill',
			title: 'Error'
		},
		warning: {
			class: 'toast-warning',
			icon: 'bi-exclamation-triangle-fill',
			title: 'Warning'
		},
		info: {
			class: 'toast-info',
			icon: 'bi-info-circle-fill',
			title: 'Info'
		}
	}

	const currentType = toastTypes[type] || toastTypes.info

	return (
		<div className="toast-container">
			<div 
				className={`toast ${currentType.class} show ${isHiding ? 'hiding' : ''}`}
				role="alert"
			>
				<div className="toast-header">
					<div className="toast-icon">
						<i className={`bi ${currentType.icon}`}></i>
					</div>
					
					<strong className="toast-title">{currentType.title}</strong>
					<button 
						type="button" 
						className="btn-close" 
						onClick={handleClose}
						aria-label="Close"
					>
						<i className="bi bi-x"></i>
					</button>
				</div>

				<div className="toast-body">
					{onUndo ? (
						<div className="toast-undo">
							<div className="toast-undo-message">
								{message}
							</div>
							<button 
								className="toast-undo-btn"
								onClick={() => {
									onUndo()
									handleClose()
								}}
							>
								<i className="bi bi-arrow-counterclockwise me-1"></i>
								Undo
							</button>
						</div>
					) : (
						message
					)}
				</div>

				{/* Progress bar - only show when auto-closing */}
				{!onUndo && (
					<div className="toast-progress">
						<div 
							className="toast-progress-bar"
							style={{ 
								width: `${progress}%`,
								transitionDuration: '50ms'
							}}
						></div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Toast