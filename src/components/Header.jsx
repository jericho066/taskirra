import React from "react"
import logoImage from '/src/assets/logo.png';

function Header({ toggleTheme, isDarkMode, onNewTask, searchQuery, setSearchQuery, onExport, onImport, onReset, onShowShortcuts }) {
    return (
        <header className="app-header">
            <div className="header-content">
                {/* Logo */}
                <a className="app-logo" href="/">
                    <div className="app-logo-icon">
                        <img src={logoImage} alt="" />
                    </div>
                    <span>Taskirra</span>
                </a>

                {/* Add Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle d-md-none"
                    onClick={() => {
                        document.querySelector('.app-sidebar')?.classList.toggle('mobile-open');
                        document.querySelector('.sidebar-backdrop')?.classList.toggle('show');
                    }}
                    aria-label="Toggle menu"
                >
                    <i className="bi bi-list"></i>
                </button>

                {/* Search - desktop */}
                <div className="header-search position-relative d-none d-md-block">
                    <i className="bi bi-search header-search-icon"></i>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search tasks"
                    />
                </div>

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

                    {/* New Task Button */}
                    <button className="btn btn-primary ripple-effect" onClick={onNewTask}>
                        <span className="d-none d-sm-inline">
                            <i className="bi bi-plus-lg me-1"></i> New Task
                        </span>

                        <span className="d-sm-none">
                            <i className="bi bi-plus-lg"></i>
                        </span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header