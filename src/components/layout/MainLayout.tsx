import { SidebarProvider } from "@/components/ui/sidebar";
import type { MainLayoutProps } from "@/types/layout";
import { MobileSidebarTrigger, Sidebar } from "./Sidebar";

/* Dựng shell dùng chung cho toàn bộ khu vực quản trị.*/
export default function MainLayout({ children }: MainLayoutProps) {
  // Cung cấp trạng thái đóng/mở Sidebar cho tất cả component nằm bên trong.
  return (
    <SidebarProvider>
      {/* Cho phép người dùng bàn phím bỏ qua Sidebar và đi thẳng tới nội dung chính. */}
      <a className="skip-link" href="#main-content"> Skip to content </a>

      {/* Hiển thị thương hiệu, các nhóm điều hướng và menu tài khoản. */}
      <Sidebar />

      {/* Vùng nội dung chính; id này là đích đến của liên kết "Skip to content". */}
      <main id="main-content" className="main-content">
        {/* Nút đóng/mở Sidebar trên màn hình nhỏ. */}
        <MobileSidebarTrigger />

        {/* Hiển thị nội dung của route đang được truy cập. */}
        {children}
      </main>
    </SidebarProvider>
  );
}
