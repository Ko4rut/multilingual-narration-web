# MANS Admin

Source nền cho web quản trị điểm tham quan (POI), nội dung thuyết minh, audio và thống kê. Dark theme theo mẫu dashboard, tổ chức code theo feature.

## Công nghệ

- Next.js 16.3.6 (App Router), React 19.2.8.
- TypeScript strict, Tailwind CSS 4, CSS variables, ESLint.
- Biểu đồ SVG/CSS, chưa cần thư viện chart hay state management bổ sung.

## Chạy local

Yêu cầu Node.js từ 20.9 và npm. Dùng cùng phiên bản Node giữa các môi trường trong nhóm.

```bash
npm ci
npm run dev
```

Mở http://localhost:3000; trang gốc chuyển tới `/dashboard`. Hiện không cần biến môi trường, backend hoặc database.

```bash
npm run lint       # ESLint
npm run typecheck  # Sinh route types và kiểm tra TypeScript
npm run build      # Build production
npm start          # Chạy bản build
```

## Phạm vi hiện tại

- Giao di?n ??ng nh?p theo thi?t k? t?i `/login`, k?m `/register` v? `/forgot-password`. C? validation HTML, n?t ?n/hi?n m?t kh?u v? th?ng b?o ch?a k?t n?i API khi g?i form; kh?ng l?u ho?c g?i m?t kh?u. Dashboard demo v?n truy c?p tr?c ti?p t?i `/dashboard`.
- Khung admin responsive, sidebar đánh dấu route đang chọn.
- Dashboard: thống kê, thời lượng nghe, POI phổ biến, heatmap, lượt ghé theo giờ.
- Bộ lọc 7/30/90 ngày lưu trên URL, ví dụ `/dashboard?period=7`. Giá trị không hợp lệ dùng mặc định 30 ngày.
- Loading, error boundary, trang 404, metadata và favicon riêng.
- Các route `/pois`, `/poi-content`, `/audio`, `/users`, `/roles`, `/languages`, `/settings` có màn hình chờ triển khai.

**Toàn bộ số liệu là mock, không phải realtime.** Bộ lọc cập nhật dữ liệu minh họa; số POI, tỷ lệ hoàn thành, thời lượng trung bình và tỷ lệ thay đổi đang cố định. Chưa có CRUD, upload, đăng nhập hoặc phân quyền. Cần bổ sung xác thực và kiểm tra quyền ở server/API trước khi quản lý dữ liệu thật.

## Cấu trúc source

```text
src/
├── app/
│   ├── layout.tsx           # Layout gốc và metadata
│   ├── globals.css          # Theme, layout, responsive
│   ├── page.tsx             # Redirect đến dashboard
│   ├── icon.svg
│   ├── not-found.tsx
│   └── (admin)/             # Route group không xuất hiện trong URL
│       ├── layout.tsx       # Sidebar và nội dung
│       ├── loading.tsx
│       ├── error.tsx
│       ├── dashboard/
│       ├── pois/
│       ├── poi-content/
│       ├── audio/
│       ├── users/
│       ├── roles/
│       ├── languages/
│       └── settings/
├── components/
│   ├── layout/              # Sidebar
│   ├── shared/              # PageHeader, ModulePlaceholder
│   └── ui/                  # Card, Icon
├── constants/
│   └── navigation.ts        # Nhóm menu và đường dẫn
└── features/
    ├── dashboard/
    │   ├── components/      # DashboardOverview, PeriodFilter
    │   ├── mocks/           # Factory dữ liệu minh họa
    │   ├── services/        # Adapter dữ liệu, thay bằng API tại đây
    │   └── types.ts         # DashboardData, Period, parsePeriod
    ├── pois/
    ├── poi-content/
    ├── audio/
    ├── users/
    ├── roles/
    ├── languages/
    └── settings/
```

Alias `@/*` trỏ tới `src/*`. Assets bổ sung đặt tại `public/` ở root. File cấu hình và `.env.local` cũng nằm ở root.

## Quy ước phát triển

1. `app/` khai báo route, metadata và ghép màn hình; nghiệp vụ và UI riêng đặt tại `features/<module>/`.
2. Component dùng chung đặt trong `components/`. Tránh để component dùng chung import ngược từ feature.
3. Thêm `hooks/`, `schemas/`, `services/`, `constants/` khi cần, không tạo thư mục rỗng hay abstraction chưa dùng.
4. Layout/page mặc định là Server Component. Chỉ thêm `"use client"` khi cần state, event hoặc browser API.
5. Tìm kiếm, bộ lọc và phân trang nên lưu trên URL; trạng thái hiển thị tạm thời có thể dùng React state.
6. Chỉnh theme tại `src/app/globals.css`; giữ hỗ trợ bàn phím và responsive khi thêm UI.

## Nối API

Thay lời gọi mock trong `src/features/dashboard/services/dashboard.service.ts`, giữ contract `Promise<DashboardData>`. Kiểm tra response và chuyển dữ liệu sang kiểu của UI tại service.

- Chọn cache/revalidation theo nghiệp vụ.
- Secret/token phía server không dùng prefix `NEXT_PUBLIC_`.
- Khi nhiều feature cần HTTP client chung, thêm `src/lib/api/` để tập trung xử lý lỗi và xác thực.
- Bổ sung biến môi trường theo backend thực tế và ghi lại tại README. Hiện source chưa yêu cầu biến nào.
- Quyền truy cập phải được kiểm tra tại server/API; ẩn menu không thay thế kiểm tra quyền.

## Thêm module

1. Tạo màn hình tại `src/features/<module>/components/`.
2. Tạo `src/app/(admin)/<module>/page.tsx`, import màn hình và khai báo metadata.
3. Thêm menu vào `src/constants/navigation.ts` nếu cần.
4. Bổ sung types, service và form theo nghiệp vụ. Dùng `PageHeader`/`Card` để giữ giao diện thống nhất.
5. Chạy lint, typecheck, build trước khi commit. Với CRUD/API, bổ sung test cho validation, lỗi và phân quyền theo contract thực tế.

## Lưu ý Next.js của repo

Đọc `AGENTS.md` và tài liệu tương ứng trong `node_modules/next/dist/docs/` trước khi sửa API/framework. Phiên bản này có khác biệt so với các bản cũ: error boundary dùng `retry()` và `searchParams` của page là Promise.

Đã bỏ trang chào, SVG và favicon mặc định của create-next-app; không tải Google Fonts khi build. Giữ file cấu hình, lockfile và hướng dẫn cho coding agent.

## Hiệu ứng nền xác thực

`src/features/auth/hooks/useAnimatedBackground.ts` điều khiển quầng sáng và đường cong bằng `requestAnimationFrame`, cập nhật CSS variables trực tiếp để không render lại form. Nền tự trôi nhẹ, có parallax theo chuột trên thiết bị hỗ trợ hover; màn hình cảm ứng chỉ dùng chuyển động tự động.

Chỉnh biên độ và tốc độ trong hook, chỉnh màu/kích thước các lớp tại `AuthForm.module.css`. Hiệu ứng dừng khi tab bị ẩn, tắt theo `prefers-reduced-motion` và dọn animation/listener khi unmount. Áp dụng chung cho login, register và forgot-password.
