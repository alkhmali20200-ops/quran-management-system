// إعدادات النظام المتقدمة
const ADVANCED_CONFIG = {
    // إعدادات الحفظ
    MEMORIZATION: {
        TOTAL_PARTS: 30, // إجمالي أجزاء القرآن
        GRADES: {
            'excellent': { min: 90, color: '#28a745', text: 'ممتاز' },
            'good': { min: 75, color: '#17a2b8', text: 'جيد' },
            'average': { min: 60, color: '#ffc107', text: 'متوسط' },
            'weak': { min: 0, color: '#dc3545', text: 'ضعيف' }
        }
    },
    
    // إعدادات الحضور
    ATTENDANCE: {
        WORKING_DAYS: ['sunday', 'monday', 'tuesday', 'wednesday'],
        TIMES: {
            'after_fajr': 'بعد الفجر',
            'after_asr': 'بعد العصر',
            'after_maghrib': 'بعد المغرب',
            'after_isha': 'بعد العشاء'
        }
    },
    
    // إعدادات الإشعارات
    NOTIFICATIONS: {
        SUCCESS_DURATION: 3000,
        ERROR_DURATION: 5000,
        WARNING_DURATION: 4000
    },
    
    // إعدادات التقارير
    REPORTS: {
        EXPORT_FORMATS: ['pdf', 'excel', 'csv'],
        DATE_FORMAT: 'YYYY-MM-DD',
        TIME_FORMAT: 'HH:mm'
    }
};

// وظائف مساعدة للتقارير
const ReportUtils = {
    // تصدير بيانات الطلاب
    exportStudentsData: function(format = 'csv') {
        const students = systemData.students;
        const csvContent = this.convertToCSV(students);
        this.downloadFile(csvContent, `students_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    },
    
    // تصدير بيانات الحضور
    exportAttendanceData: function(circleId, startDate, endDate) {
        const attendance = systemData.attendance.filter(a => 
            a.circleId === circleId && 
            a.date >= startDate && 
            a.date <= endDate
        );
        const csvContent = this.convertToCSV(attendance);
        this.downloadFile(csvContent, `attendance_${circleId}_${startDate}_${endDate}.csv`, 'text/csv');
    },
    
    // تحويل البيانات إلى CSV
    convertToCSV: function(data) {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    },
    
    // تحميل الملف
    downloadFile: function(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// وظائف الإحصائيات المتقدمة
const AdvancedStats = {
    // حساب معدل الحضور لطالب معين
    getStudentAttendanceRate: function(studentId, startDate, endDate) {
        const studentAttendance = systemData.attendance.filter(a => {
            const studentRecord = a.records.find(r => r.studentId === studentId);
            return studentRecord && a.date >= startDate && a.date <= endDate;
        });
        
        if (!studentAttendance.length) return 0;
        
        const presentCount = studentAttendance.filter(a => {
            const studentRecord = a.records.find(r => r.studentId === studentId);
            return studentRecord && studentRecord.status === 'present';
        }).length;
        
        return (presentCount / studentAttendance.length) * 100;
    },
    
    // حساب معدل الحضور لحلقة معينة
    getCircleAttendanceRate: function(circleId, startDate, endDate) {
        const circleAttendance = systemData.attendance.filter(a => 
            a.circleId === circleId && a.date >= startDate && a.date <= endDate
        );
        
        if (!circleAttendance.length) return 0;
        
        let totalStudents = 0;
        let presentStudents = 0;
        
        circleAttendance.forEach(a => {
            totalStudents += a.records.length;
            presentStudents += a.records.filter(r => r.status === 'present').length;
        });
        
        return totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
    },
    
    // حساب توزيع التقديرات
    getGradeDistribution: function() {
        const distribution = {
            excellent: 0,
            good: 0,
            average: 0,
            weak: 0
        };
        
        systemData.students.forEach(student => {
            if (distribution.hasOwnProperty(student.grade)) {
                distribution[student.grade]++;
            }
        });
        
        return distribution;
    },
    
    // حساب متوسط الحفظ حسب الحلقة
    getMemorizationByCircle: function() {
        const circleStats = {};
        
        systemData.circles.forEach(circle => {
            const circleStudents = systemData.students.filter(s => s.circleId === circle.id);
            const totalMemorized = circleStudents.reduce((sum, s) => sum + s.memorized, 0);
            const avgMemorized = circleStudents.length > 0 ? totalMemorized / circleStudents.length : 0;
            
            circleStats[circle.id] = {
                name: circle.name,
                studentsCount: circleStudents.length,
                avgMemorized: avgMemorized.toFixed(1),
                totalMemorized: totalMemorized
            };
        });
        
        return circleStats;
    }
};

// وظائف التحقق من صحة البيانات
const DataValidator = {
    // التحقق من بيانات الطالب
    validateStudent: function(studentData) {
        const errors = [];
        
        if (!studentData.name || studentData.name.trim().length < 2) {
            errors.push('اسم الطالب يجب أن يكون أكثر من حرفين');
        }
        
        if (!studentData.age || studentData.age < 5 || studentData.age > 25) {
            errors.push('عمر الطالب يجب أن يكون بين 5 و 25 سنة');
        }
        
        if (!['male', 'female'].includes(studentData.gender)) {
            errors.push('يجب تحديد جنس الطالب');
        }
        
        if (!studentData.parentPhone || studentData.parentPhone.length < 10) {
            errors.push('رقم هاتف ولي الأمر مطلوب ويجب أن يكون 10 أرقام على الأقل');
        }
        
        if (studentData.memorized < 0 || studentData.memorized > 30) {
            errors.push('عدد الأجزاء المحفوظة يجب أن يكون بين 0 و 30');
        }
        
        if (studentData.reviewed < 0 || studentData.reviewed > studentData.memorized) {
            errors.push('عدد الأجزاء المراجعة لا يمكن أن يكون أكثر من المحفوظة');
        }
        
        return errors;
    },
    
    // التحقق من بيانات المعلم
    validateTeacher: function(teacherData) {
        const errors = [];
        
        if (!teacherData.name || teacherData.name.trim().length < 2) {
            errors.push('اسم المعلم يجب أن يكون أكثر من حرفين');
        }
        
        if (!teacherData.phone || teacherData.phone.length < 10) {
            errors.push('رقم الهاتف مطلوب ويجب أن يكون 10 أرقام على الأقل');
        }
        
        if (teacherData.email && !this.isValidEmail(teacherData.email)) {
            errors.push('البريد الإلكتروني غير صحيح');
        }
        
        return errors;
    },
    
    // التحقق من بيانات الحلقة
    validateCircle: function(circleData) {
        const errors = [];
        
        if (!circleData.name || circleData.name.trim().length < 2) {
            errors.push('اسم الحلقة يجب أن يكون أكثر من حرفين');
        }
        
        if (!circleData.teacherId) {
            errors.push('يجب اختيار معلم للحلقة');
        }
        
        if (!circleData.mosque || circleData.mosque.trim().length < 2) {
            errors.push('اسم المسجد أو الدار مطلوب');
        }
        
        if (!Object.keys(ADVANCED_CONFIG.ATTENDANCE.TIMES).includes(circleData.time)) {
            errors.push('يجب اختيار وقت صحيح للحلقة');
        }
        
        if (!['male', 'female'].includes(circleData.gender)) {
            errors.push('يجب تحديد جنس الحلقة');
        }
        
        if (!circleData.maxStudents || circleData.maxStudents < 5 || circleData.maxStudents > 30) {
            errors.push('الحد الأقصى للطلاب يجب أن يكون بين 5 و 30');
        }
        
        return errors;
    },
    
    // التحقق من صحة البريد الإلكتروني
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// وظائف النسخ الاحتياطي
const BackupManager = {
    // إنشاء نسخة احتياطية
    createBackup: function() {
        const backupData = {
            timestamp: new Date().toISOString(),
            version: SYSTEM_CONFIG.VERSION,
            data: {
                users: systemData.users,
                teachers: systemData.teachers,
                students: systemData.students,
                circles: systemData.circles,
                attendance: systemData.attendance,
                progress: systemData.progress,
                activities: systemData.activities
            }
        };
        
        const backupJson = JSON.stringify(backupData, null, 2);
        const filename = `quran_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        ReportUtils.downloadFile(backupJson, filename, 'application/json');
        showNotification('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
    },
    
    // استعادة من نسخة احتياطية
    restoreBackup: function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);
                
                if (!backupData.data) {
                    throw new Error('ملف النسخة الاحتياطية غير صحيح');
                }
                
                // التحقق من صحة البيانات
                const requiredKeys = ['users', 'teachers', 'students', 'circles', 'attendance'];
                const missingKeys = requiredKeys.filter(key => !backupData.data[key]);
                
                if (missingKeys.length > 0) {
                    throw new Error(`البيانات المطلوبة مفقودة: ${missingKeys.join(', ')}`);
                }
                
                // استعادة البيانات
                Object.keys(backupData.data).forEach(key => {
                    systemData[key] = backupData.data[key];
                    saveToStorage(key, backupData.data[key]);
                });
                
                // تحديث الواجهة
                loadSystemData();
                updateDashboard();
                updateTeachersTable();
                updateStudentsTable();
                updateCirclesFilter();
                
                showNotification('تم استعادة النسخة الاحتياطية بنجاح', 'success');
                
            } catch (error) {
                showNotification('خطأ في استعادة النسخة الاحتياطية: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    }
};

// إضافة وظائف التصدير إلى النظام الرئيسي
window.ReportUtils = ReportUtils;
window.AdvancedStats = AdvancedStats;
window.DataValidator = DataValidator;
window.BackupManager = BackupManager;
window.ADVANCED_CONFIG = ADVANCED_CONFIG;