import React from "react"
import logoImage from '/src/assets/logo.png';

function Header({ toggleTheme, isDarkMode,  onExport, onImport, onReset, onShowShortcuts }) {
    return (
        <header className="app-header">
            <div className="header-content">
                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle d-md-none"
                    onClick={() => {
                        const sidebar = document.querySelector('.app-sidebar');
                        const backdrop = document.querySelector('.sidebar-backdrop');
                        
                        if (sidebar) {
                            sidebar.classList.toggle('mobile-open');
                        }
                        if (backdrop) {
                            backdrop.classList.toggle('show');
                        }
                    }}
                    aria-label="Toggle menu"
                >
                    <i className="bi bi-list"></i>
                </button>
                

                {/* Logo */}
                <a className="app-logo" href="/">
                    <div className="app-logo-icon">
                        <img src={logoImage} alt="" />
                    </div>
                    <span>Taskirra</span>
                </a>

                

                

                {/* Header Actions */}
                <div className="header-actions">
                    {/* Settings Dropdown */}
                    <div className="dropdown">
                        <button
                            className="header-action-btn dropdown-toggle icon-spin-hover"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-gear-fill"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item" onClick={onExport}>
                                    <i className="bi bi-download me-2"></i>
                                    Export Data
                                </button>
                            </li>

                            <li>
                                <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                                    <i className="bi bi-upload me-2"></i>
                                    Import Data
                                    <input
                                        type="file"
                                        accept=".json"
                                        style={{ display: 'none' }}
                                        onChange={onImport}
                                    />
                                </label>
                            </li>

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <button className="dropdown-item" onClick={onShowShortcuts}>
                                    <i className="bi bi-keyboard me-2"></i>
                                    Keyboard Shortcuts
                                </button>
                            </li>

                            <li>
                                <button className="dropdown-item text-danger" onClick={onReset}>
                                    <i className="bi bi-trash me-2"></i>
                                    Reset All Data
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        className={`header-action-btn ${isDarkMode ? 'active' : ''}`}
                        onClick={toggleTheme}
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
                    </button>

                    
                </div>
            </div>
        </header>
    )
}

export default Header