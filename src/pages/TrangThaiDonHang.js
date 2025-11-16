import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Coffee,
  CheckCircle,
  Clock,
  Package,
  ChefHat,
  Check,
  Plus,
  X,
  Bell,
  Phone,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  Loader,
} from "lucide-react";
import socket from "../socket";
import Swal from "sweetalert2";
import "animate.css";
import MenuModalForOrder from "./MenuModalForOrder";

// ========== ✅ CẤU HÌNH URL CHO RAILWAY (ĐÃ SỬA) ==========
const API_URL = process.env.REACT_APP_API_URL || 'https://hethongquanlycoffeeshop-backend-production.up.railway.app/api';
//                                                                                                                        ^^^^ THÊM /api
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://hethongquanlycoffeeshop-socketio-production.up.railway.app';

console.log("🌐 API URL:", API_URL);
console.log("🌐 Socket URL:", SOCKET_URL);

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [currentStatus, setCurrentStatus] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCallingStaff, setIsCallingStaff] = useState(false);

  // ========== TOAST NOTIFICATION ==========
  const showToast = (icon, title, message = "") => {
    const iconColors = {
      success: { bg: "#f0fff4", border: "#22c55e", text: "#166534" },
      error: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
      info: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
      warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    };

    const colors = iconColors[icon] || iconColors.info;

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon,
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "my-toast",
      },
      showClass: {
        popup: "animate__animated animate__slideInRight",
      },
      hideClass: {
        popup: "animate__animated animate__slideOutRight",
      },
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);

        toast.style.backgroundColor = colors.bg;
        toast.style.color = colors.text;
        toast.style.borderLeft = `6px solid ${colors.border}`;
        toast.style.boxShadow = `0 4px 12px ${colors.border}40`;
      },
    });
  };

  // ========== STATUS HELPERS ==========
  const getStatusIndex = (status) => {
    const statusMap = {
      PENDING: 1,
      CONFIRMED: 2,
      PREPARING: 2,
      READY: 3,
      SERVED: 4,
      SERVING: 4,
      PAID: 5,
      COMPLETED: 5,
      CANCELLED: 0,
    };
    return statusMap[status] || 1;
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Đang chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PREPARING: "Đang chuẩn bị",
      READY: "Sẵn sàng",
      SERVED: "Đã phục vụ",
      SERVING: "Đang phục vụ",
      PAID: "Đã thanh toán",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
  };

  // ========== LOAD ORDER FROM LOCALSTORAGE + FETCH FROM BACKEND ==========
  useEffect(() => {
    const loadOrderFromStorage = async () => {
      const storedOrder = localStorage.getItem("currentOrder");

      if (!storedOrder) {
        console.warn("⚠️ Không tìm thấy đơn hàng trong localStorage");
        setLoading(false);
        showToast(
          "warning",
          "Không tìm thấy đơn hàng",
          "Vui lòng đặt hàng trước"
        );
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      try {
        const parsedOrder = JSON.parse(storedOrder);
        console.log("✅ Đã load đơn hàng từ localStorage:", parsedOrder);

        if (!parsedOrder.items || !Array.isArray(parsedOrder.items)) {
          parsedOrder.items = [];
        }

        if (!parsedOrder.orderNumber) {
          throw new Error("Thiếu mã đơn hàng");
        }

        setOrderDetails(parsedOrder);
        setCurrentStatus(getStatusIndex(parsedOrder.status));

        // ✅ FETCH TRẠNG THÁI MỚI NHẤT TỪ RAILWAY BACKEND (ĐÃ SỬA)
        try {
          console.log(`🔄 Đang fetch trạng thái mới nhất từ Railway...`);

          const response = await fetch(
            `${API_URL}/orders/${parsedOrder.orderNumber}` // ✅ ĐÃ XÓA /api/
          );

          if (response.ok) {
            const latestOrder = await response.json();
            console.log("✅ Đã fetch trạng thái từ Railway:", latestOrder);

            if (
              latestOrder.status &&
              latestOrder.status !== parsedOrder.status
            ) {
              console.log(
                `🔄 CẬP NHẬT TRẠNG THÁI: ${parsedOrder.status} → ${latestOrder.status}`
              );

              const updatedOrder = {
                ...parsedOrder,
                status: latestOrder.status,
                updatedAt: new Date().toISOString(),
              };

              setOrderDetails(updatedOrder);
              setCurrentStatus(getStatusIndex(latestOrder.status));
              localStorage.setItem(
                "currentOrder",
                JSON.stringify(updatedOrder)
              );

              if (latestOrder.status === "PAID") {
                setTimeout(() => {
                  showToast(
                    "success",
                    "✅ Đơn hàng đã thanh toán!",
                    "Cảm ơn bạn đã sử dụng dịch vụ ☕"
                  );
                }, 500);
              }
            }
          } else {
            console.warn("⚠️ Không thể fetch trạng thái:", response.status);
          }
        } catch (fetchError) {
          console.error("❌ Lỗi khi fetch từ Railway:", fetchError);
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi parse dữ liệu đơn hàng:", error);
        showToast(
          "error",
          "Lỗi tải đơn hàng",
          "Không thể đọc thông tin đơn hàng"
        );
        setTimeout(() => navigate("/"), 2000);
      }
    };

    loadOrderFromStorage();
  }, [orderId, navigate]);

  // ========== SOCKET CONNECTION & LISTENERS ==========
  useEffect(() => {
    if (!orderDetails) return;

    const checkConnection = () => {
      if (socket.connected) {
        setIsConnected(true);
        console.log("✅ Socket đã kết nối tới Railway");
      } else {
        setIsConnected(false);
        console.log("⚠️ Socket chưa kết nối, đang kết nối lại...");
        socket.connect();
      }
    };

    checkConnection();

    socket.emit("join-order-tracking", {
      orderId: orderDetails.orderNumber,
      userType: "customer",
    });

    console.log(`✅ Đã đăng ký theo dõi đơn hàng #${orderDetails.orderNumber}`);

    const handleOrderStatusUpdate = (data) => {
      console.log("\n🔔 NHẬN EVENT: order-status-updated");
      console.log("   - Order ID:", data.orderId);
      console.log("   - New Status:", data.status);

      const isMatching =
        data.orderId == orderDetails.orderNumber ||
        String(data.orderId) === String(orderDetails.orderNumber);

      if (isMatching) {
        const newStatusIndex = getStatusIndex(data.status);
        setCurrentStatus(newStatusIndex);

        setOrderDetails((prev) => {
          const updated = {
            ...prev,
            status: data.status,
          };
          localStorage.setItem("currentOrder", JSON.stringify(updated));
          return updated;
        });

        showToast("success", "🔔 Cập nhật đơn hàng", getStatusLabel(data.status));

        if (data.status === "PAID" || data.status === "COMPLETED") {
          setTimeout(() => {
            showToast(
              "success",
              "✅ Đơn hàng hoàn tất!",
              "Cảm ơn bạn đã sử dụng dịch vụ ☕"
            );
          }, 1000);
        }
      }
    };

    const handleItemsAdded = (data) => {
      console.log("📡 NHẬN EVENT THÊM MÓN");

      const isMatchingOrder =
        data.orderId === orderDetails.orderNumber ||
        String(data.orderId) === String(orderDetails.orderNumber);

      if (isMatchingOrder) {
        setOrderDetails((prev) => {
          let finalItems = [];

          if (Array.isArray(data.addedItems) && data.addedItems.length > 0) {
            const formattedNewItems = data.addedItems.map((item) => ({
              id: item.productId || item.id,
              productId: item.productId || item.id,
              name: item.name || "Món mới",
              image: item.image || "https://via.placeholder.com/50?text=?",
              price: item.price,
              quantity: item.quantity,
              subtotal: item.price * item.quantity,
            }));

            finalItems = [...(prev.items || []), ...formattedNewItems];
          } else if (
            Array.isArray(data.updatedItems) &&
            data.updatedItems.length > 0
          ) {
            const formattedItems = data.updatedItems.map((item) => {
              if (item.product) {
                return {
                  id: item.product.id,
                  productId: item.product.id,
                  name: item.product.name || "Sản phẩm",
                  image: item.product.imageUrl || "https://via.placeholder.com/50?text=?",
                  price: item.price,
                  quantity: item.quantity,
                  subtotal: item.subtotal || item.price * item.quantity,
                };
              }

              return {
                id: item.productId || item.id,
                productId: item.productId || item.id,
                name: item.name || "Sản phẩm",
                image: item.image || "https://via.placeholder.com/50?text=?",
                price: item.price,
                quantity: item.quantity,
                subtotal: item.subtotal || item.price * item.quantity,
              };
            });

            finalItems = formattedItems;
          } else {
            finalItems = prev.items || [];
          }

          const updatedOrder = {
            ...prev,
            items: finalItems,
            total: data.newTotal !== undefined ? data.newTotal : prev.total,
          };

          localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));

          return updatedOrder;
        });

        setRefreshKey((prev) => prev + 1);

        showToast(
          "success",
          "Đã thêm món!",
          `Tổng mới: ${(data.newTotal || 0).toLocaleString()}₫`
        );
      }
    };

    const handleOrderCancelled = (data) => {
      if (
        data.orderId === orderDetails.orderNumber ||
        String(data.orderId) === String(orderDetails.orderNumber)
      ) {
        setOrderDetails((prev) => {
          const updated = {
            ...prev,
            status: "CANCELLED",
          };
          localStorage.setItem("currentOrder", JSON.stringify(updated));
          return updated;
        });

        setCurrentStatus(0);

        Swal.fire({
          icon: "warning",
          title: "Đơn hàng đã bị hủy",
          text: data.reason || "Đơn hàng của bạn đã được hủy bởi nhân viên",
          confirmButtonText: "Về trang chủ",
          confirmButtonColor: "#5c4033",
        }).then(() => {
          localStorage.removeItem("currentOrder");
          navigate("/");
        });
      }
    };

    const handleStaffAcknowledged = (data) => {
      if (data.tableNumber === orderDetails.tableNumber) {
        setIsCallingStaff(false);

        Swal.fire({
          icon: "success",
          title: "Nhân viên đã nhận!",
          html: `
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">👨‍🍳</div>
            <p style="font-size: 18px; font-weight: bold; color: #22c55e; margin-bottom: 10px;">
              ${data.staffName || "Nhân viên"} đang đến hỗ trợ bạn!
            </p>
            <p style="color: #666; font-size: 14px;">
              ${data.message || "Vui lòng chờ trong giây lát"}
            </p>
          </div>
        `,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: "animate__animated animate__bounceIn",
          },
        });
      }
    };

    const handleCallStaffSuccess = (data) => {
      if (data.success && data.tableNumber === orderDetails.tableNumber) {
        showToast(
          "success",
          "Đã gọi nhân viên!",
          "Vui lòng chờ nhân viên đến hỗ trợ"
        );
      }
    };

    const handleConnect = () => {
      console.log("✅ Socket kết nối thành công tới Railway");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("⚠️ Socket ngắt kết nối");
      setIsConnected(false);
      showToast("warning", "Mất kết nối", "Đang thử kết nối lại...");
    };

    const handleReconnect = () => {
      console.log("✅ Socket đã kết nối lại");
      setIsConnected(true);
      showToast("success", "Đã kết nối lại", "");

      socket.emit("join-order-tracking", {
        orderId: orderDetails.orderNumber,
        userType: "customer",
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);
    socket.on("order-status-updated", handleOrderStatusUpdate);
    socket.on("items-added-to-order", handleItemsAdded);
    socket.on("order-cancelled", handleOrderCancelled);
    socket.on("staff-acknowledged", handleStaffAcknowledged);
    socket.on("call-staff-success", handleCallStaffSuccess);

    return () => {
      socket.emit("leave-order-tracking", {
        orderId: orderDetails.orderNumber,
      });

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
      socket.off("order-status-updated", handleOrderStatusUpdate);
      socket.off("items-added-to-order", handleItemsAdded);
      socket.off("order-cancelled", handleOrderCancelled);
      socket.off("staff-acknowledged", handleStaffAcknowledged);
      socket.off("call-staff-success", handleCallStaffSuccess);

      console.log(`👋 Đã rời khỏi theo dõi đơn hàng #${orderDetails.orderNumber}`);
    };
  }, [orderDetails, navigate]);

  // ========== STATUS TIMELINE ==========
  const statuses = [
    {
      id: 1,
      label: "Đã nhận",
      icon: CheckCircle,
      color: "#10b981",
      time: orderDetails?.time || "",
      desc: "Đơn hàng đã được tiếp nhận",
    },
    {
      id: 2,
      label: "Đang pha chế",
      icon: Coffee,
      color: "#f59e0b",
      time: "",
      desc: "Đang chuẩn bị đồ uống",
    },
    {
      id: 3,
      label: "Sẵn sàng",
      icon: Package,
      color: "#3b82f6",
      time: "",
      desc: "Đơn hàng đã hoàn thành",
    },
    {
      id: 4,
      label: "Đang phục vụ",
      icon: ChefHat,
      color: "#8b5cf6",
      time: "",
      desc: "Nhân viên đang mang đến bàn",
    },
    {
      id: 5,
      label: "Hoàn thành",
      icon: Check,
      color: "#10b981",
      time: "",
      desc: "Đơn hàng đã giao thành công",
    },
  ];

  const handleAddItems = (newItems) => {
    console.log("✅ Người dùng đã chọn các món:", newItems);
  };

  const handleCancelOrder = () => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận hủy đơn?",
      html: `
        <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>#${orderDetails?.orderNumber}</strong>?</p>
        <p style="color: #f59e0b; margin-top: 10px;">
          ⚠️ <strong>Lưu ý:</strong> Đơn hàng đang pha chế không thể hoàn tiền
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Xác nhận hủy",
      cancelButtonText: "Quay lại",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("cancel-order", {
          orderId: orderDetails.orderNumber,
          reason: "Khách hàng yêu cầu hủy",
        });

        showToast(
          "info",
          "Đã gửi yêu cầu hủy đơn",
          "Vui lòng đợi nhân viên xác nhận"
        );
        setShowCancelModal(false);
      }
    });
  };

  const handleCallStaff = () => {
    if (!isConnected) {
      showToast("error", "Không có kết nối", "Vui lòng kiểm tra kết nối mạng");
      return;
    }

    Swal.fire({
      title: "🔔 Gọi nhân viên",
      html: `
        <div style="text-align: left; padding: 10px;">
          <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <p style="margin: 0; font-size: 14px; color: #666;">Bàn số</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1f2937;">
              🪑 ${orderDetails.tableNumber}
            </p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "📞 Gọi ngay",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsCallingStaff(true);

        socket.emit("call-staff", {
          tableNumber: orderDetails.tableNumber,
          orderId: orderDetails.orderNumber,
          customerName:
            orderDetails.customerName ||
            `Khách bàn ${orderDetails.tableNumber}`,
          message: "Khách hàng yêu cầu hỗ trợ",
          timestamp: new Date().toISOString(),
        });

        Swal.fire({
          title: "Đang gọi nhân viên...",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Đã gọi nhân viên!",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          setTimeout(() => {
            setIsCallingStaff(false);
          }, 3000);
        });
      }
    });
  };

  // ========== HANDLE: Thanh toán VNPay (ĐÃ SỬA) ==========
  const handleVNPayPayment = async () => {
    try {
      Swal.fire({
        title: "Đang tạo thanh toán VNPay...",
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 15px;">💳</div>
            <p style="color: #666; font-size: 16px;">
              Đang kết nối đến cổng thanh toán...
            </p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      console.log("🔄 Sending VNPay request to:", `${API_URL}/payment/create-vnpay-url`);

      const response = await fetch(
        `${API_URL}/payment/create-vnpay-url`, // ✅ ĐÃ XÓA /api/
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", // ✅ THÊM HEADER
          },
          body: JSON.stringify({
            orderId: orderDetails.orderNumber,
            amount: orderDetails.total,
            orderInfo: `Thanh toan don hang #${orderDetails.orderNumber} - Ban ${orderDetails.tableNumber}`,
          }),
        }
      );

      console.log("📦 Response status:", response.status);
      console.log("📦 Response ok:", response.ok);

      // ✅ KIỂM TRA STATUS TRƯỚC KHI PARSE JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Không thể kết nối đến server'}`);
      }

      const data = await response.json();
      console.log("✅ Payment data:", data);

      if (data.success && data.paymentUrl) {
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            orderId: orderDetails.orderNumber,
            amount: orderDetails.total,
            timestamp: new Date().toISOString(),
          })
        );

        Swal.close();

        Swal.fire({
          icon: "success",
          title: "Đã tạo thanh toán!",
          html: `
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
              <p style="font-size: 16px; color: #666;">
                Đang chuyển đến VNPay...
              </p>
            </div>
          `,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        }).then(() => {
          console.log("🔄 Redirecting to:", data.paymentUrl);
          window.location.href = data.paymentUrl;
        });
      } else {
        throw new Error(data.message || "Không thể tạo thanh toán");
      }
    } catch (error) {
      console.error("❌ VNPay Payment error:", error);

      Swal.fire({
        icon: "error",
        title: "Lỗi thanh toán VNPay",
        html: `
          <div style="text-align: center;">
            <p style="color: #666; margin-bottom: 15px;">
              ${error.message || "Không thể kết nối đến cổng thanh toán"}
            </p>
            <div style="padding: 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #ef4444;">
              <p style="font-size: 13px; color: #991b1b; margin: 0;">
                💡 <strong>Gợi ý:</strong> Kiểm tra kết nối mạng hoặc thử phương thức khác
              </p>
            </div>
          </div>
        `,
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#0071c2",
        showCancelButton: true,
        cancelButtonText: "Đóng",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          handleVNPayPayment(); // Retry
        }
      });
    }
  };

  // ========== HANDLE: Thanh toán MoMo (ĐÃ SỬA) ==========
  const handleMoMoPayment = async () => {
    try {
      Swal.fire({
        title: "Đang tạo thanh toán MoMo...",
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 64px; margin-bottom: 15px;">
              <img 
                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                alt="MoMo" 
                style="width: 80px; height: 80px; object-fit: contain;"
              />
            </div>
            <p style="color: #666; font-size: 16px; margin-top: 15px;">
              Đang kết nối đến ví MoMo...
            </p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const uniqueOrderId = `${orderDetails.orderNumber}_${Date.now()}`;

      console.log("🔄 Sending MoMo request to:", `${API_URL}/momo/create-payment`);
      console.log("📦 Order ID:", uniqueOrderId);

      const response = await fetch(
        `${API_URL}/momo/create-payment`, // ✅ ĐÃ XÓA /api/
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json", // ✅ THÊM HEADER
          },
          body: JSON.stringify({
            orderId: uniqueOrderId,
            amount: orderDetails.total,
            orderInfo: `Thanh toan don hang #${orderDetails.orderNumber} - Ban ${orderDetails.tableNumber}`,
          }),
        }
      );

      console.log("📦 Response status:", response.status);
      console.log("📦 Response ok:", response.ok);

      // ✅ KIỂM TRA STATUS
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Không thể kết nối đến server'}`);
      }

      const data = await response.json();
      console.log("✅ Payment data:", data);

      if (data.success && data.paymentUrl) {
        localStorage.setItem(
          "pendingMoMoPayment",
          JSON.stringify({
            orderId: uniqueOrderId,
            originalOrderId: orderDetails.orderNumber,
            amount: orderDetails.total,
            timestamp: new Date().toISOString(),
          })
        );

        Swal.close();

        Swal.fire({
          icon: "success",
          title: "Đã tạo thanh toán!",
          html: `
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
              <p style="font-size: 16px; color: #666; margin-bottom: 15px;">
                Đang chuyển đến ví MoMo...
              </p>
              <div style="padding: 12px; background: #f0f9ff; border-radius: 8px; border: 1px solid #3b82f6;">
                <p style="font-size: 14px; color: #1e40af; margin: 0;">
                  🔐 Thanh toán an toàn với MoMo
                </p>
              </div>
            </div>
          `,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        }).then(() => {
          console.log("🔄 Redirecting to:", data.paymentUrl);
          window.location.href = data.paymentUrl;
        });
      } else {
        throw new Error(data.message || "Không thể tạo thanh toán");
      }
    } catch (error) {
      console.error("❌ MoMo Payment error:", error);

      Swal.fire({
        icon: "error",
        title: "Lỗi thanh toán MoMo",
        html: `
          <div style="text-align: center;">
            <p style="color: #666; margin-bottom: 15px;">
              ${error.message || "Không thể kết nối đến cổng thanh toán MoMo"}
            </p>
            <div style="padding: 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #ef4444;">
              <p style="font-size: 13px; color: #991b1b; margin: 0;">
                💡 <strong>Gợi ý:</strong> Kiểm tra kết nối mạng và thử lại
              </p>
            </div>
          </div>
        `,
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#d946b6",
        showCancelButton: true,
        cancelButtonText: "Đóng",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          handleMoMoPayment(); // Retry
        }
      });
    }
  };

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Loader
          size={48}
          className="animate-spin"
          style={{ color: "#5c4033" }}
        />
        <div style={{ fontSize: "18px", color: "#666" }}>
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  // ========== NO ORDER STATE ==========
  if (!orderDetails) {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <AlertCircle size={64} style={{ color: "#ef4444" }} />
        <h2 style={{ margin: 0 }}>Không tìm thấy đơn hàng</h2>
        <p style={{ color: "#666", margin: 0 }}>
          Vui lòng đặt hàng trước khi xem trạng thái
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 30px",
            backgroundColor: "#5c4033",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }
  // ========== MAIN RENDER ==========
  return (
    <div className="container">
      <style>{`
 * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: #FAF8F3;
          min-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .top-bar {
          background: white;
          padding: 20px 30px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.08);
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-home-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          border: none;
          background: #FAF8F3;
          color: #8B4513;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-home-btn:hover {
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          color: white;
          transform: translateX(-4px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
        }

        .brand-divider {
          width: 1px;
          height: 30px;
          background: #DEB887;
        }

        .brand h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3E2723;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .top-actions {
          display: flex;
          gap: 12px;
        }

        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: #F5F5DC;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #8B4513;
        }

        .icon-btn:hover {
          background: #DEB887;
          transform: translateY(-2px);
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.08);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #F5F5DC;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #3E2723;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          background: #FFF8DC;
          color: #8B4513;
        }

        .status-badge.processing {
          background: #FFE4B5;
          color: #8B4513;
        }

        .order-info-box {
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          padding: 24px;
          border-radius: 12px;
          color: white;
          margin-bottom: 24px;
        }

        .order-number {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .order-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 0.75rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 1rem;
          font-weight: 600;
        }

        .note-box {
          background: #FFF8DC;
          border-left: 4px solid #D2691E;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .note-title {
          font-weight: 600;
          color: #8B4513;
          margin-bottom: 6px;
          font-size: 0.9rem;
        }

        .note-text {
          color: #A0522D;
          font-size: 0.95rem;
        }

        .items-list {
          margin-bottom: 24px;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          background: #FAF8F3;
          transition: all 0.2s;
        }

        .item-row:hover {
          background: #F5F5DC;
        }

        .item-emoji {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          color: #3E2723;
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .item-quantity {
          color: #8B4513;
          font-size: 0.9rem;
        }

        .item-price {
          font-weight: 700;
          color: #8B4513;
          font-size: 1.15rem;
        }

        .total-box {
          background: #FAF8F3;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border: 2px solid #F5F5DC;
        }

        .total-label {
          font-size: 1.15rem;
          font-weight: 600;
          color: #3E2723;
        }

        .total-amount {
          font-size: 1.75rem;
          font-weight: 700;
          color: #8B4513;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn {
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 69, 19, 0.3);
        }

        .btn-outline {
          background: white;
          color: #8B4513;
          border: 2px solid #8B4513;
        }

        .btn-outline:hover {
          background: #8B4513;
          color: white;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #F5F5DC;
          color: #8B4513;
        }

        .btn-secondary:hover {
          background: #DEB887;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
          transform: translateY(-2px);
        }

        .timeline {
          position: relative;
          padding: 10px 0;
        }

        .timeline-item {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
          position: relative;
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }

        .timeline-item:nth-child(1) { animation-delay: 0.1s; }
        .timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .timeline-item:nth-child(3) { animation-delay: 0.3s; }
        .timeline-item:nth-child(4) { animation-delay: 0.4s; }
        .timeline-item:nth-child(5) { animation-delay: 0.5s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 26px;
          top: 58px;
          width: 3px;
          height: calc(100% - 16px);
          background: #F5F5DC;
          border-radius: 10px;
          z-index: 0;
        }

        .timeline-item.active:not(:last-child)::before {
          background: #8B4513;
        }

        .timeline-icon-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .timeline-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: #A0522D;
          flex-shrink: 0;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          z-index: 2;
          border: 3px solid #F5F5DC;
          box-shadow: 0 0 0 4px white;
        }

        .timeline-icon::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .timeline-item.active .timeline-icon {
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          color: white;
          border-color: #8B4513;
          box-shadow: 0 8px 24px rgba(139, 69, 19, 0.25), 0 0 0 4px white;
          transform: scale(1.05) rotate(360deg);
        }

        .timeline-item.active .timeline-icon::after {
          content: '';
          position: absolute;
          width: 120%;
          height: 120%;
          border-radius: 50%;
          border: 2px solid #8B4513;
          opacity: 0;
          animation: ripple 1.5s ease-out infinite;
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .timeline-item.current .timeline-icon {
          animation: pulse 2s infinite, bounce 0.6s ease;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(139, 69, 19, 0.25);
          }
          50% {
            box-shadow: 0 8px 32px rgba(139, 69, 19, 0.45), 0 0 0 8px rgba(139, 69, 19, 0.1);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1.05) translateY(0); }
          50% { transform: scale(1.1) translateY(-8px); }
        }

        .timeline-content {
          flex: 1;
          padding-top: 8px;
          background: #FAF8F3;
          padding: 16px 20px;
          border-radius: 12px;
          border: 2px solid #F5F5DC;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .timeline-content::before {
          content: '';
          position: absolute;
          left: -2px;
          top: -2px;
          bottom: -2px;
          width: 4px;
          background: linear-gradient(180deg, #8B4513 0%, #D2691E 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .timeline-item.active .timeline-content {
          background: white;
          border-color: #8B4513;
          box-shadow: 0 4px 16px rgba(139, 69, 19, 0.1);
          transform: translateX(4px);
        }

        .timeline-item.active .timeline-content::before {
          opacity: 1;
        }

        .timeline-item.current .timeline-content {
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 4px 16px rgba(139, 69, 19, 0.1);
          }
          50% {
            box-shadow: 0 4px 24px rgba(139, 69, 19, 0.2);
          }
        }

        .timeline-label {
          font-weight: 700;
          color: #A0522D;
          font-size: 1.1rem;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .timeline-item.active .timeline-label {
          color: #3E2723;
        }

        .timeline-item.current .timeline-label::after {
          content: '●';
          color: #8B4513;
          animation: blink 1.5s infinite;
          font-size: 0.8rem;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .timeline-time {
          font-size: 0.88rem;
          color: #A0522D;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .timeline-time::before {
          content: '🕐';
          font-size: 0.9rem;
        }

        .timeline-item.active .timeline-time {
          color: #8B4513;
          font-weight: 600;
        }

        .timeline-description {
          font-size: 0.85rem;
          color: #8B4513;
          margin-top: 6px;
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .timeline-item.active .timeline-description {
          opacity: 1;
          max-height: 50px;
        }

        .status-check {
          position: absolute;
          right: -8px;
          top: -8px;
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 3;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .timeline-item.active .status-check {
          opacity: 1;
          transform: scale(1);
        }

        .progress-section {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #F5F5DC;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          align-items: center;
        }

        .progress-text {
          font-size: 0.95rem;
          color: #8B4513;
          font-weight: 600;
        }

        .progress-percentage {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8B4513;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .progress-percentage::before {
          content: '';
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }

        .progress-bar-container {
          height: 12px;
          background: #F5F5DC;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(139, 69, 19, 0.1);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B4513 0%, #D2691E 50%, #CD853F 100%);
          border-radius: 20px;
          transition: width 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
        }

        .progress-bar-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .progress-bar-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
        }

        .estimated-time {
          margin-top: 16px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #8B4513;
          font-weight: 600;
          border: 1px solid #DEB887;
        }

        .estimated-time::before {
          content: '⏱️';
          font-size: 1.2rem;
        }

        .help-section {
          background: #FAF8F3;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          margin-top: 24px;
          border: 1px solid #F5F5DC;
        }

        .help-title {
          font-weight: 600;
          color: #3E2723;
          margin-bottom: 16px;
        }

        .help-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .help-btn {
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          background: white;
          color: #8B4513;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(139, 69, 19, 0.1);
        }

        .help-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(139, 69, 19, 0.2);
          background: #FFF8DC;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(62, 39, 35, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideUp 0.3s ease;
        }

        .modal-large {
          max-width: 700px;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #F5F5DC;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #3E2723;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: #FAF8F3;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8B4513;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #8B4513;
          color: white;
          transform: rotate(90deg);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
        }

        .modal-body {
          padding: 24px;
        }

        .modal-body p {
          margin-bottom: 16px;
          color: #5D4037;
          line-height: 1.6;
          font-size: 1rem;
        }

        .modal-subtitle {
          font-weight: 700;
          color: #3E2723;
          margin-bottom: 20px;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-subtitle::before {
          content: '🔥';
          font-size: 1.2rem;
        }

        .warning-text {
          color: #dc3545;
          font-size: 0.9rem;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .item-card {
          background: white;
          padding: 18px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.3s;
          border: 2px solid #F5F5DC;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.05);
        }

        .item-card:hover {
          background: #FFFAF0;
          border-color: #DEB887;
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(139, 69, 19, 0.12);
        }

        .item-image {
          font-size: 3rem;
          text-align: center;
        }

        .item-details h4 {
          font-size: 1rem;
          color: #3E2723;
          margin-bottom: 4px;
        }

        .item-details .item-price {
          color: #8B4513;
          font-weight: 600;
        }

        .btn-add-item {
          padding: 10px 18px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(139, 69, 19, 0.15);
        }

        .btn-add-item:hover {
          background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.25);
        }

        .btn-add-item:active {
          transform: translateY(0);
        }

        .modal-footer {
          padding: 24px;
          border-top: 1px solid #F5F5DC;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-footer .btn-secondary {
          padding: 12px 24px;
          border-radius: 12px;
          border: 2px solid #DEB887;
          background: white;
          color: #8B4513;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-footer .btn-secondary:hover {
          background: #FAF8F3;
          border-color: #8B4513;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.1);
        }

        .modal-footer .btn-primary {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
        }

        .modal-footer .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
        }

        .modal-footer .btn-danger {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
        }

        .modal-footer .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
        }


        /* Custom style cho toast */
        .my-toast {
          font-weight: bold;
          padding: 1rem;
          border-radius: 10px;
        }
        
        /* Màu thanh thời gian */
        .swal2-timer-progress-bar {
          height: 4px;
        }













    /* ========== COFFEE THEME PAYMENT SECTION ========== */
.payment-section-coffee {
  margin-top: 30px;
  background: linear-gradient(135deg, #1e1410 0%, #3d2817 50%, #5c4033 100%);
  border-radius: 20px;
  padding: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(92, 64, 51, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Coffee Steam Animation */
.coffee-steam {
  position: absolute;
  top: -50px;
  right: 30px;
  opacity: 0.15;
  pointer-events: none;
}

.steam-line {
  width: 3px;
  height: 80px;
  background: linear-gradient(to top, transparent, #fff, transparent);
  margin: 0 8px;
  display: inline-block;
  border-radius: 50px;
  animation: steam 3s ease-in-out infinite;
}

.steam-1 { animation-delay: 0s; }
.steam-2 { animation-delay: 0.5s; }
.steam-3 { animation-delay: 1s; }

@keyframes steam {
  0%, 100% {
    transform: translateY(0) scaleY(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-30px) scaleY(1.2);
    opacity: 0.3;
  }
}

/* Header */
.payment-header-coffee {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.coffee-cup-icon {
  font-size: 48px;
  animation: cup-bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes cup-bounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.payment-title-coffee {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.payment-subtitle-coffee {
  font-size: 14px;
  color: #d4a574;
  margin-top: 4px;
  font-weight: 500;
}

/* Total Display */
.payment-total-display {
  background: linear-gradient(135deg, #c59d5f 0%, #d4a574 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 20px rgba(197, 157, 95, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.payment-total-display::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.total-label-coffee {
  font-size: 14px;
  color: #5c4033;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.total-amount-coffee {
  font-size: 36px;
  font-weight: 900;
  color: #3d2817;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: -1px;
}

.coffee-beans-decoration {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 16px;
  opacity: 0.6;
}

.coffee-beans-decoration span {
  animation: bean-bounce 1.5s ease-in-out infinite;
}

.coffee-beans-decoration span:nth-child(2) { animation-delay: 0.2s; }
.coffee-beans-decoration span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bean-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Payment Methods */
.payment-methods-coffee {
  display: grid;
  gap: 15px;
  margin-bottom: 25px;
}

.payment-btn-coffee {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

/* Shine Effect */
.payment-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent
  );
  transition: left 0.6s ease;
}

.payment-btn-coffee:hover .payment-shine {
  left: 100%;
}

.payment-btn-coffee:hover {
  transform: translateX(8px) scale(1.02);
  box-shadow: 
    -8px 8px 20px rgba(0, 0, 0, 0.2),
    0 0 0 3px rgba(197, 157, 95, 0.3);
}

.payment-btn-coffee:active {
  transform: translateX(4px) scale(0.98);
}

/* Payment Icon */
.payment-icon-coffee {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.momo-bg {
  background: linear-gradient(135deg, #a50064 0%, #d90368 100%);
}

.vnpay-bg {
  background: linear-gradient(135deg, #0071c2 0%, #0095ff 100%);
}

.zalopay-bg {
  background: linear-gradient(135deg, #0068ff 0%, #4facfe 100%);
}

.cash-bg {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.payment-logo-coffee {
  width: 45px;
  height: 45px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.payment-fallback {
  font-size: 28px;
  font-weight: 900;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cash-icon-large {
  font-size: 32px;
  animation: cash-rotate 3s ease-in-out infinite;
}

@keyframes cash-rotate {
  0%, 100% { transform: rotate(-10deg) scale(1); }
  50% { transform: rotate(10deg) scale(1.1); }
}

/* Payment Content */
.payment-content-coffee {
  flex: 1;
  text-align: left;
}

.payment-name-coffee {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.payment-desc-coffee {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.payment-feature {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
}

/* Payment Tags */
.payment-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: tag-pulse 2s ease-in-out infinite;
}

@keyframes tag-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.hot-tag {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.secure-tag {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.promo-tag {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.classic-tag {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: white;
}

.fire-icon, .shield-icon, .gift-icon, .star-icon {
  font-size: 14px;
  animation: icon-wiggle 1s ease-in-out infinite;
}

@keyframes icon-wiggle {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

/* Payment Arrow */
.payment-arrow {
  font-size: 24px;
  color: #c59d5f;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.payment-btn-coffee:hover .payment-arrow {
  transform: translateX(5px);
  animation: arrow-bounce 0.6s ease-in-out infinite;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateX(5px); }
  50% { transform: translateX(10px); }
}

/* Border Effects for Each Payment Method */
.momo-coffee:hover {
  border-color: #a50064;
  background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%);
}

.vnpay-coffee:hover {
  border-color: #0071c2;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
}

.zalopay-coffee:hover {
  border-color: #0068ff;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

.cash-coffee:hover {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

/* Security Section */
.payment-security-coffee {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.security-icons {
  display: flex;
  gap: 8px;
  font-size: 24px;
}

.sec-icon {
  animation: security-float 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.sec-icon:nth-child(2) { animation-delay: 0.3s; }
.sec-icon:nth-child(3) { animation-delay: 0.6s; }

@keyframes security-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.security-text-coffee {
  flex: 1;
}

.security-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 12px;
  color: #d4a574;
  line-height: 1.5;
}

/* Promotion Banner */
.payment-promo-banner {
  background: linear-gradient(135deg, #ffd89b 0%, #f7c968 100%);
  border-radius: 12px;
  padding: 15px 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 216, 155, 0.4);
}

.payment-promo-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
  animation: promo-slide 20s linear infinite;
}

@keyframes promo-slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(28.28px); }
}

.promo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.promo-icon {
  font-size: 28px;
  animation: promo-spin 3s linear infinite;
}

@keyframes promo-spin {
  0%, 100% { transform: rotate(-10deg) scale(1); }
  25% { transform: rotate(0deg) scale(1.1); }
  50% { transform: rotate(10deg) scale(1); }
  75% { transform: rotate(0deg) scale(1.1); }
}

.promo-text {
  font-size: 14px;
  color: #5c4033;
  font-weight: 600;
  line-height: 1.5;
}

.promo-text strong {
  color: #3d2817;
  font-weight: 800;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payment-section-coffee {
    padding: 20px;
  }

  .payment-title-coffee {
    font-size: 24px;
  }

  .total-amount-coffee {
    font-size: 28px;
  }

  .payment-btn-coffee {
    padding: 15px 16px;
  }

  .payment-icon-coffee {
    width: 50px;
    height: 50px;
  }

  .payment-name-coffee {
    font-size: 16px;
  }

  .payment-desc-coffee {
    flex-direction: column;
    gap: 5px;
  }

  .payment-btn-coffee:hover {
    transform: scale(1.02);
  }

  .security-icons {
    font-size: 20px;
  }

  .promo-text {
    font-size: 12px;
  }
}

/* Hover Effect for Different States */
.payment-btn-coffee:not(:hover) {
  transition: all 0.3s ease;
}

.payment-btn-coffee:hover {
  animation: payment-pulse 1.5s ease-in-out infinite;
}

@keyframes payment-pulse {
  0%, 100% {
    box-shadow: 
      -8px 8px 20px rgba(0, 0, 0, 0.2),
      0 0 0 3px rgba(197, 157, 95, 0.3);
  }
  50% {
    box-shadow: 
      -8px 8px 30px rgba(0, 0, 0, 0.3),
      0 0 0 5px rgba(197, 157, 95, 0.5);
  }
}
  `}</style>
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1000,
            fontSize: "14px",
          }}
        >
          <AlertCircle size={16} />
          Mất kết nối - Đang kết nối lại...
        </div>
      )}

      {/* Top Bar */}
      <div className="top-bar">
        <div className="brand">
          <button
            className="back-home-btn"
            onClick={() => navigate("/")}
            title="Quay về trang chủ"
          >
            <ArrowLeft size={20} />
            Trang chủ
          </button>
          <div className="brand-divider"></div>
          <div className="brand-icon">☕</div>
          <h1>Coffee Shop</h1>
        </div>
        <div className="top-actions">
          <button className="icon-btn" title="Thông báo">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left Column: Order Details */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Coffee size={24} />
              Chi tiết đơn hàng
            </h2>
            <div
              className={`status-badge ${
                orderDetails.status === "CANCELLED"
                  ? "cancelled"
                  : currentStatus < 5
                  ? "processing"
                  : "completed"
              }`}
            >
              <Clock size={14} />
              {orderDetails.status === "CANCELLED"
                ? "Đã hủy"
                : currentStatus < 5
                ? "Đang xử lý"
                : "Hoàn thành"}
            </div>
          </div>

          {/* Order Info */}
          <div className="order-info-box">
            <div className="order-number">#{orderDetails.orderNumber}</div>
            <div className="order-meta-grid">
              <div className="meta-item">
                <div className="meta-label">Bàn số</div>
                <div className="meta-value">🪑 {orderDetails.tableNumber}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Ngày đặt</div>
                <div className="meta-value">{orderDetails.date}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Giờ đặt</div>
                <div className="meta-value">{orderDetails.time}</div>
              </div>
            </div>
          </div>

          {/* Note */}
          {orderDetails.note && (
            <div className="note-box">
              <div className="note-title">📝 Ghi chú của bạn</div>
              <div className="note-text">{orderDetails.note}</div>
            </div>
          )}

          {/* Items List */}
          <div className="items-list" key={refreshKey}>
            {orderDetails.items && orderDetails.items.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div
                  key={`${item.id || item.name}-${index}-${refreshKey}`}
                  className="item-row"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-emoji"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=?";
                    }}
                  />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">
                      Số lượng: {item.quantity}
                    </div>
                  </div>
                  <div className="item-price">
                    {((item.price || 0) * (item.quantity || 0)).toLocaleString(
                      "vi-VN"
                    )}
                    ₫
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#999",
                }}
              >
                <Package
                  size={48}
                  style={{ opacity: 0.3, marginBottom: "10px" }}
                />
                <div>Chưa có món nào trong đơn hàng</div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="total-box">
            <span className="total-label">Tổng cộng</span>
            <span className="total-amount">
              {(orderDetails.total || 0).toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* Action Buttons */}
          {orderDetails.status !== "CANCELLED" && currentStatus < 5 && (
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={20} />
                Thêm món
              </button>
              <button className="btn btn-outline" onClick={handleCancelOrder}>
                <X size={20} />
                Hủy đơn
              </button>
            </div>
          )}

          {/* Payment Section - Coffee Theme */}
          {orderDetails.status !== "CANCELLED" && currentStatus >= 4 && (
            <div className="payment-section-coffee">
              {/* Steam Animation Background */}
              <div className="coffee-steam">
                <div className="steam-line steam-1"></div>
                <div className="steam-line steam-2"></div>
                <div className="steam-line steam-3"></div>
              </div>

              <div className="payment-header-coffee">
                <div className="coffee-cup-icon">☕</div>
                <div>
                  <div className="payment-title-coffee">
                    Thanh toán đơn hàng
                  </div>
                  <div className="payment-subtitle-coffee">
                    Chọn phương thức thanh toán để hoàn tất
                  </div>
                </div>
              </div>

              {/* Total Amount Display */}
              <div className="payment-total-display">
                <div className="total-label-coffee">Tổng thanh toán</div>
                <div className="total-amount-coffee">
                  {(orderDetails.total || 0).toLocaleString("vi-VN")}₫
                </div>
                <div className="coffee-beans-decoration">
                  <span>☕</span>
                  <span>☕</span>
                  <span>☕</span>
                </div>
              </div>

              <div className="payment-methods-coffee">
                {/* MoMo */}
                <button
                  className="payment-btn-coffee momo-coffee"
                  onClick={handleMoMoPayment}
                >
                  <div className="payment-shine"></div>
                  <div className="payment-icon-coffee momo-bg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                      alt="MoMo"
                      className="payment-logo-coffee"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="payment-fallback"
                      style={{ display: "none" }}
                    >
                      M
                    </div>
                  </div>
                  <div className="payment-content-coffee">
                    <div className="payment-name-coffee">Ví MoMo</div>
                    <div className="payment-desc-coffee">
                      <span className="payment-feature">⚡ Siêu nhanh</span>
                      <span className="payment-feature">🎁 Nhiều ưu đãi</span>
                    </div>
                  </div>
                  <div className="payment-tag hot-tag">
                    <span className="fire-icon">🔥</span> HOT
                  </div>
                  <div className="payment-arrow">→</div>
                </button>

                {/* VNPay */}
                <button
                  className="payment-btn-coffee vnpay-coffee"
                  onClick={handleVNPayPayment}
                >
                  <div className="payment-shine"></div>
                  <div className="payment-icon-coffee vnpay-bg">
                    <img
                      src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                      alt="VNPay"
                      className="payment-logo-coffee"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="payment-fallback"
                      style={{ display: "none" }}
                    >
                      V
                    </div>
                  </div>
                  <div className="payment-content-coffee">
                    <div className="payment-name-coffee">VNPay QR</div>
                    <div className="payment-desc-coffee">
                      <span className="payment-feature">🔒 Bảo mật cao</span>
                      <span className="payment-feature">💳 Đa ngân hàng</span>
                    </div>
                  </div>
                  <div className="payment-tag secure-tag">
                    <span className="shield-icon">🛡️</span> AN TOÀN
                  </div>
                  <div className="payment-arrow">→</div>
                </button>

                {/* ZaloPay */}
                <button className="payment-btn-coffee zalopay-coffee">
                  <div className="payment-shine"></div>
                  <div className="payment-icon-coffee zalopay-bg">
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay.png"
                      alt="ZaloPay"
                      className="payment-logo-coffee"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="payment-fallback"
                      style={{ display: "none" }}
                    >
                      Z
                    </div>
                  </div>
                  <div className="payment-content-coffee">
                    <div className="payment-name-coffee">ZaloPay</div>
                    <div className="payment-desc-coffee">
                      <span className="payment-feature">💰 Hoàn 15%</span>
                      <span className="payment-feature">🎯 Tích điểm</span>
                    </div>
                  </div>
                  <div className="payment-tag promo-tag">
                    <span className="gift-icon">🎁</span> -15%
                  </div>
                  <div className="payment-arrow">→</div>
                </button>

                {/* Cash */}
                <button className="payment-btn-coffee cash-coffee">
                  <div className="payment-shine"></div>
                  <div className="payment-icon-coffee cash-bg">
                    <div className="cash-icon-large">💵</div>
                  </div>
                  <div className="payment-content-coffee">
                    <div className="payment-name-coffee">Tiền mặt</div>
                    <div className="payment-desc-coffee">
                      <span className="payment-feature">🏪 Tại quầy</span>
                      <span className="payment-feature">📝 Xuất hóa đơn</span>
                    </div>
                  </div>
                  <div className="payment-tag classic-tag">
                    <span className="star-icon">⭐</span> TRUYỀN THỐNG
                  </div>
                  <div className="payment-arrow">→</div>
                </button>
              </div>

              {/* Security Info */}
              <div className="payment-security-coffee">
                <div className="security-icons">
                  <span className="sec-icon">🔐</span>
                  <span className="sec-icon">🛡️</span>
                  <span className="sec-icon">✓</span>
                </div>
                <div className="security-text-coffee">
                  <div className="security-title">
                    Thanh toán được mã hóa & bảo mật
                  </div>
                  <div className="security-desc">
                    Chứng nhận SSL • PCI-DSS Level 1 • Xác thực 3D Secure
                  </div>
                </div>
              </div>

              {/* Promotion Banner */}
              <div className="payment-promo-banner">
                <div className="promo-content">
                  <span className="promo-icon">🎉</span>
                  <div className="promo-text">
                    <strong>Ưu đãi đặc biệt:</strong> Giảm 20.000₫ cho đơn từ
                    200.000₫
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Status */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Package size={24} />
                Trạng thái đơn hàng
              </h2>
            </div>

            {/* Timeline */}
            <div className="">
              {statuses.map((status, index) => (
                <div
                  key={status.id}
                  className={`timeline-item ${
                    index + 1 <= currentStatus ? "active" : ""
                  } ${index + 1 === currentStatus ? "current" : ""}`}
                >
                  <div className="timeline-icon-wrapper">
                    <div className="timeline-icon">
                      <status.icon size={24} />
                    </div>
                    {index + 1 < currentStatus && (
                      <div className="status-check">✓</div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-label">{status.label}</div>
                    {status.time && (
                      <div className="timeline-time">{status.time}</div>
                    )}
                    <div className="timeline-description">{status.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-text">Tiến độ đơn hàng</span>
                <span className="progress-percentage">
                  {Math.round((currentStatus / statuses.length) * 100)}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(currentStatus / statuses.length) * 100}%`,
                  }}
                />
              </div>
              <div className="estimated-time">
                Thời gian dự kiến: {orderDetails.estimatedTime || "15-20 phút"}
              </div>
            </div>
          </div>

          {/* ✅ Help Section - CẢI TIẾN */}
          <div className="help-section">
            <div className="help-title">
              <span style={{ fontSize: "20px", marginRight: "8px" }}>💁</span>
              Cần hỗ trợ?
            </div>

            <div
              className="help-description"
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "15px",
                padding: "10px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy chọn cách liên hệ phù hợp
              bên dưới.
            </div>

            <div className="help-buttons">
              <button
                className="help-btn"
                onClick={handleCallStaff}
                disabled={isCallingStaff || !isConnected}
                style={{
                  position: "relative",
                  opacity: isCallingStaff ? 0.6 : 1,
                  cursor:
                    isCallingStaff || !isConnected ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {isCallingStaff ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Đang gọi...
                  </>
                ) : (
                  <>
                    <Phone size={18} />
                    Gọi nhân viên
                  </>
                )}
                {!isConnected && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "16px",
                      height: "16px",
                      background: "#ef4444",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  ></span>
                )}
              </button>

              <button
                className="help-btn"
                onClick={() =>
                  showToast(
                    "info",
                    "Tính năng đang phát triển",
                    "Chat sẽ sớm có mặt"
                  )
                }
                style={{
                  position: "relative",
                }}
              >
                <MessageCircle size={18} />
                Nhắn tin
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "10px",
                    background: "#f59e0b",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Sớm
                </span>
              </button>
            </div>

            {/* ✅ Thêm thông tin liên hệ khẩn cấp */}
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#fef3c7",
                borderRadius: "8px",
                border: "1px solid #fbbf24",
                fontSize: "13px",
                color: "#92400e",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                📞 Liên hệ khẩn cấp
              </div>
              <div>
                Hotline: <strong>1900-xxxx</strong>
              </div>
              <div
                style={{ fontSize: "11px", color: "#b45309", marginTop: "5px" }}
              >
                Hoạt động 24/7 để hỗ trợ bạn
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Items Modal */}
      {showAddModal && (
        <MenuModalForOrder
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          currentOrder={orderDetails}
          onAddItems={handleAddItems}
        />
      )}
    </div>
  );
};

export default OrderTracking;
