# 🔧 حل مشكلة 404 في GitHub Pages

## المشكلة:
GitHub Pages لا يجد ملف `index.html` في المكان الصحيح

## ✅ الحلول:

### الحل الأول: رفع الملفات في المجلد الرئيسي

1. **احذف جميع الملفات** من المستودع
2. **ارفع الملفات مباشرة** بدون مجلدات:
   - index.html
   - styles.css  
   - script.js
   - config.js
   - enhancements.js
   - (جميع الملفات الأخرى)

### الحل الثاني: تغيير إعدادات GitHub Pages

1. اذهب إلى **Settings** في المستودع
2. انزل إلى قسم **Pages**
3. في **Source** اختر **Deploy from a branch**
4. في **Branch** اختر **main**
5. في **Folder** اختر **/ (root)** أو **/docs** حسب مكان الملفات
6. اضغط **Save**

### الحل الثالث: إنشاء ملف index.html في المجلد الرئيسي

إذا كانت الملفات في مجلد `algmaha`، أنشئ ملف `index.html` في المجلد الرئيسي:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=./algmaha/index.html">
    <title>نظام إدارة جمعية تحفيظ القرآن الكريم</title>
</head>
<body>
    <p>جاري التحويل إلى النظام...</p>
    <p><a href="./algmaha/index.html">اضغط هنا إذا لم يتم التحويل تلقائياً</a></p>
</body>
</html>
```

## 🎯 الطريقة الصحيحة للرفع:

### الخطوة 1: تنظيم الملفات
```
المستودع/
├── index.html          ← الملف الرئيسي
├── styles.css
├── script.js
├── config.js
├── enhancements.js
├── README.md
└── (باقي الملفات)
```

### الخطوة 2: التحقق من الملفات
تأكد من وجود هذه الملفات في المجلد الرئيسي:
- ✅ index.html
- ✅ styles.css
- ✅ script.js
- ✅ config.js
- ✅ enhancements.js

### الخطوة 3: انتظار التحديث
- GitHub Pages يحتاج 5-10 دقائق للتحديث
- ستصلك رسالة إيميل عند اكتمال النشر

## 🔍 التحقق من المشكلة:

### تحقق من الرابط:
- ✅ الصحيح: `https://username.github.io/repository-name/`
- ❌ الخطأ: `https://username.github.io/repository-name/algmaha/`

### تحقق من حالة النشر:
1. اذهب إلى **Actions** في المستودع
2. تأكد من أن آخر عملية نشر نجحت (علامة خضراء ✅)

## 🆘 إذا لم تنجح الحلول:

### احذف المستودع وأعد إنشاؤه:
1. اذهب إلى **Settings** > **General**
2. انزل إلى **Danger Zone**
3. اضغط **Delete this repository**
4. أنشئ مستودع جديد
5. ارفع الملفات مباشرة في المجلد الرئيسي

## 📞 تحتاج مساعدة؟
أرسل لي:
- رابط المستودع
- لقطة شاشة من صفحة Settings > Pages
- رسالة الخطأ كاملة