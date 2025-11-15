import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader, Home, Receipt } from "lucide-react";
import Swal from "sweetalert2";
import "animate.css";

const MoMoPaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Lấy params từ URL
    const orderId = searchParams.get("orderId");
    const resultCode = parseInt(searchParams.get("resultCode"));
    const message = searchParams.get("message");

    console.log("📥 MoMo Payment Result:", { orderId, resultCode, message });

    // Lấy pending payment từ localStorage
    const pendingPayment = localStorage.getItem("pendingMoMoPayment");
    
    if (pendingPayment) {
      const paymentData = JSON.parse(pendingPayment);
      
      setPaymentInfo({
        orderId: orderId || paymentData.orderId,
        amount: paymentData.amount,
        resultCode: resultCode,
        message: message,
        success: resultCode === 0,
      });

      // Xóa pending payment
      localStorage.removeItem("pendingMoMoPayment");

      // ✅ LOCAL TEST: Gọi API để cập nhật trạng thái thanh toán
      if (resultCode === 0) {
        updatePaymentStatus(orderId || paymentData.orderId);
      }

      // Hiển thị thông báo
      setTimeout(() => {
        if (resultCode === 0) {
          Swal.fire({
            icon: "success",
            title: "Thanh toán MoMo thành công!",
            html: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 64px; margin-bottom: 15px;">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                    alt="MoMo" 
                    style="width: 80px; height: 80px; object-fit: contain;"
                  />
                </div>
                <p style="font-size: 18px; color: #d946b6; font-weight: bold; margin-bottom: 10px;">
                  🎉 Cảm ơn bạn đã thanh toán qua MoMo!
                </p>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                  Đơn hàng <strong>#${orderId}</strong> đã được xác nhận
                </p>
                <div style="padding: 15px; background: #fdf4ff; border-radius: 8px; border: 1px solid #d946b6;">
                  <p style="font-size: 16px; color: #831843; margin: 0;">
                    Số tiền: <strong>${(paymentData?.amount || 0).toLocaleString()}₫</strong>
                  </p>
                </div>
              </div>
            `,
            confirmButtonText: "Về trang chủ",
            confirmButtonColor: "#d946b6",
            allowOutsideClick: false,
          }).then(() => {
            navigate("/");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Thanh toán MoMo thất bại",
            html: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 64px; margin-bottom: 15px;">😔</div>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                  ${message || "Có lỗi xảy ra trong quá trình thanh toán qua MoMo"}
                </p>
                <div style="padding: 15px; background: #fef2f2; border-radius: 8px; border: 1px solid #ef4444;">
                  <p style="font-size: 14px; color: #991b1b; margin: 0;">
                    Đơn hàng: <strong>#${orderId}</strong>
                  </p>
                </div>
              </div>
            `,
            confirmButtonText: "Thử lại",
            confirmButtonColor: "#ef4444",
            showCancelButton: true,
            cancelButtonText: "Về trang chủ",
            cancelButtonColor: "#6b7280",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/order-tracking/${orderId}`);
            } else {
              navigate("/");
            }
          });
        }
      }, 500);
    }

    setLoading(false);
  }, [searchParams, navigate]);

  // ✅ Hàm cập nhật trạng thái thanh toán (LOCAL TEST)
  const updatePaymentStatus = async (orderId) => {
    try {
      console.log("📡 Đang cập nhật trạng thái thanh toán cho Order:", orderId);
      
      // TODO: Uncomment khi có API
      // const response = await fetch(
      //   `http://localhost:8080/api/orders/${orderId}/payment-success`,
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ paymentMethod: 'MOMO' })
      //   }
      // );
      // 
      // if (response.ok) {
      //   console.log("✅ Đã cập nhật trạng thái thanh toán");
      // }

      console.log("✅ [LOCAL TEST] Bỏ qua cập nhật DB - Chỉ hiển thị kết quả");
      
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "20px",
        background: "linear-gradient(135deg, #d946b6 0%, #9333ea 100%)",
      }}>
        <Loader size={64} className="animate-spin" style={{ color: "white" }} />
        <div style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>
          Đang xử lý kết quả thanh toán MoMo...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: paymentInfo?.success 
        ? "linear-gradient(135deg, #d946b6 0%, #9333ea 100%)"
        : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      padding: "20px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "500px",
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}>
        {/* MoMo Logo */}
        <div style={{ marginBottom: "20px" }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
            alt="MoMo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              margin: "0 auto",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {paymentInfo?.success ? (
          <>
            <CheckCircle size={80} style={{ color: "#22c55e", margin: "0 auto 20px" }} />
            <h1 style={{ fontSize: "28px", color: "#1f2937", marginBottom: "10px" }}>
              Thanh toán thành công!
            </h1>
            <p style={{ color: "#666", marginBottom: "10px" }}>
              Đơn hàng của bạn đã được thanh toán qua <strong style={{ color: "#d946b6" }}>MoMo</strong>
            </p>
          </>
        ) : (
          <>
            <XCircle size={80} style={{ color: "#ef4444", margin: "0 auto 20px" }} />
            <h1 style={{ fontSize: "28px", color: "#1f2937", marginBottom: "10px" }}>
              Thanh toán thất bại
            </h1>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              {paymentInfo?.message || "Có lỗi xảy ra khi thanh toán qua MoMo"}
            </p>
          </>
        )}

        {/* Payment Info Box */}
        <div style={{
          background: paymentInfo?.success ? "#fdf4ff" : "#fef2f2",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          border: paymentInfo?.success ? "2px solid #d946b6" : "2px solid #ef4444",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "#666" }}>Mã đơn hàng:</span>
            <strong>#{paymentInfo?.orderId}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "#666" }}>Phương thức:</span>
            <strong style={{ color: "#d946b6" }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                alt="MoMo" 
                style={{ 
                  width: "20px", 
                  height: "20px", 
                  verticalAlign: "middle", 
                  marginRight: "5px" 
                }}
              />
              Ví MoMo
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#666" }}>Số tiền:</span>
            <strong style={{ 
              color: paymentInfo?.success ? "#22c55e" : "#ef4444",
              fontSize: "18px"
            }}>
              {(paymentInfo?.amount || 0).toLocaleString()}₫
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              flex: 1,
              padding: "14px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#4b5563";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#6b7280";
            }}
          >
            <Home size={20} />
            Trang chủ
          </button>
          
          {paymentInfo?.success && (
            <button
              onClick={() => navigate(`/order-tracking/${paymentInfo.orderId}`)}
              style={{
                flex: 1,
                padding: "14px",
                background: "linear-gradient(135deg, #d946b6 0%, #9333ea 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 10px 20px rgba(217, 70, 182, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <Receipt size={20} />
              Xem đơn hàng
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f9fafb",
          borderRadius: "10px",
          fontSize: "13px",
          color: "#666",
        }}>
          <p style={{ margin: 0 }}>
            💡 <strong>Lưu ý:</strong> Đơn hàng của bạn đã được xác nhận và đang được xử lý
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoMoPaymentResult;