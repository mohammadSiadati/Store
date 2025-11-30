
📦 Admin Dashboard — Next.js + TailwindCSS + Shadcn + React Query

یک داشبورد مدرن، کاملاً Modular و مبتنی بر Feature Architecture
با استفاده از API آماده (FakeStore API) جهت نمایش لیست محصولات، کاربران و سفارش‌ها.

این پروژه با تمرکز بر Clean Architecture، UX مناسب، سرعت بالا، و توسعه‌پذیری ساخته شده است.

🚀 تکنولوژی‌ها
Frontend

Next.js 15 (App Router + React Server Components)

React 19 + React Compiler

TypeScript

TailwindCSS

Shadcn/UI

Lucide Icons

Data & State

TanStack React Query

Zustand

Axios / Fetch Wrapper

Tools

ESLint + Prettier + Husky + lint-staged

Commitlint (Conventional Commits)

GitHub Actions (CI)

Vercel Deployment

Optional

Storybook

Lighthouse Optimization

Dark/Light Theme

📁 ساختار پوشه‌ها (Feature-Based Architecture)
src/
  app/
    (auth)/
      login/page.tsx
    (dashboard)/
      layout.tsx
      page.tsx
      products/page.tsx
      products/[id]/page.tsx
      users/page.tsx
      users/[id]/page.tsx
      orders/page.tsx
      orders/[id]/page.tsx

  features/
    products/
      api/
        queries.ts
        types.ts
      components/
        products-table.tsx
        product-filters.tsx
        product-details.tsx
      hooks/
        use-product-filters.ts
      types.ts

    users/
      api/
      components/
      hooks/
      types.ts

    orders/
      api/
      components/
      hooks/
      types.ts

  components/
    layout/
      sidebar.tsx
      topbar.tsx
    ui/               # Shadcn components
    charts/
    feedback/

  core/
    lib/
      api-client.ts
      react-query-client.ts
    config/
      routes.ts
      query-keys.ts
    utils/
      formatters.ts

  stores/
    sidebar.store.ts
    theme.store.ts

  styles/
    globals.css

🧠 معماری پروژه

این پروژه بر اساس Feature-Based Structure ساخته شده است:

API → React Query → Feature Layer → Components → Page

مزایا:

هر feature کاملاً مستقل و مقیاس‌پذیر است

توسعه و نگهداری آسان‌تر

separation of concerns

readability بالا

تست‌پذیری بهتر

🔌 API مورد استفاده

این پروژه از API آماده FakeStore API برای نمایش داده‌ها استفاده می‌کند:

Products: https://fakestoreapi.com/products

Users: https://fakestoreapi.com/users

Carts/Orders: https://fakestoreapi.com/carts

⚙️ نصب و اجرای پروژه
1. Clone پروژه
git clone <your-repo-url>
cd <project-folder>

2. نصب پکیج‌ها
npm install

3. اضافه کردن Shadcn (در صورت نیاز)
npx shadcn@latest init

4. اجرای پروژه
npm run dev

🎨 صفحات پروژه
۱) Login Page

ورود ساده با Fake Auth

ذخیره token در localStorage

۲) Dashboard Page

کارت‌های آماری

نمودار دسته‌بندی محصولات

لیست آخرین سفارش‌ها

۳) Products

جدول محصولات

سرچ و فیلتر

دسته‌بندی

Product Detail Page

۴) Users

لیست کاربران

User Detail + لیست سفارش‌های کاربر

۵) Orders

جدول سفارش‌ها

جزئیات سفارش (Order Detail)

📊 Performance

استفاده از React Query Caching

React Compiler فعال

Lazy Loading صفحات سنگین

Optimized Images

استفاده از Skeleton Loading (Shadcn)

استفاده از memo و useCallback در بخش‌های حساس

🔒 مدیریت State
React Query → server state

مدیریت داده API

caching

refetching

pagination

Zustand → client state

Theme (dark/light)

Sidebar toggle

فیلترهای global

🧪 تست (Optional)

این قسمت در صورت نیاز اضافه می‌شود:

Jest + React Testing Library

تست کامپوننت‌ها:

Table

ProductCard

Sidebar

🔄 CI/CD

Pipeline ساده GitHub Actions:

نصب

lint

build

تست (در صورت وجود)

Deployment اتوماتیک روی Vercel

🗺️ بهبودهای آینده (Roadmap)

 اضافه کردن Storybook

 اضافه کردن Chartهای مختلف (Pie/Line/Area)

 اضافه کردن فرم ساخت محصول

 اضافه کردن real-time updates

 اضافه کردن mock-auth پیشرفته‌تر

 اضافه کردن Role-Based Access

🤝 مشارکت (Contribution Guide)

۱. Fork کنید
۲. یک Branch جدید بسازید:

git checkout -b feature/my-feature


۳. Commit استاندارد:

git commit -m "feat(products): add product table sorting"


۴. Pull Request بزنید.


⭐ اگر پروژه مفید بود لطفاً Star بدید!

این README کاملاً آماده کپی‌کردن داخل GitHub است.
