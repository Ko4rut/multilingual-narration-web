# MANS Admin

Ứng dụng quản trị nội dung thuyết minh đa ngôn ngữ cho điểm tham quan. Dự án hiện cung cấp giao diện dashboard, quản lý POI, quản lý nội dung POI và khung cho các module quản trị còn lại.

> Dữ liệu và tài khoản trong repository chỉ phục vụ demo. Chưa sử dụng backend hoặc cơ sở dữ liệu thật.

## Công nghệ

- Next.js 16.3.6 với App Router và React 19.
- TypeScript strict, Tailwind CSS 4 và CSS Modules.
- shadcn/ui theo style New York, Radix UI và Lucide icons.
- React Hook Form cho biểu mẫu xác thực.
- CSS variables cho light/dark theme và hệ thống token giao diện.
- Từ điển nội bộ hỗ trợ tiếng Việt và tiếng Anh.

## Yêu cầu

- Node.js 20.9 trở lên.
- npm và phiên bản Node thống nhất giữa các môi trường phát triển.

## Cài đặt và chạy local

```bash
npm ci
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Trang gốc chuyển hướng tới `/login`.

Tài khoản demo:

```text
Email:    admin@mans.vn
Password: admin123
```

Không cần cấu hình biến môi trường để chạy demo. `AUTH_SECRET` là tùy chọn trong môi trường local, nhưng phải được cấu hình bằng secret riêng khi thay cơ chế xác thực demo.

## Scripts

```bash
npm run dev        # Chạy development server
npm run lint       # Kiểm tra ESLint
npm run typecheck  # Sinh route types và kiểm tra TypeScript
npm run build      # Tạo production build
npm start          # Chạy production build
```

## Chức năng hiện có

- Đăng nhập bằng tài khoản nhân viên demo và cookie phiên HttpOnly có chữ ký.
- Bảo vệ route admin tại proxy, admin layout và data boundary của dashboard.
- Khôi phục mật khẩu ở trạng thái placeholder, chưa gửi email thật.
- Dashboard với số liệu thống kê, biểu đồ xu hướng, POI phổ biến, heatmap và bộ lọc 7/30/90 ngày lưu trên URL.
- Danh sách POI với form tạo mới, tìm kiếm, lọc, chọn bản ghi và phân trang trên dữ liệu mock. POI mới chỉ tồn tại trong state của phiên hiện tại và chưa được lưu vào backend.
- Danh sách nội dung POI với tìm kiếm, lọc ngôn ngữ/trạng thái và phân trang trên dữ liệu mock.
- Sidebar responsive, light/dark theme và giao diện tiếng Việt/tiếng Anh.
- Quản lý người dùng với thống kê tổng quan, tìm kiếm, lọc, phân trang và form thêm/xem/sửa trên dữ liệu mock trong phiên hiện tại.
- Các route audio, vai trò, ngôn ngữ, cài đặt và hồ sơ đã có giao diện để tiếp tục hoàn thiện nghiệp vụ.

## Routing

Next.js đọc route từ `src/app`. Route group trong ngoặc chỉ dùng để tổ chức layout và không xuất hiện trong URL.

| Route | Mô tả |
| --- | --- |
| `/login` | Đăng nhập |
| `/forgot-password` | Khôi phục mật khẩu dạng placeholder |
| `/dashboard` | Dashboard quản trị |
| `/pois` | Quản lý điểm tham quan |
| `/poi-content` | Quản lý nội dung POI đa ngôn ngữ |
| `/audio` | Khung quản lý audio |
| `/users` | Quản lý người dùng trên dữ liệu mock |
| `/roles` | Khung quản lý vai trò |
| `/languages` | Khung quản lý ngôn ngữ |
| `/settings` | Khung cài đặt chung |
| `/profile` | Khung hồ sơ nhân viên |

Các route admin được liệt kê trong `src/proxy.ts`. Khi thêm route được bảo vệ, cần cập nhật matcher và vẫn kiểm tra phiên tại action/service xử lý dữ liệu.

## Cấu trúc source

```text
src/
├── app/
│   ├── (auth)/                 # Layout và trang login/forgot-password
│   ├── (admin)/                # Layout và các route được bảo vệ
│   ├── globals.css             # Tailwind, utility và style toàn cục
│   ├── layout.tsx              # Root layout, metadata, preferences
│   └── page.tsx                # Chuyển hướng tới /login
├── components/
│   ├── layout/                 # MainLayout, Sidebar
│   ├── shared/                 # PageLayout, DataTable, form sheet dùng chung
│   └── ui/                     # Primitive shadcn/ui dùng chung
├── constants/
│   └── navigation.ts           # Cấu hình menu admin
├── features/
│   ├── auth/
│   │   ├── components/         # AuthForm, AnimatedBackground, CSS Module
│   │   ├── constants/          # Nội dung tĩnh theo chế độ form
│   │   ├── hooks/              # Điều phối form và animation nền
│   │   ├── mocks/              # Tài khoản nhân viên demo
│   │   ├── types/              # Contract của feature auth
│   │   ├── actions.ts          # Login/logout Server Actions
│   │   └── session.ts          # Tạo, xác minh và yêu cầu phiên
│   ├── dashboard/              # Dashboard, hooks, mock, service, utils
│   ├── pois/                   # Danh sách và thao tác POI mock
│   ├── poi-content/            # Danh sách nội dung POI mock
│   ├── preferences/            # Theme và locale dùng chung
│   ├── users/
│   │   ├── components/         # Bảng, badge, overview và form sheet
│   │   ├── constants/          # Trạng thái, role ID và option metadata
│   │   ├── hooks/              # State, CRUD mock và dữ liệu form
│   │   ├── mocks/              # Danh sách tài khoản quản trị mẫu
│   │   └── types/              # Model và props của feature users
│   └── ...                     # Các module quản trị đang phát triển
├── i18n/                       # Từ điển và kiểu locale
├── styles/
│   └── tokens.css              # Token màu sắc, typography, radius
└── proxy.ts                    # Bảo vệ route admin
```

Alias `@/*` trỏ tới `src/*`.

## Tổ chức feature auth

Auth được chia theo trách nhiệm:

- `components/`: chỉ render giao diện. `AuthForm` sử dụng shadcn `Form`, `FormField`, `FormControl`, `FormLabel`, `FormMessage`, input group và button.
- `hooks/`: quản lý React Hook Form, trạng thái pending, hiển thị mật khẩu và chuyển dữ liệu tới Server Action.
- `constants/`: chứa tiêu đề, mô tả và nhãn hành động cho từng chế độ form.
- `types/`: chứa props, form values, action state và contract dữ liệu mock.
- `mocks/`: chứa thông tin đăng nhập demo; không được dùng như cơ chế xác thực production.
- `actions.ts`: xác minh credential phía server, thiết lập/xóa cookie và redirect.
- `session.ts`: ký, kiểm tra hạn và xác minh cookie phiên.

Ứng dụng chỉ hỗ trợ tài khoản nhân viên được cấp sẵn; không có đăng ký công khai.

## Tổ chức feature

Mỗi feature chỉ tạo các thư mục thực sự cần thiết và ưu tiên cấu trúc sau:

```text
src/features/<feature>/
├── components/    # JSX và liên kết event handler từ hook
├── constants/     # Domain constants, option metadata và cấu hình tĩnh
├── hooks/         # State, effect, handler và chuẩn bị dữ liệu
├── mocks/         # Dữ liệu demo có kiểu rõ ràng
└── types/         # Model, props và contract của feature
```

Feature `users` tuân theo đúng cấu trúc trên. Trạng thái tài khoản được khai báo tập trung trong `constants/user.constants.ts` với hai giá trị `ACTIVE` và `DISABLED`, đúng với schema `Manager_Users`. Nhãn giao diện có thể hiển thị “Inactive”, nhưng không đổi domain value thành `INACTIVE` khi backend vẫn quy định `DISABLED`.

## shadcn/ui và styling

Các primitive dùng chung nằm trong `src/components/ui` và cấu hình tại `components.json`. Thêm component mới bằng:

```bash
npx shadcn@latest add <component>
```

Không ghi đè theme mặc định lên `src/app/globals.css`. Màu sắc, font và type scale của sản phẩm được định nghĩa trong `src/styles/tokens.css`, sau đó ánh xạ thành utility Tailwind trong `globals.css`.

Component riêng của feature có thể dùng CSS Module hoặc utility class, nhưng nên tái sử dụng semantic token và primitive hiện có. Luôn kiểm tra light theme, dark theme, keyboard navigation và `prefers-reduced-motion` khi thay đổi giao diện.

## i18n và preferences

- Chuỗi tiếng Anh đóng vai trò key/fallback; bản dịch tiếng Việt nằm trong `src/i18n/messages.ts`.
- Client component đọc `t()` và `locale` qua `usePreferences()`.
- Khi người dùng chưa chọn thủ công, locale mặc định là tiếng Anh và theme theo hệ điều hành.
- Lựa chọn thủ công được lưu trong cookie và tiếp tục áp dụng sau khi đăng xuất/đăng nhập lại.
- Login không hiển thị bộ chọn theme hoặc ngôn ngữ.

## Quy ước phát triển

1. Giữ page/layout trong `src/app` mỏng; nghiệp vụ và UI riêng đặt trong `src/features/<feature>`.
2. Component chỉ render JSX; state, handler và chuẩn bị dữ liệu đặt trong hook hoặc utility thuần.
3. File custom hook dùng kebab-case theo mẫu `use-<domain-action>.ts`, ví dụ `use-user-form-sheet.ts`; tên hàm export vẫn dùng camelCase như `useUserFormSheet`.
4. Component dùng chung đặt trong `src/components`; không để shared component phụ thuộc ngược vào feature.
5. Dùng function declaration cho component và JSX render callback; tránh ternary trong code feature.
6. Chỉ tạo folder khi có code thực tế và không thêm API/database ngoài yêu cầu.
7. Xác thực và phân quyền phải được kiểm tra tại mỗi Server Action/service được bảo vệ; ẩn menu không phải là kiểm soát quyền.
8. Trước khi sửa framework API, đọc `AGENTS.md`, skill của dự án và tài liệu Next.js được cài trong `node_modules/next/dist/docs`.

## Nối backend thật

Khi thay mock bằng backend:

1. Thay so sánh credential trong `src/features/auth/actions.ts` bằng identity provider hoặc API nội bộ.
2. Cấu hình `AUTH_SECRET` an toàn và thay định dạng phiên demo nếu cần.
3. Thay adapter mock trong feature service, giữ validation và contract dữ liệu ở boundary.
4. Không đưa secret/token server vào biến có prefix `NEXT_PUBLIC_`.
5. Bổ sung test cho validation, lỗi mạng, session hết hạn và phân quyền.

Xem thêm [hướng dẫn frontend](docs/frontend-setup.md) và [quy ước MANS frontend](docs/skills/mans-frontend/SKILL.md).
