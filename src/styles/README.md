# Design tokens

Thư mục `src/styles` quản lý nền tảng giao diện dùng chung.

## Cách tổ chức

```text
styles/
└── tokens.css # Color, typography, radius và theme tokens
```

Các token được import tại root layout và ánh xạ thành Tailwind utilities trong `src/app/globals.css`.

## Quy ước

- Ưu tiên semantic token thay vì hard-code màu trong component.
- Mọi token màu phải hỗ trợ light và dark theme.
- Tránh khai báo lặp font, radius hoặc type scale trong từng feature.
