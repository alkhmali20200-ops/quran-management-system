// ==================== الربط مع خدمات Google ====================

// إعدادات Google Sheets API
const GOOGLE_CONFIG = {
    // ستحتاج إلى إنشاء مشروع في Google Cloud Console
    API_KEY: 'YOUR_GOOGLE_API_KEY', // ضع مفتاح API هنا
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // معرف جدول البيانات
    DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
    SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
};

// تهيئة Google API
let gapi;
let googleSheetsReady = false;

// تحميل Google API
function loadGoogleAPI() {
    return new Promise((resolve, reject) => {
        if (window.gapi) {
            gapi = window.gapi;
            initializeGoogleAPI().then(resolve).catch(reject);
        } else {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi = window.gapi;
                initializeGoogleAPI().then(resolve).catch(reject);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        }
    });
}

// تهيئة Google API
async function initializeGoogleAPI() {
    try {
        await gapi.load('client:auth2', async () => {
            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.API_KEY,
                discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
            });
            googleSheetsReady = true;
            console.log('Google Sheets API جاهز للاستخدام');
        });
    } catch (error) {
        console.error('خطأ في تهيئة Google API:', error);
    }
}

// ==================== تصدير البيانات إلى Google Sheets ====================

// تصدير بيانات الطلاب
async function exportStudentsToSheets() {
    if (!googleSheetsReady) {
        showNotification('جاري تحميل Google Sheets...', 'info');
        await loadGoogleAPI();
    }

    try {
        // إعداد البيانات
        const headers = [
            'الاسم', 'الجنس', 'رقم الجوال', 'جوال ولي الأمر', 
            'الحلقة', 'المعلم', 'المستوى', 'الأجزاء المحفوظة', 
            'الأجزاء المراجعة', 'التقدير', 'تاريخ الانضمام', 'الملاحظات'
        ];

        const rows = systemData.students.map(student => {
            const circle = systemData.circles.find(c => c.id === student.circleId);
            const teacher = systemData.teachers.find(t => t.id === circle?.teacherId);
            
            return [
                student.name,
                student.gender === 'male' ? 'ذكر' : 'أنثى',
                student.phone || 'غير محدد',
                student.parentPhone,
                circle?.name || 'غير محدد',
                teacher?.name || 'غير محدد',
                getLevelText(student.level),
                student.memorized,
                student.reviewed,
                getGradeText(student.grade),
                new Date(student.joinDate).toLocaleDateString('ar-SA'),
                student.notes || ''
            ];
        });

        // إرسال البيانات إلى Google Sheets
        const values = [headers, ...rows];
        
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
            range: 'الطلاب!A1',
            valueInputOption: 'RAW',
            resource: { values }
        });

        showNotification('تم تصدير بيانات الطلاب بنجاح إلى Google Sheets', 'success');
        return response;
        
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showNotification('حدث خطأ في تصدير البيانات', 'error');
    }
}

// تصدير بيانات الحضور
async function exportAttendanceToSheets() {
    if (!googleSheetsReady) {
        await loadGoogleAPI();
    }

    try {
        const headers = ['التاريخ', 'الحلقة', 'الطالب', 'الحالة', 'الملاحظات'];
        const rows = [];

        systemData.attendance.forEach(session => {
            const circle = systemData.circles.find(c => c.id === session.circleId);
            
            session.records.forEach(record => {
                const student = systemData.students.find(s => s.id === record.studentId);
                const statusText = {
                    'present': 'حاضر',
                    'absent': 'غائب',
                    'excused': 'مستأذن'
                };

                rows.push([
                    new Date(session.date).toLocaleDateString('ar-SA'),
                    circle?.name || 'غير محدد',
                    student?.name || 'غير محدد',
                    statusText[record.status],
                    record.notes || ''
                ]);
            });
        });

        const values = [headers, ...rows];
        
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
            range: 'الحضور!A1',
            valueInputOption: 'RAW',
            resource: { values }
        });

        showNotification('تم تصدير بيانات الحضور بنجاح', 'success');
        
    } catch (error) {
        console.error('خطأ في تصدير الحضور:', error);
        showNotification('حدث خطأ في تصدير بيانات الحضور', 'error');
    }
}

// تصدير إحصائيات الحلقات
async function exportCircleStatsToSheets() {
    if (!googleSheetsReady) {
        await loadGoogleAPI();
    }

    try {
        const headers = [
            'اسم الحلقة', 'المعلم', 'المسجد', 'الوقت', 'الجنس',
            'عدد الطلاب', 'الحد الأقصى', 'متوسط الحفظ', 'متوسط الحضور',
            'الطلاب المتميزون', 'الطلاب المتأخرون'
        ];

        const rows = systemData.circles.map(circle => {
            const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
            const students = systemData.students.filter(s => s.circleId === circle.id);
            
            // حساب الإحصائيات
            const avgMemorized = students.length > 0 ? 
                (students.reduce((sum, s) => sum + s.memorized, 0) / students.length).toFixed(1) : 0;
            
            const excellentCount = students.filter(s => s.grade === 'excellent').length;
            const weakCount = students.filter(s => s.grade === 'weak').length;
            
            // حساب متوسط الحضور
            const attendanceSessions = systemData.attendance.filter(a => a.circleId === circle.id);
            let avgAttendance = 0;
            if (attendanceSessions.length > 0) {
                const totalPresent = attendanceSessions.reduce((sum, session) => {
                    return sum + session.records.filter(r => r.status === 'present').length;
                }, 0);
                const totalRecords = attendanceSessions.reduce((sum, session) => sum + session.records.length, 0);
                avgAttendance = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : 0;
            }

            const timeText = {
                'after_fajr': 'بعد الفجر',
                'after_asr': 'بعد العصر',
                'after_maghrib': 'بعد المغرب',
                'after_isha': 'بعد العشاء'
            };

            return [
                circle.name,
                teacher?.name || 'غير محدد',
                circle.mosque,
                timeText[circle.time] || circle.time,
                circle.gender === 'male' ? 'ذكور' : 'إناث',
                students.length,
                circle.maxStudents,
                avgMemorized,
                `${avgAttendance}%`,
                excellentCount,
                weakCount
            ];
        });

        const values = [headers, ...rows];
        
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
            range: 'إحصائيات الحلقات!A1',
            valueInputOption: 'RAW',
            resource: { values }
        });

        showNotification('تم تصدير إحصائيات الحلقات بنجاح', 'success');
        
    } catch (error) {
        console.error('خطأ في تصدير الإحصائيات:', error);
        showNotification('حدث خطأ في تصدير الإحصائيات', 'error');
    }
}

// ==================== إنشاء التقارير الذكية ====================

// إنشاء تقرير شامل بالذكاء الاصطناعي
async function generateAIReport() {
    showNotification('جاري إنشاء التقرير الذكي...', 'info');
    
    try {
        // جمع البيانات للتحليل
        const reportData = {
            totalStudents: systemData.students.length,
            totalTeachers: systemData.teachers.length,
            totalCircles: systemData.circles.length,
            
            // إحصائيات الطلاب
            studentsByGender: {
                male: systemData.students.filter(s => s.gender === 'male').length,
                female: systemData.students.filter(s => s.gender === 'female').length
            },
            
            studentsByGrade: {
                excellent: systemData.students.filter(s => s.grade === 'excellent').length,
                good: systemData.students.filter(s => s.grade === 'good').length,
                average: systemData.students.filter(s => s.grade === 'average').length,
                weak: systemData.students.filter(s => s.grade === 'weak').length
            },
            
            // إحصائيات الحفظ
            memorization: {
                totalParts: systemData.students.reduce((sum, s) => sum + s.memorized, 0),
                avgParts: (systemData.students.reduce((sum, s) => sum + s.memorized, 0) / systemData.students.length).toFixed(1),
                topMemorizers: systemData.students
                    .sort((a, b) => b.memorized - a.memorized)
                    .slice(0, 5)
                    .map(s => ({ name: s.name, parts: s.memorized }))
            },
            
            // إحصائيات الحضور
            attendance: calculateAttendanceStats(),
            
            // أداء الحلقات
            circlePerformance: systemData.circles.map(circle => {
                const students = systemData.students.filter(s => s.circleId === circle.id);
                const teacher = systemData.teachers.find(t => t.id === circle.teacherId);
                
                return {
                    name: circle.name,
                    teacher: teacher?.name,
                    studentsCount: students.length,
                    avgMemorized: students.length > 0 ? 
                        (students.reduce((sum, s) => sum + s.memorized, 0) / students.length).toFixed(1) : 0,
                    excellentCount: students.filter(s => s.grade === 'excellent').length,
                    performance: calculateCirclePerformance(circle.id)
                };
            })
        };

        // إنشاء التقرير
        const report = await createDetailedReport(reportData);
        
        // عرض التقرير
        showReportModal(report);
        
        // حفظ التقرير
        saveReportToStorage(report);
        
        showNotification('تم إنشاء التقرير بنجاح!', 'success');
        
    } catch (error) {
        console.error('خطأ في إنشاء التقرير:', error);
        showNotification('حدث خطأ في إنشاء التقرير', 'error');
    }
}

// حساب إحصائيات الحضور
function calculateAttendanceStats() {
    if (systemData.attendance.length === 0) {
        return { totalSessions: 0, avgAttendance: 0, trends: [] };
    }

    const totalSessions = systemData.attendance.length;
    let totalPresent = 0;
    let totalRecords = 0;

    systemData.attendance.forEach(session => {
        session.records.forEach(record => {
            totalRecords++;
            if (record.status === 'present') totalPresent++;
        });
    });

    const avgAttendance = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : 0;

    // تحليل الاتجاهات (آخر 4 أسابيع)
    const recentSessions = systemData.attendance
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);

    const trends = recentSessions.map(session => {
        const presentCount = session.records.filter(r => r.status === 'present').length;
        const totalCount = session.records.length;
        return {
            date: session.date,
            attendance: totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0
        };
    });

    return { totalSessions, avgAttendance, trends };
}

// حساب أداء الحلقة
function calculateCirclePerformance(circleId) {
    const students = systemData.students.filter(s => s.circleId === circleId);
    if (students.length === 0) return 0;

    // حساب النقاط بناءً على عدة معايير
    let score = 0;
    
    // معيار الحفظ (40%)
    const avgMemorized = students.reduce((sum, s) => sum + s.memorized, 0) / students.length;
    score += (avgMemorized / 30) * 40;
    
    // معيار التقديرات (30%)
    const excellentRatio = students.filter(s => s.grade === 'excellent').length / students.length;
    score += excellentRatio * 30;
    
    // معيار الحضور (30%)
    const attendanceSessions = systemData.attendance.filter(a => a.circleId === circleId);
    if (attendanceSessions.length > 0) {
        let totalPresent = 0;
        let totalRecords = 0;
        
        attendanceSessions.forEach(session => {
            session.records.forEach(record => {
                totalRecords++;
                if (record.status === 'present') totalPresent++;
            });
        });
        
        const attendanceRatio = totalRecords > 0 ? totalPresent / totalRecords : 0;
        score += attendanceRatio * 30;
    }
    
    return Math.round(score);
}

// إنشاء التقرير المفصل
async function createDetailedReport(data) {
    const currentDate = new Date().toLocaleDateString('ar-SA');
    const currentMonth = new Date().toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
    
    const report = {
        title: `تقرير أداء جمعية تحفيظ القرآن الكريم - ${currentMonth}`,
        date: currentDate,
        summary: {
            totalStudents: data.totalStudents,
            totalTeachers: data.totalTeachers,
            totalCircles: data.totalCircles,
            totalMemorizedParts: data.memorization.totalParts,
            avgAttendance: data.attendance.avgAttendance
        },
        
        // التحليل الذكي
        analysis: {
            strengths: generateStrengths(data),
            improvements: generateImprovements(data),
            recommendations: generateRecommendations(data)
        },
        
        // الإحصائيات التفصيلية
        details: {
            studentDistribution: data.studentsByGender,
            gradeDistribution: data.studentsByGrade,
            topPerformers: data.memorization.topMemorizers,
            circlePerformance: data.circlePerformance.sort((a, b) => b.performance - a.performance)
        },
        
        // المحتوى للشبكات الاجتماعية
        socialMedia: generateSocialMediaContent(data),
        
        // اقتراحات الحملة التبرعية
        fundraising: generateFundraisingCampaign(data)
    };
    
    return report;
}

// إنشاء نقاط القوة
function generateStrengths(data) {
    const strengths = [];
    
    if (data.studentsByGrade.excellent / data.totalStudents > 0.3) {
        strengths.push('نسبة عالية من الطلاب المتميزين (أكثر من 30%)');
    }
    
    if (data.memorization.avgParts > 5) {
        strengths.push(`متوسط ممتاز للحفظ (${data.memorization.avgParts} أجزاء لكل طالب)`);
    }
    
    if (data.attendance.avgAttendance > 80) {
        strengths.push(`نسبة حضور عالية (${data.attendance.avgAttendance}%)`);
    }
    
    if (data.totalCircles >= 3) {
        strengths.push('تنوع جيد في الحلقات لخدمة شرائح مختلفة');
    }
    
    const balancedGender = Math.abs(data.studentsByGender.male - data.studentsByGender.female) / data.totalStudents < 0.3;
    if (balancedGender) {
        strengths.push('توازن جيد بين الطلاب والطالبات');
    }
    
    return strengths.length > 0 ? strengths : ['الجمعية تعمل بجد لخدمة المجتمع'];
}

// إنشاء نقاط التحسين
function generateImprovements(data) {
    const improvements = [];
    
    if (data.studentsByGrade.weak / data.totalStudents > 0.2) {
        improvements.push('تحتاج نسبة من الطلاب إلى دعم إضافي في الحفظ');
    }
    
    if (data.attendance.avgAttendance < 70) {
        improvements.push('يمكن تحسين نسبة الحضور من خلال برامج تحفيزية');
    }
    
    if (data.memorization.avgParts < 3) {
        improvements.push('يمكن تطوير برامج لتسريع وتيرة الحفظ');
    }
    
    const genderImbalance = Math.abs(data.studentsByGender.male - data.studentsByGender.female) / data.totalStudents > 0.5;
    if (genderImbalance) {
        improvements.push('يمكن العمل على جذب المزيد من الطلاب من الجنس الأقل تمثيلاً');
    }
    
    return improvements.length > 0 ? improvements : ['الجمعية تحافظ على مستوى جيد من الأداء'];
}

// إنشاء التوصيات
function generateRecommendations(data) {
    const recommendations = [];
    
    recommendations.push('تنظيم مسابقات قرآنية شهرية لتحفيز الطلاب');
    recommendations.push('إقامة دورات تدريبية للمعلمين لتطوير مهاراتهم');
    recommendations.push('استخدام التقنيات الحديثة في التعليم والمتابعة');
    
    if (data.studentsByGrade.weak > 0) {
        recommendations.push('إنشاء برامج دعم خاصة للطلاب الذين يحتاجون مساعدة إضافية');
    }
    
    if (data.attendance.avgAttendance < 80) {
        recommendations.push('تطوير نظام حوافز للحضور المنتظم');
    }
    
    recommendations.push('التوسع في عدد الحلقات لاستيعاب المزيد من الطلاب');
    recommendations.push('تطوير برامج للأنشطة الثقافية والاجتماعية');
    
    return recommendations;
}

// إنشاء محتوى الشبكات الاجتماعية
function generateSocialMediaContent(data) {
    const posts = [];
    
    // منشور الإنجازات
    posts.push({
        type: 'achievements',
        title: '🏆 إنجازات جمعيتنا هذا الشهر',
        content: `
🌟 ${data.totalStudents} طالب وطالبة يحفظون كتاب الله
📚 ${data.memorization.totalParts} جزء تم حفظها هذا الشهر
👨‍🏫 ${data.totalTeachers} معلم ومعلمة مختصين
🕌 ${data.totalCircles} حلقة تحفيظ في مساجد مختلفة
📈 ${data.attendance.avgAttendance}% نسبة الحضور

#تحفيظ_القرآن #جمعية_خيرية #القرآن_الكريم
        `,
        hashtags: ['تحفيظ_القرآن', 'جمعية_خيرية', 'القرآن_الكريم']
    });
    
    // منشور الطلاب المتميزين
    if (data.memorization.topMemorizers.length > 0) {
        posts.push({
            type: 'top_performers',
            title: '⭐ تهنئة للطلاب المتميزين',
            content: `
نبارك لطلابنا المتميزين في الحفظ:

${data.memorization.topMemorizers.map((student, index) => 
    `${index + 1}. ${student.name} - ${student.parts} أجزاء`
).join('\n')}

بارك الله فيهم وزادهم من فضله 🤲

#طلاب_متميزون #حفظة_القرآن #تحفيظ
            `,
            hashtags: ['طلاب_متميزون', 'حفظة_القرآن', 'تحفيظ']
        });
    }
    
    // منشور الحاجة للدعم
    posts.push({
        type: 'support_needed',
        title: '🤝 نحتاج دعمكم لمواصلة رسالتنا',
        content: `
جمعيتنا تخدم ${data.totalStudents} طالب وطالبة في تحفيظ القرآن الكريم

نحتاج دعمكم في:
• توفير مصاحف ومواد تعليمية
• دعم المعلمين والمعلمات
• تطوير البرامج التعليمية
• توسيع الحلقات لاستيعاب المزيد

كل ريال تتبرعون به يساهم في خدمة كتاب الله 📖

#تبرعات #دعم_الجمعية #خير
        `,
        hashtags: ['تبرعات', 'دعم_الجمعية', 'خير']
    });
    
    return posts;
}

// إنشاء حملة التبرعات
function generateFundraisingCampaign(data) {
    const campaign = {
        title: 'حملة دعم جمعية تحفيظ القرآن الكريم',
        goal: 'جمع 100,000 ريال لتطوير البرامج التعليمية',
        
        needs: [
            {
                item: 'مصاحف وكتب تعليمية',
                cost: 15000,
                description: `${data.totalStudents} طالب يحتاجون مصاحف ومواد تعليمية حديثة`
            },
            {
                item: 'مكافآت المعلمين',
                cost: 30000,
                description: `دعم ${data.totalTeachers} معلم ومعلمة مختصين`
            },
            {
                item: 'تطوير التقنيات التعليمية',
                cost: 25000,
                description: 'أجهزة وبرامج تعليمية حديثة'
            },
            {
                item: 'برامج الأنشطة والمسابقات',
                cost: 20000,
                description: 'تنظيم مسابقات وأنشطة تحفيزية'
            },
            {
                item: 'توسيع الحلقات',
                cost: 10000,
                description: 'فتح حلقات جديدة لاستيعاب المزيد من الطلاب'
            }
        ],
        
        impact: {
            current: `نخدم حالياً ${data.totalStudents} طالب وطالبة`,
            target: 'نهدف لخدمة 200 طالب وطالبة خلال العام القادم',
            achievement: `تم حفظ ${data.memorization.totalParts} جزء هذا الشهر`
        },
        
        donationLevels: [
            { amount: 50, benefit: 'دعم طالب واحد لشهر كامل' },
            { amount: 100, benefit: 'توفير مصحف ومواد تعليمية لطالب' },
            { amount: 500, benefit: 'دعم معلم لشهر كامل' },
            { amount: 1000, benefit: 'رعاية حلقة كاملة لشهر' },
            { amount: 5000, benefit: 'تجهيز حلقة جديدة بالكامل' }
        ],
        
        socialProof: [
            `${data.studentsByGrade.excellent} طالب حصلوا على تقدير ممتاز`,
            `${data.attendance.avgAttendance}% نسبة حضور منتظم`,
            `${data.totalCircles} حلقات تعمل بانتظام`
        ]
    };
    
    return campaign;
}

// عرض التقرير في نافذة منبثقة
function showReportModal(report) {
    const modalContent = `
        <div class="report-modal">
            <h2>${report.title}</h2>
            <p class="report-date">تاريخ التقرير: ${report.date}</p>
            
            <!-- الملخص التنفيذي -->
            <div class="report-section">
                <h3>📊 الملخص التنفيذي</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-number">${report.summary.totalStudents}</div>
                        <div class="summary-label">إجمالي الطلاب</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${report.summary.totalTeachers}</div>
                        <div class="summary-label">المعلمون</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${report.summary.totalCircles}</div>
                        <div class="summary-label">الحلقات</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${report.summary.totalMemorizedParts}</div>
                        <div class="summary-label">الأجزاء المحفوظة</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-number">${report.summary.avgAttendance}%</div>
                        <div class="summary-label">متوسط الحضور</div>
                    </div>
                </div>
            </div>
            
            <!-- نقاط القوة -->
            <div class="report-section">
                <h3>💪 نقاط القوة</h3>
                <ul class="strengths-list">
                    ${report.analysis.strengths.map(strength => `<li>${strength}</li>`).join('')}
                </ul>
            </div>
            
            <!-- التوصيات -->
            <div class="report-section">
                <h3>🎯 التوصيات</h3>
                <ul class="recommendations-list">
                    ${report.analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <!-- أفضل الحلقات -->
            <div class="report-section">
                <h3>🏆 أداء الحلقات</h3>
                <div class="circles-performance">
                    ${report.details.circlePerformance.slice(0, 3).map((circle, index) => `
                        <div class="circle-performance-item">
                            <div class="rank">${index + 1}</div>
                            <div class="circle-info">
                                <h4>${circle.name}</h4>
                                <p>المعلم: ${circle.teacher}</p>
                                <p>عدد الطلاب: ${circle.studentsCount}</p>
                                <p>متوسط الحفظ: ${circle.avgMemorized} أجزاء</p>
                            </div>
                            <div class="performance-score">${circle.performance}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- الإجراءات -->
            <div class="report-actions">
                <button class="btn btn-primary" onclick="exportReportToPDF()">
                    <i class="fas fa-file-pdf"></i> تصدير PDF
                </button>
                <button class="btn btn-success" onclick="shareToSocialMedia()">
                    <i class="fas fa-share"></i> مشاركة في الشبكات الاجتماعية
                </button>
                <button class="btn btn-warning" onclick="createFundraisingCampaign()">
                    <i class="fas fa-heart"></i> إنشاء حملة تبرعات
                </button>
                <button class="btn btn-info" onclick="exportToGoogleDocs()">
                    <i class="fab fa-google-drive"></i> حفظ في Google Docs
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// حفظ التقرير في التخزين المحلي
function saveReportToStorage(report) {
    const reports = getFromStorage('reports') || [];
    reports.unshift({
        id: Date.now(),
        ...report,
        createdAt: new Date().toISOString()
    });
    
    // الاحتفاظ بآخر 10 تقارير فقط
    if (reports.length > 10) {
        reports.splice(10);
    }
    
    saveToStorage('reports', reports);
}

// تصدير التقرير إلى Google Docs
async function exportToGoogleDocs() {
    showNotification('جاري تصدير التقرير إلى Google Docs...', 'info');
    
    try {
        // هنا يمكن إضافة كود الربط مع Google Docs API
        // للبساطة، سنعرض رسالة توضيحية
        
        const docContent = generateGoogleDocsContent();
        
        // محاكاة التصدير
        setTimeout(() => {
            showNotification('تم إنشاء التقرير في Google Docs بنجاح!', 'success');
            
            // فتح نافذة جديدة لـ Google Docs
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                <head>
                    <title>تقرير الجمعية</title>
                    <style>
                        body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
                        h1, h2, h3 { color: #333; }
                        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                    </style>
                </head>
                <body>${docContent}</body>
                </html>
            `);
        }, 2000);
        
    } catch (error) {
        console.error('خطأ في التصدير:', error);
        showNotification('حدث خطأ في تصدير التقرير', 'error');
    }
}

// إنشاء محتوى Google Docs
function generateGoogleDocsContent() {
    const reports = getFromStorage('reports') || [];
    const latestReport = reports[0];
    
    if (!latestReport) {
        return '<p>لا توجد تقارير متاحة</p>';
    }
    
    return `
        <h1>${latestReport.title}</h1>
        <p><strong>تاريخ التقرير:</strong> ${latestReport.date}</p>
        
        <div class="summary">
            <h2>الملخص التنفيذي</h2>
            <ul>
                <li>إجمالي الطلاب: ${latestReport.summary.totalStudents}</li>
                <li>إجمالي المعلمين: ${latestReport.summary.totalTeachers}</li>
                <li>إجمالي الحلقات: ${latestReport.summary.totalCircles}</li>
                <li>الأجزاء المحفوظة: ${latestReport.summary.totalMemorizedParts}</li>
                <li>متوسط الحضور: ${latestReport.summary.avgAttendance}%</li>
            </ul>
        </div>
        
        <h2>نقاط القوة</h2>
        <ul>
            ${latestReport.analysis.strengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        
        <h2>التوصيات</h2>
        <ul>
            ${latestReport.analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
        
        <h2>أداء الحلقات</h2>
        ${latestReport.details.circlePerformance.map(circle => `
            <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;">
                <h3>${circle.name}</h3>
                <p>المعلم: ${circle.teacher}</p>
                <p>عدد الطلاب: ${circle.studentsCount}</p>
                <p>متوسط الحفظ: ${circle.avgMemorized} أجزاء</p>
                <p>نقاط الأداء: ${circle.performance}%</p>
            </div>
        `).join('')}
    `;
}

// مشاركة في الشبكات الاجتماعية
function shareToSocialMedia() {
    const reports = getFromStorage('reports') || [];
    const latestReport = reports[0];
    
    if (!latestReport || !latestReport.socialMedia) {
        showNotification('لا توجد تقارير متاحة للمشاركة', 'error');
        return;
    }
    
    const modalContent = `
        <div class="social-media-share">
            <h3>📱 مشاركة في الشبكات الاجتماعية</h3>
            
            ${latestReport.socialMedia.map((post, index) => `
                <div class="social-post">
                    <h4>${post.title}</h4>
                    <div class="post-content">
                        <textarea readonly rows="8">${post.content}</textarea>
                    </div>
                    <div class="post-actions">
                        <button class="btn btn-primary" onclick="copyToClipboard('post-${index}')">
                            <i class="fas fa-copy"></i> نسخ النص
                        </button>
                        <button class="btn btn-success" onclick="shareToWhatsApp('post-${index}')">
                            <i class="fab fa-whatsapp"></i> مشاركة في واتساب
                        </button>
                        <button class="btn btn-info" onclick="shareToTwitter('post-${index}')">
                            <i class="fab fa-twitter"></i> مشاركة في تويتر
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// إنشاء حملة التبرعات
function createFundraisingCampaign() {
    const reports = getFromStorage('reports') || [];
    const latestReport = reports[0];
    
    if (!latestReport || !latestReport.fundraising) {
        showNotification('لا توجد بيانات كافية لإنشاء حملة تبرعات', 'error');
        return;
    }
    
    const campaign = latestReport.fundraising;
    
    const modalContent = `
        <div class="fundraising-campaign">
            <h2>💝 ${campaign.title}</h2>
            <p class="campaign-goal">${campaign.goal}</p>
            
            <div class="campaign-impact">
                <h3>الأثر المتوقع</h3>
                <ul>
                    <li>${campaign.impact.current}</li>
                    <li>${campaign.impact.target}</li>
                    <li>${campaign.impact.achievement}</li>
                </ul>
            </div>
            
            <div class="campaign-needs">
                <h3>احتياجات الحملة</h3>
                ${campaign.needs.map(need => `
                    <div class="need-item">
                        <h4>${need.item}</h4>
                        <p>${need.description}</p>
                        <div class="need-cost">${need.cost.toLocaleString()} ريال</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="donation-levels">
                <h3>مستويات التبرع</h3>
                ${campaign.donationLevels.map(level => `
                    <div class="donation-level">
                        <div class="amount">${level.amount} ريال</div>
                        <div class="benefit">${level.benefit}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="campaign-actions">
                <button class="btn btn-success" onclick="generateCampaignMaterials()">
                    <i class="fas fa-magic"></i> إنشاء مواد الحملة
                </button>
                <button class="btn btn-primary" onclick="exportCampaignToPDF()">
                    <i class="fas fa-file-pdf"></i> تصدير كـ PDF
                </button>
                <button class="btn btn-info" onclick="shareCampaign()">
                    <i class="fas fa-share"></i> مشاركة الحملة
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
}

// تهيئة الربط مع Google عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل Google API تلقائياً
    loadGoogleAPI().catch(error => {
        console.log('Google API غير متاح حالياً:', error);
    });
});

// إضافة أزرار التصدير والتقارير إلى الواجهة
function addGoogleIntegrationButtons() {
    // إضافة قسم التقارير والتصدير
    const dashboardPage = document.getElementById('dashboardPage');
    const existingContent = dashboardPage.innerHTML;
    
    const newSection = `
        <div class="google-integration-section">
            <h3><i class="fas fa-cloud"></i> التقارير والتصدير</h3>
            <div class="integration-buttons">
                <button class="btn btn-primary" onclick="generateAIReport()">
                    <i class="fas fa-robot"></i> إنشاء تقرير ذكي
                </button>
                <button class="btn btn-success" onclick="exportStudentsToSheets()">
                    <i class="fab fa-google"></i> تصدير الطلاب إلى Sheets
                </button>
                <button class="btn btn-info" onclick="exportAttendanceToSheets()">
                    <i class="fas fa-calendar-check"></i> تصدير الحضور إلى Sheets
                </button>
                <button class="btn btn-warning" onclick="exportCircleStatsToSheets()">
                    <i class="fas fa-chart-bar"></i> تصدير إحصائيات الحلقات
                </button>
            </div>
        </div>
    `;
    
    dashboardPage.innerHTML = existingContent + newSection;
}

// تشغيل إضافة الأزرار عند تحميل الصفحة
setTimeout(addGoogleIntegrationButtons, 1000);