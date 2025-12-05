import React from 'react'

function KeyboardShortcutsModal({ show, onClose }) {
    if (!show) return null

    const shortcuts = [
        { keys: ['Ctrl', 'N'], description: 'Create new task' },
        { keys: ['Ctrl', 'K'], description: 'Focus search' },
        { keys: ['/'], description: 'Quick search' },
        { keys: ['Esc'], description: 'Close modal/Clear selection' },
        { keys: ['Tab'], description: 'Navigate between elements' },
        { keys: ['Enter'], description: 'Submit form/Confirm action' },
        { keys: ['Space'], description: 'Toggle checkbox' }
    ]

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-keyboard me-2"></i>
                            Keyboard Shortcuts
                        </h5>

                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="list-group list-group-flush">
                            {shortcuts.map((shortcut, index) => (
                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{shortcut.description}</span>
                                    <div className="d-flex gap-1">
                                        {shortcut.keys.map((key, i) => (
                                            <React.Fragment key={i}>
                                                <kbd className="bg-light text-black border px-2 py-1 rounded">{key}</kbd>
                                                {i < shortcut.keys.length - 1 && <span className="mx-1">+</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KeyboardShortcutsModal