# App Router

Thư mục `src/app` quản lý routing, layout và metadata bằng Next.js App Router.

## Cách tổ chức

```text
app/
├── (auth)/       # Route công khai: login, forgot-password
├── (admin)/      # Route quản trị yêu cầu phiên đăng nhập
├── layout.tsx    # Root layout, metadata và preferences provider
├── page.tsx      # Redirect route gốc
├── not-found.tsx # Trang 404 toàn ứng dụng
└── globals.css   # Tailwind và global utilities
```

Route group trong ngoặc chỉ dùng để chia sẻ layout và không xuất hiện trong URL. Mỗi route con nên có `page.tsx` mỏng, chỉ đọc route input, khai báo metadata và compose feature component.

## Quy ước

- Không đặt mock data, state UI hoặc nghiệp vụ trực tiếp trong page.
- Parse `params` và `searchParams` bằng utility có kiểu của feature.
- Route quản trị phải nằm dưới `(admin)` và vẫn kiểm tra quyền tại action/service.
- Các file đặc biệt như `loading.tsx`, `error.tsx` và `not-found.tsx` chỉ xử lý trạng thái route.
