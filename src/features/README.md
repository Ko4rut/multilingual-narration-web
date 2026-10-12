# Quy ước phát triển feature

Thư mục `src/features` tổ chức source theo domain nghiệp vụ. Mỗi feature sở hữu model, trạng thái, dữ liệu mock, UI và luồng tương tác của chính nó. Mục tiêu là giữ page trong `src/app` mỏng, tránh component quá nhiều trách nhiệm và hạn chế phụ thuộc vòng giữa các domain.

Tài liệu này là quy ước áp dụng khi tạo mới hoặc chỉnh sửa feature trong MANS Admin.

## Danh sách feature hiện tại

| Feature        | Trách nhiệm chính                                            |
| -------------- | ------------------------------------------------------------ |
| `auth`         | Đăng nhập, đăng xuất, session và giao diện xác thực          |
| `dashboard`    | Số liệu tổng quan, biểu đồ và bộ lọc kỳ báo cáo              |
| `pois`         | POI, region, category, geofence và điều kiện active          |
| `poi-contents` | Nội dung thuyết minh, ngôn ngữ, version và workflow xuất bản |
| `audios`       | File audio, nguồn audio và metadata phát lại                 |
| `users`        | Tài khoản nhân viên và role được gán                         |
| `roles`        | Role, permission, management function và permission matrix   |
| `languages`    | Danh mục ngôn ngữ và trạng thái hỗ trợ                       |
| `settings`     | Preferences và cấu hình vận hành ứng dụng                    |
| `profile`      | Thông tin tài khoản hiện tại và đổi mật khẩu demo            |

Tên thư mục feature dùng kebab-case và nên là danh từ domain rõ nghĩa. Tên route không bắt buộc giống hoàn toàn tên feature; ví dụ route `/poi-content` compose feature `poi-contents`.

## Cấu trúc chuẩn

Chỉ tạo layer khi có code thực sự cần đặt trong layer đó.

```text
src/features/<feature>/
├── components/                 # JSX và binding event từ hook/props
├── constants/                  # Status, label mapping, options, cấu hình tĩnh
├── hooks/                      # React state, effect, handler và form coordination
├── mocks/                      # Bản ghi demo có type, mô phỏng bảng dữ liệu
├── services/                   # Data-access adapter và thao tác ngoài UI
├── types/                      # Domain model, component props và contracts
├── utils/                      # Hàm thuần: parse, format, validate, aggregate
├── actions.ts                  # Server Actions nếu feature có mutation phía server
└── <server-module>.ts          # Session hoặc server-only helper đặc thù, khi cần
```

Một feature nhỏ có thể dùng `types.ts`, `constants.ts` hoặc `utils.ts` ở root. Khi domain có nhiều model hoặc file bắt đầu khó đọc, dùng các thư mục số nhiều như `types/`, `constants/`, `utils/`. Không để type hoặc constant rải rác trong component/hook chỉ vì chúng đang được dùng ở một nơi.

## Trách nhiệm của từng layer

### `components/`

Component chịu trách nhiệm render giao diện từ props hoặc dữ liệu do hook cung cấp.

Được phép:

- Render JSX và chia UI thành các component tập trung.
- Gọi hook của feature hoặc hook dùng chung.
- Bind event đơn giản như `onClick`, `onSubmit`, `onCheckedChange` tới handler.
- Khai báo column có JSX cell renderer khi DataTable cần render component.
- Ánh xạ trạng thái sang component badge riêng của feature.

Không nên:

- Chứa dữ liệu mock hoặc business rule.
- Tự tính overview, phiên bản, ID, permission matrix hoặc điều kiện workflow.
- Trực tiếp format ngày lặp lại trong nhiều cell; đưa formatter vào `utils/`.
- Chứa request orchestration, persistence, authentication hoặc authorization.
- Khai báo domain interface/props ngay trong file component.

Quy ước code:

- Dùng function declaration cho component và JSX render callback.
- Không dùng ternary; dùng biến có tên và `if` rõ ràng.
- Tách prop dài và JSX phức tạp thành nhiều dòng.
- Component chỉ dùng trong một feature phải ở feature đó, không đưa lên shared quá sớm.

### `hooks/`

Hook điều phối hành vi phía client:

- React state, effect và memoization.
- Mở/đóng form sheet, chọn bản ghi và chuyển mode create/view/edit.
- Event handler cho create/update/delete/copy/filter.
- Gọi service hoặc Server Action.
- Kết hợp utility thuần với state hiện tại.
- Chuẩn bị dữ liệu hiển thị khi việc chuẩn bị phụ thuộc React state, locale hoặc context.

Hook không được trả JSX và không chứa server secret. Logic không cần React phải chuyển sang utility để có thể tái sử dụng và kiểm thử độc lập.

Tên file hook dùng kebab-case:

```text
use-users.ts
use-user-form-sheet.ts
use-poi-contents.ts
```

Tên hàm export dùng camelCase:

```ts
export function useUsers() {}
export function useUserFormSheet() {}
```

File trực tiếp sử dụng state, effect, context, browser API hoặc event handler phía client phải nằm trong client module graph. Chỉ thêm `"use client"` tại boundary cần thiết; không thêm vào utility hoặc mock thuần.

### `types/`

Types là contract của feature:

- Model tương ứng bảng hoặc response của domain.
- Union type được suy ra từ constant status.
- Props của component.
- Action state, form values, filter state và summary shape.

Quy ước:

- Dùng `import type` nếu import chỉ phục vụ TypeScript.
- Giữ tên field theo schema dữ liệu, hiện chủ yếu là `snake_case` như `created_at`, `role_id` và `content_status`.
- Không khai báo type domain trong component hoặc hook.
- Không chuyển type riêng của một domain lên `src/types`.
- Không tạo lại shared type đã tồn tại.
- Thêm JSDoc tiếng Việt trước mỗi type/interface để giải thích mục đích, không chỉ lặp lại tên.

Ví dụ:

```ts
import type { USER_STATUS } from "../constants/user.constants";

/** Tập giá trị trạng thái hợp lệ của tài khoản quản trị. */
export type ManagerUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

/** Bản ghi người dùng quản trị tuân theo bảng Management_Users. */
export interface ManagerUser {
  id: string;
  user_status: ManagerUserStatus;
  created_at: string;
}
```

### `constants/`

Constants chứa cấu hình tĩnh thuộc domain:

- Giá trị status dạng enum-like object.
- Mapping status sang label.
- Danh sách option được suy ra từ status.
- Default kỹ thuật, giới hạn hoặc cấu hình không phải bản ghi database.

Status phải tách domain value khỏi label hiển thị:

```ts
export const CONTENT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export const CONTENT_STATUS_LABELS = {
  [CONTENT_STATUS.DRAFT]: "Draft",
  [CONTENT_STATUS.PUBLISHED]: "Published",
} as const;
```

Không đổi giá trị domain chỉ để phù hợp label UI. Ví dụ database dùng `DISABLED` thì giữ `DISABLED`; badge có thể hiển thị `Inactive` thông qua mapping.

Không đặt dữ liệu đại diện cho bảng database trong constants. Languages, roles, regions, categories, permissions và management functions là mock records, dù dữ liệu demo hiện tại ít thay đổi.

### `mocks/`

Mocks mô phỏng dữ liệu từ backend hoặc bảng database:

- Mỗi file nên tương ứng một nhóm entity hoặc bảng rõ ràng.
- Mọi collection phải được gắn type của feature.
- Quan hệ nhiều-nhiều dùng mock mapping riêng nếu schema có bảng nối.
- ID tham chiếu phải tồn tại và dữ liệu phải thỏa business rule đang mô phỏng.
- Tên file dùng kebab-case và hậu tố `.mock.ts`.

Ví dụ:

```text
mocks/
├── pois.mock.ts
├── regions.mock.ts
├── poi-categories.mock.ts
└── poi-category-mappings.mock.ts
```

Feature tự sở hữu mock tham chiếu mà UI của nó cần khi mục tiêu là giữ feature độc lập. Ví dụ `poi-contents` có `languages.mock.ts` và `poi.mock.ts` riêng. Chỉ import mock từ feature khác khi đang thực thi business rule xuyên domain có chủ đích, chẳng hạn kiểm tra content/audio để quyết định POI có được active.

Mock không phải persistence hoặc security boundary. Không thêm API/database thật nếu yêu cầu chỉ là giao diện mock.

### `utils/`

Utility là hàm thuần hoặc helper không cần React:

- Đọc và chuẩn hóa `FormData`.
- Parse query/status.
- Sinh ID từ input được truyền vào.
- Format ngày, giờ, số và tọa độ.
- Tính summary, version hoặc dữ liệu Permission Matrix.
- Kiểm tra validation và business invariant.
- Chuyển mock records thành filter/form options.

Quy ước:

- Không gọi `setState`, hook React hoặc browser API trong utility.
- Không phụ thuộc thời gian ngầm nếu có thể truyền `Date` vào hàm; cách này giúp hành vi xác định và dễ test.
- Formatter ngày/số phải nhận `locale`, không tự đoán locale.
- Dùng function declaration, tên hàm mô tả kết quả hoặc câu hỏi domain.
- Thêm JSDoc tiếng Việt trước mỗi utility function.
- Private helper trong file utility cũng cần tên rõ nghĩa và chú thích nếu thể hiện một quy tắc nghiệp vụ.

Ví dụ:

```ts
/** Định dạng timestamp theo locale hoặc trả về dấu gạch khi chưa có dữ liệu. */
export function formatTimestamp(value: string | null, locale: Locale) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString(locale);
}
```

Không chuyển mọi callback nhỏ sang utility. Callback chỉ dùng để render JSX ở một column nên ở component; callback cập nhật React state nên ở hook.

### `services/`

Service là adapter truy cập dữ liệu hoặc thao tác ngoài UI:

- Đọc/ghi API hoặc database thông qua boundary được cho phép.
- Chuyển response bên ngoài về contract nội bộ.
- Xử lý lỗi truy cập dữ liệu có cấu trúc.
- Kiểm tra authentication/authorization trước dữ liệu được bảo vệ.

Component không gọi trực tiếp backend. Hook gọi service phía client khi phù hợp; Server Component hoặc Server Action gọi service phía server.

Trong giai đoạn mock, service có thể trả mock data nhưng phải mô tả đúng đây là demo adapter.

### `actions.ts` và server modules

Server Action dùng cho mutation phía server, validation và session changes. Luôn xác thực lại credential/quyền tại server boundary; không tin trạng thái client.

Không import module chứa secret, `node:crypto`, filesystem hoặc server-only API vào client hook/component. Nếu một module chỉ chạy server, tên và vị trí phải làm trách nhiệm đó rõ ràng.

## Quy tắc phụ thuộc

Hướng phụ thuộc mong muốn:

```text
app page/layout
      ↓
feature components → feature hooks → feature services/actions
      ↓                    ↓
shared components      feature utils
      ↓                    ↓
shared types          feature types/constants/mocks
```

Các nguyên tắc bắt buộc:

1. `src/components/shared` và `src/components/ui` không import từ `src/features`.
2. Feature ưu tiên import type, constant, mock và utility của chính nó.
3. Không tạo phụ thuộc vòng giữa hai feature.
4. Quy tắc xuyên domain phải có một owner rõ ràng và được gọi qua API nhỏ, có tên.
5. Không import sâu vào file nội bộ chỉ để dùng một giá trị có thể được truyền qua props.
6. Chỉ đưa code lên shared khi có ít nhất hai consumer thực sự và API không chứa khái niệm domain.

## DataTable

Feature có bảng quản trị phải ưu tiên `@/components/shared/DataTable`.

Thông thường một table gồm:

- `DataTable` điều phối dữ liệu, column, filter và page size.
- `DataTableSearch` cho tìm kiếm toàn bảng.
- `DataTableFilters` cho status/reference filters.
- `DataTableContent` hiển thị rows và empty state.
- `DataTablePagination` điều khiển phân trang.
- `MoreMenu` cho các thao tác trên từng hàng.

Quy ước:

- `getRowId` phải trả ID ổn định của bản ghi.
- `searchValue` phải bao gồm các field người dùng thực sự cần tìm.
- Filter tham chiếu nhiều dữ liệu có thể dùng searchable combobox.
- Option có thể có `description` để hiển thị mã ở dòng dưới tên.
- Không hiển thị field kỹ thuật không có giá trị vận hành, ví dụ checksum, nếu yêu cầu sản phẩm không cần.
- Chuẩn bị option/lookup lặp lại trong utility hoặc hook, không chôn trong JSX.

## Form sheet

Form create/view/edit ưu tiên `FeatureFormSheet` và các field dùng chung.

- Hook sở hữu `open`, `mode`, selected entity, feedback và submit handler.
- Component form nhận dữ liệu và handler qua props.
- Create phải áp dụng default domain hợp lệ.
- View không cho chỉnh sửa; nút Edit chuyển mode qua hook.
- Validation nghiệp vụ phải thực hiện trước khi cập nhật state hoặc gọi service.
- Combobox tham chiếu dùng mock/table tương ứng, không hard-code option trong JSX.

## Status badge

Mỗi feature có thể có wrapper badge riêng nhưng phải kế thừa `StatusBadge`:

```text
Domain status → label mapping → semantic tone → StatusBadge
```

Không lặp lại markup badge hoặc hard-code màu riêng trong từng table. Dùng token semantic như `success`, `warning`, `destructive`, `info` và các utility đã được khai báo.

## Business invariants

Quy tắc nghiệp vụ không được chỉ thể hiện bằng việc disable/hide control. Phải kiểm tra lại trong handler, action hoặc service thực hiện mutation.

Các invariant đang có:

- POI cần content tiếng Anh `PUBLISHED` và audio hợp lệ trước khi chuyển `ACTIVE`.
- Không được xóa content nếu thao tác đó làm một POI đang active mất điều kiện kích hoạt.
- Sửa content đã `PUBLISHED` hoặc `ARCHIVED` tạo version draft mới thay vì ghi đè bản cũ.
- Role name phải duy nhất trong dữ liệu hiện tại.
- POI QR code và location phải duy nhất trong dữ liệu hiện tại.

Đặt phép kiểm tra thuần trong utility; hook/action quyết định feedback và thay đổi state.

## i18n, ngày giờ và số

- Lấy `t` và `locale` từ `usePreferences()` trong client feature.
- Chuỗi tiếng Anh là key/fallback; thêm bản dịch tiếng Việt tại `src/i18n/messages.ts`.
- Không tạo từ điển riêng trong feature.
- Truyền `locale` vào formatter utility.
- Dùng `toLocaleString(locale)`, `Intl.NumberFormat` hoặc formatter tập trung.
- Không format cùng một field theo nhiều cách trong cùng feature nếu không có lý do sản phẩm.

## Styling và accessibility

- Dùng semantic token từ `src/styles/tokens.css` và utility trong `globals.css`.
- Không hard-code màu nếu token hiện có đáp ứng ý nghĩa.
- Kiểm tra cả light và dark theme.
- Control icon-only phải có accessible label hoặc nội dung `sr-only`.
- Table, form, combobox, switch và menu phải dùng primitive hiện có để giữ keyboard behavior.
- Animation phải tôn trọng `prefers-reduced-motion`.
- Trạng thái không được truyền đạt chỉ bằng màu sắc; badge cần label, switch cần accessible name.

## Quy ước đặt tên và code style

- Folder và file thông thường: kebab-case.
- React component và interface/type chính: PascalCase.
- Function, hook và biến: camelCase.
- Constants: `UPPER_SNAKE_CASE`.
- Mock collection: tiền tố `MOCK_`.
- Dùng `readonly` cho collection đầu vào không bị thay đổi.
- Dùng function declaration cho component, hook, utility và JSX callback.
- Tránh ternary; dùng `if` và biến trung gian có tên.
- Ưu tiên early return để giảm nesting.
- Dùng alias `@/*` cho import xuyên khu vực; dùng relative import trong cùng feature.

## Khi nào đưa code lên shared?

Đưa component/type/helper lên shared khi tất cả điều kiện sau đúng:

1. Có từ hai feature sử dụng thực tế.
2. API không nhắc tới entity riêng như POI, role hoặc user.
3. Component không import mock, constant hoặc type domain.
4. Hành vi và accessibility có thể được mô tả độc lập.

Nếu chưa đủ điều kiện, giữ code trong feature. Trùng một đoạn nhỏ thường ít rủi ro hơn một shared abstraction phụ thuộc domain.

## Quy trình tạo feature mới

1. Xác định owner của domain và các bảng dữ liệu liên quan.
2. Tạo model/props trong `types/` và thêm JSDoc tiếng Việt.
3. Tạo status/default trong `constants/`; tạo bản ghi demo trong `mocks/`.
4. Viết utility thuần cho parse, format, aggregate và invariant.
5. Viết hook cho state, effects và event handlers.
6. Viết component chỉ render từ props/hook.
7. Compose feature trong một page mỏng ở `src/app`.
8. Thêm route admin vào `src/proxy.ts` nếu cần bảo vệ.
9. Thêm chuỗi tiếng Việt vào `src/i18n/messages.ts`.
10. Kiểm tra responsive, keyboard, light/dark theme và empty/error states.
11. Chạy lint, typecheck, build và behavior checks phù hợp.

## Checklist review feature

- [ ] Page/layout không chứa state, mock hoặc nghiệp vụ của feature.
- [ ] Component không chứa business rule hoặc data mutation.
- [ ] Hook không trả JSX và không chứa server secret.
- [ ] Logic thuần tái sử dụng được đã nằm trong `utils/`.
- [ ] Domain model và props nằm trong `types/`, có chú thích tiếng Việt.
- [ ] Status và label mapping nằm trong `constants/`.
- [ ] Dữ liệu đại diện bảng database nằm trong `mocks/`, không nằm trong constants.
- [ ] Mock có type và reference ID hợp lệ.
- [ ] Không có phụ thuộc vòng hoặc shared layer import ngược feature.
- [ ] Status badge kế thừa `StatusBadge`.
- [ ] Bảng và form tái sử dụng shared component phù hợp.
- [ ] Chuỗi mới có bản dịch và formatter nhận locale.
- [ ] Màu dùng semantic token; giao diện hoạt động ở light/dark theme.
- [ ] Business invariant được kiểm tra tại mutation boundary.
- [ ] `npm run lint`, `npm run typecheck` và `npm run build` thành công.

## Các anti-pattern cần tránh

- Đặt `MOCK_USERS`, `MOCK_LANGUAGES` hoặc dữ liệu bảng trong component.
- Đặt status records trong `mocks/` thay vì constants hoặc ngược lại đặt entity records trong constants.
- Khai báo `interface Props` cục bộ trong mỗi component khi feature đã có `types/`.
- Lặp `new Date(value).toLocaleString(locale)` ở nhiều component thay vì formatter utility.
- Tự dựng table, badge, sheet hoặc menu mới khi shared component đã đáp ứng.
- Import feature vào `components/shared`.
- Dùng `use client` cho file chỉ chứa constant, type, mock hoặc utility thuần.
- Cho phép UI vượt business rule chỉ vì control đang bị ẩn hoặc disable.
- Nối API/database hoặc lưu localStorage khi yêu cầu chỉ định dữ liệu mock.
- Xem dữ liệu mock hoặc role trên client là authorization production.

Khi quy ước trong tài liệu này chưa bao phủ một tình huống, ưu tiên ranh giới trách nhiệm rõ ràng, dependency một chiều và giải pháp nhỏ nhất đáp ứng đúng nghiệp vụ.
