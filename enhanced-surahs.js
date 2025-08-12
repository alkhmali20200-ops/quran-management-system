// ==================== نظام إدارة السور المحسن ====================

// عرض صفحة السور المحسنة
function showEnhancedSurahs() {
    const content = `
        <div class="enhanced-surahs-page">
            <!-- إحصائيات السور -->
            <div class="surahs-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book-quran"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${systemData.surahs.length}</h3>
                        <p>إجمالي السور</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-mosque"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${systemData.surahs.filter(s => s.type === 'meccan').length}</h3>
                        <p>السور المكية</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-city"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${systemData.surahs.filter(s => s.type === 'medinan').length}</h3>
                        <p>السور المدنية</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${getStudentsWithSurahs().length}</h3>
                        <p>طلاب لديهم سور</p>
                    </div>
                </div>
            </div>

            <!-- أدوات البحث والتصفية -->
            <div class="surahs-filters">
                <div class="filter-group">
                    <label>البحث في السور:</label>
                    <input type="text" id="surahSearch" placeholder="ابحث عن سورة..." onkeyup="filterSurahs()">
                </div>
                <div class="filter-group">
                    <label>النوع:</label>
                    <select id="surahTypeFilter" onchange="filterSurahs()">
                        <option value="">جميع السور</option>
                        <option value="meccan">مكية</option>
                        <option value="medinan">مدنية</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>ترتيب حسب:</label>
                    <select id="surahSort" onchange="filterSurahs()">
                        <option value="order">ترتيب المصحف</option>
                        <option value="name">الاسم</option>
                        <option value="verses">عدد الآيات</option>
                    </select>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" onclick="showBulkAssignModal()">
                        <i class="fas fa-users"></i> تعيين جماعي
                    </button>
                    <button class="btn btn-success" onclick="generateSurahsReport()">
                        <i class="fas fa-file-alt"></i> تقرير السور
                    </button>
                </div>
            </div>

            <!-- قائمة السور -->
            <div class="surahs-list" id="surahsList">
                ${renderSurahsList()}
            </div>

            <!-- إدارة تعيين السور للطلاب -->
            <div class="student-surahs-management">
                <h3><i class="fas fa-user-graduate"></i> إدارة سور الطلاب</h3>
                <div class="students-surahs-grid">
                    ${systemData.students.map(student => `
                        <div class="student-surahs-card">
                            <div class="student-header">
                                <div class="student-avatar">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <div class="student-info">
                                    <h4>${student.name}</h4>
                                    <p>الحلقة: ${getCircleName(student.circleId)}</p>
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="manageSurahsForStudent(${student.id})">
                                    <i class="fas fa-cog"></i> إدارة السور
                                </button>
                            </div>
                            <div class="student-surahs-list">
                                ${getStudentSurahs(student.id).length > 0 ? 
                                    getStudentSurahs(student.id).map(surah => `
                                        <div class="assigned-surah">
                                            <span class="surah-name">${surah.name}</span>
                                            <div class="surah-progress-bar">
                                                <div class="progress-fill" style="width: ${surah.progress || 0}%"></div>
                                            </div>
                                            <span class="surah-progress">${surah.progress || 0}%</span>
                                        </div>
                                    `).join('') : 
                                    '<p class="no-surahs">لم يتم تعيين سور بعد</p>'
                                }
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
    }
}

// رسم قائمة السور
function renderSurahsList() {
    return systemData.surahs.map(surah => `
        <div class="surah-card" data-type="${surah.type}" data-name="${surah.name.toLowerCase()}">
            <div class="surah-header">
                <div class="surah-number">${surah.order}</div>
                <div class="surah-info">
                    <h3>${surah.name}</h3>
                    <div class="surah-details">
                        <span class="surah-verses"><i class="fas fa-list-ol"></i> ${surah.verses} آية</span>
                        <span class="surah-type ${surah.type}">
                            <i class="fas fa-${surah.type === 'meccan' ? 'mosque' : 'city'}"></i>
                            ${surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                        </span>
                        <span class="surah-juz"><i class="fas fa-bookmark"></i> الجزء ${surah.juz}</span>
                    </div>
                </div>
            </div>
            <div class="surah-stats">
                <div class="stat-item">
                    <div class="stat-value">${getStudentsCountForSurah(surah.id)}</div>
                    <div class="stat-label">طالب</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${getAverageProgressForSurah(surah.id)}%</div>
                    <div class="stat-label">متوسط التقدم</div>
                </div>
            </div>
            <div class="surah-actions">
                <button class="btn btn-sm btn-success" onclick="bulkAssignSurah(${surah.id})">
                    <i class="fas fa-users"></i> تعيين لعدة طلاب
                </button>
                <button class="btn btn-sm btn-info" onclick="viewSurahDetails(${surah.id})">
                    <i class="fas fa-eye"></i> التفاصيل
                </button>
                <button class="btn btn-sm btn-warning" onclick="editSurah(${surah.id})">
                    <i class="fas fa-edit"></i> تعديل
                </button>
            </div>
        </div>
    `).join('');
}

// تصفية السور
function filterSurahs() {
    const searchTerm = document.getElementById('surahSearch')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('surahTypeFilter')?.value || '';
    const sortBy = document.getElementById('surahSort')?.value || 'order';
    
    let filteredSurahs = systemData.surahs.filter(surah => {
        const matchesSearch = surah.name.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || surah.type === typeFilter;
        return matchesSearch && matchesType;
    });
    
    // ترتيب السور
    filteredSurahs.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name, 'ar');
            case 'verses':
                return b.verses - a.verses;
            case 'order':
            default:
                return a.order - b.order;
        }
    });
    
    // تحديث العرض
    const surahsList = document.getElementById('surahsList');
    if (surahsList) {
        surahsList.innerHTML = filteredSurahs.map(surah => `
            <div class="surah-card" data-type="${surah.type}" data-name="${surah.name.toLowerCase()}">
                <div class="surah-header">
                    <div class="surah-number">${surah.order}</div>
                    <div class="surah-info">
                        <h3>${surah.name}</h3>
                        <div class="surah-details">
                            <span class="surah-verses"><i class="fas fa-list-ol"></i> ${surah.verses} آية</span>
                            <span class="surah-type ${surah.type}">
                                <i class="fas fa-${surah.type === 'meccan' ? 'mosque' : 'city'}"></i>
                                ${surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                            </span>
                            <span class="surah-juz"><i class="fas fa-bookmark"></i> الجزء ${surah.juz}</span>
                        </div>
                    </div>
                </div>
                <div class="surah-stats">
                    <div class="stat-item">
                        <div class="stat-value">${getStudentsCountForSurah(surah.id)}</div>
                        <div class="stat-label">طالب</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${getAverageProgressForSurah(surah.id)}%</div>
                        <div class="stat-label">متوسط التقدم</div>
                    </div>
                </div>
                <div class="surah-actions">
                    <button class="btn btn-sm btn-success" onclick="bulkAssignSurah(${surah.id})">
                        <i class="fas fa-users"></i> تعيين لعدة طلاب
                    </button>
                    <button class="btn btn-sm btn-info" onclick="viewSurahDetails(${surah.id})">
                        <i class="fas fa-eye"></i> التفاصيل
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editSurah(${surah.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// إدارة سور الطالب
function manageSurahsForStudent(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;
    
    const studentSurahs = getStudentSurahs(studentId);
    
    const modalContent = `
        <div class="manage-student-surahs-modal">
            <h3><i class="fas fa-user-graduate"></i> إدارة سور الطالب: ${student.name}</h3>
            
            <div class="student-surahs-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" onclick="switchSurahTab('assigned')">السور المعينة (${studentSurahs.length})</button>
                    <button class="tab-btn" onclick="switchSurahTab('available')">السور المتاحة</button>
                    <button class="tab-btn" onclick="switchSurahTab('progress')">تتبع التقدم</button>
                </div>
                
                <div class="tab-content">
                    <!-- السور المعينة -->
                    <div id="assigned-tab" class="tab-pane active">
                        <div class="assigned-surahs-list">
                            ${studentSurahs.length > 0 ? 
                                studentSurahs.map(surah => `
                                    <div class="assigned-surah-item">
                                        <div class="surah-info">
                                            <h4>${surah.name}</h4>
                                            <p>${surah.verses} آية - ${surah.type === 'meccan' ? 'مكية' : 'مدنية'} - الجزء ${surah.juz}</p>
                                            <small>تاريخ التعيين: ${new Date(surah.assignedDate).toLocaleDateString('ar-SA')}</small>
                                        </div>
                                        <div class="surah-progress">
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: ${surah.progress || 0}%"></div>
                                            </div>
                                            <span>${surah.progress || 0}%</span>
                                        </div>
                                        <div class="surah-actions">
                                            <button class="btn btn-sm btn-primary" onclick="updateSurahProgress(${studentId}, ${surah.id})">
                                                <i class="fas fa-chart-line"></i> تحديث التقدم
                                            </button>
                                            <button class="btn btn-sm btn-info" onclick="addSurahNote(${studentId}, ${surah.id})">
                                                <i class="fas fa-sticky-note"></i> ملاحظة
                                            </button>
                                            <button class="btn btn-sm btn-danger" onclick="removeSurahFromStudent(${studentId}, ${surah.id})">
                                                <i class="fas fa-times"></i> إزالة
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : 
                                '<div class="no-assigned-surahs"><i class="fas fa-info-circle"></i><p>لم يتم تعيين سور لهذا الطالب بعد</p></div>'
                            }
                        </div>
                        <button class="btn btn-success" onclick="showAddSurahModal(${studentId})">
                            <i class="fas fa-plus"></i> إضافة سورة جديدة
                        </button>
                    </div>
                    
                    <!-- السور المتاحة -->
                    <div id="available-tab" class="tab-pane">
                        <div class="available-surahs-search">
                            <input type="text" id="availableSurahSearch" placeholder="ابحث في السور المتاحة..." onkeyup="filterAvailableSurahs(${studentId})">
                        </div>
                        <div class="available-surahs-grid" id="availableSurahsGrid">
                            ${renderAvailableSurahs(studentId)}
                        </div>
                    </div>
                    
                    <!-- تتبع التقدم -->
                    <div id="progress-tab" class="tab-pane">
                        <div class="progress-overview">
                            <div class="progress-stats">
                                <div class="progress-stat">
                                    <div class="stat-value">${studentSurahs.length}</div>
                                    <div class="stat-label">سور معينة</div>
                                </div>
                                <div class="progress-stat">
                                    <div class="stat-value">${studentSurahs.filter(s => (s.progress || 0) === 100).length}</div>
                                    <div class="stat-label">سور مكتملة</div>
                                </div>
                                <div class="progress-stat">
                                    <div class="stat-value">${studentSurahs.length > 0 ? Math.round(studentSurahs.reduce((sum, s) => sum + (s.progress || 0), 0) / studentSurahs.length) : 0}%</div>
                                    <div class="stat-label">متوسط التقدم</div>
                                </div>
                                <div class="progress-stat">
                                    <div class="stat-value">${studentSurahs.reduce((sum, s) => sum + s.verses, 0)}</div>
                                    <div class="stat-label">إجمالي الآيات</div>
                                </div>
                            </div>
                            
                            <div class="progress-details">
                                <h4><i class="fas fa-list"></i> تفاصيل التقدم</h4>
                                <div class="progress-list">
                                    ${studentSurahs.map(surah => `
                                        <div class="progress-item">
                                            <div class="progress-surah-info">
                                                <h5>${surah.name}</h5>
                                                <p>${surah.verses} آية</p>
                                            </div>
                                            <div class="progress-bar-container">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: ${surah.progress || 0}%"></div>
                                                </div>
                                                <span class="progress-percentage">${surah.progress || 0}%</span>
                                            </div>
                                            <div class="progress-status">
                                                ${(surah.progress || 0) === 100 ? 
                                                    '<span class="status-complete"><i class="fas fa-check-circle"></i> مكتملة</span>' :
                                                    (surah.progress || 0) > 50 ? 
                                                        '<span class="status-progress"><i class="fas fa-clock"></i> قيد التقدم</span>' :
                                                        '<span class="status-started"><i class="fas fa-play"></i> بدأت</span>'
                                                }
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="generateStudentSurahReport(${studentId})">
                    <i class="fas fa-file-alt"></i> تقرير السور
                </button>
                <button class="btn btn-success" onclick="exportStudentSurahs(${studentId})">
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

// عرض السور المتاحة للطالب
function renderAvailableSurahs(studentId) {
    const studentSurahs = getStudentSurahs(studentId);
    const availableSurahs = systemData.surahs.filter(surah => 
        !studentSurahs.find(s => s.id === surah.id)
    );
    
    if (availableSurahs.length === 0) {
        return '<div class="no-available-surahs"><i class="fas fa-check-circle"></i><p>تم تعيين جميع السور لهذا الطالب</p></div>';
    }
    
    return availableSurahs.map(surah => `
        <div class="available-surah-card">
            <div class="surah-header">
                <div class="surah-number">${surah.order}</div>
                <h4>${surah.name}</h4>
                <span class="surah-type ${surah.type}">${surah.type === 'meccan' ? 'مكية' : 'مدنية'}</span>
            </div>
            <div class="surah-details">
                <p><i class="fas fa-list-ol"></i> ${surah.verses} آية</p>
                <p><i class="fas fa-bookmark"></i> الجزء ${surah.juz}</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="assignSurahToSpecificStudent(${studentId}, ${surah.id})">
                <i class="fas fa-plus"></i> تعيين
            </button>
        </div>
    `).join('');
}

// تبديل تبويبات السور
function switchSurahTab(tabName) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار التبويب المحدد
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // تفعيل الزر المحدد
    event.target.classList.add('active');
}

// تعيين سورة لطالب محدد
function assignSurahToSpecificStudent(studentId, surahId) {
    if (!systemData.studentSurahs) {
        systemData.studentSurahs = [];
    }
    
    // التحقق من عدم وجود السورة مسبقاً
    const existingAssignment = systemData.studentSurahs.find(
        ss => ss.studentId === studentId && ss.surahId === surahId
    );
    
    if (existingAssignment) {
        showNotification('هذه السورة معينة للطالب مسبقاً', 'warning');
        return;
    }
    
    // إضافة السورة للطالب
    systemData.studentSurahs.push({
        id: Date.now(),
        studentId: studentId,
        surahId: surahId,
        progress: 0,
        assignedDate: new Date().toISOString(),
        notes: ''
    });
    
    saveData();
    showNotification('تم تعيين السورة للطالب بنجاح', 'success');
    
    // إعادة تحميل النافذة
    manageSurahsForStudent(studentId);
}

// تحديث تقدم السورة
function updateSurahProgress(studentId, surahId) {
    const assignment = systemData.studentSurahs.find(
        ss => ss.studentId === studentId && ss.surahId === surahId
    );
    
    if (!assignment) return;
    
    const surah = systemData.surahs.find(s => s.id === surahId);
    const student = systemData.students.find(s => s.id === studentId);
    
    const modalContent = `
        <div class="update-progress-modal">
            <h3><i class="fas fa-chart-line"></i> تحديث تقدم السورة</h3>
            
            <div class="progress-info">
                <div class="student-surah-info">
                    <h4>الطالب: ${student.name}</h4>
                    <h4>السورة: ${surah.name}</h4>
                    <p>${surah.verses} آية - ${surah.type === 'meccan' ? 'مكية' : 'مدنية'}</p>
                </div>
                
                <div class="current-progress">
                    <label>التقدم الحالي: ${assignment.progress || 0}%</label>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${assignment.progress || 0}%"></div>
                    </div>
                </div>
            </div>
            
            <form id="updateProgressForm">
                <div class="form-group">
                    <label for="newProgress">التقدم الجديد (%):</label>
                    <input type="range" id="newProgress" min="0" max="100" value="${assignment.progress || 0}" 
                           oninput="updateProgressDisplay(this.value)">
                    <div class="progress-display">
                        <span id="progressValue">${assignment.progress || 0}%</span>
                        <div class="progress-bar">
                            <div id="progressPreview" class="progress-fill" style="width: ${assignment.progress || 0}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="progressNotes">ملاحظات التقدم:</label>
                    <textarea id="progressNotes" rows="3" placeholder="أضف ملاحظات حول تقدم الطالب...">${assignment.notes || ''}</textarea>
                </div>
                
                <div class="quick-progress-buttons">
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="setQuickProgress(25)">25%</button>
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="setQuickProgress(50)">50%</button>
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="setQuickProgress(75)">75%</button>
                    <button type="button" class="btn btn-sm btn-outline-success" onclick="setQuickProgress(100)">مكتملة</button>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> حفظ التقدم
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modalContent);
    
    // إضافة مستمع الحدث للنموذج
    setTimeout(() => {
        const form = document.getElementById('updateProgressForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newProgress = parseInt(document.getElementById('newProgress').value);
                const notes = document.getElementById('progressNotes').value;
                
                // تحديث البيانات
                assignment.progress = newProgress;
                assignment.notes = notes;
                assignment.lastUpdated = new Date().toISOString();
                
                saveData();
                showNotification('تم تحديث تقدم السورة بنجاح', 'success');
                closeModal();
                
                // إعادة تحميل إدارة السور
                manageSurahsForStudent(studentId);
            });
        }
    }, 100);
}

// تحديث عرض التقدم
function updateProgressDisplay(value) {
    document.getElementById('progressValue').textContent = value + '%';
    document.getElementById('progressPreview').style.width = value + '%';
}

// تعيين تقدم سريع
function setQuickProgress(value) {
    document.getElementById('newProgress').value = value;
    updateProgressDisplay(value);
}

// إزالة سورة من الطالب
function removeSurahFromStudent(studentId, surahId) {
    if (confirm('هل أنت متأكد من إزالة هذه السورة من الطالب؟')) {
        systemData.studentSurahs = systemData.studentSurahs.filter(
            ss => !(ss.studentId === studentId && ss.surahId === surahId)
        );
        
        saveData();
        showNotification('تم إزالة السورة من الطالب بنجاح', 'success');
        
        // إعادة تحميل إدارة السور
        manageSurahsForStudent(studentId);
    }
}

// الحصول على سور الطالب
function getStudentSurahs(studentId) {
    if (!systemData.studentSurahs) return [];
    
    return systemData.studentSurahs
        .filter(ss => ss.studentId === studentId)
        .map(ss => {
            const surah = systemData.surahs.find(s => s.id === ss.surahId);
            return {
                ...surah,
                progress: ss.progress,
                assignedDate: ss.assignedDate,
                notes: ss.notes,
                lastUpdated: ss.lastUpdated
            };
        })
        .filter(s => s.name); // تصفية السور غير الموجودة
}

// الحصول على عدد الطلاب لسورة معينة
function getStudentsCountForSurah(surahId) {
    if (!systemData.studentSurahs) return 0;
    return systemData.studentSurahs.filter(ss => ss.surahId === surahId).length;
}

// الحصول على متوسط التقدم لسورة معينة
function getAverageProgressForSurah(surahId) {
    if (!systemData.studentSurahs) return 0;
    
    const surahAssignments = systemData.studentSurahs.filter(ss => ss.surahId === surahId);
    if (surahAssignments.length === 0) return 0;
    
    const totalProgress = surahAssignments.reduce((sum, ss) => sum + (ss.progress || 0), 0);
    return Math.round(totalProgress / surahAssignments.length);
}

// الحصول على الطلاب الذين لديهم سور
function getStudentsWithSurahs() {
    if (!systemData.studentSurahs) return [];
    
    const studentIds = [...new Set(systemData.studentSurahs.map(ss => ss.studentId))];
    return systemData.students.filter(s => studentIds.includes(s.id));
}

// عرض تفاصيل السورة
function viewSurahDetails(surahId) {
    const surah = systemData.surahs.find(s => s.id === surahId);
    if (!surah) return;
    
    const studentsWithSurah = systemData.studentSurahs ? 
        systemData.studentSurahs.filter(ss => ss.surahId === surahId) : [];
    
    const modalContent = `
        <div class="surah-details-modal">
            <h3><i class="fas fa-book-quran"></i> تفاصيل السورة: ${surah.name}</h3>
            
            <div class="surah-overview">
                <div class="surah-basic-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <label>الترتيب في المصحف:</label>
                            <span>${surah.order}</span>
                        </div>
                        <div class="info-item">
                            <label>عدد الآيات:</label>
                            <span>${surah.verses}</span>
                        </div>
                        <div class="info-item">
                            <label>النوع:</label>
                            <span class="surah-type ${surah.type}">
                                <i class="fas fa-${surah.type === 'meccan' ? 'mosque' : 'city'}"></i>
                                ${surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                            </span>
                        </div>
                        <div class="info-item">
                            <label>الجزء:</label>
                            <span>${surah.juz}</span>
                        </div>
                    </div>
                </div>
                
                <div class="surah-statistics">
                    <h4><i class="fas fa-chart-bar"></i> إحصائيات السورة</h4>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${studentsWithSurah.length}</div>
                            <div class="stat-label">طالب معين</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${studentsWithSurah.filter(ss => (ss.progress || 0) === 100).length}</div>
                            <div class="stat-label">طالب أكمل</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${getAverageProgressForSurah(surahId)}%</div>
                            <div class="stat-label">متوسط التقدم</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="students-with-surah">
                <h4><i class="fas fa-users"></i> الطلاب المعينون لهذه السورة</h4>
                ${studentsWithSurah.length > 0 ? `
                    <div class="students-list">
                        ${studentsWithSurah.map(ss => {
                            const student = systemData.students.find(s => s.id === ss.studentId);
                            return `
                                <div class="student-surah-item">
                                    <div class="student-info">
                                        <h5>${student?.name || 'طالب غير موجود'}</h5>
                                        <p>الحلقة: ${getCircleName(student?.circleId)}</p>
                                        <small>تاريخ التعيين: ${new Date(ss.assignedDate).toLocaleDateString('ar-SA')}</small>
                                    </div>
                                    <div class="student-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${ss.progress || 0}%"></div>
                                        </div>
                                        <span>${ss.progress || 0}%</span>
                                    </div>
                                    <div class="student-actions">
                                        <button class="btn btn-sm btn-primary" onclick="updateSurahProgress(${ss.studentId}, ${surahId})">
                                            <i class="fas fa-edit"></i> تحديث
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '<p class="no-students">لم يتم تعيين هذه السورة لأي طالب بعد</p>'}
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-success" onclick="bulkAssignSurah(${surahId})">
                    <i class="fas fa-users"></i> تعيين لطلاب جدد
                </button>
                <button class="btn btn-primary" onclick="generateSurahReport(${surahId})">
                    <i class="fas fa-file-alt"></i> تقرير السورة
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// تعيين جماعي للسورة
function bulkAssignSurah(surahId) {
    const surah = systemData.surahs.find(s => s.id === surahId);
    if (!surah) return;
    
    const assignedStudents = systemData.studentSurahs ? 
        systemData.studentSurahs.filter(ss => ss.surahId === surahId).map(ss => ss.studentId) : [];
    
    const availableStudents = systemData.students.filter(s => !assignedStudents.includes(s.id));
    
    const modalContent = `
        <div class="bulk-assign-modal">
            <h3><i class="fas fa-users"></i> تعيين السورة: ${surah.name} لعدة طلاب</h3>
            
            <div class="surah-info">
                <p><strong>السورة:</strong> ${surah.name} - ${surah.verses} آية - ${surah.type === 'meccan' ? 'مكية' : 'مدنية'}</p>
                <p><strong>معينة حالياً لـ:</strong> ${assignedStudents.length} طالب</p>
            </div>
            
            <div class="students-selection">
                <div class="selection-header">
                    <h4>اختر الطلاب:</h4>
                    <div class="selection-actions">
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="selectAllStudents()">
                            <i class="fas fa-check-square"></i> تحديد الكل
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="deselectAllStudents()">
                            <i class="fas fa-square"></i> إلغاء التحديد
                        </button>
                    </div>
                </div>
                
                <div class="students-grid">
                    ${availableStudents.length > 0 ? 
                        availableStudents.map(student => `
                            <div class="student-selection-item">
                                <label class="student-checkbox">
                                    <input type="checkbox" name="selectedStudents" value="${student.id}">
                                    <div class="student-info">
                                        <h5>${student.name}</h5>
                                        <p>الحلقة: ${getCircleName(student.circleId)}</p>
                                        <p>المستوى: ${student.level || 'غير محدد'}</p>
                                    </div>
                                </label>
                            </div>
                        `).join('') : 
                        '<p class="no-available-students">جميع الطلاب معينون لهذه السورة مسبقاً</p>'
                    }
                </div>
            </div>
            
            ${availableStudents.length > 0 ? `
                <div class="assignment-options">
                    <div class="form-group">
                        <label for="initialProgress">التقدم الأولي (%):</label>
                        <input type="number" id="initialProgress" min="0" max="100" value="0">
                    </div>
                    <div class="form-group">
                        <label for="assignmentNotes">ملاحظات التعيين:</label>
                        <textarea id="assignmentNotes" rows="2" placeholder="ملاحظات اختيارية..."></textarea>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="performBulkAssignment(${surahId})">
                        <i class="fas fa-check"></i> تعيين للطلاب المحددين
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            ` : `
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إغلاق
                    </button>
                </div>
            `}
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// تحديد جميع الطلاب
function selectAllStudents() {
    document.querySelectorAll('input[name="selectedStudents"]').forEach(checkbox => {
        checkbox.checked = true;
    });
}

// إلغاء تحديد جميع الطلاب
function deselectAllStudents() {
    document.querySelectorAll('input[name="selectedStudents"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// تنفيذ التعيين الجماعي
function performBulkAssignment(surahId) {
    const selectedStudents = Array.from(document.querySelectorAll('input[name="selectedStudents"]:checked'))
        .map(checkbox => parseInt(checkbox.value));
    
    if (selectedStudents.length === 0) {
        showNotification('يرجى اختيار طالب واحد على الأقل', 'warning');
        return;
    }
    
    const initialProgress = parseInt(document.getElementById('initialProgress').value) || 0;
    const notes = document.getElementById('assignmentNotes').value;
    
    if (!systemData.studentSurahs) {
        systemData.studentSurahs = [];
    }
    
    let assignedCount = 0;
    
    selectedStudents.forEach(studentId => {
        // التحقق من عدم وجود السورة مسبقاً
        const existingAssignment = systemData.studentSurahs.find(
            ss => ss.studentId === studentId && ss.surahId === surahId
        );
        
        if (!existingAssignment) {
            systemData.studentSurahs.push({
                id: Date.now() + Math.random(),
                studentId: studentId,
                surahId: surahId,
                progress: initialProgress,
                assignedDate: new Date().toISOString(),
                notes: notes
            });
            assignedCount++;
        }
    });
    
    saveData();
    showNotification(`تم تعيين السورة لـ ${assignedCount} طالب بنجاح`, 'success');
    closeModal();
    
    // إعادة تحميل الصفحة
    showEnhancedSurahs();
}

// إضافة رابط الصفحة المحسنة في القائمة الجانبية
document.addEventListener('DOMContentLoaded', function() {
    // استبدال رابط السور القديم بالجديد
    const surahsLink = document.querySelector('a[onclick="showPage(\'surahsPage\')"]');
    if (surahsLink) {
        surahsLink.setAttribute('onclick', 'showEnhancedSurahs()');
    }
});