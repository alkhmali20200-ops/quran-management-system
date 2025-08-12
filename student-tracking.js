// ==================== نظام متابعة الطلاب المحسن ====================

// عرض صفحة متابعة الطلاب للمعلم
function showStudentTrackingPage() {
    const teacherId = currentUser.teacherId;
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    const teacherStudents = systemData.students.filter(s => 
        teacherCircles.some(c => c.id === s.circleId)
    );

    const content = `
        <div class="student-tracking-page">
            <div class="page-header">
                <h2><i class="fas fa-chart-line"></i> متابعة الطلاب</h2>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="generateStudentReport()">
                        <i class="fas fa-file-alt"></i> إنشاء تقرير شامل
                    </button>
                    <button class="btn btn-success" onclick="exportStudentData()">
                        <i class="fas fa-download"></i> تصدير البيانات
                    </button>
                    <button class="btn btn-info" onclick="printStudentReport()">
                        <i class="fas fa-print"></i> طباعة التقرير
                    </button>
                </div>
            </div>

            <!-- إحصائيات سريعة -->
            <div class="tracking-stats">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${teacherStudents.length}</h3>
                        <p>إجمالي الطلاب</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${teacherStudents.filter(s => s.grade === 'excellent').length}</h3>
                        <p>طلاب ممتازون</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${teacherStudents.reduce((sum, s) => sum + s.memorized, 0)}</h3>
                        <p>إجمالي الأجزاء المحفوظة</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${calculateAverageAttendance(teacherStudents)}%</h3>
                        <p>متوسط الحضور</p>
                    </div>
                </div>
            </div>

            <!-- مرشحات البحث -->
            <div class="tracking-filters">
                <div class="filter-group">
                    <label>البحث بالاسم:</label>
                    <input type="text" id="studentSearchInput" placeholder="ابحث عن طالب..." onkeyup="filterStudents()">
                </div>
                
                <div class="filter-group">
                    <label>الحلقة:</label>
                    <select id="circleFilter" onchange="filterStudents()">
                        <option value="">جميع الحلقات</option>
                        ${teacherCircles.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>التقدير:</label>
                    <select id="gradeFilter" onchange="filterStudents()">
                        <option value="">جميع التقديرات</option>
                        <option value="excellent">ممتاز</option>
                        <option value="good">جيد</option>
                        <option value="average">متوسط</option>
                        <option value="weak">ضعيف</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>المستوى:</label>
                    <select id="levelFilter" onchange="filterStudents()">
                        <option value="">جميع المستويات</option>
                        <option value="beginner">مبتدئ</option>
                        <option value="intermediate">متوسط</option>
                        <option value="advanced">متقدم</option>
                    </select>
                </div>
            </div>

            <!-- جدول الطلاب المحسن -->
            <div class="students-tracking-table">
                <div class="table-header">
                    <h3><i class="fas fa-table"></i> تفاصيل الطلاب</h3>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="toggleTableView()">
                            <i class="fas fa-th-list"></i> تبديل العرض
                        </button>
                    </div>
                </div>
                
                <div id="studentsTableContainer">
                    <!-- سيتم ملء الجدول هنا -->
                </div>
            </div>

            <!-- الرسوم البيانية -->
            <div class="tracking-charts">
                <div class="chart-container">
                    <h3><i class="fas fa-chart-bar"></i> توزيع التقديرات</h3>
                    <canvas id="gradesChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3><i class="fas fa-chart-line"></i> تطور الحفظ</h3>
                    <canvas id="memorizationChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3><i class="fas fa-chart-pie"></i> توزيع المستويات</h3>
                    <canvas id="levelsChart"></canvas>
                </div>
            </div>

            <!-- أفضل الطلاب -->
            <div class="top-students-section">
                <h3><i class="fas fa-trophy"></i> أفضل الطلاب</h3>
                <div class="top-students-grid">
                    ${getTopStudents(teacherStudents).map((student, index) => `
                        <div class="top-student-card ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}">
                            <div class="rank-badge">${index + 1}</div>
                            <div class="student-info">
                                <h4>${student.name}</h4>
                                <p><i class="fas fa-book"></i> ${student.memorized} أجزاء محفوظة</p>
                                <p><i class="fas fa-star"></i> ${getGradeText(student.grade)}</p>
                                <p><i class="fas fa-mosque"></i> ${systemData.circles.find(c => c.id === student.circleId)?.name}</p>
                            </div>
                            <div class="student-actions">
                                <button class="btn btn-sm btn-primary" onclick="viewStudentDetails(${student.id})">
                                    <i class="fas fa-eye"></i> التفاصيل
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- الطلاب الذين يحتاجون متابعة -->
            <div class="attention-needed-section">
                <h3><i class="fas fa-exclamation-triangle"></i> طلاب يحتاجون متابعة</h3>
                <div class="attention-students-list">
                    ${getStudentsNeedingAttention(teacherStudents).map(student => `
                        <div class="attention-student-card">
                            <div class="student-info">
                                <h4>${student.name}</h4>
                                <div class="attention-reasons">
                                    ${student.reasons.map(reason => `
                                        <span class="reason-badge ${reason.type}">${reason.text}</span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="student-actions">
                                <button class="btn btn-sm btn-warning" onclick="addStudentNote(${student.id})">
                                    <i class="fas fa-sticky-note"></i> إضافة ملاحظة
                                </button>
                                <button class="btn btn-sm btn-info" onclick="contactParent(${student.id})">
                                    <i class="fas fa-phone"></i> اتصال بولي الأمر
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.getElementById('studentsPage').innerHTML = content;
    
    // تحديث الجدول والرسوم البيانية
    updateStudentsTrackingTable();
    createTrackingCharts();
}

// تحديث جدول متابعة الطلاب
function updateStudentsTrackingTable() {
    const teacherId = currentUser.teacherId;
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    let students = systemData.students.filter(s => 
        teacherCircles.some(c => c.id === s.circleId)
    );

    // تطبيق المرشحات
    const searchTerm = document.getElementById('studentSearchInput')?.value.toLowerCase() || '';
    const circleFilter = document.getElementById('circleFilter')?.value || '';
    const gradeFilter = document.getElementById('gradeFilter')?.value || '';
    const levelFilter = document.getElementById('levelFilter')?.value || '';

    if (searchTerm) {
        students = students.filter(s => s.name.toLowerCase().includes(searchTerm));
    }
    if (circleFilter) {
        students = students.filter(s => s.circleId == circleFilter);
    }
    if (gradeFilter) {
        students = students.filter(s => s.grade === gradeFilter);
    }
    if (levelFilter) {
        students = students.filter(s => s.level === levelFilter);
    }

    const tableContainer = document.getElementById('studentsTableContainer');
    if (!tableContainer) return;

    const tableHTML = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>الطالب</th>
                        <th>الحلقة</th>
                        <th>المستوى</th>
                        <th>المحفوظ</th>
                        <th>المراجع</th>
                        <th>التقدير</th>
                        <th>الحضور</th>
                        <th>آخر تحديث</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => {
                        const circle = systemData.circles.find(c => c.id === student.circleId);
                        const attendance = calculateStudentAttendance(student.id);
                        const lastUpdate = getLastStudentUpdate(student.id);
                        
                        return `
                            <tr class="student-row" data-student-id="${student.id}">
                                <td>
                                    <div class="student-cell">
                                        <div class="student-avatar">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div class="student-details">
                                            <strong>${student.name}</strong>
                                            <small>${student.age || 'غير محدد'} سنة</small>
                                        </div>
                                    </div>
                                </td>
                                <td>${circle?.name || 'غير محدد'}</td>
                                <td>
                                    <span class="level-badge ${student.level}">
                                        ${getLevelText(student.level)}
                                    </span>
                                </td>
                                <td>
                                    <div class="memorization-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${(student.memorized / 30) * 100}%"></div>
                                        </div>
                                        <span>${student.memorized}/30</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="reviewed-count">${student.reviewed || 0}</span>
                                </td>
                                <td>
                                    <span class="grade-badge ${student.grade}">
                                        ${getGradeText(student.grade)}
                                    </span>
                                </td>
                                <td>
                                    <div class="attendance-indicator ${attendance >= 80 ? 'good' : attendance >= 60 ? 'average' : 'poor'}">
                                        ${attendance}%
                                    </div>
                                </td>
                                <td>
                                    <small class="last-update">${lastUpdate}</small>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-sm btn-primary" onclick="viewStudentDetails(${student.id})" title="عرض التفاصيل">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-warning" onclick="editStudent(${student.id})" title="تعديل">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-info" onclick="addStudentNote(${student.id})" title="إضافة ملاحظة">
                                            <i class="fas fa-sticky-note"></i>
                                        </button>
                                        <button class="btn btn-sm btn-success" onclick="recordProgress(${student.id})" title="تسجيل تقدم">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;

    tableContainer.innerHTML = tableHTML;
}

// إنشاء الرسوم البيانية
function createTrackingCharts() {
    const teacherId = currentUser.teacherId;
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    const teacherStudents = systemData.students.filter(s => 
        teacherCircles.some(c => c.id === s.circleId)
    );

    // رسم بياني للتقديرات
    createGradesChart(teacherStudents);
    
    // رسم بياني لتطور الحفظ
    createMemorizationChart(teacherStudents);
    
    // رسم بياني للمستويات
    createLevelsChart(teacherStudents);
}

// رسم بياني للتقديرات
function createGradesChart(students) {
    const ctx = document.getElementById('gradesChart');
    if (!ctx) return;

    const grades = {
        excellent: students.filter(s => s.grade === 'excellent').length,
        good: students.filter(s => s.grade === 'good').length,
        average: students.filter(s => s.grade === 'average').length,
        weak: students.filter(s => s.grade === 'weak').length
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'],
            datasets: [{
                label: 'عدد الطلاب',
                data: [grades.excellent, grades.good, grades.average, grades.weak],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// رسم بياني لتطور الحفظ
function createMemorizationChart(students) {
    const ctx = document.getElementById('memorizationChart');
    if (!ctx) return;

    // تجميع البيانات حسب عدد الأجزاء المحفوظة
    const memorizationData = {};
    for (let i = 0; i <= 30; i += 5) {
        const range = `${i}-${i + 4}`;
        memorizationData[range] = students.filter(s => 
            s.memorized >= i && s.memorized < i + 5
        ).length;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(memorizationData),
            datasets: [{
                label: 'عدد الطلاب',
                data: Object.values(memorizationData),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// رسم بياني للمستويات
function createLevelsChart(students) {
    const ctx = document.getElementById('levelsChart');
    if (!ctx) return;

    const levels = {
        beginner: students.filter(s => s.level === 'beginner').length,
        intermediate: students.filter(s => s.level === 'intermediate').length,
        advanced: students.filter(s => s.level === 'advanced').length
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['مبتدئ', 'متوسط', 'متقدم'],
            datasets: [{
                data: [levels.beginner, levels.intermediate, levels.advanced],
                backgroundColor: [
                    '#ffc107',
                    '#17a2b8',
                    '#28a745'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// الحصول على أفضل الطلاب
function getTopStudents(students) {
    return students
        .sort((a, b) => {
            // ترتيب حسب عدد الأجزاء المحفوظة ثم التقدير
            if (b.memorized !== a.memorized) {
                return b.memorized - a.memorized;
            }
            
            const gradeOrder = { excellent: 4, good: 3, average: 2, weak: 1 };
            return gradeOrder[b.grade] - gradeOrder[a.grade];
        })
        .slice(0, 3);
}

// الحصول على الطلاب الذين يحتاجون متابعة
function getStudentsNeedingAttention(students) {
    return students
        .map(student => {
            const reasons = [];
            
            // طلاب بتقدير ضعيف
            if (student.grade === 'weak') {
                reasons.push({ type: 'warning', text: 'تقدير ضعيف' });
            }
            
            // طلاب بحضور منخفض
            const attendance = calculateStudentAttendance(student.id);
            if (attendance < 60) {
                reasons.push({ type: 'danger', text: 'حضور منخفض' });
            }
            
            // طلاب لم يحفظوا أجزاء جديدة مؤخراً
            const lastProgress = getLastProgressUpdate(student.id);
            if (lastProgress > 30) { // أكثر من 30 يوم
                reasons.push({ type: 'info', text: 'لا توجد تحديثات حديثة' });
            }
            
            return { ...student, reasons };
        })
        .filter(student => student.reasons.length > 0)
        .slice(0, 5); // أول 5 طلاب
}

// وظائف مساعدة
function calculateAverageAttendance(students) {
    if (students.length === 0) return 0;
    
    const totalAttendance = students.reduce((sum, student) => {
        return sum + calculateStudentAttendance(student.id);
    }, 0);
    
    return Math.round(totalAttendance / students.length);
}

function calculateStudentAttendance(studentId) {
    // محاكاة حساب الحضور - يمكن تطويرها لاحقاً
    return Math.floor(Math.random() * 40) + 60; // بين 60-100%
}

function getLastStudentUpdate(studentId) {
    // محاكاة آخر تحديث
    const days = Math.floor(Math.random() * 30) + 1;
    return `منذ ${days} يوم`;
}

function getLastProgressUpdate(studentId) {
    // محاكاة آخر تحديث للتقدم
    return Math.floor(Math.random() * 60) + 1; // بين 1-60 يوم
}

function getLevelText(level) {
    const levels = {
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        advanced: 'متقدم'
    };
    return levels[level] || 'غير محدد';
}

function getGradeText(grade) {
    const grades = {
        excellent: 'ممتاز',
        good: 'جيد',
        average: 'متوسط',
        weak: 'ضعيف'
    };
    return grades[grade] || 'غير محدد';
}

// تصفية الطلاب
function filterStudents() {
    updateStudentsTrackingTable();
}

// عرض تفاصيل الطالب
function viewStudentDetails(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;

    const circle = systemData.circles.find(c => c.id === student.circleId);
    const attendance = calculateStudentAttendance(studentId);
    const notes = getStudentNotes(studentId);

    const modalContent = `
        <div class="student-details-modal">
            <h3><i class="fas fa-user"></i> تفاصيل الطالب: ${student.name}</h3>
            
            <div class="student-details-grid">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> المعلومات الأساسية</h4>
                    <div class="detail-item">
                        <label>الاسم الكامل:</label>
                        <span>${student.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>العمر:</label>
                        <span>${student.age || 'غير محدد'} سنة</span>
                    </div>
                    <div class="detail-item">
                        <label>الجنس:</label>
                        <span>${student.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                    </div>
                    <div class="detail-item">
                        <label>الحلقة:</label>
                        <span>${circle?.name || 'غير محدد'}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-book"></i> التقدم الأكاديمي</h4>
                    <div class="detail-item">
                        <label>المستوى:</label>
                        <span class="level-badge ${student.level}">${getLevelText(student.level)}</span>
                    </div>
                    <div class="detail-item">
                        <label>الأجزاء المحفوظة:</label>
                        <span>${student.memorized}/30 جزء</span>
                    </div>
                    <div class="detail-item">
                        <label>الأجزاء المراجعة:</label>
                        <span>${student.reviewed || 0} جزء</span>
                    </div>
                    <div class="detail-item">
                        <label>التقدير:</label>
                        <span class="grade-badge ${student.grade}">${getGradeText(student.grade)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-chart-line"></i> الإحصائيات</h4>
                    <div class="detail-item">
                        <label>نسبة الحضور:</label>
                        <span class="attendance-indicator ${attendance >= 80 ? 'good' : attendance >= 60 ? 'average' : 'poor'}">
                            ${attendance}%
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>تاريخ الانضمام:</label>
                        <span>${new Date(student.createdAt || Date.now()).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-phone"></i> معلومات الاتصال</h4>
                    <div class="detail-item">
                        <label>هاتف الطالب:</label>
                        <span>${student.phone || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-item">
                        <label>هاتف ولي الأمر:</label>
                        <span>${student.parentPhone || 'غير متوفر'}</span>
                    </div>
                </div>
            </div>

            <div class="student-notes-section">
                <h4><i class="fas fa-sticky-note"></i> الملاحظات</h4>
                <div class="notes-list">
                    ${notes.length > 0 ? notes.map(note => `
                        <div class="note-item">
                            <div class="note-content">${note.content}</div>
                            <div class="note-date">${new Date(note.date).toLocaleDateString('ar-SA')}</div>
                        </div>
                    `).join('') : '<p class="no-notes">لا توجد ملاحظات</p>'}
                </div>
                <button class="btn btn-primary" onclick="addStudentNote(${studentId})">
                    <i class="fas fa-plus"></i> إضافة ملاحظة جديدة
                </button>
            </div>

            <div class="modal-actions">
                <button class="btn btn-warning" onclick="editStudent(${studentId})">
                    <i class="fas fa-edit"></i> تعديل البيانات
                </button>
                <button class="btn btn-info" onclick="recordProgress(${studentId})">
                    <i class="fas fa-plus"></i> تسجيل تقدم
                </button>
                <button class="btn btn-success" onclick="generateStudentReport(${studentId})">
                    <i class="fas fa-file-alt"></i> تقرير الطالب
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;

    showModal(modalContent, 'large');
}

// إضافة ملاحظة للطالب
function addStudentNote(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;

    const modalContent = `
        <div class="add-note-modal">
            <h3><i class="fas fa-sticky-note"></i> إضافة ملاحظة - ${student.name}</h3>
            
            <form id="addNoteForm">
                <div class="form-group">
                    <label>نوع الملاحظة:</label>
                    <select id="noteType" required>
                        <option value="general">عامة</option>
                        <option value="academic">أكاديمية</option>
                        <option value="behavioral">سلوكية</option>
                        <option value="attendance">حضور</option>
                        <option value="progress">تقدم</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>الملاحظة:</label>
                    <textarea id="noteContent" rows="4" placeholder="اكتب الملاحظة هنا..." required></textarea>
                </div>
                
                <div class="form-group">
                    <label>الأولوية:</label>
                    <select id="notePriority">
                        <option value="low">منخفضة</option>
                        <option value="medium" selected>متوسطة</option>
                        <option value="high">عالية</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> حفظ الملاحظة
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </form>
        </div>
    `;

    showModal(modalContent);

    document.getElementById('addNoteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const noteData = {
            id: Date.now(),
            studentId: studentId,
            type: document.getElementById('noteType').value,
            content: document.getElementById('noteContent').value,
            priority: document.getElementById('notePriority').value,
            teacherId: currentUser.teacherId,
            date: new Date().toISOString()
        };

        // حفظ الملاحظة
        const notes = getFromStorage('studentNotes') || [];
        notes.push(noteData);
        saveToStorage('studentNotes', notes);

        closeModal();
        showNotification('تم إضافة الملاحظة بنجاح', 'success');
        
        // إعادة فتح تفاصيل الطالب إذا كانت مفتوحة
        setTimeout(() => viewStudentDetails(studentId), 500);
    });
}

// الحصول على ملاحظات الطالب
function getStudentNotes(studentId) {
    const notes = getFromStorage('studentNotes') || [];
    return notes.filter(note => note.studentId === studentId)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// تسجيل تقدم الطالب
function recordProgress(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;

    const modalContent = `
        <div class="record-progress-modal">
            <h3><i class="fas fa-plus"></i> تسجيل تقدم - ${student.name}</h3>
            
            <form id="recordProgressForm">
                <div class="form-group">
                    <label>نوع التقدم:</label>
                    <select id="progressType" required>
                        <option value="memorization">حفظ جديد</option>
                        <option value="review">مراجعة</option>
                        <option value="improvement">تحسن في الأداء</option>
                        <option value="achievement">إنجاز خاص</option>
                    </select>
                </div>
                
                <div class="form-group" id="memorizationGroup">
                    <label>عدد الأجزاء المحفوظة الجديدة:</label>
                    <input type="number" id="newMemorized" min="0" max="5" value="1">
                </div>
                
                <div class="form-group">
                    <label>التفاصيل:</label>
                    <textarea id="progressDetails" rows="3" placeholder="اكتب تفاصيل التقدم..." required></textarea>
                </div>
                
                <div class="form-group">
                    <label>التقدير الجديد (اختياري):</label>
                    <select id="newGrade">
                        <option value="">بدون تغيير</option>
                        <option value="excellent">ممتاز</option>
                        <option value="good">جيد</option>
                        <option value="average">متوسط</option>
                        <option value="weak">ضعيف</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> تسجيل التقدم
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </form>
        </div>
    `;

    showModal(modalContent);

    // إظهار/إخفاء حقل الحفظ الجديد
    document.getElementById('progressType').addEventListener('change', function() {
        const memorizationGroup = document.getElementById('memorizationGroup');
        memorizationGroup.style.display = this.value === 'memorization' ? 'block' : 'none';
    });

    document.getElementById('recordProgressForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const progressType = document.getElementById('progressType').value;
        const progressDetails = document.getElementById('progressDetails').value;
        const newGrade = document.getElementById('newGrade').value;
        
        // تحديث بيانات الطالب
        if (progressType === 'memorization') {
            const newMemorized = parseInt(document.getElementById('newMemorized').value) || 0;
            student.memorized = Math.min(30, student.memorized + newMemorized);
        }
        
        if (newGrade) {
            student.grade = newGrade;
        }

        // حفظ سجل التقدم
        const progressRecord = {
            id: Date.now(),
            studentId: studentId,
            type: progressType,
            details: progressDetails,
            oldMemorized: student.memorized - (progressType === 'memorization' ? parseInt(document.getElementById('newMemorized').value) || 0 : 0),
            newMemorized: student.memorized,
            oldGrade: student.grade,
            newGrade: newGrade || student.grade,
            teacherId: currentUser.teacherId,
            date: new Date().toISOString()
        };

        const progressRecords = getFromStorage('progressRecords') || [];
        progressRecords.push(progressRecord);
        saveToStorage('progressRecords', progressRecords);

        // حفظ بيانات الطالب المحدثة
        saveToStorage('students', systemData.students);

        closeModal();
        showNotification('تم تسجيل التقدم بنجاح', 'success');
        
        // تحديث الجدول
        updateStudentsTrackingTable();
    });
}

// إنشاء تقرير شامل للطلاب
function generateStudentReport(studentId = null) {
    const teacherId = currentUser.teacherId;
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    let students;
    
    if (studentId) {
        students = systemData.students.filter(s => s.id === studentId);
    } else {
        students = systemData.students.filter(s => 
            teacherCircles.some(c => c.id === s.circleId)
        );
    }

    const reportData = {
        title: studentId ? `تقرير الطالب: ${students[0]?.name}` : 'تقرير شامل للطلاب',
        date: new Date().toLocaleDateString('ar-SA'),
        teacher: systemData.teachers.find(t => t.id === teacherId)?.name,
        circles: teacherCircles.map(c => c.name).join(', '),
        students: students.map(student => {
            const circle = systemData.circles.find(c => c.id === student.circleId);
            const notes = getStudentNotes(student.id);
            const attendance = calculateStudentAttendance(student.id);
            
            return {
                ...student,
                circleName: circle?.name,
                attendance: attendance,
                notesCount: notes.length,
                lastNote: notes[0]?.content || 'لا توجد ملاحظات'
            };
        }),
        summary: {
            totalStudents: students.length,
            excellentStudents: students.filter(s => s.grade === 'excellent').length,
            totalMemorized: students.reduce((sum, s) => sum + s.memorized, 0),
            averageMemorized: students.length > 0 ? (students.reduce((sum, s) => sum + s.memorized, 0) / students.length).toFixed(1) : 0,
            averageAttendance: calculateAverageAttendance(students)
        }
    };

    showStudentReportModal(reportData);
}

// عرض تقرير الطلاب
function showStudentReportModal(reportData) {
    const modalContent = `
        <div class="student-report-modal">
            <div class="report-header">
                <h2><i class="fas fa-file-alt"></i> ${reportData.title}</h2>
                <div class="report-meta">
                    <p><strong>التاريخ:</strong> ${reportData.date}</p>
                    <p><strong>المعلم:</strong> ${reportData.teacher}</p>
                    <p><strong>الحلقات:</strong> ${reportData.circles}</p>
                </div>
            </div>

            <div class="report-summary">
                <h3><i class="fas fa-chart-bar"></i> ملخص التقرير</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-number">${reportData.summary.totalStudents}</div>
                        <div class="summary-label">إجمالي الطلاب</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.summary.excellentStudents}</div>
                        <div class="summary-label">طلاب ممتازون</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.summary.totalMemorized}</div>
                        <div class="summary-label">إجمالي الأجزاء المحفوظة</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.summary.averageMemorized}</div>
                        <div class="summary-label">متوسط الحفظ للطالب</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${reportData.summary.averageAttendance}%</div>
                        <div class="summary-label">متوسط الحضور</div>
                    </div>
                </div>
            </div>

            <div class="students-details">
                <h3><i class="fas fa-users"></i> تفاصيل الطلاب</h3>
                <div class="students-table">
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>الطالب</th>
                                <th>الحلقة</th>
                                <th>المحفوظ</th>
                                <th>التقدير</th>
                                <th>الحضور</th>
                                <th>الملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.students.map(student => `
                                <tr>
                                    <td>${student.name}</td>
                                    <td>${student.circleName}</td>
                                    <td>${student.memorized}/30</td>
                                    <td><span class="grade-badge ${student.grade}">${getGradeText(student.grade)}</span></td>
                                    <td>${student.attendance}%</td>
                                    <td>${student.notesCount} ملاحظة</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="report-actions">
                <button class="btn btn-primary" onclick="printStudentReport()">
                    <i class="fas fa-print"></i> طباعة التقرير
                </button>
                <button class="btn btn-success" onclick="exportStudentData()">
                    <i class="fas fa-download"></i> تصدير البيانات
                </button>
                <button class="btn btn-info" onclick="shareStudentReport()">
                    <i class="fas fa-share"></i> مشاركة التقرير
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;

    showModal(modalContent, 'large');
}

// طباعة تقرير الطلاب
function printStudentReport() {
    window.print();
}

// تصدير بيانات الطلاب
function exportStudentData() {
    const teacherId = currentUser.teacherId;
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    const students = systemData.students.filter(s => 
        teacherCircles.some(c => c.id === s.circleId)
    );

    const csvData = students.map(student => {
        const circle = systemData.circles.find(c => c.id === student.circleId);
        return [
            student.name,
            student.age || '',
            student.gender === 'male' ? 'ذكر' : 'أنثى',
            circle?.name || '',
            getLevelText(student.level),
            student.memorized,
            student.reviewed || 0,
            getGradeText(student.grade),
            calculateStudentAttendance(student.id) + '%',
            student.phone || '',
            student.parentPhone || ''
        ].join(',');
    });

    const csvContent = [
        'الاسم,العمر,الجنس,الحلقة,المستوى,المحفوظ,المراجع,التقدير,الحضور,هاتف الطالب,هاتف ولي الأمر',
        ...csvData
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `تقرير_الطلاب_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showNotification('تم تصدير البيانات بنجاح', 'success');
}

// مشاركة تقرير الطلاب
function shareStudentReport() {
    const teacherId = currentUser.teacherId;
    const teacher = systemData.teachers.find(t => t.id === teacherId);
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    const students = systemData.students.filter(s => 
        teacherCircles.some(c => c.id === s.circleId)
    );

    const reportText = `
📊 تقرير متابعة الطلاب

👨‍🏫 المعلم: ${teacher?.name}
📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}
🕌 الحلقات: ${teacherCircles.map(c => c.name).join(', ')}

📈 الإحصائيات:
• إجمالي الطلاب: ${students.length}
• الطلاب الممتازون: ${students.filter(s => s.grade === 'excellent').length}
• إجمالي الأجزاء المحفوظة: ${students.reduce((sum, s) => sum + s.memorized, 0)}
• متوسط الحفظ للطالب: ${students.length > 0 ? (students.reduce((sum, s) => sum + s.memorized, 0) / students.length).toFixed(1) : 0}

🏆 أفضل 3 طلاب:
${getTopStudents(students).map((student, index) => 
    `${index + 1}. ${student.name} - ${student.memorized} أجزاء`
).join('\n')}

#جمعية_تحفيظ_القرآن #متابعة_الطلاب
    `.trim();

    if (navigator.share) {
        navigator.share({
            title: 'تقرير متابعة الطلاب',
            text: reportText
        });
    } else {
        // نسخ النص إلى الحافظة
        navigator.clipboard.writeText(reportText).then(() => {
            showNotification('تم نسخ التقرير إلى الحافظة', 'success');
        });
    }
}

// اتصال بولي الأمر
function contactParent(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student || !student.parentPhone) {
        showNotification('رقم هاتف ولي الأمر غير متوفر', 'warning');
        return;
    }

    const modalContent = `
        <div class="contact-parent-modal">
            <h3><i class="fas fa-phone"></i> اتصال بولي الأمر - ${student.name}</h3>
            
            <div class="contact-info">
                <p><strong>رقم الهاتف:</strong> ${student.parentPhone}</p>
            </div>
            
            <div class="contact-options">
                <a href="tel:${student.parentPhone}" class="btn btn-success">
                    <i class="fas fa-phone"></i> اتصال مباشر
                </a>
                <a href="https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-primary">
                    <i class="fab fa-whatsapp"></i> واتساب
                </a>
                <a href="sms:${student.parentPhone}" class="btn btn-info">
                    <i class="fas fa-sms"></i> رسالة نصية
                </a>
            </div>
            
            <div class="quick-messages">
                <h4>رسائل سريعة:</h4>
                <button class="btn btn-sm btn-outline-primary" onclick="sendQuickMessage('${student.parentPhone}', 'attendance')">
                    رسالة حضور
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="sendQuickMessage('${student.parentPhone}', 'progress')">
                    رسالة تقدم
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="sendQuickMessage('${student.parentPhone}', 'reminder')">
                    رسالة تذكير
                </button>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;

    showModal(modalContent);
}

// إرسال رسالة سريعة
function sendQuickMessage(phone, type) {
    const messages = {
        attendance: 'السلام عليكم، نود إعلامكم بأن ابنكم/ابنتكم لم يحضر حلقة اليوم. نرجو المتابعة.',
        progress: 'السلام عليكم، نبشركم بالتقدم الممتاز لابنكم/ابنتكم في حفظ القرآن الكريم.',
        reminder: 'السلام عليكم، تذكير بموعد حلقة القرآن الكريم غداً. بارك الله فيكم.'
    };

    const message = messages[type];
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// تبديل عرض الجدول
function toggleTableView() {
    // يمكن إضافة وظيفة لتبديل بين العرض الجدولي والبطاقات
    showNotification('ميزة تبديل العرض قيد التطوير', 'info');
}

// تهيئة صفحة متابعة الطلاب
document.addEventListener('DOMContentLoaded', function() {
    // إضافة رابط متابعة الطلاب في قائمة المعلم
    if (currentUser && currentUser.type === 'teacher') {
        const studentsMenuItem = document.querySelector('[data-page="students"]');
        if (studentsMenuItem) {
            studentsMenuItem.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('students');
                showStudentTrackingPage();
            });
        }
    }
});