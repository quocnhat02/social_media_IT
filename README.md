# Social Media IT

Dự án Social Media IT là một nền tảng mạng xã hội với các tính năng hiện đại, bao gồm cả frontend (client) và backend (server).

## Giới thiệu

- **Client**: Được xây dựng bằng ReactJS, giao diện hiện đại, hỗ trợ responsive.
- **Server**: Sử dụng Node.js và Express, kết nối với cơ sở dữ liệu để xử lý logic nghiệp vụ và API.

## Các chức năng chính

### Client (Frontend)

- Đăng ký, đăng nhập, quên mật khẩu, đặt lại mật khẩu
- Trang chủ hiển thị bài viết, thông báo, bạn bè
- Đăng bài viết, bình luận, thích bài viết
- Quản lý bạn bè, gửi và nhận lời mời kết bạn
- Chat trực tuyến, nhắn tin cá nhân và nhóm
- Thông báo thời gian thực
- Trang cá nhân, chỉnh sửa thông tin cá nhân
- Làm quiz/trắc nghiệm, xem kết quả

### Server (Backend)

- Xác thực người dùng (JWT, middleware bảo vệ route)
- Quản lý người dùng, bài viết, bình luận, bạn bè
- Xử lý chat, tin nhắn, nhóm chat
- Quản lý thông báo
- Quản lý quiz, câu hỏi, bài làm
- Gửi email xác thực, quên mật khẩu

## Cấu trúc thư mục

- `client/`: Mã nguồn frontend (ReactJS)
- `server/`: Mã nguồn backend (Node.js, Express)

## Hướng dẫn cài đặt

Vui lòng xem README trong từng thư mục `client/` và `server/` để biết chi tiết cách cài đặt và chạy từng phần.
