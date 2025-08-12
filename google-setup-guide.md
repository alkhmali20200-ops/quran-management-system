# 🔧 دليل إعداد التكامل مع Google Services

## 📋 المتطلبات:
- حساب Google
- مشروع في Google Cloud Console
- تفعيل APIs المطلوبة

## 🚀 خطوات الإعداد:

### 1. إنشاء مشروع في Google Cloud Console

1. **اذهب إلى**: https://console.cloud.google.com
2. **اضغط**: "Select a project" > "New Project"
3. **اسم المشروع**: "Quran Management System"
4. **اضغط**: "Create"

### 2. تفعيل APIs المطلوبة

1. **في القائمة الجانبية**: APIs & Services > Library
2. **ابحث وفعل**:
   - Google Sheets API
   - Google Docs API
   - Google Drive API

### 3. إنشاء مفاتيح API

#### أ) API Key (للوصول العام):
1. **اذهب إلى**: APIs & Services > Credentials
2. **اضغط**: "Create Credentials" > "API Key"
3. **انسخ المفتاح** واحفظه

#### ب) OAuth 2.0 (للوصول الآمن):
1. **اضغط**: "Create Credentials" > "OAuth client ID"
2. **اختر**: "Web application"
3. **أضف Authorized origins**:
   - http://localhost:8000
   - https://your-domain.com (إذا كان لديك نطاق)
4. **احفظ Client ID**

### 4. إنشاء Google Spreadsheet

1. **اذهب إلى**: https://sheets.google.com
2. **أنشئ جدول بيانات جديد**
3. **اسم الجدول**: "بيانات جمعية تحفيظ القرآن"
4. **أنشئ الأوراق التالية**:
   - الطلاب
   - الحضور
   - إحصائيات الحلقات
   - التقارير

5. **انسخ معرف الجدول** من الرابط:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 5. تحديث الكود

في ملف `google-integration.js`، حدث المتغيرات:

```javascript
const GOOGLE_CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE',           // ضع مفتاح API هنا
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // ضع معرف الجدول هنا
    CLIENT_ID: 'YOUR_CLIENT_ID',           // ضع Client ID هنا
    DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
    SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
};
```

### 6. اختبار التكامل

1. **افتح النظام** في المتصفح
2. **اذهب إلى لوحة التحكم**
3. **اضغط**: "تصدير الطلاب إلى Sheets"
4. **تحقق من الجدول** في Google Sheets

## 🔒 الأمان والخصوصية:

### حماية المفاتيح:
- لا تشارك مفاتيح API مع أحد
- استخدم متغيرات البيئة في الإنتاج
- قم بتقييد استخدام المفاتيح

### إعدادات الخصوصية:
```javascript
// في ملف config.js
const PRIVACY_SETTINGS = {
    sharePersonalData: false,      // لا تشارك البيانات الشخصية
    anonymizeReports: true,        // إخفاء الأسماء في التقارير العامة
    encryptSensitiveData: true     // تشفير البيانات الحساسة
};
```

## 📊 استخدام الميزات:

### 1. تصدير البيانات:
- **الطلاب**: جميع بيانات الطلاب مع الإحصائيات
- **الحضور**: سجل مفصل للحضور والغياب
- **الحلقات**: أداء وإحصائيات كل حلقة

### 2. التقارير الذكية:
- **تحليل الأداء**: مقارنة الحلقات والطلاب
- **التوصيات**: اقتراحات لتحسين الأداء
- **التنبؤات**: توقعات بناءً على البيانات

### 3. الحملات التبرعية:
- **تحليل الاحتياجات**: حساب التكاليف المطلوبة
- **مواد الحملة**: إنشاء محتوى جاهز للنشر
- **تتبع الأهداف**: مراقبة تقدم الحملة

## 🛠️ استكشاف الأخطاء:

### خطأ "API key not valid":
- تأكد من صحة مفتاح API
- تحقق من تفعيل APIs المطلوبة
- راجع قيود الاستخدام

### خطأ "Permission denied":
- تأكد من صلاحيات الوصول للجدول
- تحقق من إعدادات OAuth
- راجع نطاقات الصلاحيات

### خطأ "Quota exceeded":
- تحقق من حدود الاستخدام اليومية
- فكر في ترقية الحساب
- قم بتحسين عدد الطلبات

## 📞 الدعم الفني:

### الموارد المفيدة:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

### نصائح للتطوير:
1. **ابدأ بالتجربة** على بيانات وهمية
2. **احفظ نسخ احتياطية** من البيانات
3. **اختبر الميزات** قبل الاستخدام الفعلي
4. **راقب حدود الاستخدام** لتجنب التوقف

## 🎯 الخطوات التالية:

1. **أكمل الإعداد** باتباع الخطوات أعلاه
2. **اختبر الميزات** مع بيانات تجريبية
3. **درب الفريق** على استخدام النظام
4. **ابدأ الاستخدام الفعلي** مع مراقبة الأداء

---

**ملاحظة**: هذا الدليل يغطي الإعداد الأساسي. للاستخدام المتقدم، راجع الوثائق الرسمية لـ Google APIs.