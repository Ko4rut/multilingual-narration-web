# Shared library helpers

Thư mục `src/lib` chứa helper kỹ thuật nhỏ và không phụ thuộc domain.

## Cách tổ chức

```text
lib/
└── utils.ts # Helper `cn` để kết hợp Tailwind class
```

## Quy ước

- Chỉ đưa helper lên `lib` khi được dùng ở nhiều feature.
- Không đặt React state, request nghiệp vụ hoặc domain constants tại đây.
- Utility riêng của feature phải ở feature tương ứng.
