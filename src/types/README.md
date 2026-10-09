# Shared types

Thư mục `src/types` chứa contract dùng chung cho shared layer.

## Cách tổ chức

```text
types/
├── layout/
│   ├── main-layout.types.ts # Contract của layout quản trị
│   └── sidebar.types.ts     # Điều hướng và tài khoản trong sidebar
└── shared/
    ├── data-table.types.ts          # DataTable và hook liên quan
    ├── feature-form.types.ts        # Form sheet, field và combobox
    ├── module-placeholder.types.ts  # Placeholder cho module
    ├── more-menu.types.ts           # Các hành động của MoreMenu
    ├── page-layout.types.ts         # PageLayout và các vùng nội dung
    └── status-badge.types.ts        # Tone và props của StatusBadge
```

## Quy ước

- Dùng `import type` khi import chỉ phục vụ TypeScript.
- Type riêng của domain phải nằm trong `src/features/<feature>/types`.
- Không tạo type trùng nhau giữa shared và feature.
