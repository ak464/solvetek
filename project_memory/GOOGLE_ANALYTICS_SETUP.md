# إعداد Google Analytics

## الخطوات:

### 1. الحصول على Measurement ID
1. اذهب إلى [Google Analytics](https://analytics.google.com/)
2. أنشئ حساب جديد أو استخدم حساب موجود
3. أنشئ Property جديد
4. اختر "Web" كمنصة
5. احصل على **Measurement ID** (يبدأ بـ `G-`)

### 2. إضافة المتغير للبيئة
أضف السطر التالي إلى ملف `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

استبدل `G-XXXXXXXXXX` بـ Measurement ID الخاص بك.

### 3. إعادة تشغيل السيرفر
```bash
npm run dev
```

### 4. التحقق من العمل
1. افتح موقعك في المتصفح
2. افتح Developer Tools (F12)
3. اذهب إلى Network tab
4. ابحث عن طلبات لـ `google-analytics.com`
5. إذا وجدتها، فالتتبع يعمل! ✅

### 5. إعداد Google Search Console
1. اذهب إلى [Search Console](https://search.google.com/search-console)
2. أضف موقعك
3. تحقق من الملكية (استخدم Google Analytics)
4. أرسل sitemap: `https://solvetek.net/sitemap.xml`

---

## ملاحظات:
- ✅ Google Analytics مضاف تلقائياً للموقع
- ✅ يعمل فقط إذا تم تعيين `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- ✅ لا يظهر في development mode (localhost)
- ✅ يعمل فقط في production

---

## البيانات المتتبعة:
- 📊 Page views
- 📊 User sessions
- 📊 Traffic sources
- 📊 User demographics
- 📊 Real-time visitors

**بعد 24-48 ساعة ستبدأ رؤية البيانات في Google Analytics! 🎯**
