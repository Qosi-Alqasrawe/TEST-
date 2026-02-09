<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1krVcALSOVcr2-C0HLKfRHgi7dsYBUJn5

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local`
3. Run the app:
   `npm run dev`

---

## نشر المشروع مجانًا على GitHub Pages

إذا بدك تخليه موقع مجاني على GitHub، هاد المشروع صار جاهز عبر GitHub Actions.

### 1) ارفع المشروع على GitHub

- اعمل repository جديد.
- ادفع الكود (push) على فرع `main`.

### 2) فعّل GitHub Pages

من إعدادات الريبو:

- `Settings` → `Pages`
- من `Build and deployment` اختَر:
  - **Source: GitHub Actions**

> بمجرد أول push على `main`، الـ workflow راح يبني المشروع وينشره تلقائيًا.

### 3) رابط الموقع

بعد نجاح الـ Action، بيطلع لك رابط مثل:

`https://<username>.github.io/<repository-name>/`

### ملاحظات مهمة

- تم إعداد `vite.config.ts` لقراءة `VITE_BASE_PATH` حتى يشتغل المسار الصحيح على Pages.
- ملف workflow موجود في:
  - `.github/workflows/deploy-pages.yml`
- الـ workflow يمرر تلقائيًا:
  - `VITE_BASE_PATH=/<repository-name>/`

### إعادة النشر بعد أي تعديل

كل مرة تعمل push على `main`:

- يتم build تلقائي
- ويتم نشر نسخة جديدة تلقائيًا
