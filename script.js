// إعدادات النظام
const SYSTEM_CONFIG = {
    APP_NAME: 'جمعية تحفيظ القرآن الكريم',
    VERSION: '1.0.0',
    STORAGE_PREFIX: 'quran_app_'
};

// بيانات النظام
let currentUser = null;
let systemData = {
    users: [],
    teachers: [],
    students: [],
    circles: [],
    attendance: [],
    progress: [],
    activities: [],
    surahs: [], // إضافة السور
    studentNotes: [], // ملاحظات الطلاب بالذكاء الاصطناعي
    settings: {}
};

// تهيئة النظام
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
});

// تهيئة النظام
function initializeSystem() {
    // إنشاء بيانات تجريبية إذا لم تكن موجودة
    if (!localStorage.getItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'initialized')) {
        createDemoData();
        localStorage.setItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'initialized', 'true');
    }
    
    // تحميل البيانات بعد التهيئة
    loadSystemData();
}

// إنشاء بيانات تجريبية
function createDemoData() {
    // المستخدمون
    const users = [
        { id: 1, username: 'admin', password: 'admin123', type: 'admin', name: 'مدير النظام' },
        { id: 2, username: 'teacher1', password: 'teacher123', type: 'teacher', name: 'أحمد محمد', teacherId: 1 },
        { id: 3, username: 'teacher2', password: 'teacher123', type: 'teacher', name: 'فاطمة علي', teacherId: 2 },
        { id: 4, username: 'student1', password: 'student123', type: 'student', name: 'محمد أحمد', studentId: 1 }
    ];

    // المعلمون
    const teachers = [
        {
            id: 1,
            name: 'أحمد محمد السعدي',
            phone: '0501234567',
            email: 'ahmed@example.com',
            specialization: 'تحفيظ القرآن الكريم',
            experience: 5,
            circles: [1, 2],
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'فاطمة علي الزهراني',
            phone: '0507654321',
            email: 'fatima@example.com',
            specialization: 'تحفيظ القرآن الكريم',
            experience: 3,
            circles: [3],
            createdAt: new Date().toISOString()
        }
    ];

    // الحلقات
    const circles = [
        {
            id: 1,
            name: 'حلقة الفجر للذكور',
            teacherId: 1,
            mosque: 'مسجد النور',
            time: 'after_fajr',
            days: ['sunday', 'monday', 'tuesday', 'wednesday'],
            gender: 'male',
            maxStudents: 15,
            students: [1, 2, 3],
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'حلقة العصر للذكور',
            teacherId: 1,
            mosque: 'مسجد النور',
            time: 'after_asr',
            days: ['sunday', 'monday', 'tuesday', 'wednesday'],
            gender: 'male',
            maxStudents: 20,
            students: [4, 5],
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'حلقة المغرب للإناث',
            teacherId: 2,
            mosque: 'مسجد الهدى',
            time: 'after_maghrib',
            days: ['sunday', 'monday', 'tuesday', 'wednesday'],
            gender: 'female',
            maxStudents: 12,
            students: [6, 7, 8],
            createdAt: new Date().toISOString()
        }
    ];

    // الطلاب
    const students = [
        {
            id: 1,
            name: 'محمد أحمد الغامدي',
            gender: 'male',
            phone: '', // رقم الجوال اختياري
            parentPhone: '0502222222',
            circleId: 1,
            level: 'beginner',
            memorized: 2, // عدد الأجزاء المحفوظة
            reviewed: 1, // عدد الأجزاء المراجعة
            grade: 'excellent',
            joinDate: new Date().toISOString(),
            notes: 'طالب متميز ونشيط'
        },
        {
            id: 2,
            name: 'عبدالله سعد القحطاني',
            gender: 'male',
            phone: '0503333333',
            parentPhone: '0504444444',
            circleId: 1,
            level: 'intermediate',
            memorized: 5,
            reviewed: 3,
            grade: 'good',
            joinDate: new Date().toISOString(),
            notes: ''
        },
        {
            id: 3,
            name: 'يوسف محمد العتيبي',
            gender: 'male',
            phone: '', // بدون رقم جوال
            parentPhone: '0506666666',
            circleId: 1,
            level: 'beginner',
            memorized: 1,
            reviewed: 0,
            grade: 'average',
            joinDate: new Date().toISOString(),
            notes: 'يحتاج إلى مزيد من التشجيع'
        },
        {
            id: 4,
            name: 'خالد عبدالرحمن الدوسري',
            gender: 'male',
            phone: '0507777777',
            parentPhone: '0508888888',
            circleId: 2,
            level: 'advanced',
            memorized: 10,
            reviewed: 8,
            grade: 'excellent',
            joinDate: new Date().toISOString(),
            notes: 'طالب متفوق'
        },
        {
            id: 5,
            name: 'عمر فهد الشهري',
            gender: 'male',
            phone: '',
            parentPhone: '0501010101',
            circleId: 2,
            level: 'intermediate',
            memorized: 4,
            reviewed: 2,
            grade: 'good',
            joinDate: new Date().toISOString(),
            notes: ''
        },
        {
            id: 6,
            name: 'عائشة أحمد المطيري',
            gender: 'female',
            phone: '0501212121',
            parentPhone: '0501313131',
            circleId: 3,
            level: 'beginner',
            memorized: 3,
            reviewed: 2,
            grade: 'excellent',
            joinDate: new Date().toISOString(),
            notes: 'طالبة متميزة'
        },
        {
            id: 7,
            name: 'فاطمة سعد الحربي',
            gender: 'female',
            phone: '',
            parentPhone: '0501515151',
            circleId: 3,
            level: 'intermediate',
            memorized: 6,
            reviewed: 4,
            grade: 'good',
            joinDate: new Date().toISOString(),
            notes: ''
        },
        {
            id: 8,
            name: 'زينب محمد الزهراني',
            gender: 'female',
            phone: '',
            parentPhone: '0501717171',
            circleId: 3,
            level: 'beginner',
            memorized: 2,
            reviewed: 1,
            grade: 'average',
            joinDate: new Date().toISOString(),
            notes: 'تحتاج إلى مزيد من المتابعة'
        }
    ];

    // السور والآيات
    const surahs = [
        { id: 1, name: 'الفاتحة', verses: 7, juz: 1, order: 1 },
        { id: 2, name: 'البقرة', verses: 286, juz: 1, order: 2 },
        { id: 3, name: 'آل عمران', verses: 200, juz: 3, order: 3 },
        { id: 4, name: 'النساء', verses: 176, juz: 4, order: 4 },
        { id: 5, name: 'المائدة', verses: 120, juz: 6, order: 5 },
        { id: 6, name: 'الأنعام', verses: 165, juz: 7, order: 6 },
        { id: 7, name: 'الأعراف', verses: 206, juz: 8, order: 7 },
        { id: 8, name: 'الأنفال', verses: 75, juz: 9, order: 8 },
        { id: 9, name: 'التوبة', verses: 129, juz: 10, order: 9 },
        { id: 10, name: 'يونس', verses: 109, juz: 11, order: 10 },
        { id: 11, name: 'هود', verses: 123, juz: 11, order: 11 },
        { id: 12, name: 'يوسف', verses: 111, juz: 12, order: 12 },
        { id: 13, name: 'الرعد', verses: 43, juz: 13, order: 13 },
        { id: 14, name: 'إبراهيم', verses: 52, juz: 13, order: 14 },
        { id: 15, name: 'الحجر', verses: 99, juz: 14, order: 15 },
        { id: 16, name: 'النحل', verses: 128, juz: 14, order: 16 },
        { id: 17, name: 'الإسراء', verses: 111, juz: 15, order: 17 },
        { id: 18, name: 'الكهف', verses: 110, juz: 15, order: 18 },
        { id: 19, name: 'مريم', verses: 98, juz: 16, order: 19 },
        { id: 20, name: 'طه', verses: 135, juz: 16, order: 20 }
        // يمكن إضافة باقي السور حسب الحاجة
    ];

    // ملاحظات الطلاب بالذكاء الاصطناعي
    const studentNotes = [
        {
            id: 1,
            studentId: 1,
            type: 'ai_suggestion',
            content: 'يُنصح بالتركيز على تحسين التجويد، خاصة في أحكام النون الساكنة والتنوين',
            priority: 'high',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            studentId: 3,
            type: 'ai_suggestion',
            content: 'الطالب يحتاج إلى مراجعة أكثر للأجزاء المحفوظة، يُنصح بتخصيص 15 دقيقة يومياً للمراجعة',
            priority: 'medium',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            studentId: 8,
            type: 'ai_suggestion',
            content: 'تحتاج إلى تحفيز إضافي، يُنصح بوضع أهداف قصيرة المدى وتقديم مكافآت عند تحقيقها',
            priority: 'high',
            createdAt: new Date().toISOString()
        }
    ];

    // حفظ البيانات
    saveToStorage('users', users);
    saveToStorage('teachers', teachers);
    saveToStorage('students', students);
    saveToStorage('circles', circles);
    saveToStorage('surahs', surahs);
    saveToStorage('studentNotes', studentNotes);
    saveToStorage('attendance', []);
    saveToStorage('progress', []);
    saveToStorage('activities', []);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تسجيل الدخول
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // التنقل في القائمة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // أزرار الإضافة
    document.getElementById('addTeacherBtn')?.addEventListener('click', () => showAddTeacherModal());
    document.getElementById('addStudentBtn')?.addEventListener('click', () => showAddStudentModal());
    document.getElementById('addCircleBtn')?.addEventListener('click', () => showAddCircleModal());
    
    // المرشحات
    document.getElementById('circleFilter')?.addEventListener('change', filterStudents);
    document.getElementById('genderFilter')?.addEventListener('change', filterStudents);
}

// تحميل بيانات النظام
function loadSystemData() {
    // تحميل البيانات من التخزين المحلي
    const loadedUsers = getFromStorage('users');
    const loadedTeachers = getFromStorage('teachers');
    const loadedStudents = getFromStorage('students');
    const loadedCircles = getFromStorage('circles');
    
    // إذا كانت البيانات موجودة، استخدمها، وإلا احتفظ بالبيانات التجريبية
    if (loadedUsers && loadedUsers.length > 0) {
        systemData.users = loadedUsers;
    }
    if (loadedTeachers && loadedTeachers.length > 0) {
        systemData.teachers = loadedTeachers;
    }
    if (loadedStudents && loadedStudents.length > 0) {
        systemData.students = loadedStudents;
    }
    if (loadedCircles && loadedCircles.length > 0) {
        systemData.circles = loadedCircles;
    }
    
    // تحميل باقي البيانات
    systemData.attendance = getFromStorage('attendance') || [];
    systemData.progress = getFromStorage('progress') || [];
    systemData.activities = getFromStorage('activities') || [];
    systemData.surahs = getFromStorage('surahs') || [];
    systemData.studentNotes = getFromStorage('studentNotes') || [];
    
    // التأكد من وجود المستخدم الإداري
    if (!systemData.users.find(u => u.username === 'admin')) {
        systemData.users.push({
            id: 1,
            username: 'admin',
            password: 'admin123',
            type: 'admin',
            name: 'مدير النظام',
            isActive: true
        });
        saveToStorage('users', systemData.users);
    }
    
    // التحقق من سلامة البيانات
    validateSystemData();
}

// التحقق من سلامة البيانات
function validateSystemData() {
    // إذا كانت البيانات فارغة أو معطلة، أعد إنشاءها
    if (!systemData.teachers || systemData.teachers.length === 0 ||
        !systemData.students || systemData.students.length === 0 ||
        !systemData.circles || systemData.circles.length === 0) {
        
        console.log('البيانات معطلة، جاري إعادة إنشاءها...');
        resetSystemData();
    }
}

// إعادة تعيين بيانات النظام
function resetSystemData() {
    // مسح البيانات المعطلة
    localStorage.removeItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'initialized');
    localStorage.removeItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'teachers');
    localStorage.removeItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'students');
    localStorage.removeItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'circles');
    localStorage.removeItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'users');
    
    // إعادة إنشاء البيانات
    createDemoData();
    localStorage.setItem(SYSTEM_CONFIG.STORAGE_PREFIX + 'initialized', 'true');
    
    // إعادة تحميل البيانات
    loadSystemData();
    
    console.log('تم إعادة تعيين البيانات بنجاح');
}

// حفظ البيانات في التخزين المحلي
function saveToStorage(key, data) {
    localStorage.setItem(SYSTEM_CONFIG.STORAGE_PREFIX + key, JSON.stringify(data));
}

// استرجاع البيانات من التخزين المحلي
function getFromStorage(key) {
    const data = localStorage.getItem(SYSTEM_CONFIG.STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : null;
}

// معالج تسجيل الدخول المحسن
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // التحقق من نوع المستخدم
    if (userType === 'student_public') {
        // دخول الطلاب العام - بدون كلمة مرور
        showStudentPublicInterface();
        return;
    }
    
    // التحقق من المستخدمين المسجلين
    let user = systemData.users.find(u => 
        u.username === username && 
        u.password === password && 
        u.type === userType &&
        (u.isActive !== false) // التحقق من أن الحساب نشط
    );
    
    // إذا لم يوجد المستخدم، تحقق من البيانات التجريبية القديمة
    if (!user && userType === 'teacher') {
        // البحث في المعلمين مباشرة للتوافق مع النظام القديم
        const teacher = systemData.teachers.find(t => 
            (t.username === username || `teacher${t.id}` === username || username === 'teacher1' || username === 'teacher2') && 
            (t.password === password || password === 'teacher123')
        );
        
        if (teacher) {
            // إنشاء حساب مستخدم للمعلم تلقائياً
            user = {
                id: Date.now(),
                username: username,
                password: password,
                type: 'teacher',
                name: teacher.name,
                teacherId: teacher.id,
                isActive: true,
                createdAt: new Date().toISOString()
            };
            
            // إضافة المستخدم إلى النظام
            systemData.users.push(user);
            saveToStorage('users', systemData.users);
        } else {
            // إذا لم يوجد المعلم، جرب البحث بطريقة أخرى
            let teacherId = null;
            if (username === 'teacher1') teacherId = 1;
            else if (username === 'teacher2') teacherId = 2;
            else if (username.startsWith('teacher')) {
                teacherId = parseInt(username.replace('teacher', ''));
            }
            
            if (teacherId && password === 'teacher123') {
                const foundTeacher = systemData.teachers.find(t => t.id === teacherId);
                if (foundTeacher) {
                    user = {
                        id: Date.now(),
                        username: username,
                        password: password,
                        type: 'teacher',
                        name: foundTeacher.name,
                        teacherId: foundTeacher.id,
                        isActive: true,
                        createdAt: new Date().toISOString()
                    };
                    
                    systemData.users.push(user);
                    saveToStorage('users', systemData.users);
                }
            }
        }
    }
    
    if (user) {
        currentUser = {
            ...user,
            loginTime: new Date()
        };
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'grid';
        
        // رسالة ترحيب مخصصة
        let welcomeMessage = `مرحباً، ${user.name || user.username}`;
        if (userType === 'teacher' && user.teacherId) {
            const teacher = systemData.teachers.find(t => t.id === user.teacherId);
            if (teacher) {
                welcomeMessage = `مرحباً، ${teacher.name}`;
            }
        }
        
        document.getElementById('currentUser').textContent = welcomeMessage;
        
        // تطبيق صلاحيات المستخدم
        document.body.className = user.type;
        
        // عرض لوحة التحكم
        showPage('dashboard');
        updateDashboard();
        
        // تحديث القوائم
        updateTeachersTable();
        updateStudentsTable();
        updateCirclesFilter();
        
        showNotification(welcomeMessage, 'success');
        
    } else {
        showNotification('بيانات الدخول غير صحيحة أو الحساب معطل', 'error');
    }
}

// عرض واجهة الطلاب العامة
function showStudentPublicInterface() {
    // إخفاء شاشة تسجيل الدخول
    document.getElementById('loginScreen').style.display = 'none';
    
    // إنشاء واجهة الطلاب العامة
    const publicInterface = document.createElement('div');
    publicInterface.id = 'studentPublicInterface';
    publicInterface.className = 'student-public-interface';
    publicInterface.innerHTML = `
        <div class="public-header">
            <div class="organization-logo"></div>
            <h1 class="organization-name"></h1>
            <button class="btn btn-secondary logout-btn" onclick="logoutFromPublic()">
                <i class="fas fa-sign-out-alt"></i> الخروج
            </button>
        </div>
        <div class="public-content">
            ${showStudentPublicPage()}
        </div>
    `;
    
    document.body.appendChild(publicInterface);
    
    // تحديث عرض الجمعية
    updateOrganizationDisplay();
    
    currentUser = {
        type: 'student_public',
        loginTime: new Date()
    };
    
    showNotification('مرحباً بك في صفحة الطلاب', 'success');
}

// الخروج من الواجهة العامة
function logoutFromPublic() {
    const publicInterface = document.getElementById('studentPublicInterface');
    if (publicInterface) {
        publicInterface.remove();
    }
    
    document.getElementById('loginScreen').style.display = 'flex';
    currentUser = null;
}

// تبديل حقول كلمة المرور حسب نوع المستخدم
function togglePasswordFields() {
    const userType = document.getElementById('userType').value;
    const usernameGroup = document.querySelector('#username').parentElement;
    const passwordGroup = document.querySelector('#password').parentElement;
    
    if (userType === 'student_public') {
        // إخفاء حقول اسم المستخدم وكلمة المرور للدخول العام
        usernameGroup.style.display = 'none';
        passwordGroup.style.display = 'none';
        
        // إزالة الإلزامية
        document.getElementById('username').required = false;
        document.getElementById('password').required = false;
        
        // تغيير نص الزر
        document.querySelector('.login-btn').innerHTML = '<i class="fas fa-users"></i> دخول صفحة الطلاب';
    } else {
        // إظهار حقول اسم المستخدم وكلمة المرور
        usernameGroup.style.display = 'block';
        passwordGroup.style.display = 'block';
        
        // إضافة الإلزامية
        document.getElementById('username').required = true;
        document.getElementById('password').required = true;
        
        // إعادة نص الزر الأصلي
        document.querySelector('.login-btn').innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
    }
}

// معالج تسجيل الخروج
function handleLogout() {
    currentUser = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.body.className = '';
}

// تبديل القائمة الجانبية للجوال
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// إغلاق القائمة الجانبية عند النقر خارجها (للجوال)
document.addEventListener('click', function(e) {
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        sidebar && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        menuBtn && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// إظهار/إخفاء زر القائمة حسب حجم الشاشة
function updateMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        } else {
            menuBtn.style.display = 'none';
            // إزالة الفئة النشطة من القائمة الجانبية
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }
    }
}

// تحديث القائمة عند تغيير حجم الشاشة
window.addEventListener('resize', updateMobileMenu);

// تحديث القائمة عند تحميل الصفحة
setTimeout(() => {
    updateMobileMenu();
}, 500);

// معالج التنقل
function handleNavigation(e) {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    showPage(page);
    
    // تحديث القائمة النشطة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
}

// عرض الصفحة
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId + 'Page').classList.add('active');
    
    // تحديث محتوى الصفحة حسب الحاجة
    switch(pageId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'teachers':
            updateTeachersTable();
            break;
        case 'students':
            updateStudentsTable();
            break;
        case 'circles':
            updateCirclesPage();
            break;
        case 'attendance':
            updateAttendancePage();
            break;
        case 'progress':
            updateProgressPage();
            break;
        case 'calendar':
            updateCalendarPage();
            break;
        case 'activities':
            updateActivitiesPage();
            break;
        case 'excellence':
            updateExcellencePage();
            break;
        case 'surahs':
            showSurahsPage();
            break;
        case 'studentProfile':
            // الصفحة تُحدث من خلال showStudentProfile()
            break;
    }
}

// تحديث لوحة التحكم
function updateDashboard() {
    // تحديث الإحصائيات
    document.getElementById('totalStudents').textContent = systemData.students.length;
    document.getElementById('totalTeachers').textContent = systemData.teachers.length;
    document.getElementById('totalCircles').textContent = systemData.circles.length;
    
    // حساب نسبة الحضور اليوم (مؤقت)
    document.getElementById('todayAttendance').textContent = '85%';
    
    // إضافة أزرار الإدارة للمشرفين
    addAdminButtons();
    
    // رسم الرسوم البيانية
    drawMemorizeChart();
    drawAttendanceChart();
}

// إضافة أزرار الإدارة
function addAdminButtons() {
    if (currentUser && currentUser.type === 'admin') {
        const dashboardContent = document.getElementById('dashboardContent');
        
        // التحقق من وجود قسم الإدارة
        let adminSection = document.getElementById('adminControlsSection');
        if (!adminSection) {
            adminSection = document.createElement('div');
            adminSection.id = 'adminControlsSection';
            adminSection.className = 'admin-controls-section';
            adminSection.innerHTML = `
                <h3><i class="fas fa-cogs"></i> إعدادات الإدارة</h3>
                <div class="admin-buttons">
                    <button class="btn btn-primary" onclick="showOrganizationSettingsModal()">
                        <i class="fas fa-building"></i> إعدادات الجمعية
                    </button>
                    <button class="btn btn-success" onclick="showTeacherAccountsList()">
                        <i class="fas fa-user-cog"></i> حسابات المعلمين
                    </button>
                    <button class="btn btn-info" onclick="createTeacherAccount()">
                        <i class="fas fa-user-plus"></i> إنشاء حساب معلم
                    </button>
                    <button class="btn btn-warning" onclick="generateAIReport()">
                        <i class="fas fa-robot"></i> تقرير ذكي
                    </button>
                </div>
            `;
            
            // إدراج القسم بعد الإحصائيات
            const statsSection = dashboardContent.querySelector('.stats-grid');
            if (statsSection) {
                statsSection.parentNode.insertBefore(adminSection, statsSection.nextSibling);
            } else {
                dashboardContent.appendChild(adminSection);
            }
        }
    }
}

// رسم رسم بياني للحفظ
function drawMemorizeChart() {
    const ctx = document.getElementById('memorizeChart').getContext('2d');
    
    // حساب البيانات
    const levels = {
        'ممتاز': systemData.students.filter(s => s.grade === 'excellent').length,
        'جيد': systemData.students.filter(s => s.grade === 'good').length,
        'متوسط': systemData.students.filter(s => s.grade === 'average').length,
        'ضعيف': systemData.students.filter(s => s.grade === 'weak').length
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(levels),
            datasets: [{
                data: Object.values(levels),
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

// رسم رسم بياني للحضور
function drawAttendanceChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // بيانات وهمية للحضور الأسبوعي
    const attendanceData = [85, 90, 88, 92, 87, 89, 91];
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'نسبة الحضور %',
                data: attendanceData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
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

// تحديث جدول المعلمين
function updateTeachersTable() {
    const tbody = document.querySelector('#teachersTable tbody');
    tbody.innerHTML = '';
    
    systemData.teachers.forEach(teacher => {
        const teacherCircles = systemData.circles.filter(c => c.teacherId === teacher.id);
        const totalStudents = teacherCircles.reduce((sum, circle) => sum + circle.students.length, 0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.phone}</td>
            <td>${teacherCircles.map(c => c.name).join(', ')}</td>
            <td>${totalStudents}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editTeacher(${teacher.id})">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${teacher.id})">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تحديث جدول الطلاب
function updateStudentsTable() {
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';
    
    let filteredStudents = systemData.students;
    
    // تطبيق المرشحات
    const circleFilter = document.getElementById('circleFilter').value;
    const genderFilter = document.getElementById('genderFilter').value;
    
    if (circleFilter) {
        filteredStudents = filteredStudents.filter(s => s.circleId == circleFilter);
    }
    
    if (genderFilter) {
        filteredStudents = filteredStudents.filter(s => s.gender === genderFilter);
    }
    
    filteredStudents.forEach(student => {
        const circle = systemData.circles.find(c => c.id === student.circleId);
        const teacher = systemData.teachers.find(t => t.id === circle?.teacherId);
        
        const gradeClass = {
            'excellent': 'badge-excellent',
            'good': 'badge-good',
            'average': 'badge-average',
            'weak': 'badge-weak'
        }[student.grade];
        
        const gradeText = {
            'excellent': 'ممتاز',
            'good': 'جيد',
            'average': 'متوسط',
            'weak': 'ضعيف'
        }[student.grade];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
            <td>${circle?.name || 'غير محدد'}</td>
            <td>${teacher?.name || 'غير محدد'}</td>
            <td>${student.memorized} أجزاء</td>
            <td><span class="badge ${gradeClass}">${gradeText}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تحديث مرشح الحلقات
function updateCirclesFilter() {
    const select = document.getElementById('circleFilter');
    select.innerHTML = '<option value="">جميع الحلقات</option>';
    
    systemData.circles.forEach(circle => {
        const option = document.createElement('option');
        option.value = circle.id;
        option.textContent = circle.name;
        select.appendChild(option);
    });
}

// تصفية الطلاب
function filterStudents() {
    updateStudentsTable();
}

// عرض نافذة إضافة معلم
function showAddTeacherModal() {
    const modalContent = `
        <h3><i class="fas fa-plus"></i> إضافة معلم جديد</h3>
        <form id="addTeacherForm">
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="teacherName" required>
            </div>
            <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" id="teacherPhone" required>
            </div>
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" id="teacherEmail">
            </div>
            <div class="form-group">
                <label>التخصص</label>
                <input type="text" id="teacherSpecialization" value="تحفيظ القرآن الكريم">
            </div>
            <div class="form-group">
                <label>سنوات الخبرة</label>
                <input type="number" id="teacherExperience" min="0">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
    
    document.getElementById('addTeacherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTeacher();
    });
}

// إضافة معلم جديد
function addTeacher() {
    const newTeacher = {
        id: Date.now(),
        name: document.getElementById('teacherName').value,
        phone: document.getElementById('teacherPhone').value,
        email: document.getElementById('teacherEmail').value,
        specialization: document.getElementById('teacherSpecialization').value,
        experience: parseInt(document.getElementById('teacherExperience').value) || 0,
        circles: [],
        createdAt: new Date().toISOString()
    };
    
    systemData.teachers.push(newTeacher);
    saveToStorage('teachers', systemData.teachers);
    updateTeachersTable();
    updateDashboard();
    closeModal();
    
    showNotification('تم إضافة المعلم بنجاح', 'success');
}

// عرض النافذة المنبثقة
function showModal(content, size = 'normal') {
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    
    modalContent.innerHTML = content;
    
    // تطبيق الحجم
    if (size === 'large') {
        modalContent.style.maxWidth = '800px';
        modalContent.style.width = '95%';
    } else {
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
    }
    
    modalOverlay.classList.add('active');
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// عرض إشعار
function showNotification(message, type = 'info') {
    // يمكن تطوير هذه الوظيفة لاحقاً لعرض إشعارات أفضل
    alert(message);
}

// تحديث صفحة الحلقات
function updateCirclesPage() {
    const content = document.getElementById('circlesContent');
    content.innerHTML = `
        <div class="circles-grid">
            ${systemData.circles.map(circle => {
                const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
                const timeText = {
                    'after_fajr': 'بعد الفجر',
                    'after_asr': 'بعد العصر',
                    'after_maghrib': 'بعد المغرب',
                    'after_isha': 'بعد العشاء'
                }[circle.time];
                
                return `
                    <div class="circle-card">
                        <h3>${circle.name}</h3>
                        <div class="circle-info">
                            <p><i class="fas fa-mosque"></i> ${circle.mosque}</p>
                            <p><i class="fas fa-clock"></i> ${timeText}</p>
                            <p><i class="fas fa-chalkboard-teacher"></i> ${teacher?.name || 'غير محدد'}</p>
                            <p><i class="fas fa-users"></i> ${circle.students.length}/${circle.maxStudents} طالب</p>
                            <p><i class="fas fa-venus-mars"></i> ${circle.gender === 'male' ? 'ذكور' : 'إناث'}</p>
                        </div>
                        <div class="circle-actions">
                            <button class="btn btn-sm btn-primary" onclick="viewCircleDetails(${circle.id})">
                                <i class="fas fa-eye"></i> عرض التفاصيل
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="editCircle(${circle.id})">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// تحديث صفحة الحضور
function updateAttendancePage() {
    const content = document.getElementById('attendanceContent');
    const today = new Date().toISOString().split('T')[0];
    
    content.innerHTML = `
        <div class="attendance-header">
            <div class="form-group">
                <label>التاريخ</label>
                <input type="date" id="attendanceDate" value="${today}">
            </div>
            <div class="form-group">
                <label>الحلقة</label>
                <select id="attendanceCircle">
                    <option value="">اختر الحلقة</option>
                    ${systemData.circles.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
            <button class="btn btn-primary" onclick="loadAttendanceList()">
                <i class="fas fa-list"></i> عرض قائمة الحضور
            </button>
        </div>
        <div id="attendanceList"></div>
    `;
}

// تحديث صفحة متابعة الحفظ
function updateProgressPage() {
    const content = document.getElementById('progressContent');
    
    content.innerHTML = `
        <div class="progress-summary">
            <h3>ملخص التقدم</h3>
            <div class="progress-stats">
                ${systemData.students.map(student => {
                    const circle = systemData.circles.find(c => c.id === student.circleId);
                    const progressPercent = (student.memorized / 30) * 100; // 30 جزء
                    
                    return `
                        <div class="student-progress">
                            <div class="student-info">
                                <h4>${student.name}</h4>
                                <p>${circle?.name || 'غير محدد'}</p>
                            </div>
                            <div class="progress-details">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <p>محفوظ: ${student.memorized} أجزاء | مراجع: ${student.reviewed} أجزاء</p>
                                <span class="badge badge-${student.grade === 'excellent' ? 'excellent' : student.grade === 'good' ? 'good' : student.grade === 'average' ? 'average' : 'weak'}">
                                    ${student.grade === 'excellent' ? 'ممتاز' : student.grade === 'good' ? 'جيد' : student.grade === 'average' ? 'متوسط' : 'ضعيف'}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// تحديث صفحة المتميزين
function updateExcellencePage() {
    const content = document.getElementById('excellenceContent');
    
    // الطلاب المتميزون هذا الأسبوع
    const excellentStudents = systemData.students.filter(s => s.grade === 'excellent');
    const maleExcellent = excellentStudents.filter(s => s.gender === 'male');
    const femaleExcellent = excellentStudents.filter(s => s.gender === 'female');
    
    content.innerHTML = `
        <div class="excellence-section">
            <h3><i class="fas fa-trophy"></i> الطلاب المتميزون هذا الأسبوع</h3>
            
            <div class="excellence-grid">
                <div class="excellence-category">
                    <h4><i class="fas fa-mars"></i> الطلاب الذكور المتميزون</h4>
                    <div class="excellent-students">
                        ${maleExcellent.map(student => {
                            const circle = systemData.circles.find(c => c.id === student.circleId);
                            return `
                                <div class="excellent-student">
                                    <div class="student-avatar">
                                        <i class="fas fa-user-graduate"></i>
                                    </div>
                                    <div class="student-details">
                                        <h5>${student.name}</h5>
                                        <p>${circle?.name || 'غير محدد'}</p>
                                        <p>محفوظ: ${student.memorized} أجزاء</p>
                                        <span class="badge badge-excellent">ممتاز</span>
                                    </div>
                                </div>
                            `;
                        }).join('') || '<p class="empty-state">لا يوجد طلاب متميزون حالياً</p>'}
                    </div>
                </div>
                
                <div class="excellence-category">
                    <h4><i class="fas fa-venus"></i> الطالبات المتميزات</h4>
                    <div class="excellent-students">
                        ${femaleExcellent.map(student => {
                            const circle = systemData.circles.find(c => c.id === student.circleId);
                            return `
                                <div class="excellent-student">
                                    <div class="student-avatar">
                                        <i class="fas fa-user-graduate"></i>
                                    </div>
                                    <div class="student-details">
                                        <h5>${student.name}</h5>
                                        <p>${circle?.name || 'غير محدد'}</p>
                                        <p>محفوظ: ${student.memorized} أجزاء</p>
                                        <span class="badge badge-excellent">ممتاز</span>
                                    </div>
                                </div>
                            `;
                        }).join('') || '<p class="empty-state">لا يوجد طالبات متميزات حالياً</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// تحديث صفحة التقويم
function updateCalendarPage() {
    const content = document.getElementById('calendarContent');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    content.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <h3>${getMonthName(currentMonth)} ${currentYear}</h3>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">الأحد</div>
                <div class="calendar-day-header">الاثنين</div>
                <div class="calendar-day-header">الثلاثاء</div>
                <div class="calendar-day-header">الأربعاء</div>
                <div class="calendar-day-header">الخميس</div>
                <div class="calendar-day-header">الجمعة</div>
                <div class="calendar-day-header">السبت</div>
                ${generateCalendarDays(currentYear, currentMonth)}
            </div>
        </div>
        
        <div class="daily-schedule">
            <h3>جدول اليوم</h3>
            <div class="schedule-list">
                ${systemData.circles.map(circle => {
                    const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
                    const timeText = {
                        'after_fajr': 'بعد الفجر',
                        'after_asr': 'بعد العصر',
                        'after_maghrib': 'بعد المغرب',
                        'after_isha': 'بعد العشاء'
                    }[circle.time];
                    
                    return `
                        <div class="schedule-item">
                            <div class="schedule-time">${timeText}</div>
                            <div class="schedule-details">
                                <h4>${circle.name}</h4>
                                <p>المعلم: ${teacher?.name || 'غير محدد'}</p>
                                <p>المكان: ${circle.mosque}</p>
                                <p>عدد الطلاب: ${circle.students.length}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// تحديث صفحة الأنشطة
function updateActivitiesPage() {
    const content = document.getElementById('activitiesContent');
    
    content.innerHTML = `
        <div class="activities-header">
            <button class="btn btn-primary" onclick="showAddActivityModal()">
                <i class="fas fa-plus"></i> إضافة نشاط جديد
            </button>
        </div>
        
        <div class="activities-list">
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="activity-details">
                    <h4>مسابقة حفظ القرآن الشهرية</h4>
                    <p>مسابقة شهرية لتشجيع الطلاب على الحفظ والمراجعة</p>
                    <span class="activity-date">التاريخ: نهاية كل شهر</span>
                </div>
                <div class="activity-actions">
                    <button class="btn btn-sm btn-success">
                        <i class="fas fa-play"></i> بدء النشاط
                    </button>
                </div>
            </div>
            
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="activity-details">
                    <h4>ورشة تجويد القرآن</h4>
                    <p>ورشة تعليمية لتحسين مستوى التجويد لدى الطلاب</p>
                    <span class="activity-date">التاريخ: كل أسبوعين</span>
                </div>
                <div class="activity-actions">
                    <button class="btn btn-sm btn-success">
                        <i class="fas fa-play"></i> بدء النشاط
                    </button>
                </div>
            </div>
        </div>
    `;
}

// وظائف مساعدة
function getMonthName(month) {
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[month];
}

function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let html = '';
    
    // أيام فارغة في بداية الشهر
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = new Date().getDate() === day && 
                       new Date().getMonth() === month && 
                       new Date().getFullYear() === year;
        
        html += `<div class="calendar-day ${isToday ? 'today' : ''}">${day}</div>`;
    }
    
    return html;
}

// وظائف إضافية للنظام

// عرض نافذة إضافة طالب
function showAddStudentModal() {
    const modalContent = `
        <h3><i class="fas fa-plus"></i> إضافة طالب جديد</h3>
        <form id="addStudentForm">
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="studentName" required>
            </div>
            <div class="form-group">
                <label>العمر</label>
                <input type="number" id="studentAge" min="5" max="25" required>
            </div>
            <div class="form-group">
                <label>الجنس</label>
                <select id="studentGender" required>
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                </select>
            </div>
            <div class="form-group">
                <label>رقم هاتف الطالب</label>
                <input type="tel" id="studentPhone">
            </div>
            <div class="form-group">
                <label>رقم هاتف ولي الأمر</label>
                <input type="tel" id="parentPhone" required>
            </div>
            <div class="form-group">
                <label>الحلقة</label>
                <select id="studentCircle" required>
                    <option value="">اختر الحلقة</option>
                    ${systemData.circles.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>المستوى</label>
                <select id="studentLevel" required>
                    <option value="">اختر المستوى</option>
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                </select>
            </div>
            <div class="form-group">
                <label>عدد الأجزاء المحفوظة</label>
                <input type="number" id="studentMemorized" min="0" max="30" value="0">
            </div>
            <div class="form-group">
                <label>عدد الأجزاء المراجعة</label>
                <input type="number" id="studentReviewed" min="0" max="30" value="0">
            </div>
            <div class="form-group">
                <label>التقدير</label>
                <select id="studentGrade" required>
                    <option value="">اختر التقدير</option>
                    <option value="excellent">ممتاز</option>
                    <option value="good">جيد</option>
                    <option value="average">متوسط</option>
                    <option value="weak">ضعيف</option>
                </select>
            </div>
            <div class="form-group">
                <label>ملاحظات</label>
                <textarea id="studentNotes" rows="3"></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
    
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addStudent();
    });
}

// إضافة طالب جديد
function addStudent() {
    const newStudent = {
        id: Date.now(),
        name: document.getElementById('studentName').value,
        age: parseInt(document.getElementById('studentAge').value),
        gender: document.getElementById('studentGender').value,
        phone: document.getElementById('studentPhone').value,
        parentPhone: document.getElementById('parentPhone').value,
        circleId: parseInt(document.getElementById('studentCircle').value),
        level: document.getElementById('studentLevel').value,
        memorized: parseInt(document.getElementById('studentMemorized').value) || 0,
        reviewed: parseInt(document.getElementById('studentReviewed').value) || 0,
        grade: document.getElementById('studentGrade').value,
        notes: document.getElementById('studentNotes').value,
        joinDate: new Date().toISOString()
    };
    
    systemData.students.push(newStudent);
    
    // إضافة الطالب إلى الحلقة
    const circle = systemData.circles.find(c => c.id === newStudent.circleId);
    if (circle) {
        circle.students.push(newStudent.id);
        saveToStorage('circles', systemData.circles);
    }
    
    saveToStorage('students', systemData.students);
    updateStudentsTable();
    updateDashboard();
    closeModal();
    
    showNotification('تم إضافة الطالب بنجاح', 'success');
}

// عرض نافذة إضافة حلقة
function showAddCircleModal() {
    const modalContent = `
        <h3><i class="fas fa-plus"></i> إضافة حلقة جديدة</h3>
        <form id="addCircleForm">
            <div class="form-group">
                <label>اسم الحلقة</label>
                <input type="text" id="circleName" required>
            </div>
            <div class="form-group">
                <label>المعلم المسؤول</label>
                <select id="circleTeacher" required>
                    <option value="">اختر المعلم</option>
                    ${systemData.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>المسجد أو الدار</label>
                <input type="text" id="circleMosque" required>
            </div>
            <div class="form-group">
                <label>وقت الحلقة</label>
                <select id="circleTime" required>
                    <option value="">اختر الوقت</option>
                    <option value="after_fajr">بعد الفجر</option>
                    <option value="after_asr">بعد العصر</option>
                    <option value="after_maghrib">بعد المغرب</option>
                    <option value="after_isha">بعد العشاء</option>
                </select>
            </div>
            <div class="form-group">
                <label>الجنس</label>
                <select id="circleGender" required>
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكور</option>
                    <option value="female">إناث</option>
                </select>
            </div>
            <div class="form-group">
                <label>الحد الأقصى للطلاب</label>
                <input type="number" id="circleMaxStudents" min="5" max="30" value="15" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
    
    document.getElementById('addCircleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCircle();
    });
}

// إضافة حلقة جديدة
function addCircle() {
    const newCircle = {
        id: Date.now(),
        name: document.getElementById('circleName').value,
        teacherId: parseInt(document.getElementById('circleTeacher').value),
        mosque: document.getElementById('circleMosque').value,
        time: document.getElementById('circleTime').value,
        gender: document.getElementById('circleGender').value,
        maxStudents: parseInt(document.getElementById('circleMaxStudents').value),
        days: ['sunday', 'monday', 'tuesday', 'wednesday'],
        students: [],
        createdAt: new Date().toISOString()
    };
    
    systemData.circles.push(newCircle);
    
    // إضافة الحلقة إلى المعلم
    const teacher = systemData.teachers.find(t => t.id === newCircle.teacherId);
    if (teacher) {
        teacher.circles.push(newCircle.id);
        saveToStorage('teachers', systemData.teachers);
    }
    
    saveToStorage('circles', systemData.circles);
    updateCirclesPage();
    updateCirclesFilter();
    updateDashboard();
    closeModal();
    
    showNotification('تم إضافة الحلقة بنجاح', 'success');
}

// تحميل قائمة الحضور
function loadAttendanceList() {
    const date = document.getElementById('attendanceDate').value;
    const circleId = document.getElementById('attendanceCircle').value;
    
    if (!date || !circleId) {
        alert('يرجى اختيار التاريخ والحلقة');
        return;
    }
    
    const circle = systemData.circles.find(c => c.id == circleId);
    const students = systemData.students.filter(s => circle.students.includes(s.id));
    
    const attendanceListHtml = `
        <div class="attendance-list">
            <h3>قائمة حضور ${circle.name} - ${date}</h3>
            <form id="attendanceForm">
                <div class="students-attendance">
                    ${students.map(student => `
                        <div class="student-attendance-item">
                            <div class="student-info">
                                <h4>${student.name}</h4>
                                <p>المستوى: ${student.level}</p>
                            </div>
                            <div class="attendance-options">
                                <label>
                                    <input type="radio" name="attendance_${student.id}" value="present" checked>
                                    <span class="attendance-status present">حاضر</span>
                                </label>
                                <label>
                                    <input type="radio" name="attendance_${student.id}" value="absent">
                                    <span class="attendance-status absent">غائب</span>
                                </label>
                                <label>
                                    <input type="radio" name="attendance_${student.id}" value="excused">
                                    <span class="attendance-status excused">غائب بعذر</span>
                                </label>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> حفظ الحضور
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('attendanceList').innerHTML = attendanceListHtml;
    
    document.getElementById('attendanceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAttendance(date, circleId, students);
    });
}

// حفظ الحضور
function saveAttendance(date, circleId, students) {
    const attendanceRecord = {
        id: Date.now(),
        date: date,
        circleId: parseInt(circleId),
        records: []
    };
    
    students.forEach(student => {
        const status = document.querySelector(`input[name="attendance_${student.id}"]:checked`).value;
        attendanceRecord.records.push({
            studentId: student.id,
            status: status
        });
    });
    
    // إزالة سجل الحضور السابق لنفس اليوم والحلقة إن وجد
    systemData.attendance = systemData.attendance.filter(a => 
        !(a.date === date && a.circleId === parseInt(circleId))
    );
    
    systemData.attendance.push(attendanceRecord);
    saveToStorage('attendance', systemData.attendance);
    
    showNotification('تم حفظ الحضور بنجاح', 'success');
}

// تعديل معلم
function editTeacher(teacherId) {
    const teacher = systemData.teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const modalContent = `
        <h3><i class="fas fa-edit"></i> تعديل بيانات المعلم</h3>
        <form id="editTeacherForm">
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="editTeacherName" value="${teacher.name}" required>
            </div>
            <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" id="editTeacherPhone" value="${teacher.phone}" required>
            </div>
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" id="editTeacherEmail" value="${teacher.email || ''}">
            </div>
            <div class="form-group">
                <label>التخصص</label>
                <input type="text" id="editTeacherSpecialization" value="${teacher.specialization || ''}">
            </div>
            <div class="form-group">
                <label>سنوات الخبرة</label>
                <input type="number" id="editTeacherExperience" value="${teacher.experience || 0}" min="0">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ التغييرات
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
    
    document.getElementById('editTeacherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateTeacher(teacherId);
    });
}

// تحديث بيانات المعلم
function updateTeacher(teacherId) {
    const teacher = systemData.teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    teacher.name = document.getElementById('editTeacherName').value;
    teacher.phone = document.getElementById('editTeacherPhone').value;
    teacher.email = document.getElementById('editTeacherEmail').value;
    teacher.specialization = document.getElementById('editTeacherSpecialization').value;
    teacher.experience = parseInt(document.getElementById('editTeacherExperience').value) || 0;
    
    saveToStorage('teachers', systemData.teachers);
    updateTeachersTable();
    closeModal();
    
    showNotification('تم تحديث بيانات المعلم بنجاح', 'success');
}

// حذف معلم
function deleteTeacher(teacherId) {
    if (!confirm('هل أنت متأكد من حذف هذا المعلم؟')) return;
    
    // التحقق من وجود حلقات مرتبطة بالمعلم
    const teacherCircles = systemData.circles.filter(c => c.teacherId === teacherId);
    if (teacherCircles.length > 0) {
        alert('لا يمكن حذف المعلم لأنه مسؤول عن حلقات. يرجى نقل الحلقات إلى معلم آخر أولاً.');
        return;
    }
    
    systemData.teachers = systemData.teachers.filter(t => t.id !== teacherId);
    saveToStorage('teachers', systemData.teachers);
    updateTeachersTable();
    updateDashboard();
    
    showNotification('تم حذف المعلم بنجاح', 'success');
}

// تعديل طالب
function editStudent(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;
    
    const modalContent = `
        <h3><i class="fas fa-edit"></i> تعديل بيانات الطالب</h3>
        <form id="editStudentForm">
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="editStudentName" value="${student.name}" required>
            </div>
            <div class="form-group">
                <label>العمر</label>
                <input type="number" id="editStudentAge" value="${student.age || 12}" min="5" max="25" required>
            </div>
            <div class="form-group">
                <label>الجنس</label>
                <select id="editStudentGender" required>
                    <option value="male" ${student.gender === 'male' ? 'selected' : ''}>ذكر</option>
                    <option value="female" ${student.gender === 'female' ? 'selected' : ''}>أنثى</option>
                </select>
            </div>
            <div class="form-group">
                <label>رقم هاتف الطالب</label>
                <input type="tel" id="editStudentPhone" value="${student.phone || ''}">
            </div>
            <div class="form-group">
                <label>رقم هاتف ولي الأمر</label>
                <input type="tel" id="editParentPhone" value="${student.parentPhone || ''}" required>
            </div>
            <div class="form-group">
                <label>الحلقة</label>
                <select id="editStudentCircle" required>
                    ${systemData.circles.map(c => 
                        `<option value="${c.id}" ${c.id === student.circleId ? 'selected' : ''}>${c.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>المستوى</label>
                <select id="editStudentLevel" required>
                    <option value="beginner" ${student.level === 'beginner' ? 'selected' : ''}>مبتدئ</option>
                    <option value="intermediate" ${student.level === 'intermediate' ? 'selected' : ''}>متوسط</option>
                    <option value="advanced" ${student.level === 'advanced' ? 'selected' : ''}>متقدم</option>
                </select>
            </div>
            <div class="form-group">
                <label>عدد الأجزاء المحفوظة</label>
                <input type="number" id="editStudentMemorized" value="${student.memorized}" min="0" max="30">
            </div>
            <div class="form-group">
                <label>عدد الأجزاء المراجعة</label>
                <input type="number" id="editStudentReviewed" value="${student.reviewed || 0}" min="0" max="30">
            </div>
            <div class="form-group">
                <label>التقدير</label>
                <select id="editStudentGrade" required>
                    <option value="excellent" ${student.grade === 'excellent' ? 'selected' : ''}>ممتاز</option>
                    <option value="good" ${student.grade === 'good' ? 'selected' : ''}>جيد</option>
                    <option value="average" ${student.grade === 'average' ? 'selected' : ''}>متوسط</option>
                    <option value="weak" ${student.grade === 'weak' ? 'selected' : ''}>ضعيف</option>
                </select>
            </div>
            <div class="form-group">
                <label>ملاحظات</label>
                <textarea id="editStudentNotes" rows="3">${student.notes || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ التغييرات
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
    
    // إضافة مستمع الحدث بعد تأخير قصير للتأكد من تحميل العناصر
    setTimeout(() => {
        const form = document.getElementById('editStudentForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                updateStudent(studentId);
            });
        }
    }, 100);
}

// تحديث بيانات الطالب
function updateStudent(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;
    
    const oldCircleId = student.circleId;
    const newCircleId = parseInt(document.getElementById('editStudentCircle').value);
    
    student.name = document.getElementById('editStudentName').value;
    student.age = parseInt(document.getElementById('editStudentAge').value);
    student.gender = document.getElementById('editStudentGender').value;
    student.phone = document.getElementById('editStudentPhone').value;
    student.parentPhone = document.getElementById('editParentPhone').value;
    student.circleId = newCircleId;
    student.level = document.getElementById('editStudentLevel').value;
    student.memorized = parseInt(document.getElementById('editStudentMemorized').value) || 0;
    student.reviewed = parseInt(document.getElementById('editStudentReviewed').value) || 0;
    student.grade = document.getElementById('editStudentGrade').value;
    student.notes = document.getElementById('editStudentNotes').value;
    
    // تحديث الحلقات إذا تغيرت
    if (oldCircleId !== newCircleId) {
        // إزالة من الحلقة القديمة
        const oldCircle = systemData.circles.find(c => c.id === oldCircleId);
        if (oldCircle) {
            oldCircle.students = oldCircle.students.filter(id => id !== studentId);
        }
        
        // إضافة إلى الحلقة الجديدة
        const newCircle = systemData.circles.find(c => c.id === newCircleId);
        if (newCircle && !newCircle.students.includes(studentId)) {
            newCircle.students.push(studentId);
        }
        
        saveToStorage('circles', systemData.circles);
    }
    
    saveToStorage('students', systemData.students);
    updateStudentsTable();
    updateDashboard();
    closeModal();
    
    showNotification('تم تحديث بيانات الطالب بنجاح', 'success');
}

// حذف طالب
function deleteStudent(studentId) {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    
    const student = systemData.students.find(s => s.id === studentId);
    if (student) {
        // إزالة الطالب من الحلقة
        const circle = systemData.circles.find(c => c.id === student.circleId);
        if (circle) {
            circle.students = circle.students.filter(id => id !== studentId);
            saveToStorage('circles', systemData.circles);
        }
    }
    
    systemData.students = systemData.students.filter(s => s.id !== studentId);
    saveToStorage('students', systemData.students);
    updateStudentsTable();
    updateDashboard();
    
    showNotification('تم حذف الطالب بنجاح', 'success');
}

// إضافة CSS للتقويم والأنشطة
const additionalStyles = `
<style>
.circles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.circle-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.circle-card h3 {
    color: #333;
    margin-bottom: 1rem;
}

.circle-info p {
    margin-bottom: 0.5rem;
    color: #666;
}

.circle-info i {
    width: 20px;
    color: #667eea;
}

.circle-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
}

.progress-stats {
    display: grid;
    gap: 1rem;
}

.student-progress {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.progress-details {
    flex: 1;
    margin-left: 1rem;
}

.excellence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}

.excellence-category {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.excellent-students {
    display: grid;
    gap: 1rem;
}

.excellent-student {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.student-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.calendar-container {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #e1e5e9;
    border-radius: 8px;
    overflow: hidden;
}

.calendar-day-header {
    background: #667eea;
    color: white;
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
}

.calendar-day {
    background: white;
    padding: 0.75rem;
    text-align: center;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar-day.today {
    background: #667eea;
    color: white;
    font-weight: bold;
}

.calendar-day.empty {
    background: #f8f9fa;
}

.daily-schedule {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.schedule-list {
    display: grid;
    gap: 1rem;
}

.schedule-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.schedule-time {
    background: #667eea;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    min-width: 100px;
    text-align: center;
}

.activities-list {
    display: grid;
    gap: 1rem;
}

.activity-item {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.activity-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.activity-details {
    flex: 1;
}

.activity-details h4 {
    color: #333;
    margin-bottom: 0.5rem;
}

.activity-date {
    color: #666;
    font-size: 0.9rem;
}

.attendance-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: end;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.students-attendance {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
}

.student-attendance-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.attendance-options {
    display: flex;
    gap: 1rem;
}

.attendance-options label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.attendance-status {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: 600;
}

.attendance-status.present {
    background: #28a745;
    color: white;
}

.attendance-status.absent {
    background: #dc3545;
    color: white;
}

.attendance-status.excused {
    background: #ffc107;
    color: #212529;
}

textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-family: inherit;
    resize: vertical;
}

textarea:focus {
    outline: none;
    border-color: #667eea;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// ==================== الوظائف الجديدة ====================

// عرض صفحة الطالب الشخصية
function showStudentProfile(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;
    
    const circle = systemData.circles.find(c => c.id === student.circleId);
    const teacher = systemData.teachers.find(t => t.id === circle?.teacherId);
    
    // حساب إحصائيات الحضور
    const studentAttendance = systemData.attendance.filter(a => 
        a.records.some(r => r.studentId === studentId)
    );
    
    let presentCount = 0, absentCount = 0, excusedCount = 0;
    studentAttendance.forEach(session => {
        const record = session.records.find(r => r.studentId === studentId);
        if (record) {
            if (record.status === 'present') presentCount++;
            else if (record.status === 'absent') absentCount++;
            else if (record.status === 'excused') excusedCount++;
        }
    });
    
    const totalSessions = presentCount + absentCount + excusedCount;
    const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions * 100).toFixed(1) : 0;
    
    // الحصول على ملاحظات الذكاء الاصطناعي
    const aiNotes = systemData.studentNotes.filter(n => n.studentId === studentId && n.type === 'ai_suggestion');
    
    // حساب التقدم في الحفظ
    const progressPercent = (student.memorized / 30 * 100).toFixed(1);
    
    document.getElementById('studentProfileTitle').innerHTML = `
        <i class="fas fa-user-graduate"></i> ملف الطالب: ${student.name}
    `;
    
    document.getElementById('studentProfileContent').innerHTML = `
        <div class="student-profile-container">
            <!-- معلومات أساسية -->
            <div class="profile-section">
                <h3><i class="fas fa-user"></i> المعلومات الأساسية</h3>
                <div class="profile-info-grid">
                    <div class="info-item">
                        <label>الاسم:</label>
                        <span>${student.name}</span>
                    </div>
                    <div class="info-item">
                        <label>الجنس:</label>
                        <span>${student.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                    </div>
                    <div class="info-item">
                        <label>رقم الجوال:</label>
                        <span>${student.phone || 'غير محدد'}</span>
                    </div>
                    <div class="info-item">
                        <label>جوال ولي الأمر:</label>
                        <span>${student.parentPhone}</span>
                    </div>
                    <div class="info-item">
                        <label>الحلقة:</label>
                        <span>${circle?.name || 'غير محدد'}</span>
                    </div>
                    <div class="info-item">
                        <label>المعلم:</label>
                        <span>${teacher?.name || 'غير محدد'}</span>
                    </div>
                    <div class="info-item">
                        <label>المستوى:</label>
                        <span>${getLevelText(student.level)}</span>
                    </div>
                    <div class="info-item">
                        <label>التقدير:</label>
                        <span class="grade-badge grade-${student.grade}">${getGradeText(student.grade)}</span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="showTransferStudentModal(${studentId})">
                        <i class="fas fa-exchange-alt"></i> نقل إلى حلقة أخرى
                    </button>
                    <button class="btn btn-success" onclick="showEditStudentModal(${studentId})">
                        <i class="fas fa-edit"></i> تعديل البيانات
                    </button>
                </div>
            </div>
            
            <!-- إحصائيات الحضور -->
            <div class="profile-section">
                <h3><i class="fas fa-calendar-check"></i> إحصائيات الحضور</h3>
                <div class="attendance-stats">
                    <div class="stat-item present">
                        <div class="stat-number">${presentCount}</div>
                        <div class="stat-label">حضور</div>
                    </div>
                    <div class="stat-item absent">
                        <div class="stat-number">${absentCount}</div>
                        <div class="stat-label">غياب</div>
                    </div>
                    <div class="stat-item excused">
                        <div class="stat-number">${excusedCount}</div>
                        <div class="stat-label">استئذان</div>
                    </div>
                    <div class="stat-item rate">
                        <div class="stat-number">${attendanceRate}%</div>
                        <div class="stat-label">نسبة الحضور</div>
                    </div>
                </div>
                
                <!-- سجل الحضور الأخير -->
                <div class="recent-attendance">
                    <h4>آخر 10 جلسات</h4>
                    <div class="attendance-timeline">
                        ${getRecentAttendance(studentId, 10)}
                    </div>
                </div>
            </div>
            
            <!-- تقدم الحفظ -->
            <div class="profile-section">
                <h3><i class="fas fa-book-quran"></i> تقدم الحفظ</h3>
                <div class="memorization-progress">
                    <div class="progress-item">
                        <label>الأجزاء المحفوظة:</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            <span class="progress-text">${student.memorized} من 30 جزء (${progressPercent}%)</span>
                        </div>
                    </div>
                    <div class="progress-item">
                        <label>الأجزاء المراجعة:</label>
                        <div class="progress-bar">
                            <div class="progress-fill reviewed" style="width: ${(student.reviewed / 30 * 100).toFixed(1)}%"></div>
                            <span class="progress-text">${student.reviewed} من 30 جزء</span>
                        </div>
                    </div>
                </div>
                
                <!-- السور المحفوظة -->
                <div class="memorized-surahs">
                    <h4>السور المطلوب حفظها</h4>
                    <div class="surahs-grid">
                        ${getSurahsForStudent(student)}
                    </div>
                </div>
            </div>
            
            <!-- ملاحظات الذكاء الاصطناعي -->
            <div class="profile-section">
                <h3><i class="fas fa-robot"></i> توصيات الذكاء الاصطناعي</h3>
                <div class="ai-suggestions">
                    ${aiNotes.length > 0 ? aiNotes.map(note => `
                        <div class="ai-note priority-${note.priority}">
                            <div class="ai-note-header">
                                <i class="fas fa-lightbulb"></i>
                                <span class="priority-badge">${getPriorityText(note.priority)}</span>
                            </div>
                            <p>${note.content}</p>
                            <small>تم إنشاؤها في: ${new Date(note.createdAt).toLocaleDateString('ar-SA')}</small>
                        </div>
                    `).join('') : '<p class="no-suggestions">لا توجد توصيات حالياً</p>'}
                    
                    <button class="btn btn-primary" onclick="generateAISuggestion(${studentId})">
                        <i class="fas fa-magic"></i> إنشاء توصية جديدة
                    </button>
                </div>
            </div>
            
            <!-- الملاحظات العامة -->
            <div class="profile-section">
                <h3><i class="fas fa-sticky-note"></i> الملاحظات</h3>
                <div class="notes-section">
                    <textarea id="studentNotes" rows="4" placeholder="أضف ملاحظاتك هنا...">${student.notes || ''}</textarea>
                    <button class="btn btn-success" onclick="saveStudentNotes(${studentId})">
                        <i class="fas fa-save"></i> حفظ الملاحظات
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showPage('studentProfile');
}

// العودة من صفحة الطالب
function goBackFromProfile() {
    showPage('students');
}

// الحصول على آخر سجلات الحضور
function getRecentAttendance(studentId, limit = 10) {
    const studentAttendance = systemData.attendance
        .filter(a => a.records.some(r => r.studentId === studentId))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    
    if (studentAttendance.length === 0) {
        return '<p class="no-attendance">لا توجد سجلات حضور</p>';
    }
    
    return studentAttendance.map(session => {
        const record = session.records.find(r => r.studentId === studentId);
        const statusClass = record.status;
        const statusText = {
            'present': 'حضور',
            'absent': 'غياب',
            'excused': 'استئذان'
        };
        
        return `
            <div class="attendance-record">
                <div class="record-date">${new Date(session.date).toLocaleDateString('ar-SA')}</div>
                <div class="record-status ${statusClass}">${statusText[record.status]}</div>
            </div>
        `;
    }).join('');
}

// الحصول على السور المطلوبة للطالب
function getSurahsForStudent(student) {
    const requiredSurahs = systemData.surahs.filter(s => s.juz <= student.memorized + 1);
    
    if (requiredSurahs.length === 0) {
        return '<p>لا توجد سور محددة</p>';
    }
    
    return requiredSurahs.map(surah => `
        <div class="surah-item ${surah.juz <= student.memorized ? 'completed' : 'pending'}">
            <div class="surah-name">${surah.name}</div>
            <div class="surah-info">${surah.verses} آية - الجزء ${surah.juz}</div>
            <div class="surah-status">
                ${surah.juz <= student.memorized ? 
                    '<i class="fas fa-check-circle"></i> محفوظة' : 
                    '<i class="fas fa-clock"></i> مطلوبة'
                }
            </div>
        </div>
    `).join('');
}

// نقل طالب إلى حلقة أخرى
function showTransferStudentModal(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    const availableCircles = systemData.circles.filter(c => 
        c.id !== student.circleId && c.gender === student.gender
    );
    
    const modalContent = `
        <h3><i class="fas fa-exchange-alt"></i> نقل الطالب: ${student.name}</h3>
        <form onsubmit="transferStudent(event, ${studentId})">
            <div class="form-group">
                <label>الحلقة الحالية</label>
                <input type="text" value="${systemData.circles.find(c => c.id === student.circleId)?.name}" readonly>
            </div>
            
            <div class="form-group">
                <label>الحلقة الجديدة</label>
                <select id="newCircleId" required>
                    <option value="">اختر الحلقة الجديدة</option>
                    ${availableCircles.map(c => `
                        <option value="${c.id}">${c.name} - ${c.mosque}</option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>سبب النقل</label>
                <textarea id="transferReason" rows="3" placeholder="اختياري - سبب النقل"></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-check"></i> تأكيد النقل
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
}

// تنفيذ نقل الطالب
function transferStudent(event, studentId) {
    event.preventDefault();
    
    const newCircleId = parseInt(document.getElementById('newCircleId').value);
    const reason = document.getElementById('transferReason').value;
    
    const student = systemData.students.find(s => s.id === studentId);
    const oldCircleId = student.circleId;
    
    // إزالة الطالب من الحلقة القديمة
    const oldCircle = systemData.circles.find(c => c.id === oldCircleId);
    if (oldCircle) {
        oldCircle.students = oldCircle.students.filter(id => id !== studentId);
    }
    
    // إضافة الطالب للحلقة الجديدة
    const newCircle = systemData.circles.find(c => c.id === newCircleId);
    if (newCircle) {
        newCircle.students.push(studentId);
    }
    
    // تحديث بيانات الطالب
    student.circleId = newCircleId;
    
    // حفظ التغييرات
    saveToStorage('students', systemData.students);
    saveToStorage('circles', systemData.circles);
    
    // تسجيل النشاط
    const activity = {
        id: Date.now(),
        type: 'student_transfer',
        description: `تم نقل الطالب ${student.name} من ${oldCircle?.name} إلى ${newCircle?.name}`,
        details: reason ? `السبب: ${reason}` : '',
        timestamp: new Date().toISOString(),
        userId: currentUser.id
    };
    
    systemData.activities.push(activity);
    saveToStorage('activities', systemData.activities);
    
    showNotification('تم نقل الطالب بنجاح', 'success');
    closeModal();
    
    // تحديث صفحة الطالب
    showStudentProfile(studentId);
}

// إنشاء توصية ذكاء اصطناعي
function generateAISuggestion(studentId) {
    const student = systemData.students.find(s => s.id === studentId);
    if (!student) return;
    
    // محاكاة الذكاء الاصطناعي - في التطبيق الحقيقي سيكون هناك API
    const suggestions = [
        {
            condition: student.grade === 'weak',
            content: 'يُنصح بتقليل كمية الحفظ اليومي والتركيز على المراجعة المكثفة للأجزاء المحفوظة مع استخدام أساليب التحفيز الإيجابي',
            priority: 'high'
        },
        {
            condition: student.grade === 'average',
            content: 'الطالب يحتاج إلى تحسين التجويد وزيادة وقت المراجعة اليومية. يُنصح بتخصيص 20 دقيقة يومياً للمراجعة',
            priority: 'medium'
        },
        {
            condition: student.memorized > student.reviewed + 2,
            content: 'هناك فجوة كبيرة بين الحفظ والمراجعة. يُنصح بالتوقف عن الحفظ الجديد والتركيز على المراجعة لمدة أسبوعين',
            priority: 'high'
        },
        {
            condition: student.grade === 'excellent' && student.memorized < 5,
            content: 'الطالب متميز ويمكن زيادة كمية الحفظ اليومي. يُنصح بحفظ صفحة إضافية يومياً مع المحافظة على جودة التجويد',
            priority: 'medium'
        },
        {
            condition: true, // توصية عامة
            content: 'يُنصح بالمشاركة في المسابقات القرآنية لتحفيز الطالب وقياس مستواه مقارنة بأقرانه',
            priority: 'low'
        }
    ];
    
    // اختيار أول توصية تنطبق على الطالب
    const applicableSuggestion = suggestions.find(s => s.condition);
    
    if (applicableSuggestion) {
        const newNote = {
            id: Date.now(),
            studentId: studentId,
            type: 'ai_suggestion',
            content: applicableSuggestion.content,
            priority: applicableSuggestion.priority,
            createdAt: new Date().toISOString()
        };
        
        systemData.studentNotes.push(newNote);
        saveToStorage('studentNotes', systemData.studentNotes);
        
        showNotification('تم إنشاء توصية جديدة بنجاح', 'success');
        
        // تحديث صفحة الطالب
        showStudentProfile(studentId);
    }
}

// حفظ ملاحظات الطالب
function saveStudentNotes(studentId) {
    const notes = document.getElementById('studentNotes').value;
    const student = systemData.students.find(s => s.id === studentId);
    
    if (student) {
        student.notes = notes;
        saveToStorage('students', systemData.students);
        showNotification('تم حفظ الملاحظات بنجاح', 'success');
    }
}

// عرض صفحة السور والآيات
function showSurahsPage() {
    const content = document.getElementById('surahsContent');
    
    content.innerHTML = `
        <div class="surahs-container">
            <div class="surahs-stats">
                <div class="stat-card">
                    <h4>إجمالي السور</h4>
                    <p class="stat-number">${systemData.surahs.length}</p>
                </div>
                <div class="stat-card">
                    <h4>إجمالي الآيات</h4>
                    <p class="stat-number">${systemData.surahs.reduce((sum, s) => sum + s.verses, 0)}</p>
                </div>
                <div class="stat-card">
                    <h4>الأجزاء المغطاة</h4>
                    <p class="stat-number">${Math.max(...systemData.surahs.map(s => s.juz))}</p>
                </div>
            </div>
            
            <div class="surahs-table-container">
                <table class="data-table" id="surahsTable">
                    <thead>
                        <tr>
                            <th>الترتيب</th>
                            <th>اسم السورة</th>
                            <th>عدد الآيات</th>
                            <th>الجزء</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${systemData.surahs.map(surah => `
                            <tr>
                                <td>${surah.order}</td>
                                <td>${surah.name}</td>
                                <td>${surah.verses}</td>
                                <td>${surah.juz}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="showEditSurahModal(${surah.id})">
                                        <i class="fas fa-edit"></i> تعديل
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteSurah(${surah.id})">
                                        <i class="fas fa-trash"></i> حذف
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// إضافة سورة جديدة
function showAddSurahModal() {
    const modalContent = `
        <h3><i class="fas fa-plus"></i> إضافة سورة جديدة</h3>
        <form onsubmit="addSurah(event)">
            <div class="form-group">
                <label>اسم السورة</label>
                <input type="text" id="surahName" required placeholder="مثال: الفاتحة">
            </div>
            
            <div class="form-group">
                <label>عدد الآيات</label>
                <input type="number" id="surahVerses" required min="1" placeholder="مثال: 7">
            </div>
            
            <div class="form-group">
                <label>رقم الجزء</label>
                <input type="number" id="surahJuz" required min="1" max="30" placeholder="مثال: 1">
            </div>
            
            <div class="form-group">
                <label>ترتيب السورة</label>
                <input type="number" id="surahOrder" required min="1" max="114" placeholder="مثال: 1">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
}

// إضافة السورة
function addSurah(event) {
    event.preventDefault();
    
    const newSurah = {
        id: Date.now(),
        name: document.getElementById('surahName').value,
        verses: parseInt(document.getElementById('surahVerses').value),
        juz: parseInt(document.getElementById('surahJuz').value),
        order: parseInt(document.getElementById('surahOrder').value)
    };
    
    systemData.surahs.push(newSurah);
    systemData.surahs.sort((a, b) => a.order - b.order); // ترتيب حسب ترتيب السورة
    
    saveToStorage('surahs', systemData.surahs);
    showNotification('تم إضافة السورة بنجاح', 'success');
    closeModal();
    showSurahsPage();
}

// عرض الطلاب المتأخرين للمعلم
function showLaggingStudents() {
    if (currentUser.type !== 'teacher') return;
    
    const teacherCircles = systemData.circles.filter(c => c.teacherId === currentUser.teacherId);
    const teacherStudents = systemData.students.filter(s => 
        teacherCircles.some(c => c.id === s.circleId)
    );
    
    // حساب متوسط الحفظ في كل حلقة
    const circleAverages = teacherCircles.map(circle => {
        const circleStudents = systemData.students.filter(s => s.circleId === circle.id);
        const averageMemorized = circleStudents.length > 0 ? 
            circleStudents.reduce((sum, s) => sum + s.memorized, 0) / circleStudents.length : 0;
        
        return {
            circleId: circle.id,
            circleName: circle.name,
            average: averageMemorized
        };
    });
    
    // العثور على الطلاب المتأخرين (أقل من المتوسط بـ 2 أجزاء أو أكثر)
    const laggingStudents = teacherStudents.filter(student => {
        const circleAvg = circleAverages.find(avg => avg.circleId === student.circleId);
        return circleAvg && (student.memorized < circleAvg.average - 1);
    });
    
    const modalContent = `
        <h3><i class="fas fa-exclamation-triangle"></i> الطلاب المتأخرون في الحفظ</h3>
        <div class="lagging-students-content">
            ${laggingStudents.length === 0 ? 
                '<p class="no-lagging">ممتاز! لا يوجد طلاب متأخرون في الحفظ</p>' :
                `
                <div class="lagging-explanation">
                    <p><i class="fas fa-info-circle"></i> الطلاب التالون متأخرون عن متوسط حلقاتهم في الحفظ:</p>
                </div>
                
                <div class="lagging-students-list">
                    ${laggingStudents.map(student => {
                        const circle = systemData.circles.find(c => c.id === student.circleId);
                        const circleAvg = circleAverages.find(avg => avg.circleId === student.circleId);
                        const gap = (circleAvg.average - student.memorized).toFixed(1);
                        
                        return `
                            <div class="lagging-student-card">
                                <div class="student-info">
                                    <h4>${student.name}</h4>
                                    <p>الحلقة: ${circle?.name}</p>
                                    <p>محفوظ: ${student.memorized} أجزاء</p>
                                    <p>متوسط الحلقة: ${circleAvg.average.toFixed(1)} أجزاء</p>
                                    <p class="gap">الفجوة: ${gap} جزء</p>
                                </div>
                                <div class="student-actions">
                                    <button class="btn btn-sm btn-primary" onclick="showStudentProfile(${student.id}); closeModal();">
                                        <i class="fas fa-user"></i> عرض الملف
                                    </button>
                                    <button class="btn btn-sm btn-success" onclick="generateAISuggestion(${student.id}); closeModal();">
                                        <i class="fas fa-robot"></i> توصية ذكية
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                `
            }
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">
                <i class="fas fa-times"></i> إغلاق
            </button>
        </div>
    `;
    
    showModal(modalContent);
}

// تحديث نموذج إضافة الطالب لإزالة العمر والبريد الإلكتروني
function showAddStudentModal() {
    const modalContent = `
        <h3><i class="fas fa-plus"></i> إضافة طالب جديد</h3>
        <form onsubmit="addStudent(event)">
            <div class="form-row">
                <div class="form-group">
                    <label>الاسم الكامل</label>
                    <input type="text" id="studentName" required>
                </div>
                <div class="form-group">
                    <label>الجنس</label>
                    <select id="studentGender" required>
                        <option value="">اختر الجنس</option>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>رقم الجوال (اختياري)</label>
                    <input type="tel" id="studentPhone" placeholder="05xxxxxxxx">
                </div>
                <div class="form-group">
                    <label>جوال ولي الأمر</label>
                    <input type="tel" id="parentPhone" required placeholder="05xxxxxxxx">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>الحلقة</label>
                    <select id="studentCircle" required>
                        <option value="">اختر الحلقة</option>
                        ${systemData.circles.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>المستوى</label>
                    <select id="studentLevel" required>
                        <option value="">اختر المستوى</option>
                        <option value="beginner">مبتدئ</option>
                        <option value="intermediate">متوسط</option>
                        <option value="advanced">متقدم</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>الأجزاء المحفوظة</label>
                    <input type="number" id="memorized" min="0" max="30" value="0" required>
                </div>
                <div class="form-group">
                    <label>الأجزاء المراجعة</label>
                    <input type="number" id="reviewed" min="0" max="30" value="0" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>التقدير</label>
                <select id="studentGrade" required>
                    <option value="">اختر التقدير</option>
                    <option value="excellent">ممتاز</option>
                    <option value="good">جيد</option>
                    <option value="average">متوسط</option>
                    <option value="weak">ضعيف</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>ملاحظات</label>
                <textarea id="studentNotes" rows="3" placeholder="ملاحظات إضافية (اختياري)"></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> حفظ
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </form>
    `;
    
    showModal(modalContent);
}

// تحديث دالة إضافة الطالب
function addStudent(event) {
    event.preventDefault();
    
    const newStudent = {
        id: Date.now(),
        name: document.getElementById('studentName').value,
        gender: document.getElementById('studentGender').value,
        phone: document.getElementById('studentPhone').value || '', // اختياري
        parentPhone: document.getElementById('parentPhone').value,
        circleId: parseInt(document.getElementById('studentCircle').value),
        level: document.getElementById('studentLevel').value,
        memorized: parseInt(document.getElementById('memorized').value),
        reviewed: parseInt(document.getElementById('reviewed').value),
        grade: document.getElementById('studentGrade').value,
        notes: document.getElementById('studentNotes').value,
        joinDate: new Date().toISOString()
    };
    
    systemData.students.push(newStudent);
    
    // إضافة الطالب إلى الحلقة
    const circle = systemData.circles.find(c => c.id === newStudent.circleId);
    if (circle) {
        circle.students.push(newStudent.id);
        saveToStorage('circles', systemData.circles);
    }
    
    saveToStorage('students', systemData.students);
    updateStudentsTable();
    updateDashboard();
    closeModal();
    showNotification('تم إضافة الطالب بنجاح', 'success');
}

// إضافة زر الطلاب المتأخرين للمعلمين
function addLaggingStudentsButton() {
    if (currentUser && currentUser.type === 'teacher') {
        const studentsPage = document.getElementById('studentsPage');
        const pageHeader = studentsPage.querySelector('.page-header');
        
        // التحقق من عدم وجود الزر مسبقاً
        if (!pageHeader.querySelector('#laggingStudentsBtn')) {
            const laggingBtn = document.createElement('button');
            laggingBtn.id = 'laggingStudentsBtn';
            laggingBtn.className = 'btn btn-warning';
            laggingBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> الطلاب المتأخرون';
            laggingBtn.onclick = showLaggingStudents;
            
            pageHeader.appendChild(laggingBtn);
        }
    }
}

// تحديث جدول الطلاب لإضافة رابط الملف الشخصي
function updateStudentsTable() {
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';
    
    let filteredStudents = systemData.students;
    
    // تطبيق المرشحات
    const circleFilter = document.getElementById('circleFilter')?.value;
    const genderFilter = document.getElementById('genderFilter')?.value;
    
    if (circleFilter) {
        filteredStudents = filteredStudents.filter(s => s.circleId == circleFilter);
    }
    
    if (genderFilter) {
        filteredStudents = filteredStudents.filter(s => s.gender === genderFilter);
    }
    
    // تصفية للمعلمين - عرض طلاب حلقاتهم فقط
    if (currentUser && currentUser.type === 'teacher') {
        const teacherCircles = systemData.circles.filter(c => c.teacherId === currentUser.teacherId);
        filteredStudents = filteredStudents.filter(s => 
            teacherCircles.some(c => c.id === s.circleId)
        );
    }
    
    filteredStudents.forEach(student => {
        const circle = systemData.circles.find(c => c.id === student.circleId);
        const teacher = systemData.teachers.find(t => t.id === circle?.teacherId);
        
        const gradeClass = {
            'excellent': 'badge-excellent',
            'good': 'badge-good', 
            'average': 'badge-average',
            'weak': 'badge-weak'
        };
        
        const gradeText = {
            'excellent': 'ممتاز',
            'good': 'جيد',
            'average': 'متوسط', 
            'weak': 'ضعيف'
        };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <a href="#" onclick="showStudentProfile(${student.id})" class="student-name-link">
                    ${student.name}
                </a>
            </td>
            <td>${student.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
            <td>${student.phone || 'غير محدد'}</td>
            <td>${student.parentPhone}</td>
            <td>${circle?.name || 'غير محدد'}</td>
            <td>${teacher?.name || 'غير محدد'}</td>
            <td>${student.memorized}</td>
            <td>${student.reviewed}</td>
            <td><span class="badge ${gradeClass[student.grade]}">${gradeText[student.grade]}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showStudentProfile(${student.id})">
                    <i class="fas fa-user"></i> الملف
                </button>
                ${currentUser.type === 'admin' || currentUser.type === 'teacher' ? `
                    <button class="btn btn-sm btn-success" onclick="showEditStudentModal(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // إضافة زر الطلاب المتأخرين للمعلمين
    addLaggingStudentsButton();
}

// دوال مساعدة
function getLevelText(level) {
    const levels = {
        'beginner': 'مبتدئ',
        'intermediate': 'متوسط',
        'advanced': 'متقدم'
    };
    return levels[level] || level;
}

function getGradeText(grade) {
    const grades = {
        'excellent': 'ممتاز',
        'good': 'جيد',
        'average': 'متوسط',
        'weak': 'ضعيف'
    };
    return grades[grade] || grade;
}

function getPriorityText(priority) {
    const priorities = {
        'high': 'عالية',
        'medium': 'متوسطة',
        'low': 'منخفضة'
    };
    return priorities[priority] || priority;
}

// تحديث معالج التنقل لإضافة الصفحات الجديدة
function handleNavigation(e) {
    e.preventDefault();
    const page = e.target.closest('.menu-item').dataset.page;
    
    if (page === 'surahs') {
        showSurahsPage();
    }
    
    showPage(page);
}

// CSS إضافي للصفحات الجديدة
const newStyles = `
<style>
.student-profile-container {
    display: grid;
    gap: 2rem;
}

.profile-section {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-section h3 {
    color: #333;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #667eea;
}

.profile-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 5px;
}

.info-item label {
    font-weight: 600;
    color: #666;
}

.profile-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.attendance-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    color: white;
}

.stat-item.present { background: #28a745; }
.stat-item.absent { background: #dc3545; }
.stat-item.excused { background: #ffc107; color: #212529; }
.stat-item.rate { background: #17a2b8; }

.stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.875rem;
}

.attendance-timeline {
    display: grid;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
}

.attendance-record {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 5px;
}

.record-status {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: 600;
}

.record-status.present { background: #28a745; color: white; }
.record-status.absent { background: #dc3545; color: white; }
.record-status.excused { background: #ffc107; color: #212529; }

.progress-item {
    margin-bottom: 1rem;
}

.progress-bar {
    position: relative;
    background: #e9ecef;
    border-radius: 10px;
    height: 25px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #28a745;
    transition: width 0.3s ease;
}

.progress-fill.reviewed {
    background: #17a2b8;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
}

.surahs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.surah-item {
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid #e9ecef;
    text-align: center;
}

.surah-item.completed {
    background: #d4edda;
    border-color: #28a745;
}

.surah-item.pending {
    background: #fff3cd;
    border-color: #ffc107;
}

.surah-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.surah-info {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.surah-status {
    font-size: 0.875rem;
    font-weight: 600;
}

.ai-suggestions {
    display: grid;
    gap: 1rem;
}

.ai-note {
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid;
}

.ai-note.priority-high {
    background: #f8d7da;
    border-color: #dc3545;
}

.ai-note.priority-medium {
    background: #fff3cd;
    border-color: #ffc107;
}

.ai-note.priority-low {
    background: #d1ecf1;
    border-color: #17a2b8;
}

.ai-note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.priority-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(0,0,0,0.1);
}

.notes-section textarea {
    margin-bottom: 1rem;
}

.student-name-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.student-name-link:hover {
    text-decoration: underline;
}

.surahs-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.surahs-table-container {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.lagging-students-content {
    max-height: 500px;
    overflow-y: auto;
}

.lagging-explanation {
    background: #fff3cd;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.lagging-students-list {
    display: grid;
    gap: 1rem;
}

.lagging-student-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #dc3545;
}

.student-info h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.student-info p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #666;
}

.gap {
    color: #dc3545 !important;
    font-weight: bold !important;
}

.student-actions {
    display: flex;
    gap: 0.5rem;
}

.no-lagging {
    text-align: center;
    padding: 2rem;
    color: #28a745;
    font-size: 1.1rem;
}

.no-suggestions {
    text-align: center;
    padding: 1rem;
    color: #666;
    font-style: italic;
}

@media (max-width: 768px) {
    .profile-info-grid {
        grid-template-columns: 1fr;
    }
    
    .attendance-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .profile-actions {
        flex-direction: column;
    }
    
    .lagging-student-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .student-actions {
        width: 100%;
        justify-content: center;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', newStyles);