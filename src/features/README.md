# Domain features

Thư mục `src/features` chia ứng dụng theo domain nghiệp vụ như auth, dashboard, audio, POI, languages và users.

## Cấu trúc feature chuẩn

```text
features/<feature>/
├── components/ # Render JSX và bind handler
├── constants/  # Domain constants và option metadata
├── hooks/      # State, effect, handler và chuẩn bị dữ liệu
├── mocks/      # Dữ liệu demo có kiểu
├── types/      # Model, props và contract
├── services/   # Adapter dữ liệu hoặc thao tác ngoài UI, khi cần
└── utils/      # Hàm thuần, parser hoặc formatter, khi cần
```

Chỉ tạo layer khi feature thực sự có code cho layer đó. Server Action có thể đặt tại root của feature khi thực hiện mutation phía server.

## Quy ước

- Component không giữ orchestration logic; hook không trả JSX.
- File hook dùng kebab-case `use-<domain-action>.ts`, hàm export giữ camelCase.
- Mock không được xem là persistence hoặc authorization production.
- Type và constant riêng của domain không đưa lên shared.
- Không tạo phụ thuộc vòng giữa các feature.
