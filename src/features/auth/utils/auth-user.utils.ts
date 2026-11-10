/** Tạo tối đa hai chữ cái đại diện từ họ tên để hiển thị avatar. */
export function getUserInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.slice(-2).map(function getInitial(part) {
    return part.charAt(0).toUpperCase();
  }).join("");
}
