import React from 'react'

function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizes = {
        sm: '1rem',
        md: '2rem',
        lg: '3rem'
    }

    return (
        <div className="text-center py-5">
            <div 
                className="spinner-border text-primary" 
                role="status"
                style={{ width: sizes[size], height: sizes[size] }}
            >
                <span className="visually-hidden">{text}</span>
            </div>
            
            {text && <p className="mt-3 text-muted">{text}</p>}
        </div>
    )
}

export default LoadingSpinner

