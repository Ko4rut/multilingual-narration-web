# External services

Thư mục `src/service` là tầng kết nối ứng dụng với các dịch vụ bên ngoài như REST API và WebSocket.

## Cấu trúc hiện tại

```text
src/service/
├── api.ts
└── websocket.ts
```

## Trách nhiệm

- `api.ts`: cấu hình Axios client, Bearer header, base URL, timeout và xử lý lỗi dùng chung.
- API nghiệp vụ nằm cùng feature tại `src/features/<feature>/api/<feature>.api.ts`.
- `websocket.ts`: cấu hình và quản lý vòng đời kết nối WebSocket.

`service/api.ts` chỉ sở hữu primitive HTTP dùng chung. `auth/api/auth.api.ts` và
`users/api/users.api.ts` sở hữu endpoint của feature tương ứng; chúng chạy qua
Server Action hoặc server-only helper để Bearer token không vào client bundle.

## Quy tắc

1. Chỉ đặt cấu hình kết nối và primitive giao tiếp dùng chung tại đây.
2. Hàm gọi endpoint nghiệp vụ phải nằm trong feature `api/<feature>.api.ts`; hook,
   component và Server Action không gọi Axios trực tiếp.
3. Base URL và thông tin môi trường phải lấy từ biến môi trường của Next.js; chỉ biến an toàn cho client mới dùng prefix `NEXT_PUBLIC_`.
4. Không hard-code token, mật khẩu hoặc thông tin nhạy cảm trong mã nguồn.
5. Kết nối WebSocket phải có cơ chế cleanup, xử lý reconnect và tránh đăng ký listener trùng lặp.
6. Chuẩn hóa lỗi tại tầng service để feature không phụ thuộc trực tiếp vào cấu trúc lỗi của thư viện transport.
