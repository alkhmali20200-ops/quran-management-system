// ==================== إعدادات الجمعية ====================

// إعدادات الجمعية الافتراضية
const DEFAULT_ORGANIZATION = {
    name: 'جمعية تحفيظ القرآن الكريم',
    logo: '', // سيتم تحديثه من قبل الإدارة
    description: 'نظام إدارة الحلقات والطلاب',
    address: '',
    phone: '',
    email: '',
    website: '',
    establishedYear: new Date().getFullYear(),
    colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#28a745'
    }
};

// حفظ إعدادات الجمعية
function saveOrganizationSettings(settings) {
    saveToStorage('organizationSettings', settings);
    updateOrganizationDisplay();
    showNotification('تم حفظ إعدادات الجمعية بنجاح', 'success');
}

// جلب إعدادات الجمعية
function getOrganizationSettings() {
    return getFromStorage('organizationSettings') || DEFAULT_ORGANIZATION;
}

// تحديث عرض الجمعية في جميع أنحاء النظام
function updateOrganizationDisplay() {
    const settings = getOrganizationSettings();
    
    // تحديث العنوان
    document.title = settings.name;
    
    // تحديث الشعار والاسم في الهيدر
    const headerTitle = document.querySelector('.login-header h1, .header h1');
    if (headerTitle) {
        headerTitle.textContent = settings.name;
    }
    
    // تحديث الشعار
    const logoElements = document.querySelectorAll('.organization-logo');
    logoElements.forEach(logo => {
        if (settings.logo) {
            logo.innerHTML = `<img src="${settings.logo}" alt="${settings.name}" style="max-height: 50px;">`;
        } else {
            logo.innerHTML = '<i class="fas fa-mosque"></i>';
        }
    });
    
    // تحديث الوصف
    const descElements = document.querySelectorAll('.organization-description');
    descElements.forEach(desc => {
        desc.textContent = settings.description;
    });
    
    // تحديث الألوان
    if (settings.colors) {
        document.documentElement.style.setProperty('--primary-color', settings.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', settings.colors.secondary);
        document.documentElement.style.setProperty('--accent-color', settings.colors.accent);
    }
}

// عرض نموذج إعدادات الجمعية
function showOrganizationSettingsModal() {
    const settings = getOrganizationSettings();
    
    // التأكد من وجود العنصر المنبثق
    let modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) {
        // إنشاء النموذج المنبثق إذا لم يكن موجوداً
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'modalOverlay';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = '<div id="modalContent" class="modal-content"></div>';
        document.body.appendChild(modalOverlay);
    }
    
    const modalContent = `
        <div class="organization-settings-modal">
            <h3><i class="fas fa-cog"></i> إعدادات الجمعية</h3>
            
            <form id="organizationSettingsForm">
                <div class="settings-tabs">
                    <button type="button" class="tab-btn active" onclick="showSettingsTab('basic')">
                        <i class="fas fa-info-circle"></i> المعلومات الأساسية
                    </button>
                    <button type="button" class="tab-btn" onclick="showSettingsTab('branding')">
                        <i class="fas fa-palette"></i> الهوية البصرية
                    </button>
                    <button type="button" class="tab-btn" onclick="showSettingsTab('contact')">
                        <i class="fas fa-phone"></i> معلومات الاتصال
                    </button>
                </div>
                
                <!-- المعلومات الأساسية -->
                <div id="basicTab" class="settings-tab active">
                    <div class="form-group">
                        <label>اسم الجمعية</label>
                        <input type="text" id="orgName" value="${settings.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>وصف الجمعية</label>
                        <textarea id="orgDescription" rows="3">${settings.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>سنة التأسيس</label>
                        <input type="number" id="orgYear" value="${settings.establishedYear}" min="1900" max="2030">
                    </div>
                    
                    <div class="form-group">
                        <label>العنوان</label>
                        <textarea id="orgAddress" rows="2">${settings.address || ''}</textarea>
                    </div>
                </div>
                
                <!-- الهوية البصرية -->
                <div id="brandingTab" class="settings-tab">
                    <div class="form-group">
                        <label>شعار الجمعية</label>
                        <div class="logo-upload-section">
                            <div class="current-logo">
                                <div class="organization-logo">
                                    ${settings.logo ? 
                                        `<img src="${settings.logo}" alt="الشعار الحالي" style="max-height: 100px;">` : 
                                        '<i class="fas fa-mosque" style="font-size: 4rem; color: #ccc;"></i>'
                                    }
                                </div>
                            </div>
                            <input type="file" id="logoFile" accept="image/*" onchange="handleLogoUpload(this)">
                            <input type="url" id="logoUrl" placeholder="أو أدخل رابط الشعار" value="${settings.logo || ''}">
                            <button type="button" class="btn btn-secondary" onclick="previewLogo()">معاينة الشعار</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>ألوان الجمعية</label>
                        <div class="color-picker-group">
                            <div class="color-item">
                                <label>اللون الأساسي</label>
                                <input type="color" id="primaryColor" value="${settings.colors?.primary || '#667eea'}">
                            </div>
                            <div class="color-item">
                                <label>اللون الثانوي</label>
                                <input type="color" id="secondaryColor" value="${settings.colors?.secondary || '#764ba2'}">
                            </div>
                            <div class="color-item">
                                <label>لون التمييز</label>
                                <input type="color" id="accentColor" value="${settings.colors?.accent || '#28a745'}">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- معلومات الاتصال -->
                <div id="contactTab" class="settings-tab">
                    <div class="form-group">
                        <label>رقم الهاتف</label>
                        <input type="tel" id="orgPhone" value="${settings.phone || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" id="orgEmail" value="${settings.email || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>الموقع الإلكتروني</label>
                        <input type="url" id="orgWebsite" value="${settings.website || ''}">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> حفظ الإعدادات
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modalContent, 'large');
    
    // معالج إرسال النموذج
    document.getElementById('organizationSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newSettings = {
            name: document.getElementById('orgName').value,
            description: document.getElementById('orgDescription').value,
            establishedYear: parseInt(document.getElementById('orgYear').value),
            address: document.getElementById('orgAddress').value,
            phone: document.getElementById('orgPhone').value,
            email: document.getElementById('orgEmail').value,
            website: document.getElementById('orgWebsite').value,
            logo: document.getElementById('logoUrl').value,
            colors: {
                primary: document.getElementById('primaryColor').value,
                secondary: document.getElementById('secondaryColor').value,
                accent: document.getElementById('accentColor').value
            }
        };
        
        saveOrganizationSettings(newSettings);
        closeModal();
    });
}

// تبديل تبويبات الإعدادات
function showSettingsTab(tabName) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار التبويب المحدد
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// معالجة رفع الشعار
function handleLogoUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('logoUrl').value = e.target.result;
            previewLogo();
        };
        reader.readAsDataURL(file);
    }
}

// معاينة الشعار
function previewLogo() {
    const logoUrl = document.getElementById('logoUrl').value;
    const logoPreview = document.querySelector('.current-logo .organization-logo');
    
    if (logoUrl) {
        logoPreview.innerHTML = `<img src="${logoUrl}" alt="معاينة الشعار" style="max-height: 100px;">`;
    } else {
        logoPreview.innerHTML = '<i class="fas fa-mosque" style="font-size: 4rem; color: #ccc;"></i>';
    }
}

// ==================== نظام المستخدمين المحسن ====================

// إنشاء حساب معلم جديد
function createTeacherAccount() {
    const modalContent = `
        <div class="create-teacher-account">
            <h3><i class="fas fa-user-plus"></i> إنشاء حساب معلم جديد</h3>
            
            <form id="createTeacherForm">
                <div class="form-group">
                    <label>اختر المعلم</label>
                    <select id="teacherSelect" required>
                        <option value="">اختر المعلم</option>
                        ${systemData.teachers.map(teacher => {
                            const hasAccount = systemData.users?.some(user => user.teacherId === teacher.id);
                            return hasAccount ? '' : `<option value="${teacher.id}">${teacher.name}</option>`;
                        }).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>اسم المستخدم</label>
                    <input type="text" id="teacherUsername" required>
                    <small>سيتم استخدامه لتسجيل الدخول</small>
                </div>
                
                <div class="form-group">
                    <label>كلمة المرور</label>
                    <input type="password" id="teacherPassword" required>
                    <small>يجب أن تكون 6 أحرف على الأقل</small>
                </div>
                
                <div class="form-group">
                    <label>تأكيد كلمة المرور</label>
                    <input type="password" id="confirmPassword" required>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="sendCredentials">
                        إرسال بيانات الدخول للمعلم (إذا توفر رقم الجوال)
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-user-plus"></i> إنشاء الحساب
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modalContent);
    
    document.getElementById('createTeacherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const teacherId = document.getElementById('teacherSelect').value;
        const username = document.getElementById('teacherUsername').value;
        const password = document.getElementById('teacherPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // التحقق من كلمة المرور
        if (password !== confirmPassword) {
            showNotification('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        // التحقق من عدم تكرار اسم المستخدم
        if (!systemData.users) systemData.users = [];
        
        const existingUser = systemData.users.find(user => user.username === username);
        if (existingUser) {
            showNotification('اسم المستخدم موجود بالفعل', 'error');
            return;
        }
        
        // إنشاء الحساب
        const newUser = {
            id: Date.now(),
            username: username,
            password: password, // في الإنتاج يجب تشفيرها
            type: 'teacher',
            teacherId: parseInt(teacherId),
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        systemData.users.push(newUser);
        saveToStorage('users', systemData.users);
        
        // إرسال البيانات للمعلم (محاكاة)
        if (document.getElementById('sendCredentials').checked) {
            const teacher = systemData.teachers.find(t => t.id == teacherId);
            if (teacher && teacher.phone) {
                showNotification(`تم إرسال بيانات الدخول للمعلم ${teacher.name}`, 'success');
            }
        }
        
        showNotification('تم إنشاء حساب المعلم بنجاح', 'success');
        closeModal();
        updateTeacherAccountsList();
    });
}

// عرض قائمة حسابات المعلمين
function showTeacherAccountsList() {
    if (!systemData.users) systemData.users = [];
    
    const teacherAccounts = systemData.users.filter(user => user.type === 'teacher');
    
    const modalContent = `
        <div class="teacher-accounts-list">
            <h3><i class="fas fa-users"></i> حسابات المعلمين</h3>
            
            <div class="accounts-header">
                <button class="btn btn-primary" onclick="closeModal(); createTeacherAccount();">
                    <i class="fas fa-user-plus"></i> إنشاء حساب جديد
                </button>
            </div>
            
            <div class="accounts-table">
                ${teacherAccounts.length === 0 ? 
                    '<p class="no-data">لا توجد حسابات معلمين</p>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>المعلم</th>
                                <th>اسم المستخدم</th>
                                <th>تاريخ الإنشاء</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teacherAccounts.map(account => {
                                const teacher = systemData.teachers.find(t => t.id === account.teacherId);
                                return `
                                    <tr>
                                        <td>${teacher ? teacher.name : 'غير محدد'}</td>
                                        <td>${account.username}</td>
                                        <td>${new Date(account.createdAt).toLocaleDateString('ar-SA')}</td>
                                        <td>
                                            <span class="status ${account.isActive ? 'active' : 'inactive'}">
                                                ${account.isActive ? 'نشط' : 'معطل'}
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-warning" onclick="toggleAccountStatus(${account.id})">
                                                <i class="fas fa-${account.isActive ? 'ban' : 'check'}"></i>
                                                ${account.isActive ? 'تعطيل' : 'تفعيل'}
                                            </button>
                                            <button class="btn btn-sm btn-info" onclick="resetTeacherPassword(${account.id})">
                                                <i class="fas fa-key"></i> إعادة تعيين كلمة المرور
                                            </button>
                                            <button class="btn btn-sm btn-danger" onclick="deleteTeacherAccount(${account.id})">
                                                <i class="fas fa-trash"></i> حذف
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// تبديل حالة الحساب
function toggleAccountStatus(accountId) {
    const account = systemData.users.find(u => u.id === accountId);
    if (account) {
        account.isActive = !account.isActive;
        saveToStorage('users', systemData.users);
        showNotification(`تم ${account.isActive ? 'تفعيل' : 'تعطيل'} الحساب`, 'success');
        showTeacherAccountsList();
    }
}

// إعادة تعيين كلمة المرور
function resetTeacherPassword(accountId) {
    const newPassword = prompt('أدخل كلمة المرور الجديدة (6 أحرف على الأقل):');
    
    if (newPassword && newPassword.length >= 6) {
        const account = systemData.users.find(u => u.id === accountId);
        if (account) {
            account.password = newPassword;
            saveToStorage('users', systemData.users);
            showNotification('تم تغيير كلمة المرور بنجاح', 'success');
            
            // إرسال كلمة المرور الجديدة للمعلم (محاكاة)
            const teacher = systemData.teachers.find(t => t.id === account.teacherId);
            if (teacher && teacher.phone) {
                showNotification(`تم إرسال كلمة المرور الجديدة للمعلم ${teacher.name}`, 'info');
            }
        }
    } else if (newPassword !== null) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
    }
}

// حذف حساب المعلم
function deleteTeacherAccount(accountId) {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
        systemData.users = systemData.users.filter(u => u.id !== accountId);
        saveToStorage('users', systemData.users);
        showNotification('تم حذف الحساب بنجاح', 'success');
        showTeacherAccountsList();
    }
}

// تحديث قائمة حسابات المعلمين
function updateTeacherAccountsList() {
    // تحديث أي عناصر في الواجهة تعرض حسابات المعلمين
    const accountsCount = systemData.users ? systemData.users.filter(u => u.type === 'teacher').length : 0;
    
    // يمكن إضافة عداد في لوحة التحكم
    const teacherAccountsCounter = document.getElementById('teacherAccountsCount');
    if (teacherAccountsCounter) {
        teacherAccountsCounter.textContent = accountsCount;
    }
}

// ==================== صفحة الطلاب العامة ====================

// عرض صفحة الطلاب العامة
function showStudentPublicPage() {
    const content = `
        <div class="student-public-page">
            <div class="page-header">
                <div class="organization-logo"></div>
                <h1 class="organization-name">${getOrganizationSettings().name}</h1>
                <p class="organization-description">${getOrganizationSettings().description}</p>
            </div>
            
            <div class="circle-selection">
                <h2><i class="fas fa-users"></i> اختر حلقتك</h2>
                <div class="circles-grid">
                    ${systemData.circles.map(circle => {
                        const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
                        const studentsCount = systemData.students.filter(s => s.circleId === circle.id).length;
                        
                        return `
                            <div class="circle-card" onclick="showCircleInfo(${circle.id})">
                                <div class="circle-icon">
                                    <i class="fas fa-mosque"></i>
                                </div>
                                <h3>${circle.name}</h3>
                                <div class="circle-details">
                                    <p><i class="fas fa-user-tie"></i> ${teacher ? teacher.name : 'غير محدد'}</p>
                                    <p><i class="fas fa-map-marker-alt"></i> ${circle.mosque}</p>
                                    <p><i class="fas fa-clock"></i> ${getTimeText(circle.time)}</p>
                                    <p><i class="fas fa-users"></i> ${studentsCount} طالب</p>
                                </div>
                                <button class="btn btn-primary">
                                    <i class="fas fa-eye"></i> عرض التفاصيل
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- أفضل 3 طلاب -->
            <div class="top-students-section">
                <h2><i class="fas fa-trophy"></i> الطلاب المتميزون</h2>
                <div class="top-students-podium">
                    ${getTopStudents()}
                </div>
            </div>
            
            <!-- إحصائيات عامة -->
            <div class="public-stats">
                <h2><i class="fas fa-chart-bar"></i> إحصائيات الجمعية</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-number">${systemData.students.length}</div>
                        <div class="stat-label">إجمالي الطلاب</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                        <div class="stat-number">${systemData.teachers.length}</div>
                        <div class="stat-label">المعلمون</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-mosque"></i></div>
                        <div class="stat-number">${systemData.circles.length}</div>
                        <div class="stat-label">الحلقات</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-book-quran"></i></div>
                        <div class="stat-number">${systemData.students.reduce((sum, s) => sum + s.memorized, 0)}</div>
                        <div class="stat-label">الأجزاء المحفوظة</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return content;
}

// عرض معلومات الحلقة للطلاب
function showCircleInfo(circleId) {
    const circle = systemData.circles.find(c => c.id === circleId);
    const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
    const students = systemData.students.filter(s => s.circleId === circleId);
    
    // الحصول على الإعلانات والملاحظات
    const announcements = getCircleAnnouncements(circleId);
    const notes = getCircleNotes(circleId);
    
    const modalContent = `
        <div class="circle-info-modal">
            <h3><i class="fas fa-mosque"></i> ${circle.name}</h3>
            
            <div class="circle-info-tabs">
                <button class="tab-btn active" onclick="showCircleTab('info')">
                    <i class="fas fa-info-circle"></i> معلومات الحلقة
                </button>
                <button class="tab-btn" onclick="showCircleTab('announcements')">
                    <i class="fas fa-bullhorn"></i> الإعلانات
                </button>
                <button class="tab-btn" onclick="showCircleTab('notes')">
                    <i class="fas fa-sticky-note"></i> ملاحظات المعلم
                </button>
                <button class="tab-btn" onclick="showCircleTab('students')">
                    <i class="fas fa-users"></i> الطلاب
                </button>
            </div>
            
            <!-- معلومات الحلقة -->
            <div id="infoTab" class="circle-tab active">
                <div class="circle-details-card">
                    <div class="detail-item">
                        <i class="fas fa-user-tie"></i>
                        <span>المعلم: ${teacher ? teacher.name : 'غير محدد'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>المسجد: ${circle.mosque}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>الوقت: ${getTimeText(circle.time)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-venus-mars"></i>
                        <span>النوع: ${circle.gender === 'male' ? 'ذكور' : 'إناث'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>عدد الطلاب: ${students.length} / ${circle.maxStudents}</span>
                    </div>
                </div>
            </div>
            
            <!-- الإعلانات -->
            <div id="announcementsTab" class="circle-tab">
                <div class="announcements-list">
                    ${announcements.length === 0 ? 
                        '<p class="no-data">لا توجد إعلانات حالياً</p>' :
                        announcements.map(announcement => `
                            <div class="announcement-item ${announcement.priority}">
                                <div class="announcement-header">
                                    <h4>${announcement.title}</h4>
                                    <span class="announcement-date">${new Date(announcement.date).toLocaleDateString('ar-SA')}</span>
                                </div>
                                <div class="announcement-content">
                                    ${announcement.content}
                                </div>
                                ${announcement.priority === 'high' ? '<div class="priority-badge">مهم</div>' : ''}
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <!-- ملاحظات المعلم -->
            <div id="notesTab" class="circle-tab">
                <div class="teacher-notes">
                    ${notes.length === 0 ? 
                        '<p class="no-data">لا توجد ملاحظات من المعلم</p>' :
                        notes.map(note => `
                            <div class="teacher-note">
                                <div class="note-header">
                                    <span class="note-date">${new Date(note.date).toLocaleDateString('ar-SA')}</span>
                                </div>
                                <div class="note-content">
                                    ${note.content}
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <!-- الطلاب -->
            <div id="studentsTab" class="circle-tab">
                <div class="students-list">
                    ${students.map(student => `
                        <div class="student-item">
                            <div class="student-info">
                                <h4>${student.name}</h4>
                                <p>المستوى: ${getLevelText(student.level)}</p>
                                <p>الأجزاء المحفوظة: ${student.memorized}</p>
                            </div>
                            <div class="student-grade">
                                <span class="grade ${student.grade}">${getGradeText(student.grade)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// تبديل تبويبات معلومات الحلقة
function showCircleTab(tabName) {
    document.querySelectorAll('.circle-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// الحصول على أفضل 3 طلاب
function getTopStudents() {
    const topStudents = systemData.students
        .filter(student => student.grade === 'excellent')
        .sort((a, b) => b.memorized - a.memorized)
        .slice(0, 3);
    
    if (topStudents.length === 0) {
        return '<p class="no-data">لا توجد بيانات للطلاب المتميزين حالياً</p>';
    }
    
    return topStudents.map((student, index) => {
        const circle = systemData.circles.find(c => c.id === student.circleId);
        const medals = ['🥇', '🥈', '🥉'];
        
        return `
            <div class="top-student-card rank-${index + 1}">
                <div class="medal">${medals[index]}</div>
                <div class="student-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <h3>${student.name}</h3>
                <div class="student-stats">
                    <p><i class="fas fa-book-quran"></i> ${student.memorized} أجزاء</p>
                    <p><i class="fas fa-mosque"></i> ${circle ? circle.name : 'غير محدد'}</p>
                    <p><i class="fas fa-star"></i> ${getGradeText(student.grade)}</p>
                </div>
            </div>
        `;
    }).join('');
}

// الحصول على إعلانات الحلقة
function getCircleAnnouncements(circleId) {
    // في التطبيق الحقيقي، ستأتي من قاعدة البيانات
    const announcements = getFromStorage('circleAnnouncements') || [];
    return announcements.filter(a => a.circleId === circleId);
}

// الحصول على ملاحظات المعلم للحلقة
function getCircleNotes(circleId) {
    // في التطبيق الحقيقي، ستأتي من قاعدة البيانات
    const notes = getFromStorage('circleNotes') || [];
    return notes.filter(n => n.circleId === circleId);
}

// تهيئة إعدادات الجمعية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تأخير قصير للتأكد من تحميل البيانات الأساسية أولاً
    setTimeout(() => {
        updateOrganizationDisplay();
        
        // التأكد من وجود systemData
        if (typeof systemData !== 'undefined') {
            // إنشاء المستخدمين الافتراضيين إذا لم يكونوا موجودين
            if (!systemData.users) {
                systemData.users = [
                    {
                        id: 1,
                        username: 'admin',
                        password: 'admin123',
                        type: 'admin',
                        isActive: true,
                        createdAt: new Date().toISOString()
                    }
                ];
                saveToStorage('users', systemData.users);
            }
        }
    }, 100);
});