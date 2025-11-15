

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../socket";
import OrderAPI from "../api/orderApi";
import OrderItemAPI from "../api/orderitemApi";
import TableAPI from "../api/tableApi";
import ProductAPI from "../api/productApi";
import BillAPI from "../api/billApi";
import $ from "jquery";

// Import CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "../assets/css/GioHang.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

window.jQuery = window.$ = $;

const GioHang = () => {
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleQtyChange = (index, newQty) => {
    const updatedCart = [...cart];
    updatedCart[index].qty = parseInt(newQty) || 1;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Xóa toàn bộ giỏ hàng?",
      text: "Bạn chắc chắn muốn xóa hết các món đã chọn?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5c4033",
      cancelButtonColor: "#a1887f",
      confirmButtonText: "Có, xóa hết!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setCart([]);
        setOrderNotes("");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        Swal.fire("Đã xóa!", "Giỏ hàng của bạn hiện trống.", "success");
      }
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire("Giỏ hàng trống!", "Vui lòng chọn món trước khi đặt hàng.", "warning");
      return;
    }

    const selectedTable = JSON.parse(localStorage.getItem("selectedTable"));
    if (!selectedTable || !selectedTable.id) {
      Swal.fire({
        title: "Chưa chọn bàn!",
        text: "Vui lòng chọn bàn trước khi đặt hàng.",
        icon: "warning",
        confirmButtonColor: "#5c4033",
      });
      navigate("/chon-ban");
      return;
    }

    const orderData = {
      table: { id: selectedTable.id },
      totalAmount: total,
      status: "PENDING",
      notes: orderNotes.trim() || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1️⃣ Tạo đơn hàng
      console.log("🔄 Đang tạo đơn hàng...");
      const response = await OrderAPI.create(orderData);
      const createdOrder = response.data || response;
      console.log("✅ Tạo đơn hàng thành công - ID:", createdOrder.id);

      // 2️⃣ Tạo chi tiết đơn hàng
      console.log("🔄 Đang tạo chi tiết đơn hàng...");
      const orderItemsData = cart.map((item) => ({
        order: { id: createdOrder.id },
        product: { id: item.id },
        quantity: item.qty,
        price: item.price,
        subtotal: item.price * item.qty,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      for (const itemData of orderItemsData) {
        await OrderItemAPI.create(itemData);
      }
      console.log("✅ Tạo chi tiết đơn hàng thành công");

      // 3️⃣ TẠO HÓA ĐƠN (BILL) TỰ ĐỘNG
      console.log("🔄 Đang tạo hóa đơn...");
      
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      
      const vietnamDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      
      const billData = {
        order: { id: createdOrder.id },
        totalAmount: total,
        paymentMethod: "CASH", 
        paymentStatus: "PENDING",
        notes: orderNotes.trim() 
          ? `Ghi chú: ${orderNotes.trim()}. Bàn số ${selectedTable.tableNumber}` 
          : `Khách đặt hàng tại bàn số ${selectedTable.tableNumber}`,
        issuedAt: vietnamDateTime,
      };
      
      console.log("📅 Thời gian tạo hóa đơn:", currentDate.toLocaleString('vi-VN'));
      console.log("📤 issuedAt gửi đi:", vietnamDateTime);

      const billResponse = await BillAPI.create(billData);
      console.log("✅ Tạo hóa đơn thành công - Bill ID:", billResponse.data?.id || billResponse.id);

      // 4️⃣ Cập nhật trạng thái bàn thành "RESERVED"
      console.log("🔄 Đang cập nhật trạng thái bàn...");
      await TableAPI.updateStatus(selectedTable.id, "RESERVED");
      console.log("✅ Cập nhật bàn thành RESERVED");

      // 5️⃣ Giảm số lượng tồn kho từng sản phẩm
      console.log("🔄 Đang giảm tồn kho sản phẩm...");
      for (const item of cart) {
        try {
          await ProductAPI.updateStock(item.id, item.qty);
          console.log(`✅ Giảm tồn kho cho ${item.name}: -${item.qty}`);
        } catch (err) {
          console.warn(`⚠️ Sản phẩm ${item.name} tồn kho không đủ hoặc lỗi:`, err);
        }
      }

      // 6️⃣ Gửi dữ liệu realtime qua Socket.IO
      console.log("🔄 Đang gửi thông báo realtime...");
      socket.emit("order-submitted", {
        tableNumber: selectedTable.tableNumber,
        orderTime: new Date().toLocaleString(),
        totalPrice: total,
        status: "PENDING",
        notes: orderNotes.trim() || "",
        items: cart.map((item) => ({
          productName: item.name,
          quantity: item.qty,
          price: item.price,
        })),
      });
      console.log("✅ Đã emit 'order-submitted' qua socket");

      // 7️⃣ LƯU THÔNG TIN ĐƠN HÀNG VÀO LOCALSTORAGE CHO TRANG TRACKING
      const orderTrackingData = {
        orderNumber: createdOrder.id,
        tableNumber: selectedTable.tableNumber,
        date: currentDate.toLocaleDateString('vi-VN'),
        time: currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        items: cart.map(item => ({
          name: item.name,
          quantity: item.qty,
          price: item.price,
          image: item.image || '☕'
        })),
        total: total,
        note: orderNotes.trim() || '',
        status: 'PENDING',
        estimatedTime: '15-20 phút',
        createdAt: vietnamDateTime
      };
      
      localStorage.setItem('currentOrder', JSON.stringify(orderTrackingData));
      console.log("✅ Đã lưu thông tin đơn hàng vào localStorage");

      // 8️⃣ Thông báo thành công
      Swal.fire({
        title: "☕ Gửi đơn hàng thành công!",
        html: `
          <b>Bàn:</b> ${selectedTable.tableNumber}<br/>
          <b>Mã đơn:</b> #${createdOrder.id}<br/>
          <b>Tổng tiền:</b> ${total.toLocaleString()} đ<br/>
          ${orderNotes.trim() ? `<b>Ghi chú:</b> ${orderNotes.trim()}<br/>` : ''}
          <small class="text-muted">Hóa đơn đã được tạo tự động</small>
        `,
        icon: "success",
        confirmButtonColor: "#5c4033",
        confirmButtonText: "Xem trạng thái đơn hàng"
      }).then(() => {
        // Xóa giỏ hàng
        localStorage.removeItem("cart");
        setCart([]);
        setOrderNotes("");
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Chuyển đến trang theo dõi đơn hàng
        navigate(`/trang-thai-don-hang/${createdOrder.id}`);
      });
    } catch (error) {
      console.error("❌ Lỗi khi gửi đơn hàng:", error);
      Swal.fire({
        title: "Lỗi!",
        text: error.response?.data?.message || "Không thể gửi đơn hàng. Vui lòng thử lại.",
        icon: "error",
        confirmButtonColor: "#5c4033",
      });
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: "100px" }}>
      <h2 className="text-center mb-4 fw-bold text-coffee" style={{ color: "#fff" }}>
        🛒 Giỏ hàng của bạn
      </h2>

      <div className="row">
        <div className="col-lg-8 col-md-12">
          <div className="row gy-3">
            <AnimatePresence>
              {cart.length === 0 ? (
                <motion.div
                  className="text-center text-warning mt-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <i className="bi bi-bag-x fs-1"></i>
                  <p className="mt-2 fs-5">Giỏ hàng trống ☕</p>
                </motion.div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={index}
                    className="col-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="card shadow-sm border-0 cart-item-card">
                      <div className="row g-0 align-items-center">
                        <div className="col-4 col-md-3 text-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded-3 cart-img"
                          />
                        </div>
                        <div className="col-8 col-md-9">
                          <div className="card-body">
                            <h5 className="card-title fw-bold">{item.name}</h5>
                            <p className="mb-1 text-muted">{item.price.toLocaleString()} đ</p>
                            <div className="d-flex align-items-center justify-content-between mt-2">
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => handleQtyChange(index, e.target.value)}
                                className="form-control form-control-sm text-center"
                                style={{ width: "70px" }}
                              />
                              <span className="fw-bold text-coffee">
                                {(item.price * item.qty).toLocaleString()} đ
                              </span>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleRemove(index)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="col-lg-4 col-md-12 mt-4 mt-lg-0">
          <motion.div
            className="card shadow-lg border-0 p-4 position-sticky"
            style={{ top: "120px", borderRadius: "16px" }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="fw-bold text-coffee mb-3">Tổng đơn hàng</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Tổng cộng</span>
              <span className="text-coffee">{total.toLocaleString()} đ</span>
            </div>

            {/* 📝 Trường ghi chú đơn hàng */}
            <div className="mb-3">
              <label htmlFor="orderNotes" className="form-label fw-semibold">
                <i className="bi bi-pencil-square me-1"></i> Ghi chú đơn hàng
              </label>
              <textarea
                id="orderNotes"
                className="form-control"
                rows="3"
                placeholder="Ví dụ: Ít đá, nhiều đường, không sữa..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                maxLength="200"
                style={{ 
                  resize: "none",
                  borderColor: "#d4a574",
                  borderRadius: "8px"
                }}
              ></textarea>
              <small className="text-muted d-block mt-1">
                {orderNotes.length}/200 ký tự
              </small>
            </div>

            <button className="btn btn-coffee w-100 mb-2" onClick={handleCheckout}>
              ☕ Gửi đơn hàng
            </button>
            
            {/* Nút xem trạng thái đơn hàng */}
            <button 
              className="btn w-100 mb-2" 
              onClick={() => {
                const currentOrder = localStorage.getItem('currentOrder');
                if (currentOrder) {
                  const orderData = JSON.parse(currentOrder);
                  navigate(`/trang-thai-don-hang/${orderData.orderNumber}`);
                } else {
                  Swal.fire({
                    title: "Chưa có đơn hàng!",
                    text: "Bạn chưa có đơn hàng nào đang xử lý.",
                    icon: "info",
                    confirmButtonColor: "#5c4033",
                  });
                }
              }}
              style={{ 
                backgroundColor: "#8B4513",
                color: "#fff",
                border: "none",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#6F3609"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#8B4513"}
            >
              <i className="bi bi-list-check me-2"></i>
              Xem trạng thái đơn hàng
            </button>
            
            <button className="btn btn-outline-danger w-100" onClick={handleClearCart}>
              🗑 Xóa tất cả
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GioHang;