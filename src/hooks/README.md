# Shared hooks

Thư mục `src/hooks` chứa custom hook kỹ thuật được dùng bởi nhiều feature.

## Cách tổ chức

```text
hooks/
├── use-data-table.ts          # Search, filter và pagination state
├── use-mobile.ts              # Theo dõi mobile viewport
└── use-sidebar-navigation.ts  # Navigation state dùng chung
```

## Quy ước

- Tên file dùng kebab-case dạng `use-<domain-action>.ts`.
- Tên hàm export vẫn dùng camelCase theo React convention.
- Hook không trả JSX và không chứa logic riêng của một feature.
- Hook chuyên biệt phải đặt trong `src/features/<feature>/hooks`.
