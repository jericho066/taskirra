import React, { useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO } from 'date-fns';


function AnalyticsView({ tasks }) {
    // Calculate productivity heatmap data (last 90 days)
    const heatmapData = useMemo(() => {
        const days = [];
        const today = new Date();
        
        for (let i = 89; i >= 0; i--) {
            const date = subDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');
            
            const completedTasks = tasks.filter(task => {
                if (!task.updatedAt || task.status !== 'done') return false;
                const taskDate = format(new Date(task.updatedAt), 'yyyy-MM-dd');
                return taskDate === dateStr;
            });
            
            days.push({
                date: dateStr,
                count: completedTasks.length,
                displayDate: format(date, 'MMM d'),
                dayName: format(date, 'EEE'),
            });
        }
        
        return days;
    }, [tasks]);

    // Calculate current streak
    const streakData = useMemo(() => {
        const today = new Date();
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        
        // Sort dates in reverse (most recent first)
        const dates = [...heatmapData].reverse();
        
        // Current streak (consecutive days from today)
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].count > 0) {
                currentStreak++;
            } else if (i > 0) {
                break; // Stop at first day with no completions
            }
        }
        
        // Best streak ever
        for (const day of dates) {
            if (day.count > 0) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }
        
        return { currentStreak, bestStreak };
    }, [heatmapData]);

    // Calculate most productive day of week
    const productivityByDay = useMemo(() => {
        const dayStats = {
            'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0,
            'Friday': 0, 'Saturday': 0, 'Sunday': 0
        };
        
        tasks.forEach(task => {
            if (task.status === 'done' && task.updatedAt) {
                const dayName = format(new Date(task.updatedAt), 'EEEE');
                dayStats[dayName]++;
            }
        });
        
        const maxDay = Object.entries(dayStats).reduce((a, b) => a[1] > b[1] ? a : b);
        return { dayStats, mostProductiveDay: maxDay[0], maxCount: maxDay[1] };
    }, [tasks]);

    // Calculate most productive time (simplified to morning/afternoon/evening)
    const productivityByTime = useMemo(() => {
        const timeStats = { morning: 0, afternoon: 0, evening: 0, night: 0 };
        
        tasks.forEach(task => {
            if (task.status === 'done' && task.updatedAt) {
                const hour = new Date(task.updatedAt).getHours();
                if (hour >= 6 && hour < 12) timeStats.morning++;
                else if (hour >= 12 && hour < 17) timeStats.afternoon++;
                else if (hour >= 17 && hour < 22) timeStats.evening++;
                else timeStats.night++;
            }
        });
        
        const maxTime = Object.entries(timeStats).reduce((a, b) => a[1] > b[1] ? a : b);
        const timeLabels = {
            morning: '6 AM - 12 PM',
            afternoon: '12 PM - 5 PM',
            evening: '5 PM - 10 PM',
            night: '10 PM - 6 AM'
        };
        
        return { 
            timeStats, 
            mostProductiveTime: maxTime[0],
            mostProductiveTimeLabel: timeLabels[maxTime[0]],
            maxCount: maxTime[1] 
        };
    }, [tasks]);

    // Tag analytics
    const tagAnalytics = useMemo(() => {
        const tagCounts = {};
        
        tasks.forEach(task => {
            task.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        return sortedTags;
    }, [tasks]);

    // Priority completion stats
    const priorityStats = useMemo(() => {
        const stats = {
            high: { total: 0, completed: 0 },
            medium: { total: 0, completed: 0 },
            low: { total: 0, completed: 0 }
        };
        
        tasks.forEach(task => {
            if (stats[task.priority]) {
                stats[task.priority].total++;
                if (task.status === 'done') {
                    stats[task.priority].completed++;
                }
            }
        });
        
        return stats;
    }, [tasks]);

    // Completion rate over last 30 days
    const completionTrend = useMemo(() => {
        const weeks = [];
        const today = new Date();
        
        for (let i = 3; i >= 0; i--) {
            const weekEnd = subDays(today, i * 7);
            const weekStart = subDays(weekEnd, 6);
            
            const weekTasks = tasks.filter(task => {
                if (!task.createdAt) return false;
                const taskDate = new Date(task.createdAt);
                return taskDate >= weekStart && taskDate <= weekEnd;
            });
            
            const completed = weekTasks.filter(t => t.status === 'done').length;
            const rate = weekTasks.length > 0 ? Math.round((completed / weekTasks.length) * 100) : 0;
            
            weeks.push({
                label: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
                rate,
                completed,
                total: weekTasks.length
            });
        }
        
        return weeks;
    }, [tasks]);

    // Get heatmap intensity class
    const getHeatmapClass = (count) => {
        if (count === 0) return 'intensity-0';
        if (count <= 2) return 'intensity-1';
        if (count <= 4) return 'intensity-2';
        if (count <= 6) return 'intensity-3';
        return 'intensity-4';
    };

    // Average completion time (in days)
    const avgCompletionTime = useMemo(() => {
        const completedWithDate = tasks.filter(t => 
            t.status === 'done' && t.createdAt && t.updatedAt
        );
        
        if (completedWithDate.length === 0) return 0;
        
        const totalDays = completedWithDate.reduce((sum, task) => {
            const created = new Date(task.createdAt);
            const completed = new Date(task.updatedAt);
            const days = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);
        
        return Math.round(totalDays / completedWithDate.length);
    }, [tasks]);

    return (
        <div className="analytics-view">
            {/* Header */}
            <div className="analytics-header mb-4">
                <h2 className="fw-bold mb-2">Analytics & Insights</h2>
                <p className="text-muted mb-0">
                    Track your productivity trends and patterns
                </p>
            </div>

            {/* Key Metrics Row */}
            <div className="row g-3 mb-4">
                <div className="col-md-3 col-6">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                            <i className="bi bi-fire"></i>
                        </div>
                        <div className="metric-content">
                            <div className="metric-value">{streakData.currentStreak}</div>
                            <div className="metric-label">Day Streak</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                            <i className="bi bi-trophy"></i>
                        </div>
                        <div className="metric-content">
                            <div className="metric-value">{streakData.bestStreak}</div>
                            <div className="metric-label">Best Streak</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
                            <i className="bi bi-calendar-week"></i>
                        </div>
                        <div className="metric-content">
                            <div className="metric-value">{productivityByDay.mostProductiveDay}</div>
                            <div className="metric-label">Best Day</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            <i className="bi bi-clock"></i>
                        </div>
                        <div className="metric-content">
                            <div className="metric-value">{avgCompletionTime}d</div>
                            <div className="metric-label">Avg. Time</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productivity Heatmap */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        <i className="bi bi-grid-3x3-gap me-2"></i>
                        Productivity Heatmap (Last 90 Days)
                    </h5>
                    
                    <div className="heatmap-container">
                        <div className="heatmap-grid">
                            {heatmapData.map((day, index) => (
                                <div
                                    key={day.date}
                                    className={`heatmap-cell ${getHeatmapClass(day.count)}`}
                                    title={`${day.displayDate}: ${day.count} tasks completed`}
                                    data-count={day.count}
                                >
                                    <span className="heatmap-tooltip">
                                        {day.displayDate}<br />
                                        {day.count} tasks
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="heatmap-legend mt-3">
                            <span className="legend-label">Less</span>
                            <div className="heatmap-cell intensity-0"></div>
                            <div className="heatmap-cell intensity-1"></div>
                            <div className="heatmap-cell intensity-2"></div>
                            <div className="heatmap-cell intensity-3"></div>
                            <div className="heatmap-cell intensity-4"></div>
                            <span className="legend-label">More</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights Grid */}
            <div className="row g-3 mb-4">
                {/* Day of Week Distribution */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                <i className="bi bi-calendar-day me-2"></i>
                                Day of Week Performance
                            </h5>
                            
                            <div className="day-bars">
                                {Object.entries(productivityByDay.dayStats).map(([day, count]) => {
                                    const maxCount = productivityByDay.maxCount;
                                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                    
                                    return (
                                        <div key={day} className="day-bar-item">
                                            <div className="day-bar-label">{day.slice(0, 3)}</div>
                                            <div className="day-bar-track">
                                                <div 
                                                    className="day-bar-fill" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="day-bar-value">{count}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="alert alert-light border mt-3 mb-0">
                                <small className="d-flex align-items-center">
                                    <i className="bi bi-lightbulb me-2 text-warning"></i>
                                    Most productive on <strong className="mx-1">{productivityByDay.mostProductiveDay}</strong> with {productivityByDay.maxCount} tasks completed
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time of Day Distribution */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                <i className="bi bi-clock-history me-2"></i>
                                Time of Day Performance
                            </h5>
                            
                            <div className="time-blocks">
                                {Object.entries(productivityByTime.timeStats).map(([time, count]) => {
                                    const labels = {
                                        morning: { icon: 'bi-sunrise', label: 'Morning', time: '6AM - 12PM' },
                                        afternoon: { icon: 'bi-sun', label: 'Afternoon', time: '12PM - 5PM' },
                                        evening: { icon: 'bi-sunset', label: 'Evening', time: '5PM - 10PM' },
                                        night: { icon: 'bi-moon-stars', label: 'Night', time: '10PM - 6AM' }
                                    };
                                    
                                    const isMax = time === productivityByTime.mostProductiveTime;
                                    
                                    return (
                                        <div key={time} className={`time-block ${isMax ? 'time-block-max' : ''}`}>
                                            <i className={`bi ${labels[time].icon} time-block-icon`}></i>
                                            <div className="time-block-label">{labels[time].label}</div>
                                            <div className="time-block-time">{labels[time].time}</div>
                                            <div className="time-block-count">{count}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="alert alert-light border mt-3 mb-0">
                                <small className="d-flex align-items-center">
                                    <i className="bi bi-lightbulb me-2 text-warning"></i>
                                    You're most productive in the <strong className="mx-1">{productivityByTime.mostProductiveTime}</strong> ({productivityByTime.mostProductiveTimeLabel})
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority & Tags Row */}
            <div className="row g-3 mb-4">
                {/* Priority Completion */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                <i className="bi bi-flag me-2"></i>
                                Priority Completion Rate
                            </h5>
                            
                            {Object.entries(priorityStats).map(([priority, stats]) => {
                                const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                                const colors = {
                                    high: '#ef4444',
                                    medium: '#f59e0b',
                                    low: '#10b981'
                                };
                                
                                return (
                                    <div key={priority} className="priority-stat-item mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-capitalize fw-semibold">{priority} Priority</span>
                                            <span className="text-muted small">{stats.completed}/{stats.total} ({rate}%)</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div 
                                                className="progress-bar" 
                                                style={{ 
                                                    width: `${rate}%`,
                                                    backgroundColor: colors[priority]
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Top Tags */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                <i className="bi bi-tags me-2"></i>
                                Most Used Tags
                            </h5>
                            
                            {tagAnalytics.length > 0 ? (
                                <div className="tag-cloud">
                                    {tagAnalytics.map(([tag, count], index) => (
                                        <div key={tag} className="tag-stat-item">
                                            <span className="tag-stat-rank">#{index + 1}</span>
                                            <span className="badge bg-primary">{tag}</span>
                                            <span className="tag-stat-count">{count} tasks</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-4">
                                    <i className="bi bi-tags" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                                    <br />No tags used yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Trend */}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        <i className="bi bi-graph-up me-2"></i>
                        Completion Rate Trend (Last 4 Weeks)
                    </h5>
                    
                    <div className="trend-chart">
                        {completionTrend.map((week, index) => (
                            <div key={index} className="trend-week">
                                <div className="trend-week-label">{week.label}</div>
                                <div className="trend-week-bar-container">
                                    <div 
                                        className="trend-week-bar" 
                                        style={{ height: `${week.rate}%` }}
                                    >
                                        <span className="trend-week-value">{week.rate}%</span>
                                    </div>
                                </div>
                                <div className="trend-week-info">
                                    {week.completed}/{week.total}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsView;