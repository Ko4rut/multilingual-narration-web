# Shared types

Thư mục `src/types` chứa contract dùng chung cho shared layer.

## Cách tổ chức

```text
types/
├── components.ts # Props của shared composed components
├── data-table.ts # Contract DataTable và hook liên quan
├── layout.ts     # Props của application layout
└── sidebar.ts    # Contract navigation/sidebar
```

## Quy ước

- Dùng `import type` khi import chỉ phục vụ TypeScript.
- Type riêng của domain phải nằm trong `src/features/<feature>/types`.
- Không tạo type trùng nhau giữa shared và feature.
