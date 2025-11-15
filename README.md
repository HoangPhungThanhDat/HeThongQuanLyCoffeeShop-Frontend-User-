# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# ☕ COFFEE SHOP MANAGEMENT SYSTEM - Frontend

## 📋 Giới thiệu

**Coffee Shop Management System** là hệ thống quản lý cửa hàng cà phê toàn diện, được xây dựng theo kiến trúc **Microservices** với **Java Spring Boot** backend và **ReactJS** frontend. Hệ thống hỗ trợ 3 vai trò chính: **Admin**, **Nhân viên** và **Khách hàng**, mang đến trải nghiệm quản lý và đặt hàng hiện đại, thời gian thực.

---

## 💳 Tích hợp thanh toán Online

### 3 Phương thức thanh toán

#### 💵 **Tiền mặt**
- Thanh toán trực tiếp cho nhân viên
- Xác nhận thanh toán qua hệ thống

#### 📱 **MoMo QR Code**
- Tạo mã QR thanh toán động
- Hiển thị QR code cho khách quét
- Tự động kiểm tra trạng thái thanh toán (polling mỗi 3s)
- Chuyển hướng sau khi thanh toán thành công

#### 💳 **VNPay Gateway**
- Hỗ trợ thẻ ATM, Visa, MasterCard
- Redirect đến cổng thanh toán VNPay
- Xử lý callback và verify chữ ký
- Bảo mật cao với hash secret

### Payment Flow
1. Khách hàng chọn phương thức thanh toán
2. Frontend gọi API tạo giao dịch
3. Backend tạo payment request (MoMo/VNPay)
4. Hiển thị QR hoặc redirect đến payment gateway
5. Kiểm tra trạng thái thanh toán
6. Cập nhật đơn hàng và tạo hóa đơn

### Environment Variables
```env
# MoMo
REACT_APP_MOMO_PARTNER_CODE
REACT_APP_MOMO_ACCESS_KEY
REACT_APP_MOMO_SECRET_KEY
REACT_APP_MOMO_REDIRECT_URL

# VNPay
REACT_APP_VNPAY_TMN_CODE
REACT_APP_VNPAY_HASH_SECRET
REACT_APP_VNPAY_URL
REACT_APP_VNPAY_RETURN_URL
```

--- CẤU TRÚC DỰ ÁN ---
# File Tree: Frontend(Users)

**Generated:** 11/12/2025, 8:00:08 PM
**Root Path:** `h:\HỆ THỐNG QUẢN LÝ COFFEE SHOP\Frontend(Users)\Frontend(Users)`

```
├── 📁 public
│   ├── 📁 sounds
│   │   └── 🎵 cart-add.wav
│   ├── 📄 favicon.ico
│   ├── 🖼️ iconcoffee.png
│   ├── 🌐 index.html
│   ├── 🖼️ logo192.png
│   ├── 🖼️ logo512.png
│   ├── ⚙️ manifest.json
│   └── 📄 robots.txt
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 axiosClient.js
│   │   ├── 📄 billApi.js
│   │   ├── 📄 categoryApi.js
│   │   ├── 📄 orderApi.js
│   │   ├── 📄 orderitemApi.js
│   │   ├── 📄 productApi.js
│   │   └── 📄 tableApi.js
│   ├── 📁 assets
│   │   ├── 📁 css
│   │   │   ├── 🎨 ChonBan.css
│   │   │   ├── 🎨 GioHang.css
│   │   │   ├── 🎨 MenuModal.css
│   │   │   ├── 🎨 MenuMon.css
│   │   │   ├── 🎨 TrangThaiDonHang.css
│   │   │   ├── 🎨 bootstrap-icons.css
│   │   │   ├── 🎨 loader.css
│   │   │   └── 🎨 tooplate-barista.css
│   │   ├── 📁 fonts
│   │   │   ├── 📄 bootstrap-icons.woff
│   │   │   └── 📄 bootstrap-icons.woff2
│   │   ├── 📁 images
│   │   │   ├── 📁 reviews
│   │   │   │   ├── 🖼️ senior-man-white-sweater-eyeglasses.jpg
│   │   │   │   ├── 🖼️ user.png
│   │   │   │   ├── 🖼️ young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair.jpg
│   │   │   │   └── 🖼️ young-woman-with-round-glasses-yellow-sweater.jpg
│   │   │   ├── 📁 slides
│   │   │   │   └── 🖼️ sincere-laugh-showing-picture-smartphone-casual-meeting-with-best-friends-restaurant-terrace.jpg
│   │   │   ├── 📁 team
│   │   │   │   ├── 🖼️ cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg
│   │   │   │   ├── 🖼️ portrait-elegant-old-man-wearing-suit.jpg
│   │   │   │   ├── 🖼️ small-business-owner-drinking-coffee.jpg
│   │   │   │   └── 🖼️ smiley-business-woman-working-cashier.jpg
│   │   │   ├── 🖼️ Hinhcaffe.png
│   │   │   ├── 🖼️ banner1.jpg
│   │   │   ├── 🖼️ banner2.jpg
│   │   │   ├── 🖼️ banner3.webp
│   │   │   ├── 🖼️ banner4.webp
│   │   │   ├── 🖼️ barman-with-fruits.jpg
│   │   │   ├── 🖼️ caffee1.jpg
│   │   │   ├── 🖼️ coffee-beans.png
│   │   │   ├── 🖼️ happy-loving-couple-bakers-drinking-coffee-looking-notebook.jpg
│   │   │   ├── 🖼️ happy-waitress-giving-coffee-customers-while-serving-them-coffee-shop.jpg
│   │   │   ├── 🖼️ hinhcafe2.webp
│   │   │   ├── 🖼️ mid-section-waitress-wiping-espresso-machine-with-napkin-cafa-c.jpg
│   │   │   └── 🖼️ young-female-barista-wear-face-mask-serving-take-away-hot-coffee-paper-cup-consumer-cafe.jpg
│   │   ├── 📁 js
│   │   │   ├── 📄 click-scroll.js
│   │   │   ├── 📄 custom.js
│   │   │   └── 📄 jquery.sticky.js
│   │   └── 📁 video
│   │       ├── 🎬 CoffeeShop.mp4
│   │       ├── 🎬 Download.mp4
│   │       └── 🎬 pexels-mike-jones-9046237.mp4
│   ├── 📁 components
│   ├── 📁 config
│   │   └── 📄 apiConfig.js
│   ├── 📁 constants
│   │   └── 📄 routes.js
│   ├── 📁 contexts
│   │   └── 📄 AuthContext.js
│   ├── 📁 hooks
│   ├── 📁 layouts
│   │   ├── 📄 Footer.js
│   │   ├── 📄 Header.js
│   │   └── 📄 Menu.js
│   ├── 📁 pages
│   │   ├── 📄 ChonBan.js
│   │   ├── 📄 DanhGia.js
│   │   ├── 📄 GioHang.js
│   │   ├── 📄 GioiThieu.js
│   │   ├── 📄 LienHe.js
│   │   ├── 📄 MenuModalForOrder.js
│   │   ├── 📄 MenuMon.js
│   │   ├── 📄 MoMoPaymentResult.js
│   │   ├── 📄 PaymentResult.js
│   │   ├── 📄 SanPhamMoiNhat.js
│   │   ├── 📄 ThucDon.js
│   │   └── 📄 TrangThaiDonHang.js
│   ├── 📁 routes
│   │   └── 📄 AppRoutes.jsx
│   ├── 📁 socket
│   ├── 📁 store
│   ├── 📁 styles
│   ├── 📁 utils
│   ├── 🎨 App.css
│   ├── 📄 App.js
│   ├── 📄 App.test.js
│   ├── 🎨 index.css
│   ├── 📄 index.js
│   ├── 🖼️ logo.svg
│   ├── 📄 reportWebVitals.js
│   ├── 📄 setupTests.js
│   └── 📄 socket.js
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ package-lock.json
└── ⚙️ package.json
```

---
*Generated by FileTree Pro Extension*

## 🎯 Tính năng chính

### 👨‍💼 Admin
- **Quản lý sản phẩm (CRUD)**: Thêm, xóa, sửa sản phẩm, danh mục, kèm ảnh
- **Quản lý khuyến mãi**: Tạo, áp dụng khuyến mãi cho sản phẩm/đơn hàng
- **Quản lý nhân viên**: CRUD thông tin nhân viên (bao gồm ảnh)
- **Xem báo cáo tổng quan**: Doanh thu, đơn hàng, hóa đơn

### 👨‍🍳 Nhân viên
- **Tìm kiếm, chọn sản phẩm**: Tạo/sửa đơn hàng nhanh chóng
- **Quản lý bàn**: Chọn bàn, cập nhật trạng thái bàn
- **Xem đơn hàng realtime**: Nhận đơn từ khách hàng qua **WebSocket**
- **Xử lý đơn hàng**: Xác nhận, chuẩn bị, hoàn thành, thanh toán
- **Xem/xuất hóa đơn**: In hóa đơn cho khách hàng
- **Lưu thông tin thanh toán**: Ghi nhận tiền mặt/chuyển khoản, liên kết với đơn hàng

### 👤 Khách hàng
- **Chọn sản phẩm từ menu**: Thêm món vào giỏ hàng
- **Gửi đơn hàng**: Sau khi gửi đơn, tự động chuyển sang trang theo dõi trạng thái
- **Theo dõi trạng thái đơn hàng realtime**: 
  - ✅ **Đã xác nhận** - Nhân viên đã nhận đơn
  - 🍳 **Đang chuẩn bị** - Đang chế biến món
  - ✨ **Đã sẵn sàng** - Món đã hoàn thành
  - 🍽️ **Đã phục vụ** - Món đã được mang ra
  - ✔️ **Hoàn thành** - Đơn hàng hoàn tất
- **Thêm món vào đơn hàng đang có**: Khách có thể order thêm món trong cùng đơn → Nhân viên nhận thông báo realtime
- **Gọi nhân viên**: Nút bấm gọi nhân viên hỗ trợ → Nhân viên nhận thông báo ngay lập tức
- **Thanh toán đa dạng** (3 hình thức):
  - 💵 **Tiền mặt** - Thanh toán trực tiếp
  - 📱 **MoMo QR** - Quét mã QR thanh toán
  - 💳 **VNPay** - Thanh toán qua cổng VNPay
- **Đồng bộ đơn hàng**: Cập nhật tức thì từ khách hàng đến nhân viên qua **WebSocket**

---

## 🏗️ Kiến trúc hệ thống

Hệ thống sử dụng kiến trúc **Frontend Monolithic** kết nối với **Backend Microservices**:

- **Frontend**: Single Page Application (SPA) ReactJS - build thành 1 bundle duy nhất
- **Backend**: Các microservices độc lập xây dựng bằng Spring Boot

### Sơ đồ kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────┐
│           FRONTEND - React SPA (Monolithic)             │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │  Admin   │  │  Staff   │  │     Customer       │    │
│  │Dashboard │  │   UI     │  │   (Menu, Order)    │    │
│  └──────────┘  └──────────┘  └────────────────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │
              HTTP REST API + WebSocket
                       │
┌──────────────────────▼──────────────────────────────────┐
│              API GATEWAY (Spring Cloud)                 │
│              - Routing, Load Balancing                  │
│              - Authentication (JWT)                     │
└──────────────────────┬──────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┬─────────────┐
       │               │               │             │
┌──────▼──────┐ ┌─────▼─────┐ ┌───────▼────┐ ┌─────▼─────┐
│  Categories │ │  Products │ │   Orders   │ │   Users   │
│   Service   │ │  Service  │ │  Service   │ │  Service  │
└─────────────┘ └───────────┘ └────────────┘ └───────────┘

┌─────────────┐ ┌─────────────┐ ┌──────────────┐ ┌────────┐
│ Promotions  │ │   Tables    │ │    Bills     │ │Payment │
│  Service    │ │   Service   │ │   Service    │ │Service │
└─────────────┘ └─────────────┘ └──────────────┘ └────────┘
        │               │                │             │
        └───────────────┴────────────────┴─────────────┘
                            │
                    ┌───────▼────────┐
                    │   MySQL / DB   │
                    └────────────────┘
```

### Backend Microservices chi tiết

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   categories    │    │    products     │    │   promotions    │
│   (Danh mục)    │───▶│   (Sản phẩm)    │◀───│  (Khuyến mãi)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     tables      │    │     orders      │    │   order_items   │
│     (Bàn)       │◀───│   (Đơn hàng)    │───▶│  (Chi tiết ĐH)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      users      │    │      bills      │    │   promotions    │
│   (Nhân viên)   │◀───│   (Hóa đơn)     │───▶│  (Khuyến mãi)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Các microservices chính:**
- **categories**: Quản lý danh mục sản phẩm
- **products**: Quản lý sản phẩm (tên, giá, ảnh, danh mục)
- **promotions**: Quản lý khuyến mãi
- **tables**: Quản lý bàn
- **orders**: Quản lý đơn hàng (trạng thái, bàn, thời gian)
- **order_items**: Chi tiết từng món trong đơn hàng
- **users**: Quản lý nhân viên/admin
- **bills**: Quản lý hóa đơn, thanh toán

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **ReactJS** (Create React App)
- **React Router v6** - Điều hướng trang
- **Axios** - Gọi API REST
- **Socket.IO Client** - Realtime đơn hàng, thông báo
- **Context API / React Hooks** - Quản lý state
- **Bootstrap 5** - Giao diện responsive
- **React Toastify** - Thông báo
- **QRCode.react** - Tạo mã QR cho MoMo
- **MoMo Payment Gateway** - Thanh toán MoMo QR
- **VNPay Payment Gateway** - Thanh toán VNPay
- **dotenv** - Quản lý biến môi trường

---

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Node.js**: >= 14.x
- **npm** hoặc **yarn**
- Backend microservices đã chạy

### Bước 1: Clone repository
```bash
git clone https://github.com/yourusername/coffee-shop-frontend.git
cd coffee-shop-frontend
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install

# Cài đặt thêm các package
npm install socket.io-client      # Socket.IO client
npm install qrcode.react          # QR Code cho MoMo
npm install crypto-js             # Hash cho VNPay
npm install react-toastify        # Notifications
```

### Bước 3: Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
REACT_APP_API_GATEWAY_URL=http://localhost:8080
REACT_APP_SOCKET_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=10000

# MoMo Payment
REACT_APP_MOMO_PARTNER_CODE=your_partner_code
REACT_APP_MOMO_ACCESS_KEY=your_access_key
REACT_APP_MOMO_SECRET_KEY=your_secret_key
REACT_APP_MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/callback

# VNPay Payment
REACT_APP_VNPAY_TMN_CODE=your_tmn_code
REACT_APP_VNPAY_HASH_SECRET=your_hash_secret
REACT_APP_VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
REACT_APP_VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/callback
```

### Bước 4: Chạy ứng dụng
```bash
npm start
# hoặc
yarn start
```

Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### Build production
```bash
npm run build
# hoặc
yarn build
```

---

## 🔌 Tích hợp Socket.IO & Realtime Features

### Kết nối Socket.IO
- Sử dụng **Socket.IO Client** để kết nối realtime với backend
- Tự động reconnect khi mất kết nối
- Quản lý rooms theo orderId và staff room

### Events chính

#### **Khách hàng:**
- ✅ Join room theo đơn hàng
- ✅ Nhận cập nhật trạng thái realtime (5 trạng thái)
- ✅ Gửi yêu cầu thêm món vào đơn đang có
- ✅ Emit event gọi nhân viên hỗ trợ

#### **Nhân viên:**
- ✅ Join staff room để nhận tất cả thông báo
- ✅ Nhận đơn hàng mới với âm thanh thông báo
- ✅ Nhận thông báo khi khách thêm món
- ✅ Nhận thông báo khi khách gọi nhân viên
- ✅ Cập nhật trạng thái đơn hàng cho khách

### Socket.IO Events
```
Client → Server:
├── joinOrderRoom(orderId)
├── joinStaffRoom()
├── addItemsToOrder({ orderId, items })
├── callStaff({ orderId, tableNumber })
└── updateOrderStatus({ orderId, status })

Server → Client:
├── newOrder(orderData)
├── orderStatusUpdated({ orderId, status })
├── itemsAdded({ orderId, newItems })
├── itemsAddedToOrder({ orderId, newItems })
└── staffCalled({ orderId, tableNumber })
```

---

## 🔐 Xác thực và phân quyền

### Authentication Flow
1. User đăng nhập → Backend trả về **JWT token**
2. Token được lưu vào **localStorage** hoặc **sessionStorage**
3. Mọi request gửi kèm token trong **Authorization header**
4. Frontend kiểm tra **role** để hiển thị UI tương ứng

### Phân quyền theo Role
- **Admin**: Truy cập tất cả chức năng quản trị
- **Staff**: Quản lý đơn hàng, bàn, thanh toán
- **Customer**: Menu, đặt món, theo dõi đơn hàng

### Protected Routes
- Sử dụng **PrivateRoute** component để bảo vệ các route
- Kiểm tra authentication và role trước khi render
- Tự động redirect về login nếu chưa xác thực
- Hiển thị 403 Unauthorized nếu không đủ quyền

---

## 📱 Giao diện chính

### Admin Dashboard
- Thống kê doanh thu, đơn hàng
- Quản lý sản phẩm, danh mục, khuyến mãi
- Quản lý nhân viên

### Staff Dashboard
- Danh sách đơn hàng realtime
- Quản lý bàn (trạng thái: trống/đang dùng)
- Tạo đơn hàng mới
- Xử lý thanh toán và xuất hóa đơn

### Customer Interface
- **Menu sản phẩm** theo danh mục với hình ảnh
- **Giỏ hàng** thêm/xóa/cập nhật số lượng
- **Gửi đơn hàng** → Tự động chuyển sang trang theo dõi
- **Theo dõi trạng thái realtime**: Xác nhận → Chuẩn bị → Sẵn sàng → Phục vụ → Hoàn thành
- **Thêm món** vào đơn hàng đang có
- **Gọi nhân viên** hỗ trợ (button)
- **Thanh toán đa dạng**:
  - 💵 Tiền mặt
  - 📱 MoMo QR Code
  - 💳 VNPay (ATM/Visa/MasterCard)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage
```

---

## 📦 Deployment

### Build Docker image
```bash
docker build -t coffee-shop-frontend .
docker run -p 3000:80 coffee-shop-frontend
```

### Deploy to Vercel/Netlify
```bash
npm run build
# Upload thư mục build/ lên platform
```

---

## 📄 License

Dự án này được phân phối dưới giấy phép **MIT License**.

---

## 👨‍💻 Tác giả

**Hoàng Đạt**  

---

## 📞 Liên hệ & Hỗ trợ

Nếu có bất kỳ câu hỏi hoặc vấn đề nào, vui lòng tạo **Issue** trên GitHub hoặc liên hệ qua email.

---

## 🙏 Cảm ơn

Cảm ơn đã sử dụng **Coffee Shop Management System**! ☕

---

### 📝 Changelog

#### Version 1.0.0 
- ✅ Hoàn thiện 3 giao diện: Admin, Staff, Customer
- ✅ Tích hợp WebSocket cho đơn hàng realtime
- ✅ Quản lý sản phẩm, khuyến mãi, bàn, nhân viên
- ✅ Theo dõi trạng thái đơn hàng realtime (5 trạng thái)
- ✅ Thêm món vào đơn hàng đang có
- ✅ Chức năng gọi nhân viên với thông báo realtime
- ✅ Thanh toán đa dạng:
  - 💵 Tiền mặt
  - 📱 MoMo QR Code
  - 💳 VNPay Gateway
- ✅ Xuất hóa đơn tự động
- ✅ Responsive design với Bootstrap 5