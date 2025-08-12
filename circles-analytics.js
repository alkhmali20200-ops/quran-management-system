// ==================== تحليلات أداء الحلقات ==================== 

// عرض صفحة تحليلات الحلقات
function showCirclesAnalytics() {
    const content = `
        <div class="circles-analytics-page">
            <div class="page-header">
                <h2><i class="fas fa-chart-line"></i> تحليلات أداء الحلقات</h2>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="generateCirclesReport()">
                        <i class="fas fa-file-chart-line"></i> تقرير شامل
                    </button>
                    <button class="btn btn-success" onclick="exportCirclesData()">
                        <i class="fas fa-download"></i> تصدير البيانات
                    </button>
                    <button class="btn btn-info" onclick="shareCirclesAnalytics()">
                        <i class="fas fa-share"></i> مشاركة التحليلات
                    </button>
                </div>
            </div>

            <!-- إحصائيات عامة للحلقات -->
            <div class="circles-overview">
                <div class="overview-stats">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <i class="fas fa-mosque"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${systemData.circles.length}</h3>
                            <p>إجمالي الحلقات</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${systemData.students.length}</h3>
                            <p>إجمالي الطلاب</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${systemData.teachers.length}</h3>
                            <p>المعلمون النشطون</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${systemData.students.reduce((sum, s) => sum + s.memorized, 0)}</h3>
                            <p>إجمالي الأجزاء المحفوظة</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- الرسوم البيانية الرئيسية -->
            <div class="main-charts">
                <div class="chart-container">
                    <h3><i class="fas fa-chart-bar"></i> أداء الحلقات - عدد الطلاب</h3>
                    <canvas id="circlesStudentsChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3><i class="fas fa-chart-line"></i> متوسط الحفظ بالحلقات</h3>
                    <canvas id="circlesMemorizationChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3><i class="fas fa-chart-pie"></i> توزيع التقديرات</h3>
                    <canvas id="circlesGradesChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3><i class="fas fa-chart-area"></i> نسب الحضور</h3>
                    <canvas id="circlesAttendanceChart"></canvas>
                </div>
            </div>

            <!-- تفاصيل الحلقات -->
            <div class="circles-details">
                <h3><i class="fas fa-list"></i> تفاصيل الحلقات</h3>
                <div class="circles-grid">
                    ${systemData.circles.map(circle => {
                        const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
                        const students = systemData.students.filter(s => s.circleId === circle.id);
                        const performance = calculateCirclePerformance(circle.id);
                        
                        return `
                            <div class="circle-card" data-circle-id="${circle.id}">
                                <div class="circle-header">
                                    <h4>${circle.name}</h4>
                                    <div class="performance-badge ${getPerformanceClass(performance.overall)}">
                                        ${performance.overall}%
                                    </div>
                                </div>
                                
                                <div class="circle-info">
                                    <div class="info-item">
                                        <i class="fas fa-chalkboard-teacher"></i>
                                        <span>${teacher?.name || 'غير محدد'}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-users"></i>
                                        <span>${students.length} طالب</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>${circle.location || 'غير محدد'}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-clock"></i>
                                        <span>${circle.time || 'غير محدد'}</span>
                                    </div>
                                </div>
                                
                                <div class="circle-stats">
                                    <div class="stat-item">
                                        <div class="stat-value">${students.filter(s => s.grade === 'excellent').length}</div>
                                        <div class="stat-label">ممتاز</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${students.reduce((sum, s) => sum + s.memorized, 0)}</div>
                                        <div class="stat-label">أجزاء محفوظة</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${performance.attendance}%</div>
                                        <div class="stat-label">حضور</div>
                                    </div>
                                </div>
                                
                                <div class="circle-actions">
                                    <button class="btn btn-sm btn-primary" onclick="viewCircleDetails(${circle.id})">
                                        <i class="fas fa-eye"></i> التفاصيل
                                    </button>
                                    <button class="btn btn-sm btn-info" onclick="generateCircleReport(${circle.id})">
                                        <i class="fas fa-file-alt"></i> تقرير
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- مقارنة الحلقات -->
            <div class="circles-comparison">
                <h3><i class="fas fa-balance-scale"></i> مقارنة الحلقات</h3>
                <div class="comparison-chart">
                    <canvas id="circlesComparisonChart"></canvas>
                </div>
            </div>

            <!-- أفضل الحلقات -->
            <div class="top-circles">
                <h3><i class="fas fa-trophy"></i> أفضل الحلقات</h3>
                <div class="top-circles-list">
                    ${getTopCircles().map((circle, index) => `
                        <div class="top-circle-item ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}">
                            <div class="rank">${index + 1}</div>
                            <div class="circle-info">
                                <h4>${circle.name}</h4>
                                <p><i class="fas fa-chalkboard-teacher"></i> ${circle.teacherName}</p>
                                <p><i class="fas fa-users"></i> ${circle.studentsCount} طالب</p>
                            </div>
                            <div class="performance-score">
                                ${circle.performance}%
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- التوصيات -->
            <div class="recommendations">
                <h3><i class="fas fa-lightbulb"></i> التوصيات والاقتراحات</h3>
                <div class="recommendations-list">
                    ${generateCircleRecommendations().map(rec => `
                        <div class="recommendation-item ${rec.priority}">
                            <div class="rec-icon">
                                <i class="${rec.icon}"></i>
                            </div>
                            <div class="rec-content">
                                <h4>${rec.title}</h4>
                                <p>${rec.description}</p>
                            </div>
                            <div class="rec-priority">
                                ${rec.priority === 'high' ? 'عالية' : rec.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // إضافة المحتوى إلى الصفحة
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = content;
        
        // إنشاء الرسوم البيانية
        setTimeout(() => {
            createCirclesCharts();
        }, 100);
    }
}

// حساب أداء الحلقة
function calculateCirclePerformance(circleId) {
    const circle = systemData.circles.find(c => c.id === circleId);
    const students = systemData.students.filter(s => s.circleId === circleId);
    
    if (students.length === 0) {
        return { overall: 0, memorization: 0, grades: 0, attendance: 0 };
    }

    // حساب أداء الحفظ (متوسط الأجزاء المحفوظة / 30 * 100)
    const avgMemorization = students.reduce((sum, s) => sum + s.memorized, 0) / students.length;
    const memorizationScore = Math.round((avgMemorization / 30) * 100);

    // حساب أداء التقديرات
    const excellentCount = students.filter(s => s.grade === 'excellent').length;
    const goodCount = students.filter(s => s.grade === 'good').length;
    const averageCount = students.filter(s => s.grade === 'average').length;
    const weakCount = students.filter(s => s.grade === 'weak').length;
    
    const gradesScore = Math.round(
        (excellentCount * 100 + goodCount * 80 + averageCount * 60 + weakCount * 40) / students.length
    );

    // حساب الحضور (محاكاة)
    const attendanceScore = Math.floor(Math.random() * 30) + 70; // بين 70-100%

    // الأداء العام
    const overallScore = Math.round((memorizationScore + gradesScore + attendanceScore) / 3);

    return {
        overall: overallScore,
        memorization: memorizationScore,
        grades: gradesScore,
        attendance: attendanceScore
    };
}

// الحصول على فئة الأداء
function getPerformanceClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'weak';
}

// إنشاء الرسوم البيانية
function createCirclesCharts() {
    // التأكد من تحميل Chart.js
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        setTimeout(createCirclesCharts, 500);
        return;
    }
    
    setTimeout(() => {
        createCirclesStudentsChart();
        createCirclesMemorizationChart();
        createCirclesGradesChart();
        createCirclesAttendanceChart();
        createCirclesComparisonChart();
    }, 200);
}

// رسم بياني لعدد الطلاب في كل حلقة
function createCirclesStudentsChart() {
    const ctx = document.getElementById('circlesStudentsChart');
    if (!ctx) return;

    const data = systemData.circles.map(circle => ({
        name: circle.name,
        students: systemData.students.filter(s => s.circleId === circle.id).length
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'عدد الطلاب',
                data: data.map(d => d.students),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
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

// رسم بياني لمتوسط الحفظ
function createCirclesMemorizationChart() {
    const ctx = document.getElementById('circlesMemorizationChart');
    if (!ctx) return;

    const data = systemData.circles.map(circle => {
        const students = systemData.students.filter(s => s.circleId === circle.id);
        const avgMemorization = students.length > 0 ? 
            students.reduce((sum, s) => sum + s.memorized, 0) / students.length : 0;
        
        return {
            name: circle.name,
            avg: avgMemorization.toFixed(1)
        };
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'متوسط الأجزاء المحفوظة',
                data: data.map(d => d.avg),
                borderColor: 'rgba(40, 167, 69, 1)',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
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
                    max: 30
                }
            }
        }
    });
}

// رسم بياني للتقديرات
function createCirclesGradesChart() {
    const ctx = document.getElementById('circlesGradesChart');
    if (!ctx) return;

    const grades = {
        excellent: systemData.students.filter(s => s.grade === 'excellent').length,
        good: systemData.students.filter(s => s.grade === 'good').length,
        average: systemData.students.filter(s => s.grade === 'average').length,
        weak: systemData.students.filter(s => s.grade === 'weak').length
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ممتاز', 'جيد', 'متوسط', 'ضعيف'],
            datasets: [{
                data: [grades.excellent, grades.good, grades.average, grades.weak],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#dc3545'
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

// رسم بياني للحضور
function createCirclesAttendanceChart() {
    const ctx = document.getElementById('circlesAttendanceChart');
    if (!ctx) return;

    const data = systemData.circles.map(circle => ({
        name: circle.name,
        attendance: Math.floor(Math.random() * 30) + 70 // محاكاة بيانات الحضور
    }));

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'نسبة الحضور %',
                data: data.map(d => d.attendance),
                borderColor: 'rgba(255, 193, 7, 1)',
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                pointBackgroundColor: 'rgba(255, 193, 7, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// رسم بياني للمقارنة
function createCirclesComparisonChart() {
    const ctx = document.getElementById('circlesComparisonChart');
    if (!ctx) return;

    const data = systemData.circles.map(circle => {
        const performance = calculateCirclePerformance(circle.id);
        return {
            name: circle.name,
            memorization: performance.memorization,
            grades: performance.grades,
            attendance: performance.attendance
        };
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.name),
            datasets: [
                {
                    label: 'الحفظ',
                    data: data.map(d => d.memorization),
                    backgroundColor: 'rgba(40, 167, 69, 0.8)'
                },
                {
                    label: 'التقديرات',
                    data: data.map(d => d.grades),
                    backgroundColor: 'rgba(23, 162, 184, 0.8)'
                },
                {
                    label: 'الحضور',
                    data: data.map(d => d.attendance),
                    backgroundColor: 'rgba(255, 193, 7, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// الحصول على أفضل الحلقات
function getTopCircles() {
    return systemData.circles.map(circle => {
        const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
        const students = systemData.students.filter(s => s.circleId === circle.id);
        const performance = calculateCirclePerformance(circle.id);
        
        return {
            ...circle,
            teacherName: teacher?.name || 'غير محدد',
            studentsCount: students.length,
            performance: performance.overall
        };
    })
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 3);
}

// إنشاء التوصيات
function generateCircleRecommendations() {
    const recommendations = [];
    
    // تحليل الحلقات وإنشاء التوصيات
    systemData.circles.forEach(circle => {
        const students = systemData.students.filter(s => s.circleId === circle.id);
        const performance = calculateCirclePerformance(circle.id);
        
        // حلقات بأداء منخفض
        if (performance.overall < 70) {
            recommendations.push({
                title: `تحسين أداء حلقة ${circle.name}`,
                description: `الحلقة تحتاج إلى متابعة خاصة لتحسين الأداء العام`,
                priority: 'high',
                icon: 'fas fa-exclamation-triangle'
            });
        }
        
        // حلقات بعدد طلاب قليل
        if (students.length < 5) {
            recommendations.push({
                title: `زيادة عدد الطلاب في حلقة ${circle.name}`,
                description: `الحلقة تحتوي على ${students.length} طلاب فقط، يمكن زيادة العدد`,
                priority: 'medium',
                icon: 'fas fa-user-plus'
            });
        }
        
        // حلقات بعدد طلاب كبير
        if (students.length > 15) {
            recommendations.push({
                title: `تقسيم حلقة ${circle.name}`,
                description: `الحلقة تحتوي على ${students.length} طالب، قد تحتاج إلى تقسيم`,
                priority: 'medium',
                icon: 'fas fa-cut'
            });
        }
    });
    
    // توصيات عامة
    const totalStudents = systemData.students.length;
    const totalCircles = systemData.circles.length;
    const avgStudentsPerCircle = totalStudents / totalCircles;
    
    if (avgStudentsPerCircle > 12) {
        recommendations.push({
            title: 'إضافة حلقات جديدة',
            description: `متوسط الطلاب في الحلقة ${avgStudentsPerCircle.toFixed(1)} طالب، يُنصح بإضافة حلقات جديدة`,
            priority: 'high',
            icon: 'fas fa-plus-circle'
        });
    }
    
    const excellentStudents = systemData.students.filter(s => s.grade === 'excellent').length;
    const excellentPercentage = (excellentStudents / totalStudents) * 100;
    
    if (excellentPercentage < 30) {
        recommendations.push({
            title: 'برامج تحفيزية للطلاب',
            description: `نسبة الطلاب الممتازين ${excellentPercentage.toFixed(1)}%، يُنصح بإضافة برامج تحفيزية`,
            priority: 'medium',
            icon: 'fas fa-trophy'
        });
    }
    
    return recommendations.slice(0, 5); // أول 5 توصيات
}

// عرض تفاصيل الحلقة
function viewCircleDetails(circleId) {
    const circle = systemData.circles.find(c => c.id === circleId);
    const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
    const students = systemData.students.filter(s => s.circleId === circleId);
    const performance = calculateCirclePerformance(circleId);
    
    const modalContent = `
        <div class="circle-details-modal">
            <h3><i class="fas fa-mosque"></i> تفاصيل حلقة: ${circle.name}</h3>
            
            <div class="circle-overview">
                <div class="overview-grid">
                    <div class="overview-item">
                        <label>المعلم:</label>
                        <span>${teacher?.name || 'غير محدد'}</span>
                    </div>
                    <div class="overview-item">
                        <label>الموقع:</label>
                        <span>${circle.location || 'غير محدد'}</span>
                    </div>
                    <div class="overview-item">
                        <label>الوقت:</label>
                        <span>${circle.time || 'غير محدد'}</span>
                    </div>
                    <div class="overview-item">
                        <label>عدد الطلاب:</label>
                        <span>${students.length} طالب</span>
                    </div>
                </div>
            </div>
            
            <div class="performance-overview">
                <h4><i class="fas fa-chart-line"></i> نظرة عامة على الأداء</h4>
                <div class="performance-grid">
                    <div class="performance-item">
                        <div class="performance-value ${getPerformanceClass(performance.overall)}">${performance.overall}%</div>
                        <div class="performance-label">الأداء العام</div>
                    </div>
                    <div class="performance-item">
                        <div class="performance-value ${getPerformanceClass(performance.memorization)}">${performance.memorization}%</div>
                        <div class="performance-label">الحفظ</div>
                    </div>
                    <div class="performance-item">
                        <div class="performance-value ${getPerformanceClass(performance.grades)}">${performance.grades}%</div>
                        <div class="performance-label">التقديرات</div>
                    </div>
                    <div class="performance-item">
                        <div class="performance-value ${getPerformanceClass(performance.attendance)}">${performance.attendance}%</div>
                        <div class="performance-label">الحضور</div>
                    </div>
                </div>
            </div>
            
            <div class="students-summary">
                <h4><i class="fas fa-users"></i> ملخص الطلاب</h4>
                <div class="students-stats">
                    <div class="stat-item">
                        <div class="stat-value">${students.filter(s => s.grade === 'excellent').length}</div>
                        <div class="stat-label">ممتاز</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${students.filter(s => s.grade === 'good').length}</div>
                        <div class="stat-label">جيد</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${students.filter(s => s.grade === 'average').length}</div>
                        <div class="stat-label">متوسط</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${students.filter(s => s.grade === 'weak').length}</div>
                        <div class="stat-label">ضعيف</div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="generateCircleReport(${circleId})">
                    <i class="fas fa-file-alt"></i> إنشاء تقرير
                </button>
                <button class="btn btn-success" onclick="exportCircleData(${circleId})">
                    <i class="fas fa-download"></i> تصدير البيانات
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// إنشاء تقرير للحلقة
function generateCircleReport(circleId) {
    const circle = systemData.circles.find(c => c.id === circleId);
    const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
    const students = systemData.students.filter(s => s.circleId === circleId);
    const performance = calculateCirclePerformance(circleId);
    
    const reportData = {
        circle: circle,
        teacher: teacher,
        students: students,
        performance: performance,
        date: new Date().toLocaleDateString('ar-SA')
    };
    
    showCircleReportModal(reportData);
}

// عرض تقرير الحلقة
function showCircleReportModal(data) {
    const modalContent = `
        <div class="circle-report-modal">
            <div class="report-header">
                <h2><i class="fas fa-file-alt"></i> تقرير حلقة: ${data.circle.name}</h2>
                <div class="report-meta">
                    <p><strong>التاريخ:</strong> ${data.date}</p>
                    <p><strong>المعلم:</strong> ${data.teacher?.name || 'غير محدد'}</p>
                    <p><strong>الموقع:</strong> ${data.circle.location || 'غير محدد'}</p>
                </div>
            </div>
            
            <div class="report-performance">
                <h3><i class="fas fa-chart-bar"></i> الأداء العام</h3>
                <div class="performance-summary">
                    <div class="performance-item">
                        <div class="performance-circle ${getPerformanceClass(data.performance.overall)}">
                            ${data.performance.overall}%
                        </div>
                        <div class="performance-label">الأداء العام</div>
                    </div>
                </div>
                
                <div class="performance-breakdown">
                    <div class="breakdown-item">
                        <label>الحفظ:</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.performance.memorization}%"></div>
                        </div>
                        <span>${data.performance.memorization}%</span>
                    </div>
                    <div class="breakdown-item">
                        <label>التقديرات:</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.performance.grades}%"></div>
                        </div>
                        <span>${data.performance.grades}%</span>
                    </div>
                    <div class="breakdown-item">
                        <label>الحضور:</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.performance.attendance}%"></div>
                        </div>
                        <span>${data.performance.attendance}%</span>
                    </div>
                </div>
            </div>
            
            <div class="report-students">
                <h3><i class="fas fa-users"></i> الطلاب (${data.students.length})</h3>
                <div class="students-table">
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>الطالب</th>
                                <th>المحفوظ</th>
                                <th>التقدير</th>
                                <th>الملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.students.map(student => `
                                <tr>
                                    <td>${student.name}</td>
                                    <td>${student.memorized}/30</td>
                                    <td><span class="grade-badge ${student.grade}">${getGradeText(student.grade)}</span></td>
                                    <td>${student.notes || 'لا توجد ملاحظات'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="report-actions">
                <button class="btn btn-primary" onclick="printCircleReport()">
                    <i class="fas fa-print"></i> طباعة
                </button>
                <button class="btn btn-success" onclick="exportCircleData(${data.circle.id})">
                    <i class="fas fa-download"></i> تصدير
                </button>
                <button class="btn btn-info" onclick="shareCircleReport(${data.circle.id})">
                    <i class="fas fa-share"></i> مشاركة
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// مشاركة تحليلات الحلقات
function shareCirclesAnalytics() {
    const totalStudents = systemData.students.length;
    const totalCircles = systemData.circles.length;
    const excellentStudents = systemData.students.filter(s => s.grade === 'excellent').length;
    const totalMemorized = systemData.students.reduce((sum, s) => sum + s.memorized, 0);
    
    const shareText = `
🕌 تحليلات أداء الحلقات - جمعية تحفيظ القرآن الكريم

📊 الإحصائيات العامة:
• ${totalCircles} حلقة نشطة
• ${totalStudents} طالب وطالبة
• ${excellentStudents} طالب بتقدير ممتاز
• ${totalMemorized} جزء محفوظ إجمالي

🏆 أفضل الحلقات:
${getTopCircles().map((circle, index) => 
    `${index + 1}. ${circle.name} - ${circle.performance}%`
).join('\n')}

📈 متوسط الأداء العام: ${Math.round(getTopCircles().reduce((sum, c) => sum + c.performance, 0) / getTopCircles().length)}%

#جمعية_تحفيظ_القرآن #تحليلات_الأداء #التعليم_القرآني
    `.trim();

    if (navigator.share) {
        navigator.share({
            title: 'تحليلات أداء الحلقات',
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('تم نسخ التحليلات إلى الحافظة', 'success');
        });
    }
}

// إضافة رابط التحليلات في القائمة الجانبية
document.addEventListener('DOMContentLoaded', function() {
    // إضافة عنصر جديد في القائمة للإدارة
    if (currentUser && currentUser.type === 'admin') {
        const sidebar = document.querySelector('.sidebar-menu');
        if (sidebar) {
            const analyticsItem = document.createElement('li');
            analyticsItem.innerHTML = `
                <a href="#" class="menu-item" onclick="showCirclesAnalytics()">
                    <i class="fas fa-chart-line"></i>
                    <span>تحليلات الحلقات</span>
                </a>
            `;
            sidebar.appendChild(analyticsItem);
        }
    }
});