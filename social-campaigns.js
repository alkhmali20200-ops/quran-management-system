// ==================== نظام التغريدات والحملات التحفيزية ====================

// إنشاء تغريدة تحفيزية
function createMotivationalTweet() {
    const stats = generateCurrentStats();
    const achievements = getRecentAchievements();
    const tweetTemplates = getTweetTemplates();
    
    const modalContent = `
        <div class="tweet-creator-modal">
            <h3><i class="fab fa-twitter"></i> إنشاء تغريدة تحفيزية</h3>
            
            <div class="tweet-templates">
                <h4><i class="fas fa-templates"></i> قوالب جاهزة</h4>
                <div class="templates-grid">
                    ${tweetTemplates.map((template, index) => `
                        <div class="template-card" onclick="selectTweetTemplate(${index})">
                            <div class="template-preview">
                                ${template.preview}
                            </div>
                            <div class="template-title">${template.title}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="tweet-editor">
                <h4><i class="fas fa-edit"></i> محرر التغريدة</h4>
                <div class="tweet-preview">
                    <div class="tweet-content">
                        <textarea id="tweetText" maxlength="280" placeholder="اكتب تغريدتك هنا...">${generateDefaultTweet(stats, achievements)}</textarea>
                        <div class="tweet-counter">
                            <span id="charCount">0</span>/280
                        </div>
                    </div>
                </div>
                
                <div class="tweet-options">
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="includeStats" checked>
                            تضمين الإحصائيات
                        </label>
                    </div>
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="includeHashtags" checked>
                            إضافة الهاشتاجات
                        </label>
                    </div>
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="includeEmojis" checked>
                            استخدام الرموز التعبيرية
                        </label>
                    </div>
                </div>
                
                <div class="stats-insertion">
                    <h5><i class="fas fa-chart-bar"></i> إدراج إحصائيات</h5>
                    <div class="stats-buttons">
                        <button class="btn btn-sm btn-outline-primary" onclick="insertStat('totalStudents')">
                            عدد الطلاب (${stats.totalStudents})
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="insertStat('excellentStudents')">
                            الطلاب الممتازون (${stats.excellentStudents})
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="insertStat('totalMemorized')">
                            الأجزاء المحفوظة (${stats.totalMemorized})
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="insertStat('totalCircles')">
                            عدد الحلقات (${stats.totalCircles})
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="tweet-actions">
                <button class="btn btn-primary" onclick="generateTweet()">
                    <i class="fas fa-magic"></i> إنشاء تلقائي
                </button>
                <button class="btn btn-success" onclick="previewTweet()">
                    <i class="fas fa-eye"></i> معاينة
                </button>
                <button class="btn btn-info" onclick="copyTweet()">
                    <i class="fas fa-copy"></i> نسخ النص
                </button>
                <button class="btn btn-warning" onclick="shareTweet()">
                    <i class="fab fa-twitter"></i> تغريد
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent, 'large');
    
    // تحديث عداد الأحرف
    const tweetTextarea = document.getElementById('tweetText');
    const charCount = document.getElementById('charCount');
    
    function updateCharCount() {
        const count = tweetTextarea.value.length;
        charCount.textContent = count;
        charCount.style.color = count > 250 ? '#dc3545' : count > 200 ? '#ffc107' : '#28a745';
    }
    
    tweetTextarea.addEventListener('input', updateCharCount);
    updateCharCount();
}

// إنشاء الإحصائيات الحالية
function generateCurrentStats() {
    const totalStudents = systemData.students.length;
    const excellentStudents = systemData.students.filter(s => s.grade === 'excellent').length;
    const totalMemorized = systemData.students.reduce((sum, s) => sum + s.memorized, 0);
    const totalCircles = systemData.circles.length;
    const totalTeachers = systemData.teachers.length;
    
    return {
        totalStudents,
        excellentStudents,
        totalMemorized,
        totalCircles,
        totalTeachers,
        excellentPercentage: Math.round((excellentStudents / totalStudents) * 100),
        avgMemorizedPerStudent: (totalMemorized / totalStudents).toFixed(1)
    };
}

// الحصول على الإنجازات الحديثة
function getRecentAchievements() {
    // محاكاة الإنجازات الحديثة
    return [
        { type: 'memorization', text: 'طالب أكمل حفظ 5 أجزاء هذا الأسبوع' },
        { type: 'excellence', text: '3 طلاب حصلوا على تقدير ممتاز' },
        { type: 'attendance', text: 'نسبة حضور 95% في الأسبوع الماضي' },
        { type: 'new_circle', text: 'افتتاح حلقة جديدة للإناث' }
    ];
}

// قوالب التغريدات
function getTweetTemplates() {
    const stats = generateCurrentStats();
    
    return [
        {
            title: 'إحصائيات عامة',
            preview: `🕌 جمعية تحفيظ القرآن الكريم\n📊 ${stats.totalStudents} طالب وطالبة\n⭐ ${stats.excellentStudents} طالب ممتاز\n📖 ${stats.totalMemorized} جزء محفوظ`,
            template: `🕌 الحمد لله الذي وفقنا لخدمة كتابه الكريم\n\n📊 إحصائياتنا اليوم:\n• ${stats.totalStudents} طالب وطالبة\n• ${stats.excellentStudents} طالب بتقدير ممتاز\n• ${stats.totalMemorized} جزء محفوظ من القرآن الكريم\n• ${stats.totalCircles} حلقة نشطة\n\n🤲 ادعموا مسيرة التحفيظ\n#تحفيظ_القرآن #الخير #التعليم_القرآني`
        },
        {
            title: 'دعوة للدعم',
            preview: `💝 كن جزءاً من رحلة تحفيظ القرآن\n🎯 هدفنا: ${stats.totalStudents + 50} طالب\n💰 تبرعك يصنع الفرق`,
            template: `💝 كن شريكاً في الأجر\n\n🎯 نسعى لتحفيظ ${stats.totalStudents + 50} طالب وطالبة\n📈 حققنا ${Math.round((stats.totalStudents / (stats.totalStudents + 50)) * 100)}% من هدفنا\n\n💰 تبرعك البسيط يحفظ طالباً كاملاً\n🏆 ${stats.excellentStudents} طالب ممتاز بفضل دعمكم\n\n🤲 ساهم في بناء جيل قرآني\n#دعم_التحفيظ #صدقة_جارية #القرآن_الكريم`
        },
        {
            title: 'إنجازات الطلاب',
            preview: `🏆 إنجازات رائعة من طلابنا\n⭐ ${stats.excellentStudents} طالب ممتاز\n📖 متوسط ${stats.avgMemorizedPerStudent} جزء للطالب`,
            template: `🏆 فخورون بإنجازات طلابنا\n\n⭐ ${stats.excellentStudents} طالب حصلوا على تقدير ممتاز\n📖 متوسط ${stats.avgMemorizedPerStudent} جزء محفوظ للطالب الواحد\n📈 نسبة التفوق ${stats.excellentPercentage}%\n\n🌟 كل طالب نجمة في سماء القرآن\n🤲 بارك الله في الجميع\n\n#إنجازات_الطلاب #التفوق_القرآني #فخر_التحفيظ`
        },
        {
            title: 'شكر للداعمين',
            preview: `🙏 شكراً لكل من ساهم في دعمنا\n💝 ${stats.totalStudents} طالب يدعون لكم\n🌟 أثركم باقٍ في قلوبهم`,
            template: `🙏 شكراً من القلب لكل الداعمين\n\n💝 ${stats.totalStudents} طالب وطالبة يدعون لكم في كل صلاة\n🌟 ${stats.totalMemorized} جزء محفوظ بفضل دعمكم الكريم\n📿 ${stats.totalCircles} حلقات تعمل بانتظام\n\n🤲 جزاكم الله خير الجزاء\n💫 أجركم مستمر ما دام القرآن في صدورهم\n\n#شكر_الداعمين #الأجر_المستمر #بركة_الدعم`
        },
        {
            title: 'دعوة للتطوع',
            preview: `🤝 انضم لفريق التطوع\n👨‍🏫 نحتاج معلمين متطوعين\n💪 كن جزءاً من التغيير`,
            template: `🤝 انضم إلى أسرة التطوع\n\n👨‍🏫 نبحث عن معلمين متطوعين\n📚 لتعليم ${stats.totalStudents} طالب وطالبة\n🕌 في ${stats.totalCircles} حلقة منتشرة\n\n💪 مهاراتك تصنع الفرق\n🌟 ساعة واحدة أسبوعياً تكفي\n🎯 كن سبباً في حفظ طالب للقرآن\n\n#التطوع #معلم_متطوع #خدمة_القرآن`
        },
        {
            title: 'قصة نجاح',
            preview: `📖 قصة نجاح ملهمة\n🌟 طالب أكمل حفظ القرآن كاملاً\n💝 بفضل دعمكم المستمر`,
            template: `📖 قصة تملأ القلب فرحاً\n\n🌟 أحد طلابنا أكمل حفظ القرآن الكريم كاملاً\n💝 رحلة استمرت 3 سنوات بدعمكم\n🏆 من ${stats.excellentStudents} طالب ممتاز في جمعيتنا\n\n🤲 دعواتكم كانت سر النجاح\n💫 هذا ثمرة تبرعاتكم الكريمة\n📿 30 جزءاً في صدر شاب مؤمن\n\n#قصة_نجاح #حفظ_كامل #ثمرة_الدعم`
        }
    ];
}

// إنشاء تغريدة افتراضية
function generateDefaultTweet(stats, achievements) {
    const templates = getTweetTemplates();
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate.template;
}

// اختيار قالب تغريدة
function selectTweetTemplate(templateIndex) {
    const templates = getTweetTemplates();
    const template = templates[templateIndex];
    
    document.getElementById('tweetText').value = template.template;
    document.getElementById('tweetText').dispatchEvent(new Event('input'));
}

// إدراج إحصائية
function insertStat(statType) {
    const stats = generateCurrentStats();
    const textarea = document.getElementById('tweetText');
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    
    let statText = '';
    switch(statType) {
        case 'totalStudents':
            statText = `${stats.totalStudents} طالب وطالبة`;
            break;
        case 'excellentStudents':
            statText = `${stats.excellentStudents} طالب ممتاز`;
            break;
        case 'totalMemorized':
            statText = `${stats.totalMemorized} جزء محفوظ`;
            break;
        case 'totalCircles':
            statText = `${stats.totalCircles} حلقة نشطة`;
            break;
    }
    
    textarea.value = textBefore + statText + textAfter;
    textarea.focus();
    textarea.setSelectionRange(cursorPos + statText.length, cursorPos + statText.length);
    textarea.dispatchEvent(new Event('input'));
}

// إنشاء تغريدة تلقائياً
function generateTweet() {
    const stats = generateCurrentStats();
    const includeStats = document.getElementById('includeStats').checked;
    const includeHashtags = document.getElementById('includeHashtags').checked;
    const includeEmojis = document.getElementById('includeEmojis').checked;
    
    const motivationalPhrases = [
        'الحمد لله الذي وفقنا لخدمة كتابه الكريم',
        'بفضل الله ثم دعمكم نحقق إنجازات رائعة',
        'رحلة تحفيظ القرآن مستمرة بعون الله',
        'كل يوم نزداد قرباً من هدفنا',
        'طلابنا نجوم في سماء القرآن الكريم'
    ];
    
    const emojis = includeEmojis ? ['🕌', '📖', '⭐', '🤲', '💝', '🌟', '📿', '🏆'] : [];
    const hashtags = includeHashtags ? ['#تحفيظ_القرآن', '#جمعية_خيرية', '#التعليم_القرآني', '#دعم_التحفيظ'] : [];
    
    let tweet = '';
    
    // إضافة رمز تعبيري في البداية
    if (includeEmojis) {
        tweet += emojis[Math.floor(Math.random() * emojis.length)] + ' ';
    }
    
    // إضافة عبارة تحفيزية
    tweet += motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)] + '\n\n';
    
    // إضافة الإحصائيات
    if (includeStats) {
        tweet += '📊 إحصائياتنا اليوم:\n';
        tweet += `• ${stats.totalStudents} طالب وطالبة\n`;
        tweet += `• ${stats.excellentStudents} طالب بتقدير ممتاز\n`;
        tweet += `• ${stats.totalMemorized} جزء محفوظ من القرآن\n`;
        tweet += `• ${stats.totalCircles} حلقة نشطة\n\n`;
    }
    
    // إضافة دعوة للعمل
    const callToActions = [
        'ساهم في دعم مسيرة التحفيظ',
        'كن شريكاً في الأجر',
        'تبرعك يصنع الفرق',
        'انضم لرحلة تحفيظ القرآن'
    ];
    
    if (includeEmojis) {
        tweet += '🤲 ';
    }
    tweet += callToActions[Math.floor(Math.random() * callToActions.length)];
    
    // إضافة الهاشتاجات
    if (includeHashtags && hashtags.length > 0) {
        tweet += '\n\n' + hashtags.slice(0, 3).join(' ');
    }
    
    document.getElementById('tweetText').value = tweet;
    document.getElementById('tweetText').dispatchEvent(new Event('input'));
}

// معاينة التغريدة
function previewTweet() {
    const tweetText = document.getElementById('tweetText').value;
    
    const previewModal = `
        <div class="tweet-preview-modal">
            <h3><i class="fab fa-twitter"></i> معاينة التغريدة</h3>
            
            <div class="twitter-preview">
                <div class="tweet-header">
                    <div class="profile-pic">
                        <i class="fas fa-mosque"></i>
                    </div>
                    <div class="profile-info">
                        <div class="profile-name">جمعية تحفيظ القرآن الكريم</div>
                        <div class="profile-handle">@quran_society</div>
                    </div>
                </div>
                
                <div class="tweet-body">
                    ${tweetText.replace(/\n/g, '<br>')}
                </div>
                
                <div class="tweet-footer">
                    <div class="tweet-time">الآن</div>
                    <div class="tweet-actions">
                        <span><i class="far fa-comment"></i> 0</span>
                        <span><i class="fas fa-retweet"></i> 0</span>
                        <span><i class="far fa-heart"></i> 0</span>
                        <span><i class="far fa-share"></i></span>
                    </div>
                </div>
            </div>
            
            <div class="preview-actions">
                <button class="btn btn-primary" onclick="copyTweet()">
                    <i class="fas fa-copy"></i> نسخ النص
                </button>
                <button class="btn btn-success" onclick="shareTweet()">
                    <i class="fab fa-twitter"></i> تغريد الآن
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(previewModal);
}

// نسخ التغريدة
function copyTweet() {
    const tweetText = document.getElementById('tweetText').value;
    
    navigator.clipboard.writeText(tweetText).then(() => {
        showNotification('تم نسخ التغريدة إلى الحافظة', 'success');
    }).catch(() => {
        // طريقة بديلة للنسخ
        const textArea = document.createElement('textarea');
        textArea.value = tweetText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('تم نسخ التغريدة إلى الحافظة', 'success');
    });
}

// مشاركة التغريدة
function shareTweet() {
    const tweetText = document.getElementById('tweetText').value;
    const encodedText = encodeURIComponent(tweetText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// إنشاء حملة تبرعات من التقرير
function createFundraisingCampaignFromReport() {
    const stats = generateCurrentStats();
    const targetAmount = 50000; // هدف التبرع
    const currentAmount = Math.floor(Math.random() * 30000) + 10000; // المبلغ الحالي (محاكاة)
    
    const campaignContent = `
        <div class="fundraising-campaign-modal">
            <h3><i class="fas fa-heart"></i> إنشاء حملة تبرعات</h3>
            
            <div class="campaign-overview">
                <div class="campaign-stats">
                    <div class="stat-item">
                        <div class="stat-value">${currentAmount.toLocaleString()}</div>
                        <div class="stat-label">المبلغ المحصل</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${targetAmount.toLocaleString()}</div>
                        <div class="stat-label">الهدف المطلوب</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((currentAmount / targetAmount) * 100)}%</div>
                        <div class="stat-label">نسبة الإنجاز</div>
                    </div>
                </div>
                
                <div class="progress-bar-large">
                    <div class="progress-fill" style="width: ${(currentAmount / targetAmount) * 100}%"></div>
                </div>
            </div>
            
            <div class="campaign-content">
                <h4><i class="fas fa-bullhorn"></i> محتوى الحملة</h4>
                <textarea id="campaignText" rows="8">${generateCampaignText(stats, currentAmount, targetAmount)}</textarea>
            </div>
            
            <div class="donation-levels">
                <h4><i class="fas fa-layer-group"></i> مستويات التبرع</h4>
                <div class="levels-grid">
                    <div class="level-card">
                        <div class="level-amount">50 ريال</div>
                        <div class="level-benefit">دعم طالب لشهر كامل</div>
                    </div>
                    <div class="level-card">
                        <div class="level-amount">100 ريال</div>
                        <div class="level-benefit">توفير مصحف ومواد تعليمية</div>
                    </div>
                    <div class="level-card">
                        <div class="level-amount">500 ريال</div>
                        <div class="level-benefit">دعم معلم لشهر كامل</div>
                    </div>
                    <div class="level-card">
                        <div class="level-amount">1000 ريال</div>
                        <div class="level-benefit">رعاية حلقة كاملة لشهر</div>
                    </div>
                </div>
            </div>
            
            <div class="social-proof">
                <h4><i class="fas fa-users"></i> الدليل الاجتماعي</h4>
                <div class="proof-items">
                    <div class="proof-item">
                        <i class="fas fa-star"></i>
                        <span>${stats.excellentStudents} طالب حصلوا على تقدير ممتاز</span>
                    </div>
                    <div class="proof-item">
                        <i class="fas fa-chart-line"></i>
                        <span>${stats.excellentPercentage}% نسبة التفوق في الجمعية</span>
                    </div>
                    <div class="proof-item">
                        <i class="fas fa-mosque"></i>
                        <span>${stats.totalCircles} حلقات تعمل بانتظام</span>
                    </div>
                </div>
            </div>
            
            <div class="campaign-actions">
                <button class="btn btn-primary" onclick="generateCampaignPost()">
                    <i class="fas fa-magic"></i> إنشاء منشور
                </button>
                <button class="btn btn-success" onclick="shareCampaign()">
                    <i class="fas fa-share"></i> مشاركة الحملة
                </button>
                <button class="btn btn-info" onclick="copyCampaignText()">
                    <i class="fas fa-copy"></i> نسخ النص
                </button>
                <button class="btn btn-warning" onclick="createDonationLink()">
                    <i class="fas fa-link"></i> رابط التبرع
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(campaignContent, 'large');
}

// إنشاء نص الحملة
function generateCampaignText(stats, currentAmount, targetAmount) {
    return `🕌 ساهم في بناء جيل قرآني

💝 جمعية تحفيظ القرآن الكريم تحتاج دعمكم لمواصلة رسالتها النبيلة

📊 إنجازاتنا بفضل دعمكم:
• ${stats.totalStudents} طالب وطالبة يحفظون كتاب الله
• ${stats.excellentStudents} طالب حصلوا على تقدير ممتاز
• ${stats.totalMemorized} جزء محفوظ من القرآن الكريم
• ${stats.totalCircles} حلقة تعمل بانتظام

🎯 هدفنا: جمع ${targetAmount.toLocaleString()} ريال
💰 المحصل حتى الآن: ${currentAmount.toLocaleString()} ريال
📈 نسبة الإنجاز: ${Math.round((currentAmount / targetAmount) * 100)}%

🤲 كل ريال تتبرع به يساهم في:
• تعليم طالب كتاب الله
• توفير المواد التعليمية
• دعم المعلمين المتطوعين
• تطوير البرامج التعليمية

💫 تبرعك صدقة جارية يستمر أجرها ما دام القرآن في صدور الطلاب

#دعم_التحفيظ #صدقة_جارية #القرآن_الكريم #جمعية_خيرية`;
}

// إنشاء منشور للحملة
function generateCampaignPost() {
    const campaignText = document.getElementById('campaignText').value;
    
    const postFormats = [
        {
            platform: 'تويتر',
            icon: 'fab fa-twitter',
            maxLength: 280,
            format: 'tweet'
        },
        {
            platform: 'فيسبوك',
            icon: 'fab fa-facebook',
            maxLength: 2000,
            format: 'facebook'
        },
        {
            platform: 'إنستغرام',
            icon: 'fab fa-instagram',
            maxLength: 2200,
            format: 'instagram'
        },
        {
            platform: 'واتساب',
            icon: 'fab fa-whatsapp',
            maxLength: 4000,
            format: 'whatsapp'
        }
    ];
    
    const formatModal = `
        <div class="post-format-modal">
            <h3><i class="fas fa-share-alt"></i> اختر منصة المشاركة</h3>
            
            <div class="platforms-grid">
                ${postFormats.map(platform => `
                    <div class="platform-card" onclick="formatCampaignPost('${platform.format}')">
                        <div class="platform-icon">
                            <i class="${platform.icon}"></i>
                        </div>
                        <div class="platform-name">${platform.platform}</div>
                        <div class="platform-limit">حد أقصى: ${platform.maxLength} حرف</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(formatModal);
}

// تنسيق منشور الحملة حسب المنصة
function formatCampaignPost(platform) {
    const campaignText = document.getElementById('campaignText').value;
    let formattedText = '';
    
    switch(platform) {
        case 'tweet':
            // تقصير النص لتويتر
            formattedText = campaignText.substring(0, 250) + '...\n\n#دعم_التحفيظ #صدقة_جارية';
            break;
        case 'facebook':
            // إضافة دعوة للعمل لفيسبوك
            formattedText = campaignText + '\n\n👈 اضغط على الرابط للتبرع الآن\n💬 شارك المنشور لتصل الرسالة لأكبر عدد';
            break;
        case 'instagram':
            // إضافة هاشتاجات أكثر لإنستغرام
            formattedText = campaignText + '\n\n#تحفيظ_القرآن #جمعية_خيرية #دعم_التعليم #القرآن_الكريم #صدقة_جارية #الخير #التطوع #المملكة_العربية_السعودية';
            break;
        case 'whatsapp':
            // تنسيق مناسب لواتساب
            formattedText = `*🕌 ساهم في بناء جيل قرآني*\n\n` + campaignText + '\n\n_شارك الرسالة مع أصدقائك وعائلتك_';
            break;
    }
    
    const formattedModal = `
        <div class="formatted-post-modal">
            <h3><i class="fas fa-edit"></i> المنشور المنسق - ${platform}</h3>
            
            <div class="formatted-content">
                <textarea id="formattedText" rows="15">${formattedText}</textarea>
                <div class="char-count">عدد الأحرف: ${formattedText.length}</div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="copyFormattedText()">
                    <i class="fas fa-copy"></i> نسخ النص
                </button>
                <button class="btn btn-success" onclick="shareFormattedPost('${platform}')">
                    <i class="fas fa-share"></i> مشاركة
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(formattedModal);
}

// نسخ النص المنسق
function copyFormattedText() {
    const formattedText = document.getElementById('formattedText').value;
    
    navigator.clipboard.writeText(formattedText).then(() => {
        showNotification('تم نسخ المنشور إلى الحافظة', 'success');
    });
}

// مشاركة المنشور المنسق
function shareFormattedPost(platform) {
    const formattedText = document.getElementById('formattedText').value;
    const encodedText = encodeURIComponent(formattedText);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'tweet':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedText}`;
            break;
        default:
            copyFormattedText();
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// إضافة أزرار التغريدات في لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    // إضافة قسم التغريدات في لوحة التحكم للإدارة
    if (currentUser && currentUser.type === 'admin') {
        const dashboardContent = document.getElementById('dashboardPage');
        if (dashboardContent) {
            const socialSection = document.createElement('div');
            socialSection.className = 'social-campaigns-section';
            socialSection.innerHTML = `
                <div class="section-header">
                    <h3><i class="fas fa-bullhorn"></i> الحملات والتسويق</h3>
                </div>
                <div class="social-buttons">
                    <button class="btn btn-primary" onclick="createMotivationalTweet()">
                        <i class="fab fa-twitter"></i> إنشاء تغريدة
                    </button>
                    <button class="btn btn-success" onclick="createFundraisingCampaignFromReport()">
                        <i class="fas fa-heart"></i> حملة تبرعات
                    </button>
                    <button class="btn btn-info" onclick="generateSocialMediaPack()">
                        <i class="fas fa-images"></i> حزمة وسائل التواصل
                    </button>
                </div>
            `;
            
            // إدراج القسم في المكان المناسب
            const existingContent = dashboardContent.querySelector('.admin-section');
            if (existingContent) {
                existingContent.parentNode.insertBefore(socialSection, existingContent.nextSibling);
            }
        }
    }
});

// إنشاء حزمة وسائل التواصل الاجتماعي
function generateSocialMediaPack() {
    const stats = generateCurrentStats();
    
    const packContent = `
        <div class="social-media-pack-modal">
            <h3><i class="fas fa-images"></i> حزمة وسائل التواصل الاجتماعي</h3>
            
            <div class="pack-overview">
                <p>حزمة شاملة من المحتوى الجاهز للنشر على جميع منصات التواصل الاجتماعي</p>
            </div>
            
            <div class="content-types">
                <div class="content-type-card" onclick="generateContentType('posts')">
                    <div class="content-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="content-title">منشورات نصية</div>
                    <div class="content-desc">5 منشورات جاهزة للنشر</div>
                </div>
                
                <div class="content-type-card" onclick="generateContentType('stories')">
                    <div class="content-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <div class="content-title">قصص مصورة</div>
                    <div class="content-desc">نصوص للقصص والحالات</div>
                </div>
                
                <div class="content-type-card" onclick="generateContentType('hashtags')">
                    <div class="content-icon">
                        <i class="fas fa-hashtag"></i>
                    </div>
                    <div class="content-title">مجموعة هاشتاجات</div>
                    <div class="content-desc">هاشتاجات محسنة للوصول</div>
                </div>
                
                <div class="content-type-card" onclick="generateContentType('quotes')">
                    <div class="content-icon">
                        <i class="fas fa-quote-right"></i>
                    </div>
                    <div class="content-title">اقتباسات تحفيزية</div>
                    <div class="content-desc">اقتباسات قرآنية ونبوية</div>
                </div>
            </div>
            
            <div class="pack-actions">
                <button class="btn btn-primary" onclick="downloadFullPack()">
                    <i class="fas fa-download"></i> تحميل الحزمة كاملة
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(packContent, 'large');
}

// إنشاء نوع محتوى محدد
function generateContentType(type) {
    const stats = generateCurrentStats();
    let content = '';
    
    switch(type) {
        case 'posts':
            content = generateTextPosts(stats);
            break;
        case 'stories':
            content = generateStoryTexts(stats);
            break;
        case 'hashtags':
            content = generateHashtagSets();
            break;
        case 'quotes':
            content = generateMotivationalQuotes();
            break;
    }
    
    const contentModal = `
        <div class="content-type-modal">
            <h3><i class="fas fa-file-alt"></i> ${getContentTypeTitle(type)}</h3>
            
            <div class="content-list">
                ${content}
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="copyAllContent()">
                    <i class="fas fa-copy"></i> نسخ الكل
                </button>
                <button class="btn btn-success" onclick="downloadContent('${type}')">
                    <i class="fas fa-download"></i> تحميل
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal(contentModal, 'large');
}

// الحصول على عنوان نوع المحتوى
function getContentTypeTitle(type) {
    const titles = {
        posts: 'المنشورات النصية',
        stories: 'نصوص القصص',
        hashtags: 'مجموعات الهاشتاجات',
        quotes: 'الاقتباسات التحفيزية'
    };
    return titles[type] || 'المحتوى';
}

// إنشاء منشورات نصية
function generateTextPosts(stats) {
    const posts = [
        `🕌 الحمد لله الذي وفقنا لخدمة كتابه الكريم\n\n📊 ${stats.totalStudents} طالب وطالبة يحفظون القرآن في جمعيتنا\n⭐ ${stats.excellentStudents} منهم حصلوا على تقدير ممتاز\n\n🤲 ادعموا مسيرة التحفيظ\n#تحفيظ_القرآن #جمعية_خيرية`,
        
        `💝 كن شريكاً في الأجر\n\n🎯 هدفنا: تحفيظ ${stats.totalStudents + 100} طالب وطالبة\n📈 حققنا ${Math.round((stats.totalStudents / (stats.totalStudents + 100)) * 100)}% من هدفنا\n\n💰 تبرعك البسيط يحفظ طالباً كاملاً\n🤲 ساهم في بناء جيل قرآني`,
        
        `🏆 فخورون بإنجازات طلابنا\n\n⭐ ${stats.excellentStudents} طالب بتقدير ممتاز\n📖 ${stats.totalMemorized} جزء محفوظ من القرآن\n📈 نسبة التفوق ${stats.excellentPercentage}%\n\n🌟 كل طالب نجمة في سماء القرآن`,
        
        `🙏 شكراً لكل من ساهم في دعمنا\n\n💝 ${stats.totalStudents} طالب يدعون لكم في كل صلاة\n🌟 ${stats.totalMemorized} جزء محفوظ بفضل دعمكم\n📿 ${stats.totalCircles} حلقات تعمل بانتظام\n\n🤲 جزاكم الله خير الجزاء`,
        
        `📖 قصة نجاح ملهمة\n\n🌟 أحد طلابنا أكمل حفظ القرآن كاملاً\n💝 رحلة استمرت 3 سنوات بدعمكم\n🏆 من ${stats.excellentStudents} طالب ممتاز في جمعيتنا\n\n🤲 هذا ثمرة تبرعاتكم الكريمة`
    ];
    
    return posts.map((post, index) => `
        <div class="content-item">
            <div class="content-header">
                <h4>منشور ${index + 1}</h4>
                <button class="btn btn-sm btn-outline-primary" onclick="copyContent(this)">
                    <i class="fas fa-copy"></i> نسخ
                </button>
            </div>
            <div class="content-text">${post.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

// إنشاء نصوص القصص
function generateStoryTexts(stats) {
    const stories = [
        `📱 قصة اليوم\n\n"بدأت رحلتي مع القرآن في سن الثامنة"\n\n🌟 هكذا بدأ أحد طلابنا حديثه\n📖 اليوم أكمل حفظ 15 جزءاً\n🏆 وحصل على تقدير ممتاز\n\n💝 كن سبباً في قصة نجاح جديدة`,
        
        `🎯 هدف الأسبوع\n\n📊 ${stats.totalCircles} حلقات\n👥 ${stats.totalStudents} طالب\n⭐ ${stats.excellentStudents} ممتاز\n\n🚀 نسعى للوصول إلى ${stats.totalStudents + 50} طالب\n🤲 ساعدنا في تحقيق الهدف`,
        
        `💡 نصيحة المعلم\n\n"الثبات على الحفظ أهم من السرعة"\n\n📚 نصيحة من معلمينا المتميزين\n🌟 ${stats.totalTeachers} معلم متطوع\n📖 يعلمون ${stats.totalStudents} طالب\n\n👨‍🏫 انضم لفريق التطوع`,
        
        `🏅 إنجاز الشهر\n\n🎉 ${stats.excellentStudents} طالب حصلوا على ممتاز\n📈 زيادة ${Math.floor(Math.random() * 20) + 10}% عن الشهر الماضي\n🏆 أعلى نسبة تفوق في تاريخ الجمعية\n\n💝 بفضل دعمكم المستمر`
    ];
    
    return stories.map((story, index) => `
        <div class="content-item">
            <div class="content-header">
                <h4>قصة ${index + 1}</h4>
                <button class="btn btn-sm btn-outline-primary" onclick="copyContent(this)">
                    <i class="fas fa-copy"></i> نسخ
                </button>
            </div>
            <div class="content-text">${story.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

// إنشاء مجموعات الهاشتاجات
function generateHashtagSets() {
    const hashtagSets = [
        {
            title: 'هاشتاجات عامة',
            tags: '#تحفيظ_القرآن #جمعية_خيرية #القرآن_الكريم #التعليم_القرآني #دعم_التحفيظ #صدقة_جارية #الخير #التطوع'
        },
        {
            title: 'هاشتاجات الإنجازات',
            tags: '#إنجازات_الطلاب #التفوق_القرآني #فخر_التحفيظ #نجاح_الطلاب #ممتاز #حفظ_القرآن #تميز_الطلاب'
        },
        {
            title: 'هاشتاجات التبرع',
            tags: '#دعم_التحفيظ #تبرع_للخير #صدقة_جارية #ساهم_معنا #الأجر_المستمر #بناء_جيل_قرآني #استثمار_الآخرة'
        },
        {
            title: 'هاشتاجات التطوع',
            tags: '#التطوع #معلم_متطوع #خدمة_القرآن #انضم_لنا #تطوع_معنا #خدمة_المجتمع #العطاء'
        },
        {
            title: 'هاشتاجات محلية',
            tags: '#المملكة_العربية_السعودية #الرياض #جدة #الدمام #مكة_المكرمة #المدينة_المنورة #السعودية #الخليج'
        }
    ];
    
    return hashtagSets.map(set => `
        <div class="content-item">
            <div class="content-header">
                <h4>${set.title}</h4>
                <button class="btn btn-sm btn-outline-primary" onclick="copyContent(this)">
                    <i class="fas fa-copy"></i> نسخ
                </button>
            </div>
            <div class="content-text">${set.tags}</div>
        </div>
    `).join('');
}

// إنشاء اقتباسات تحفيزية
function generateMotivationalQuotes() {
    const quotes = [
        `"وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ"\n\n🌟 القرآن ميسر للحفظ والفهم\n📖 كل طالب قادر على الحفظ\n💝 نحن هنا لنساعدهم في الرحلة`,
        
        `"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"\n\n👨‍🏫 حديث شريف يحفزنا\n📚 التعليم والتعلم شرف عظيم\n🤲 كن جزءاً من هذا الخير`,
        
        `"مَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللَّهِ يَتْلُونَ كِتَابَ اللَّهِ"\n\n🕌 بركة الاجتماع على القرآن\n👥 ${systemData.students.length} طالب يتلون كتاب الله\n✨ السكينة تنزل عليهم`,
        
        `"إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ"\n\n📖 فضل تلاوة القرآن عظيم\n🌟 كل حرف بحسنة والحسنة بعشر أمثالها\n💎 استثمار في الآخرة لا يضيع`,
        
        `"وَقُل رَّبِّ زِدْنِي عِلْمًا"\n\n📚 دعاء طلب العلم\n🎯 هدفنا زيادة العلم والحفظ\n🚀 كل يوم خطوة نحو الهدف`
    ];
    
    return quotes.map((quote, index) => `
        <div class="content-item">
            <div class="content-header">
                <h4>اقتباس ${index + 1}</h4>
                <button class="btn btn-sm btn-outline-primary" onclick="copyContent(this)">
                    <i class="fas fa-copy"></i> نسخ
                </button>
            </div>
            <div class="content-text">${quote.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

// نسخ محتوى محدد
function copyContent(button) {
    const contentText = button.closest('.content-item').querySelector('.content-text').textContent;
    
    navigator.clipboard.writeText(contentText).then(() => {
        showNotification('تم نسخ المحتوى', 'success');
        button.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> نسخ';
        }, 2000);
    });
}