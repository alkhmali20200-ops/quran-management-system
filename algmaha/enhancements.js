// تحسينات إضافية للنظام

// نظام الإشعارات المحسن
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.cssText = `
            background: white;
            border-left: 4px solid ${colors[type]};
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideIn 0.3s ease-out;
            cursor: pointer;
        `;
        
        notification.innerHTML = `
            <i class="${icons[type]}" style="color: ${colors[type]}; font-size: 1.2rem;"></i>
            <span style="flex: 1; color: #333;">${message}</span>
            <i class="fas fa-times" style="color: #999; cursor: pointer;"></i>
        `;
        
        // إضافة الأنيميشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // إغلاق عند النقر
        notification.addEventListener('click', () => this.hide(notification));
        
        this.container.appendChild(notification);
        
        // إخفاء تلقائي
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }
        
        return notification;
    }
    
    hide(notification) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// إنشاء نظام الإشعارات العام
const notifications = new NotificationSystem();

// تحديث وظيفة showNotification لاستخدام النظام الجديد
window.showNotification = function(message, type = 'info') {
    notifications.show(message, type);
};

// نظام البحث المتقدم
class SearchSystem {
    constructor() {
        this.setupSearchBox();
    }
    
    setupSearchBox() {
        // إضافة مربع البحث إلى شريط التنقل
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const searchContainer = document.createElement('div');
            searchContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-left: 2rem;
            `;
            
            searchContainer.innerHTML = `
                <div style="position: relative;">
                    <input type="text" id="globalSearch" placeholder="بحث..." style="
                        padding: 0.5rem 2.5rem 0.5rem 1rem;
                        border: 2px solid #e1e5e9;
                        border-radius: 20px;
                        width: 250px;
                        font-size: 0.9rem;
                    ">
                    <i class="fas fa-search" style="
                        position: absolute;
                        right: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #666;
                    "></i>
                    <div id="searchResults" style="
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                        max-height: 300px;
                        overflow-y: auto;
                        display: none;
                        z-index: 1000;
                    "></div>
                </div>
            `;
            
            // إدراج مربع البحث بين العلامة التجارية ومعلومات المستخدم
            const navUser = navbar.querySelector('.nav-user');
            navbar.insertBefore(searchContainer, navUser);
            
            this.setupSearchEvents();
        }
    }
    
    setupSearchEvents() {
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query);
                } else {
                    searchResults.style.display = 'none';
                }
            });
            
            // إخفاء النتائج عند النقر خارجها
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }
    
    performSearch(query) {
        const results = [];
        const searchResults = document.getElementById('searchResults');
        
        // البحث في الطلاب
        systemData.students.forEach(student => {
            if (student.name.includes(query)) {
                results.push({
                    type: 'student',
                    title: student.name,
                    subtitle: 'طالب',
                    action: () => {
                        showPage('students');
                        // تمييز الطالب في الجدول
                        setTimeout(() => this.highlightInTable('studentsTable', student.name), 100);
                    }
                });
            }
        });
        
        // البحث في المعلمين
        systemData.teachers.forEach(teacher => {
            if (teacher.name.includes(query)) {
                results.push({
                    type: 'teacher',
                    title: teacher.name,
                    subtitle: 'معلم',
                    action: () => {
                        showPage('teachers');
                        setTimeout(() => this.highlightInTable('teachersTable', teacher.name), 100);
                    }
                });
            }
        });
        
        // البحث في الحلقات
        systemData.circles.forEach(circle => {
            if (circle.name.includes(query) || circle.mosque.includes(query)) {
                results.push({
                    type: 'circle',
                    title: circle.name,
                    subtitle: `حلقة - ${circle.mosque}`,
                    action: () => {
                        showPage('circles');
                    }
                });
            }
        });
        
        this.displaySearchResults(results);
    }
    
    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">لا توجد نتائج</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" style="
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #f0f0f0;
                    cursor: pointer;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                    <div style="font-weight: 600; color: #333;">${result.title}</div>
                    <div style="font-size: 0.8rem; color: #666;">${result.subtitle}</div>
                </div>
            `).join('');
            
            // إضافة أحداث النقر
            searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    results[index].action();
                    searchResults.style.display = 'none';
                    document.getElementById('globalSearch').value = '';
                });
            });
        }
        
        searchResults.style.display = 'block';
    }
    
    highlightInTable(tableId, searchText) {
        const table = document.getElementById(tableId);
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const firstCell = row.querySelector('td');
                if (firstCell && firstCell.textContent.includes(searchText)) {
                    row.style.background = '#fff3cd';
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        row.style.background = '';
                    }, 3000);
                }
            });
        }
    }
}

// نظام الاختصارات
class KeyboardShortcuts {
    constructor() {
        this.setupShortcuts();
    }
    
    setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K للبحث
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('globalSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + 1-9 للتنقل السريع
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const menuItems = document.querySelectorAll('.menu-item');
                const index = parseInt(e.key) - 1;
                if (menuItems[index]) {
                    menuItems[index].click();
                }
            }
            
            // ESC لإغلاق النوافذ المنبثقة
            if (e.key === 'Escape') {
                const modal = document.getElementById('modalOverlay');
                if (modal && modal.classList.contains('active')) {
                    closeModal();
                }
            }
        });
    }
}

// نظام حفظ تلقائي
class AutoSave {
    constructor() {
        this.setupAutoSave();
    }
    
    setupAutoSave() {
        // حفظ تلقائي كل 30 ثانية
        setInterval(() => {
            this.saveAllData();
        }, 30000);
        
        // حفظ عند إغلاق النافذة
        window.addEventListener('beforeunload', () => {
            this.saveAllData();
        });
    }
    
    saveAllData() {
        try {
            saveToStorage('users', systemData.users);
            saveToStorage('teachers', systemData.teachers);
            saveToStorage('students', systemData.students);
            saveToStorage('circles', systemData.circles);
            saveToStorage('attendance', systemData.attendance);
            saveToStorage('progress', systemData.progress);
            saveToStorage('activities', systemData.activities);
            
            // إشعار صامت للحفظ التلقائي
            console.log('تم الحفظ التلقائي:', new Date().toLocaleTimeString('ar-SA'));
        } catch (error) {
            console.error('خطأ في الحفظ التلقائي:', error);
        }
    }
}

// نظام الإحصائيات المتقدمة
class AdvancedAnalytics {
    static generateWeeklyReport() {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyAttendance = systemData.attendance.filter(a => {
            const attendanceDate = new Date(a.date);
            return attendanceDate >= weekAgo && attendanceDate <= today;
        });
        
        const report = {
            totalSessions: weeklyAttendance.length,
            totalStudents: systemData.students.length,
            averageAttendance: 0,
            topPerformers: [],
            attendanceByDay: {}
        };
        
        // حساب متوسط الحضور
        if (weeklyAttendance.length > 0) {
            let totalPresent = 0;
            let totalRecords = 0;
            
            weeklyAttendance.forEach(session => {
                session.records.forEach(record => {
                    totalRecords++;
                    if (record.status === 'present') {
                        totalPresent++;
                    }
                });
            });
            
            report.averageAttendance = totalRecords > 0 ? (totalPresent / totalRecords) * 100 : 0;
        }
        
        // أفضل الطلاب أداءً
        const studentPerformance = {};
        systemData.students.forEach(student => {
            const attendanceRate = AdvancedStats.getStudentAttendanceRate(
                student.id, 
                weekAgo.toISOString().split('T')[0], 
                today.toISOString().split('T')[0]
            );
            
            studentPerformance[student.id] = {
                name: student.name,
                attendanceRate: attendanceRate,
                memorized: student.memorized,
                grade: student.grade
            };
        });
        
        report.topPerformers = Object.values(studentPerformance)
            .sort((a, b) => b.attendanceRate - a.attendanceRate)
            .slice(0, 5);
        
        return report;
    }
    
    static displayWeeklyReport() {
        const report = this.generateWeeklyReport();
        
        const modalContent = `
            <h3><i class="fas fa-chart-bar"></i> التقرير الأسبوعي</h3>
            <div class="report-content">
                <div class="report-stats">
                    <div class="stat-item">
                        <h4>إجمالي الجلسات</h4>
                        <p class="stat-number">${report.totalSessions}</p>
                    </div>
                    <div class="stat-item">
                        <h4>متوسط الحضور</h4>
                        <p class="stat-number">${report.averageAttendance.toFixed(1)}%</p>
                    </div>
                    <div class="stat-item">
                        <h4>إجمالي الطلاب</h4>
                        <p class="stat-number">${report.totalStudents}</p>
                    </div>
                </div>
                
                <div class="top-performers">
                    <h4>أفضل 5 طلاب حضوراً</h4>
                    <div class="performers-list">
                        ${report.topPerformers.map((student, index) => `
                            <div class="performer-item">
                                <span class="rank">${index + 1}</span>
                                <span class="name">${student.name}</span>
                                <span class="rate">${student.attendanceRate.toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="ReportUtils.exportWeeklyReport()">
                    <i class="fas fa-download"></i> تصدير التقرير
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        `;
        
        showModal(modalContent);
    }
}

// إضافة أزرار التقرير إلى لوحة التحكم
function addReportButtons() {
    const dashboardPage = document.getElementById('dashboardPage');
    if (dashboardPage) {
        const reportSection = document.createElement('div');
        reportSection.className = 'report-section';
        reportSection.style.cssText = 'margin-top: 2rem;';
        
        reportSection.innerHTML = `
            <div class="page-header">
                <h3><i class="fas fa-file-alt"></i> التقارير السريعة</h3>
            </div>
            <div class="report-buttons" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="AdvancedAnalytics.displayWeeklyReport()">
                    <i class="fas fa-chart-bar"></i> التقرير الأسبوعي
                </button>
                <button class="btn btn-success" onclick="ReportUtils.exportStudentsData()">
                    <i class="fas fa-download"></i> تصدير بيانات الطلاب
                </button>
                <button class="btn btn-warning" onclick="BackupManager.createBackup()">
                    <i class="fas fa-save"></i> نسخة احتياطية
                </button>
            </div>
        `;
        
        dashboardPage.appendChild(reportSection);
    }
}

// تهيئة التحسينات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // انتظار تحميل النظام الأساسي
    setTimeout(() => {
        new SearchSystem();
        new KeyboardShortcuts();
        new AutoSave();
        addReportButtons();
        
        // إضافة نصائح الاستخدام
        if (!localStorage.getItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'tips_shown')) {
            setTimeout(() => {
                showNotification('استخدم Ctrl+K للبحث السريع، أو Ctrl+1-9 للتنقل بين الصفحات', 'info', 8000);
                localStorage.setItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'tips_shown', 'true');
            }, 2000);
        }
    }, 1000);
});

// إضافة CSS للتحسينات
const enhancementStyles = `
<style>
.report-content {
    margin: 1.5rem 0;
}

.report-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-item {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
}

.stat-item h4 {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    margin: 0;
}

.performers-list {
    display: grid;
    gap: 0.5rem;
}

.performer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 5px;
}

.rank {
    background: #667eea;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
}

.name {
    flex: 1;
    margin: 0 1rem;
    font-weight: 600;
}

.rate {
    color: #28a745;
    font-weight: bold;
}

.report-section {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.report-buttons button {
    min-width: 200px;
}

@media (max-width: 768px) {
    .report-buttons {
        flex-direction: column;
    }
    
    .report-buttons button {
        width: 100%;
    }
    
    .report-stats {
        grid-template-columns: 1fr;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', enhancementStyles);