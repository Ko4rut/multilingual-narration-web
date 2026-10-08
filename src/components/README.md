# Shared components

Thư mục `src/components` chứa component dùng lại giữa nhiều feature.

## Cách tổ chức

```text
components/
├── layout/  # Khung ứng dụng như MainLayout và Sidebar
├── shared/  # Component ghép như PageLayout, DataTable, MoreMenu
└── ui/      # Primitive shadcn/ui và Radix
```

Component chỉ dùng trong một domain phải đặt tại `src/features/<feature>/components`, không đưa lên shared sớm.

## Quy ước

- `ui/` giữ API gần với shadcn/ui và dùng semantic design tokens.
- `shared/` cung cấp API qua props hoặc composition, không chứa mock/domain data.
- `layout/` chỉ điều phối bố cục cấp ứng dụng.
- Shared component không được import ngược từ `src/features`.
