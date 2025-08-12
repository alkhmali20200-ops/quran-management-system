// ==================== لوحة تحكم الذكاء الاصطناعي ====================

// عرض لوحة تحكم الذكاء الاصطناعي
function showAIDashboard() {
    const content = `
        <div class="ai-dashboard-page">
            <div class="page-header">
                <h2><i class="fas fa-robot"></i> لوحة تحكم الذكاء الاصطناعي</h2>
                <div class="ai-status">
                    <span class="status-indicator active"></span>
                    <span>الذكاء الاصطناعي متاح</span>
                </div>
            </div>

            <!-- الميزات الرئيسية -->
            <div class="ai-features-grid">
                <div class="ai-feature-card" onclick="generateAIReport()">
                    <div class="feature-icon">
                        <i class="fas fa-file-chart-line"></i>
                    </div>
                    <div class="feature-content">
                        <h3>تقرير ذكي شامل</h3>
                        <p>إنشاء تقرير تحليلي شامل عن أداء الجمعية والطلاب</p>
                    </div>
                    <div class="feature-action">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>

                <div class="ai-feature-card" onclick="generateMarketingContent()">
                    <div class="feature-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    <div class="feature-content">
                        <h3>محتوى تسويقي ذكي</h3>
                        <p>إنشاء محتوى تسويقي احترافي للجمعية</p>
                    </div>
                    <div class="feature-action">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>

                <div class="ai-feature-card" onclick="generateSmartTweets()">
                    <div class="feature-icon">
                        <i class="fab fa-twitter"></i>
                    </div>
                    <div class="feature-content">
                        <h3>تغريدات ذكية</h3>
                        <p>إنشاء تغريدات تحفيزية بالذكاء الاصطناعي</p>
                    </div>
                    <div class="feature-action">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>

                <div class="ai-feature-card" onclick="generateStudentAnalysis()">
                    <div class="feature-icon">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="feature-content">
                        <h3>تحليل الطلاب الذكي</h3>
                        <p>تحليل أداء الطلاب وتقديم توصيات</p>
                    </div>
                    <div class="feature-action">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>

                <div class="ai-feature-card" onclick="generateCircleRecommendations()">
                    <div class="feature-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="feature-content">
                        <h3>توصيات الحلقات</h3>
                        <p>توصيات ذكية لتحسين أداء الحلقات</p>
                    </div>
                    <div class="feature-action">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>

                <div class="ai-feature-card" onclick="generateFundraisingStrategy()">
                    <div class="feature-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="feature-content">
                        <h3>استراتيجية التبرعات</h3>
                        <p>خطة ذكية لجمع التبرعات والدعم</p>
                    </div>
                    <div class="feature-action">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>
            </div>

            <!-- الإحصائيات السريعة -->
            <div class="ai-quick-stats">
                <h3><i class="fas fa-chart-bar"></i> إحصائيات سريعة</h3>
                <div class="quick-stats-grid">
                    <div class="quick-stat">
                        <div class="stat-number">${systemData.students.length}</div>
                        <div class="stat-label">إجمالي الطلاب</div>
                    </div>
                    <div class="quick-stat">
                        <div class="stat-number">${systemData.students.filter(s => s.grade === 'excellent').length}</div>
                        <div class="stat-label">طلاب ممتازون</div>
                    </div>
                    <div class="quick-stat">
                        <div class="stat-number">${systemData.circles.length}</div>
                        <div class="stat-label">الحلقات النشطة</div>
                    </div>
                    <div class="quick-stat">
                        <div class="stat-number">${systemData.students.reduce((sum, s) => sum + s.memorized, 0)}</div>
                        <div class="stat-label">أجزاء محفوظة</div>
                    </div>
                </div>
            </div>

            <!-- التحليلات الذكية -->
            <div class="ai-insights">
                <h3><i class="fas fa-brain"></i> تحليلات ذكية</h3>
                <div class="insights-container" id="aiInsights">
                    <div class="loading-insights">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>جاري تحليل البيانات...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // إضافة المحتوى إلى الصفحة
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = content;
        
        // تحميل التحليلات الذكية
        setTimeout(loadAIInsights, 1000);
    }
}

// تحميل التحليلات الذكية
function loadAIInsights() {
    const insights = generateAIInsights();
    const container = document.getElementById('aiInsights');
    
    if (container) {
        container.innerHTML = `
            <div class="insights-grid">
                ${insights.map(insight => `
                    <div class="insight-card ${insight.type}">
                        <div class="insight-icon">
                            <i class="${insight.icon}"></i>
                        </div>
                        <div class="insight-content">
                            <h4>${insight.title}</h4>
                            <p>${insight.description}</p>
                            <div class="insight-value">${insight.value}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// إنشاء التحليلات الذكية
function generateAIInsights() {
    const totalStudents = systemData.students.length;
    const excellentStudents = systemData.students.filter(s => s.grade === 'excellent').length;
    const excellentPercentage = Math.round((excellentStudents / totalStudents) * 100);
    const avgMemorized = (systemData.students.reduce((sum, s) => sum + s.memorized, 0) / totalStudents).toFixed(1);
    
    return [
        {
            type: 'success',
            icon: 'fas fa-trophy',
            title: 'معدل التفوق',
            description: 'نسبة الطلاب الممتازين في الجمعية',
            value: `${excellentPercentage}%`
        },
        {
            type: 'info',
            icon: 'fas fa-book-open',
            title: 'متوسط الحفظ',
            description: 'متوسط الأجزاء المحفوظة لكل طالب',
            value: `${avgMemorized} جزء`
        },
        {
            type: 'warning',
            icon: 'fas fa-users',
            title: 'كثافة الحلقات',
            description: 'متوسط عدد الطلاب في الحلقة الواحدة',
            value: `${Math.round(totalStudents / systemData.circles.length)} طالب`
        },
        {
            type: 'primary',
            icon: 'fas fa-chart-line',
            title: 'نمو الجمعية',
            description: 'معدل نمو عدد الطلاب المتوقع',
            value: '+15% شهرياً'
        }
    ];
}

// إنشاء تقرير ذكي شامل
function generateAIReport() {
    const stats = {
        totalStudents: systemData.students.length,
        excellentStudents: systemData.students.filter(s => s.grade === 'excellent').length,
        totalCircles: systemData.circles.length,
        totalMemorized: systemData.students.reduce((sum, s) => sum + s.memorized, 0),
        avgMemorized: (systemData.students.reduce((sum, s) => sum + s.memorized, 0) / systemData.students.length).toFixed(1)
    };

    const reportContent = `
        <div class="ai-report-modal">
            <div class="report-header">
                <h3><i class="fas fa-robot"></i> التقرير الذكي الشامل</h3>
                <div class="report-date">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</div>
            </div>

            <div class="ai-analysis-section">
                <h4><i class="fas fa-brain"></i> التحليل الذكي</h4>
                <div class="analysis-content">
                    <div class="analysis-item">
                        <div class="analysis-icon success">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="analysis-text">
                            <strong>أداء ممتاز:</strong> تحقق الجمعية نسبة تفوق ${Math.round((stats.excellentStudents / stats.totalStudents) * 100)}% 
                            وهي نسبة ممتازة تفوق المعدل المطلوب (25%).
                        </div>
                    </div>

                    <div class="analysis-item">
                        <div class="analysis-icon info">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="analysis-text">
                            <strong>معدل الحفظ:</strong> متوسط ${stats.avgMemorized} جزء لكل طالب يعتبر معدلاً جيداً، 
                            مع إمكانية تحسينه من خلال برامج تحفيزية إضافية.
                        </div>
                    </div>

                    <div class="analysis-item">
                        <div class="analysis-icon warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="analysis-text">
                            <strong>توزيع الطلاب:</strong> متوسط ${Math.round(stats.totalStudents / stats.totalCircles)} طالب لكل حلقة. 
                            يُنصح بعدم تجاوز 12 طالب لضمان جودة التعليم.
                        </div>
                    </div>
                </div>
            </div>

            <div class="recommendations-section">
                <h4><i class="fas fa-lightbulb"></i> التوصيات الذكية</h4>
                <div class="recommendations-list">
                    ${generateSmartRecommendations(stats).map(rec => `
                        <div class="recommendation-item ${rec.priority}">
                            <div class="rec-priority">${rec.priority === 'high' ? 'عالية' : rec.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</div>
                            <div class="rec-content">
                                <h5>${rec.title}</h5>
                                <p>${rec.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="performance-metrics">
                <h4><i class="fas fa-chart-bar"></i> مؤشرات الأداء</h4>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${stats.totalStudents}</div>
                        <div class="metric-label">إجمالي الطلاب</div>
                        <div class="metric-trend positive">+12% من الشهر الماضي</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${stats.excellentStudents}</div>
                        <div class="metric-label">طلاب ممتازون</div>
                        <div class="metric-trend positive">+8% من الشهر الماضي</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${stats.totalMemorized}</div>
                        <div class="metric-label">أجزاء محفوظة</div>
                        <div class="metric-trend positive">+25% من الشهر الماضي</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${stats.totalCircles}</div>
                        <div class="metric-label">حلقات نشطة</div>
                        <div class="metric-trend stable">مستقر</div>
                    </div>
                </div>
            </div>

            <div class="future-predictions">
                <h4><i class="fas fa-crystal-ball"></i> التوقعات المستقبلية</h4>
                <div class="predictions-content">
                    <div class="prediction-item">
                        <div class="prediction-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="prediction-text">
                            <strong>نمو متوقع:</strong> بناءً على الاتجاه الحالي، متوقع وصول عدد الطلاب إلى 
                            ${Math.round(stats.totalStudents * 1.3)} طالب خلال 6 أشهر.
                        </div>
                    </div>
                    <div class="prediction-item">
                        <div class="prediction-icon">
                            <i class="fas fa-target"></i>
                        </div>
                        <div class="prediction-text">
                            <strong>هدف الحفظ:</strong> مع البرامج التحفيزية المقترحة، يمكن زيادة متوسط الحفظ إلى 
                            ${(parseFloat(stats.avgMemorized) + 2).toFixed(1)} جزء لكل طالب.
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn btn-primary" onclick="exportAIReport()">
                    <i class="fas fa-download"></i> تصدير التقرير
                </button>
                <button class="btn btn-success" onclick="shareAIReport()">
                    <i class="fas fa-share"></i> مشاركة التقرير
                </button>
                <button class="btn btn-info" onclick="printAIReport()">
                    <i class="fas fa-print"></i> طباعة
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;

    showModal(reportContent, 'large');
}

// إنشاء التوصيات الذكية
function generateSmartRecommendations(stats) {
    const recommendations = [];
    
    // تحليل نسبة التفوق
    const excellentPercentage = (stats.excellentStudents / stats.totalStudents) * 100;
    if (excellentPercentage < 30) {
        recommendations.push({
            priority: 'high',
            title: 'تحسين برامج التحفيز',
            description: 'نسبة الطلاب الممتازين أقل من المطلوب. يُنصح بإضافة برامج تحفيزية ومسابقات.'
        });
    }
    
    // تحليل كثافة الحلقات
    const avgStudentsPerCircle = stats.totalStudents / stats.totalCircles;
    if (avgStudentsPerCircle > 12) {
        recommendations.push({
            priority: 'high',
            title: 'إضافة حلقات جديدة',
            description: `متوسط ${Math.round(avgStudentsPerCircle)} طالب لكل حلقة. يُنصح بإضافة حلقات لضمان جودة التعليم.`
        });
    }
    
    // تحليل معدل الحفظ
    if (parseFloat(stats.avgMemorized) < 5) {
        recommendations.push({
            priority: 'medium',
            title: 'تطوير منهج الحفظ',
            description: 'متوسط الحفظ يمكن تحسينه من خلال تطوير المناهج وطرق التدريس.'
        });
    }
    
    // توصيات عامة
    recommendations.push({
        priority: 'medium',
        title: 'برنامج تدريب المعلمين',
        description: 'تنظيم دورات تدريبية للمعلمين لتحسين طرق التدريس والتحفيز.'
    });
    
    recommendations.push({
        priority: 'low',
        title: 'نظام مكافآت الطلاب',
        description: 'إنشاء نظام نقاط ومكافآت لتحفيز الطلاب على الحفظ والمراجعة.'
    });
    
    return recommendations;
}

// إنشاء محتوى تسويقي ذكي
function generateMarketingContent() {
    const stats = {
        totalStudents: systemData.students.length,
        excellentStudents: systemData.students.filter(s => s.grade === 'excellent').length,
        totalCircles: systemData.circles.length,
        totalMemorized: systemData.students.reduce((sum, s) => sum + s.memorized, 0)
    };

    const marketingContent = `
        <div class="marketing-content-modal">
            <h3><i class="fas fa-bullhorn"></i> محتوى تسويقي ذكي</h3>
            
            <div class="content-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" onclick="switchMarketingTab('social')">وسائل التواصل</button>
                    <button class="tab-btn" onclick="switchMarketingTab('brochure')">بروشور</button>
                    <button class="tab-btn" onclick="switchMarketingTab('presentation')">عرض تقديمي</button>
                    <button class="tab-btn" onclick="switchMarketingTab('newsletter')">نشرة إخبارية</button>
                </div>
                
                <div class="tab-content">
                    <div id="social-tab" class="tab-pane active">
                        <h4><i class="fab fa-facebook"></i> محتوى وسائل التواصل</h4>
                        <div class="social-content">
                            ${generateSocialMediaContent(stats)}
                        </div>
                    </div>
                    
                    <div id="brochure-tab" class="tab-pane">
                        <h4><i class="fas fa-file-alt"></i> محتوى البروشور</h4>
                        <div class="brochure-content">
                            ${generateBrochureContent(stats)}
                        </div>
                    </div>
                    
                    <div id="presentation-tab" class="tab-pane">
                        <h4><i class="fas fa-presentation"></i> محتوى العرض التقديمي</h4>
                        <div class="presentation-content">
                            ${generatePresentationContent(stats)}
                        </div>
                    </div>
                    
                    <div id="newsletter-tab" class="tab-pane">
                        <h4><i class="fas fa-newspaper"></i> محتوى النشرة الإخبارية</h4>
                        <div class="newsletter-content">
                            ${generateNewsletterContent(stats)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="copyMarketingContent()">
                    <i class="fas fa-copy"></i> نسخ المحتوى
                </button>
                <button class="btn btn-success" onclick="downloadMarketingPack()">
                    <i class="fas fa-download"></i> تحميل الحزمة
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;

    showModal(marketingContent, 'large');
}

// إنشاء تغريدات ذكية
function generateSmartTweets() {
    const stats = {
        totalStudents: systemData.students.length,
        excellentStudents: systemData.students.filter(s => s.grade === 'excellent').length,
        totalCircles: systemData.circles.length,
        totalMemorized: systemData.students.reduce((sum, s) => sum + s.memorized, 0)
    };

    const tweetsContent = `
        <div class="smart-tweets-modal">
            <h3><i class="fab fa-twitter"></i> تغريدات ذكية بالذكاء الاصطناعي</h3>
            
            <div class="tweet-generator">
                <div class="generator-options">
                    <div class="option-group">
                        <label>نوع التغريدة:</label>
                        <select id="tweetType" onchange="generateAITweets()">
                            <option value="achievement">إنجازات</option>
                            <option value="motivation">تحفيزية</option>
                            <option value="fundraising">جمع تبرعات</option>
                            <option value="volunteer">دعوة للتطوع</option>
                            <option value="gratitude">شكر وامتنان</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>النبرة:</label>
                        <select id="tweetTone" onchange="generateAITweets()">
                            <option value="formal">رسمية</option>
                            <option value="friendly">ودية</option>
                            <option value="inspiring">ملهمة</option>
                            <option value="urgent">عاجلة</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="includeEmojis" checked onchange="generateAITweets()">
                            تضمين الرموز التعبيرية
                        </label>
                    </div>
                    
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="includeHashtags" checked onchange="generateAITweets()">
                            إضافة الهاشتاجات
                        </label>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="generateAITweets()">
                    <i class="fas fa-magic"></i> إنشاء تغريدات ذكية
                </button>
            </div>
            
            <div class="generated-tweets" id="generatedTweets">
                <div class="loading">
                    <i class="fas fa-robot fa-spin"></i>
                    <p>الذكاء الاصطناعي يعمل على إنشاء تغريدات مخصصة...</p>
                </div>
            </div>
        </div>
    `;

    showModal(tweetsContent, 'large');
    
    // إنشاء التغريدات الأولية
    setTimeout(generateAITweets, 1000);
}

// إنشاء التغريدات بالذكاء الاصطناعي
function generateAITweets() {
    const tweetType = document.getElementById('tweetType')?.value || 'achievement';
    const tweetTone = document.getElementById('tweetTone')?.value || 'formal';
    const includeEmojis = document.getElementById('includeEmojis')?.checked ?? true;
    const includeHashtags = document.getElementById('includeHashtags')?.checked ?? true;
    
    const stats = {
        totalStudents: systemData.students.length,
        excellentStudents: systemData.students.filter(s => s.grade === 'excellent').length,
        totalCircles: systemData.circles.length,
        totalMemorized: systemData.students.reduce((sum, s) => sum + s.memorized, 0)
    };

    const tweets = generateTweetsByType(tweetType, tweetTone, includeEmojis, includeHashtags, stats);
    
    const container = document.getElementById('generatedTweets');
    if (container) {
        container.innerHTML = `
            <div class="tweets-list">
                ${tweets.map((tweet, index) => `
                    <div class="tweet-card">
                        <div class="tweet-header">
                            <h4>تغريدة ${index + 1}</h4>
                            <div class="tweet-actions">
                                <button class="btn btn-sm btn-outline-primary" onclick="copyTweet('${tweet.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-copy"></i> نسخ
                                </button>
                                <button class="btn btn-sm btn-outline-success" onclick="shareToTwitter('${encodeURIComponent(tweet)}')">
                                    <i class="fab fa-twitter"></i> تغريد
                                </button>
                            </div>
                        </div>
                        <div class="tweet-content">
                            ${tweet.replace(/\n/g, '<br>')}
                        </div>
                        <div class="tweet-stats">
                            <span class="char-count">${tweet.length}/280 حرف</span>
                            <span class="tweet-quality ${getTweetQuality(tweet)}">
                                ${getTweetQualityText(getTweetQuality(tweet))}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// إنشاء التغريدات حسب النوع
function generateTweetsByType(type, tone, emojis, hashtags, stats) {
    const tweets = [];
    const emojiPrefix = emojis ? getEmojiForType(type) : '';
    const hashtagSuffix = hashtags ? getHashtagsForType(type) : '';
    
    switch (type) {
        case 'achievement':
            tweets.push(
                `${emojiPrefix} الحمد لله على هذه الإنجازات الرائعة!\n\n📊 ${stats.totalStudents} طالب وطالبة\n⭐ ${stats.excellentStudents} طالب ممتاز\n📖 ${stats.totalMemorized} جزء محفوظ\n\n${getTonePhrase(tone, 'achievement')} ${hashtagSuffix}`,
                
                `${emojiPrefix} فخورون بطلابنا المتميزين!\n\n🏆 ${stats.excellentStudents} طالب حققوا التفوق\n📈 نسبة النجاح ${Math.round((stats.excellentStudents/stats.totalStudents)*100)}%\n🕌 ${stats.totalCircles} حلقات نشطة\n\n${getTonePhrase(tone, 'achievement')} ${hashtagSuffix}`,
                
                `${emojiPrefix} إنجاز جديد في مسيرة التحفيظ!\n\n📚 ${stats.totalMemorized} جزء من القرآن الكريم محفوظ في صدور طلابنا\n🌟 متوسط ${(stats.totalMemorized/stats.totalStudents).toFixed(1)} جزء لكل طالب\n\n${getTonePhrase(tone, 'achievement')} ${hashtagSuffix}`
            );
            break;
            
        case 'motivation':
            tweets.push(
                `${emojiPrefix} "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ"\n\n🌟 كل طالب قادر على الحفظ\n💪 ${stats.totalStudents} طالب يثبتون ذلك يومياً\n📖 انضم لرحلة الحفظ المباركة\n\n${getTonePhrase(tone, 'motivation')} ${hashtagSuffix}`,
                
                `${emojiPrefix} رحلة الألف ميل تبدأ بخطوة واحدة\n\n✨ ${stats.excellentStudents} طالب بدأوا وحققوا التميز\n🎯 هدفنا: ${stats.totalStudents + 100} طالب بحلول العام القادم\n\n${getTonePhrase(tone, 'motivation')} ${hashtagSuffix}`,
                
                `${emojiPrefix} كل حرف تحفظه نور في قلبك\n\n💎 ${stats.totalMemorized} جزء محفوظ = ملايين الحسنات\n🤲 كن جزءاً من هذا الخير العظيم\n\n${getTonePhrase(tone, 'motivation')} ${hashtagSuffix}`
            );
            break;
            
        case 'fundraising':
            tweets.push(
                `${emojiPrefix} ساهم في بناء جيل قرآني\n\n💝 ${stats.totalStudents} طالب يحتاجون دعمكم\n🎯 هدفنا: 50,000 ريال\n💰 كل ريال يساهم في تعليم طالب\n\n${getTonePhrase(tone, 'fundraising')} ${hashtagSuffix}`,
                
                `${emojiPrefix} استثمر في الآخرة\n\n📈 ${stats.excellentStudents} طالب ممتاز بفضل دعمكم\n🌟 تبرعك صدقة جارية\n💫 أجرك مستمر ما دام القرآن في صدورهم\n\n${getTonePhrase(tone, 'fundraising')} ${hashtagSuffix}`,
                
                `${emojiPrefix} كن شريكاً في الأجر\n\n🏆 ${stats.totalCircles} حلقات تعمل بدعمكم\n📚 ${stats.totalMemorized} جزء محفوظ بفضلكم\n💝 مساهمتك تصنع الفرق\n\n${getTonePhrase(tone, 'fundraising')} ${hashtagSuffix}`
            );
            break;
            
        case 'volunteer':
            tweets.push(
                `${emojiPrefix} انضم لفريق التطوع\n\n👨‍🏫 نحتاج معلمين متطوعين\n📚 لتعليم ${stats.totalStudents} طالب وطالبة\n⏰ ساعة واحدة أسبوعياً تكفي\n\n${getTonePhrase(tone, 'volunteer')} ${hashtagSuffix}`,
                
                `${emojiPrefix} كن سبباً في حفظ طالب للقرآن\n\n🌟 ${stats.totalCircles} حلقات تحتاج معلمين\n💪 مهاراتك تصنع الفرق\n🎯 خبرتك تبني المستقبل\n\n${getTonePhrase(tone, 'volunteer')} ${hashtagSuffix}`,
                
                `${emojiPrefix} "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"\n\n📖 شارك في تعليم ${stats.totalStudents} طالب\n🏆 كن جزءاً من قصة نجاحهم\n\n${getTonePhrase(tone, 'volunteer')} ${hashtagSuffix}`
            );
            break;
            
        case 'gratitude':
            tweets.push(
                `${emojiPrefix} شكراً لكل من ساهم معنا\n\n🙏 ${stats.totalStudents} طالب يدعون لكم\n💝 ${stats.totalMemorized} جزء محفوظ بفضلكم\n🌟 أثركم باقٍ في قلوبهم\n\n${getTonePhrase(tone, 'gratitude')} ${hashtagSuffix}`,
                
                `${emojiPrefix} جزاكم الله خير الجزاء\n\n🏆 ${stats.excellentStudents} طالب ممتاز بدعمكم\n📈 نمو مستمر بفضل ثقتكم\n💫 بركة دعواتكم تحيط بنا\n\n${getTonePhrase(tone, 'gratitude')} ${hashtagSuffix}`,
                
                `${emojiPrefix} الشكر لا يوفيكم حقكم\n\n🤲 دعواتكم سر نجاحنا\n💝 دعمكم وقود مسيرتنا\n🌟 ${stats.totalCircles} حلقات تشهد لكم بالخير\n\n${getTonePhrase(tone, 'gratitude')} ${hashtagSuffix}`
            );
            break;
    }
    
    return tweets;
}

// الحصول على الرموز التعبيرية حسب النوع
function getEmojiForType(type) {
    const emojis = {
        achievement: '🏆',
        motivation: '💪',
        fundraising: '💝',
        volunteer: '🤝',
        gratitude: '🙏'
    };
    return emojis[type] || '🕌';
}

// الحصول على الهاشتاجات حسب النوع
function getHashtagsForType(type) {
    const hashtags = {
        achievement: '#إنجازات_التحفيظ #فخر_الطلاب #التميز_القرآني',
        motivation: '#تحفيظ_القرآن #انضم_لنا #رحلة_الحفظ',
        fundraising: '#دعم_التحفيظ #صدقة_جارية #استثمار_الآخرة',
        volunteer: '#التطوع #معلم_متطوع #خدمة_القرآن',
        gratitude: '#شكر_الداعمين #الامتنان #بركة_الدعم'
    };
    return hashtags[type] || '#تحفيظ_القرآن #جمعية_خيرية';
}

// الحصول على العبارة المناسبة للنبرة
function getTonePhrase(tone, type) {
    const phrases = {
        formal: {
            achievement: 'نفخر بهذه الإنجازات المتميزة',
            motivation: 'ندعوكم للانضمام إلى مسيرتنا',
            fundraising: 'نتطلع إلى دعمكم الكريم',
            volunteer: 'نرحب بانضمامكم لفريقنا',
            gratitude: 'نقدر دعمكم وثقتكم'
        },
        friendly: {
            achievement: 'ما شاء الله تبارك الله! 🌟',
            motivation: 'تعالوا نحفظ القرآن سوياً! 😊',
            fundraising: 'كونوا جزءاً من الخير! 💕',
            volunteer: 'انضموا لعائلتنا الكريمة! 🤗',
            gratitude: 'حبكم يملأ قلوبنا! ❤️'
        },
        inspiring: {
            achievement: 'هذا ما يحدث عندما نتحد للخير!',
            motivation: 'كل حلم يبدأ بخطوة... ابدأ اليوم!',
            fundraising: 'كن البطل في قصة نجاح طالب!',
            volunteer: 'أنت القطعة المفقودة في أحجية النجاح!',
            gratitude: 'أنتم الملائكة الحقيقيون في حياتنا!'
        },
        urgent: {
            achievement: 'إنجاز عاجل يستحق الاحتفال!',
            motivation: 'الفرصة محدودة... لا تفوتها!',
            fundraising: 'نحتاج دعمكم العاجل!',
            volunteer: 'مطلوب متطوعون بشكل عاجل!',
            gratitude: 'شكر عاجل لا يحتمل التأخير!'
        }
    };
    
    return phrases[tone]?.[type] || 'شاركونا هذه اللحظة المميزة';
}

// تقييم جودة التغريدة
function getTweetQuality(tweet) {
    let score = 0;
    
    // طول مناسب
    if (tweet.length >= 100 && tweet.length <= 250) score += 2;
    else if (tweet.length >= 50 && tweet.length <= 280) score += 1;
    
    // وجود رموز تعبيرية
    if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(tweet)) score += 1;
    
    // وجود هاشتاجات
    if (tweet.includes('#')) score += 1;
    
    // وجود أرقام/إحصائيات
    if (/\d+/.test(tweet)) score += 1;
    
    // وجود دعوة للعمل
    if (/انضم|ساهم|شارك|ادعم|تبرع/i.test(tweet)) score += 1;
    
    if (score >= 5) return 'excellent';
    if (score >= 3) return 'good';
    if (score >= 2) return 'average';
    return 'weak';
}

// نص تقييم جودة التغريدة
function getTweetQualityText(quality) {
    const texts = {
        excellent: 'ممتازة',
        good: 'جيدة',
        average: 'متوسطة',
        weak: 'تحتاج تحسين'
    };
    return texts[quality] || 'غير محدد';
}

// نسخ التغريدة
function copyTweet(tweet) {
    navigator.clipboard.writeText(tweet).then(() => {
        showNotification('تم نسخ التغريدة بنجاح', 'success');
    }).catch(() => {
        // طريقة بديلة للنسخ
        const textArea = document.createElement('textarea');
        textArea.value = tweet;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('تم نسخ التغريدة بنجاح', 'success');
    });
}

// مشاركة في تويتر
function shareToTwitter(tweet) {
    const url = `https://twitter.com/intent/tweet?text=${tweet}`;
    window.open(url, '_blank', 'width=600,height=400');
}

// إضافة رابط لوحة تحكم الذكاء الاصطناعي في القائمة الجانبية
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser && (currentUser.type === 'admin' || currentUser.type === 'teacher')) {
        const sidebar = document.querySelector('.sidebar-menu');
        if (sidebar) {
            const aiItem = document.createElement('li');
            aiItem.innerHTML = `
                <a href="#" class="menu-item" onclick="showAIDashboard()">
                    <i class="fas fa-robot"></i>
                    <span>الذكاء الاصطناعي</span>
                </a>
            `;
            sidebar.appendChild(aiItem);
        }
    }
});