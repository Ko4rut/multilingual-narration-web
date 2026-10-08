# Shared constants

Thư mục `src/constants` chứa cấu hình tĩnh được dùng bởi nhiều feature.

## Cách tổ chức

```text
constants/
├── components.ts # Giá trị mặc định cho shared components
└── navigation.ts # Cấu hình navigation cấp ứng dụng
```

## Quy ước

- Chỉ đặt giá trị bất biến và metadata tĩnh, không đặt state runtime.
- Constant riêng của domain phải nằm trong `src/features/<feature>/constants`.
- Dùng object `as const` khi cần suy ra union type từ domain values.
