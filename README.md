# 📁 Node.js – Kiểm tra dung lượng tất cả thư mục con

Script này dùng để quét một thư mục cha, tính tổng dung lượng (đệ quy) của từng thư mục con trực tiếp bên trong, sau đó in ra danh sách kèm dung lượng đã được định dạng (B, KB, MB, GB, TB) và sắp xếp theo thứ tự giảm dần (thư mục lớn nhất ở đầu).

## 🎯 Công dụng

- Giúp bạn nhanh chóng xác định thư mục con nào chiếm nhiều dung lượng nhất.
- Hữu ích khi dọn dẹp ổ đĩa, kiểm tra dung lượng lưu trữ của các dự án, thư mục logs, cache, node_modules, v.v.
- Xử lý an toàn: bỏ qua symbolic link, không theo đường dẫn vòng, không bị lỗi dừng nếu không đọc được một vài thư mục.

## 🧰 Môi trường cần thiết

- **Node.js** phiên bản 10.0 trở lên (vì sử dụng `fs.promises` và các tính năng ES6+).
- Hệ điều hành: Windows, macOS, Linux đều được (chỉ phụ thuộc vào Node.js).

## 📥 Cài đặt

1. Tạo một file mới, ví dụ `folder-sizes.js`.
2. Copy toàn bộ mã nguồn script (đã cung cấp ở trên) vào file đó.
3. (Tùy chọn) Cấp quyền thực thi nếu chạy trên Linux/macOS:
   ```bash
   chmod +x folder-sizes.js