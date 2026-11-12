# MANS Admin

MANS Admin là giao diện quản trị cho hệ thống thuyết minh tự động đa ngôn ngữ. Ứng dụng quản lý điểm tham quan (POI), nội dung thuyết minh, audio, ngôn ngữ, người dùng, vai trò và các thiết lập vận hành của hệ thống.

> Trạng thái hiện tại: đăng nhập, User Management, Role, POI, POI Content và
> Audio Management đã kết nối MNR Backend; các feature còn lại vẫn dùng mock.

## Chức năng hiện có

- Đăng nhập tài khoản nhân viên qua MNR Backend; Access Token được giữ trong cookie HttpOnly.
- Dashboard thống kê với bộ lọc 7/30/90 ngày, biểu đồ xu hướng, POI phổ biến và heatmap lượt truy cập.
- Quản lý POI qua API: tìm kiếm, lọc trạng thái/khu vực/category, phân trang, thêm, xem, sửa, sao chép ID và xem/tải QR. Backend tự sinh payload/ảnh QR khi tạo POI; PATCH chỉ gửi các trường thực sự thay đổi.
- Quản lý nội dung POI qua API: tạo/sửa phiên bản, submit, review và publish; backend tự sinh TTS khi publish nếu chưa có audio hợp lệ.
- Quản lý và nghe thử metadata audio từ API. Asset audio đã lưu là bất biến; giao diện không cho thay URL khi chưa có quy trình upload/import xác minh file mới.
- Quản lý người dùng, vai trò và ma trận phân quyền bằng API thật. Tên hiển thị Action và Management Function vẫn được ánh xạ cục bộ vì backend chưa có API danh mục tương ứng.
- Quản lý ngôn ngữ, hồ sơ cá nhân và các nhóm thiết lập hệ thống.
- Giao diện responsive, hỗ trợ light/dark theme và tiếng Anh/tiếng Việt.

Một POI chỉ được chuyển sang `ACTIVE` khi có ít nhất một content tiếng Anh ở trạng thái `PUBLISHED` và content đó có audio hợp lệ. Đây là quy tắc nghiệp vụ của bản thiết kế hiện tại, không chỉ là điều kiện hiển thị trên giao diện.

## Công nghệ

- Next.js 16.3.6, App Router và React 19.
- TypeScript với `strict` mode.
- Tailwind CSS 4 và hệ thống CSS variables theo semantic token.
- shadcn/ui style New York, Base UI/Radix UI và Lucide icons.
- React Hook Form cho các biểu mẫu cần validation.
- Từ điển nội bộ cho tiếng Anh và tiếng Việt.

## Yêu cầu môi trường

- Node.js 20.9 trở lên.
- npm đi kèm Node.js.

Nên thống nhất phiên bản Node.js giữa local, CI và production để tránh khác biệt khi cài dependency hoặc build Next.js.

## Cài đặt và chạy local

```bash
npm ci
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Route `/` tự động chuyển tới `/login`.

Tạo `.env.local` để khai báo backend và secret session local:

```bash
BACKEND_API_URL=http://127.0.0.1:8000/api/v1
AUTH_SECRET=replace-with-a-private-random-value
```

Backend phải chạy và có JWT được cấu hình. Đăng nhập web dùng tài khoản thật trong
`manager_user`; User Management tải role/user và lưu thao tác tạo, sửa vào database.
Giá trị fallback của `AUTH_SECRET` chỉ dành cho demo, không dùng ở production.

## Scripts

| Lệnh                | Mục đích                                |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Chạy development server                 |
| `npm run lint`      | Kiểm tra ESLint toàn dự án              |
| `npm run typecheck` | Sinh route types và kiểm tra TypeScript |
| `npm run build`     | Tạo production build                    |
| `npm start`         | Chạy production build đã tạo            |

Trước khi gửi pull request, tối thiểu chạy:

```bash
npm run lint
npm run typecheck
npm run build
```

## Routing

Next.js đọc route từ `src/app`. Route group trong ngoặc dùng để chia sẻ layout và không xuất hiện trong URL.

| Route              | Chức năng                                |
| ------------------ | ---------------------------------------- |
| `/login`           | Đăng nhập nhân viên                      |
| `/forgot-password` | Giao diện khôi phục mật khẩu dạng demo   |
| `/dashboard`       | Dashboard quản trị                       |
| `/pois`            | Quản lý điểm tham quan                   |
| `/poi-content`     | Quản lý nội dung thuyết minh đa ngôn ngữ |
| `/audio`           | Quản lý audio                            |
| `/users`           | Quản lý tài khoản nhân viên              |
| `/roles`           | Quản lý vai trò và ma trận phân quyền    |
| `/languages`       | Quản lý ngôn ngữ                         |
| `/settings`        | Thiết lập ứng dụng và hệ thống           |
| `/profile`         | Hồ sơ tài khoản hiện tại                 |

Các route quản trị được bảo vệ tại `src/proxy.ts` và layout admin. Khi bổ sung route quản trị, phải cập nhật matcher và tiếp tục kiểm tra session/quyền tại từng Server Action hoặc service truy cập dữ liệu. Ẩn menu hoặc redirect ở client không thay thế authorization phía server.

## Kiến trúc source

```text
src/
├── app/                         # App Router, layout, metadata và route composition
│   ├── (auth)/                  # Login và forgot-password
│   └── (admin)/                 # Các route quản trị được bảo vệ
├── components/
│   ├── layout/                  # Khung ứng dụng và sidebar
│   ├── shared/                  # DataTable, form sheet, menu, badge, page layout
│   └── ui/                      # Primitive shadcn/ui dùng chung
├── constants/                   # Cấu hình dùng chung như navigation
├── features/                    # Module chia theo domain nghiệp vụ
│   ├── audios/
│   ├── auth/
│   ├── dashboard/
│   ├── languages/
│   ├── poi-contents/
│   ├── pois/
│   ├── profile/
│   ├── roles/
│   ├── settings/
│   └── users/
├── i18n/                        # Locale types và từ điển tiếng Việt
├── lib/                         # Helper dùng chung cấp ứng dụng
├── mocks/                       # Mock thực sự dùng chung giữa nhiều domain
├── styles/                      # Design tokens cho light/dark theme
├── types/                       # Contract của shared components và layout
└── proxy.ts                     # Bảo vệ các route quản trị
```

Alias `@/*` trỏ tới `src/*`.

Page và layout trong `src/app` phải mỏng: đọc route input, khai báo metadata, kiểm tra boundary cần thiết và compose component từ feature. State, dữ liệu mock, nghiệp vụ và UI riêng của domain phải nằm trong `src/features/<feature>`.

Quy ước đầy đủ khi phát triển feature nằm tại [src/features/README.md](src/features/README.md).

## Shared UI và design system

- `src/components/ui`: primitive shadcn/ui; không chứa dữ liệu hoặc quy tắc riêng của domain.
- `src/components/shared/DataTable.tsx`: tìm kiếm, lọc, phân trang và hiển thị bảng thống nhất.
- `src/components/shared/FeatureFormSheet.tsx`: sheet dùng chung cho chế độ create/view/edit.
- `src/components/shared/MoreMenu.tsx`: các thao tác theo từng hàng như copy, view, edit và delete.
- `src/components/shared/StatusBadge.tsx`: nền tảng cho badge trạng thái của từng feature.
- `src/components/shared/PageLayout.tsx`: bố cục thống nhất cho trang quản trị.

Màu sắc, typography và radius nằm trong `src/styles/tokens.css`, sau đó được ánh xạ thành utility trong `src/app/globals.css`. Không hard-code màu khi semantic token hiện có đã diễn tả đúng ý nghĩa. Component trạng thái riêng của feature phải kế thừa `StatusBadge` và chỉ ánh xạ domain status sang label/tone.

Thêm primitive shadcn/ui bằng:

```bash
npx shadcn@latest add <component>
```

Kiểm tra diff sau khi thêm để tránh công cụ ghi đè token hoặc convention hiện có.

## i18n và preferences

- Chuỗi tiếng Anh là key và fallback mặc định.
- Bản dịch tiếng Việt được quản lý tập trung trong `src/i18n/messages.ts`.
- Client component lấy `t` và `locale` qua `usePreferences()`.
- Ngày, giờ và số phải format bằng locale hiện tại.
- Khi chưa có lựa chọn được lưu, locale mặc định là tiếng Anh và theme đi theo hệ điều hành.
- Lựa chọn thủ công được lưu trong cookie và tiếp tục áp dụng sau đăng xuất/đăng nhập.
- Login không hiển thị bộ chọn theme hoặc ngôn ngữ.

## Dữ liệu mock và trạng thái domain

- Mock phải có type rõ ràng và nằm trong `mocks/` của feature sở hữu dữ liệu đó.
- Chỉ giữ mock cho feature chưa có API; role, region và POI category của các màn hình đã kết nối phải lấy từ backend.
- Enum-like status, label mapping, option metadata và default kỹ thuật nằm trong `constants/`.
- Giá trị domain giữ nguyên theo schema, ví dụ `PUBLISHED`, `ACTIVE`, `DISABLED`; label giao diện được ánh xạ riêng thành `Published`, `Active`, `Inactive`.
- Không coi mock state là persistence, authentication hoặc authorization production.

## Xác thực và giới hạn hiện tại

Credential được kiểm tra bởi MNR Backend. Login thành công giữ Access Token trong
cookie HttpOnly, SameSite=Lax; Forgot password chưa gửi email thật.

Trước khi nối dữ liệu thật cần:

1. Cấu hình `BACKEND_API_URL`, JWT backend và `AUTH_SECRET` riêng cho từng môi trường.
2. Bổ sung refresh-token rotation ở lớp web để tự cấp lại Access Token khi hết hạn.
3. Nối các feature còn dùng mock bằng adapter có validation tại boundary.
4. Kiểm tra authorization tại mỗi action/service được bảo vệ.
5. Không đưa secret hoặc token server vào biến có prefix `NEXT_PUBLIC_`.
6. Bổ sung test cho lỗi mạng, dữ liệu không hợp lệ, session hết hạn và phân quyền.

## Tài liệu liên quan

- [Quy ước phát triển feature](src/features/README.md)
- [App Router trong dự án](src/app/README.md)
- [Shared components](src/components/README.md)
- [Shared types](src/types/README.md)
- [Internationalization](src/i18n/README.md)
- [Design tokens](src/styles/README.md)
- [Frontend setup](docs/frontend-setup.md)
- [MANS frontend skill](docs/skills/mans-frontend/SKILL.md)

Trước khi sửa code, đọc `AGENTS.md`, tài liệu Next.js được cài trong `node_modules/next/dist/docs/` và MANS frontend skill. Nếu tiếp tục một công việc dở dang, đọc `docs/agent-handoff.md` trước khi thao tác.
