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
- ادفع الكود (push) على فرع `main` أو `work` أو أي فرع يطابق `codex/**`.

### 2) فعّل GitHub Pages

من إعدادات الريبو:

- `Settings` → `Pages`
- من `Build and deployment` اختَر:
  - **Source: GitHub Actions**

> بمجرد أول push على أي فرع مدعوم (`main` / `work` / `codex/**`)، الـ workflow راح يبني المشروع وينشره تلقائيًا.

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

كل مرة تعمل push على فرع مدعوم (`main` / `work` / `codex/**`):

- يتم build تلقائي
- ويتم نشر نسخة جديدة تلقائيًا


### Troubleshooting (إذا الموقع ما تغيّر)

إذا شايف التعديل محليًا بس مش ظاهر على رابط GitHub Pages، غالبًا السبب إن التعديل موجود على فرع ثاني (مثل `work` أو `codex/...`) ولسّا مش مدموج في `main`.

بهذا المشروع، الـ workflow صار يشتغل تلقائيًا على الفروع التالية أيضًا:
- `main`
- `work`
- `codex/**`

يعني حتى قبل الدمج، أي push على هالفروع لازم يعمل deploy جديد. وإذا ما ظهر التحديث:
1) افتح تبويب **Actions** وتأكد آخر run ناجح.
2) اعمل hard refresh (Ctrl+F5).
3) تأكد أنك فاتح الرابط الصحيح: `https://<username>.github.io/<repo>/`


### حل المشكلة الظاهرة بالصورة (ليش الموقع لسا فاضي؟)

إذا صفحة GitHub (فرع `main`) ما فيها إلا **2 commits** بينما شغلك موجود بفرع ثاني، فالموقع رح يضل قديم.

نفّذ الأوامر التالية من جهازك (copy/paste):

```bash
git checkout main
git pull origin main
git merge work
git push origin main
```

إذا اسم فرعك مش `work` (مثلاً `codex/verify-all-project-goals-are-included`) استبدله بالسطر الثالث:

```bash
git merge codex/verify-all-project-goals-are-included
```

بعدها:
1. ادخل **Actions** وتأكد آخر deployment صار ✅
2. انتظر دقيقة–دقيقتين
3. اعمل Hard Refresh (`Ctrl + F5`) للرابط

> باختصار: المشكلة مش من الكود الحالي، المشكلة أن آخر تعديلاتك لسا مش واصلة لفرع `main` الظاهر بالموقع.
