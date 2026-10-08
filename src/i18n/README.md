# Internationalization

Thư mục `src/i18n` chứa contract locale và từ điển dùng chung.

## Cách tổ chức

```text
i18n/
├── messages.ts # Từ điển tiếng Việt
└── types.ts    # Locale union dùng trong ứng dụng
```

Chuỗi tiếng Anh là key và fallback mặc định. Locale được đọc qua preferences context.

## Quy ước

- Thêm bản dịch tập trung trong `messages.ts`.
- Không tạo từ điển cục bộ rải rác trong component.
- Dùng locale đã chọn khi format ngày, giờ và số.
