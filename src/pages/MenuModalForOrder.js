
import React, { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";
import socket from "../socket";
import "../assets/css/MenuModal.css";

const MenuModalForOrder = ({ isOpen, onClose, currentOrder, onAddItems }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchProducts();
    }
  }, [isOpen, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = selectedCategory
        ? await productApi.getByCategory(selectedCategory)
        : await productApi.getAll();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (product, delta) => {
    const hasPromotion = product.promotions && product.promotions.length > 0;
    
    // ✅ Tính giá cuối cùng (đã giảm nếu có khuyến mãi)
    const finalPrice = hasPromotion
      ? product.price * (1 - product.promotions[0].discountPercentage / 100)
      : product.price;

    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((item) => item.id !== product.id);
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else if (delta > 0) {
        return [
          ...prev,
          {
            id: product.id,
            productId: product.id, // ✅ QUAN TRỌNG: Backend cần trường này
            name: product.name,
            price: finalPrice, // ✅ GIÁ ĐÃ GIẢM (nếu có khuyến mãi)
            originalPrice: product.price, // ✅ Giá gốc để hiển thị
            quantity: 1,
            image: `http://localhost:8080/api/products/image/${product.imageUrl}`,
            discountPercentage: hasPromotion ? product.promotions[0].discountPercentage : 0,
          },
        ];
      }
      return prev;
    });
  };

  const getItemQuantity = (productId) => {
    const item = selectedItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleConfirmAdd = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một món!");
      return;
    }

    // ✅ LOG ĐỂ DEBUG
    console.log("\n🔍 ===================================");
    console.log("🔍 DỮ LIỆU GỬI TỪ FRONTEND");
    console.log("🔍 ===================================");
    console.log("📦 Order ID:", currentOrder.orderNumber);
    console.log("📦 Số món:", selectedItems.length);
    console.log("📦 Tổng tiền:", getTotalAmount().toLocaleString(), "₫");
    
    selectedItems.forEach((item, i) => {
      console.log(`\n   📦 Món ${i + 1}:`);
      console.log(`      - id: ${item.id}`);
      console.log(`      - productId: ${item.productId}`);
      console.log(`      - name: ${item.name}`);
      console.log(`      - quantity: ${item.quantity}`);
      console.log(`      - price (đã giảm): ${item.price?.toLocaleString()}₫`);
      console.log(`      - originalPrice: ${item.originalPrice?.toLocaleString()}₫`);
      console.log(`      - discount: ${item.discountPercentage}%`);
    });
    console.log("===================================\n");

    // ✅ Emit socket với đầy đủ dữ liệu
    socket.emit("add-items-to-order", {
      orderId: currentOrder.orderNumber,
      items: selectedItems, // ✅ Đã có productId và price đúng
      additionalAmount: getTotalAmount(),
    });

    onAddItems(selectedItems);
    setSelectedItems([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-menu-large"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "900px", maxHeight: "90vh", overflow: "hidden" }}
      >
        <div className="modal-header" style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 10 }}>
          <h3>Thêm món vào đơn hàng #{currentOrder.orderNumber}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: "20px", overflowY: "auto", maxHeight: "calc(90vh - 200px)" }}>
          {/* Category Filter */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: "8px 16px",
                border: selectedCategory === null ? "2px solid #5c4033" : "1px solid #ddd",
                backgroundColor: selectedCategory === null ? "#5c4033" : "white",
                color: selectedCategory === null ? "white" : "#333",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: "8px 16px",
                  border: selectedCategory === category.id ? "2px solid #5c4033" : "1px solid #ddd",
                  backgroundColor: selectedCategory === category.id ? "#5c4033" : "white",
                  color: selectedCategory === category.id ? "white" : "#333",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Đang tải sản phẩm...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
              {products.map((product) => {
                const hasPromotion = product.promotions && product.promotions.length > 0;
                const discountedPrice = hasPromotion
                  ? product.price * (1 - product.promotions[0].discountPercentage / 100)
                  : product.price;
                const quantity = getItemQuantity(product.id);

                return (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: quantity > 0 ? "#f0f9ff" : "white",
                      transition: "all 0.3s",
                    }}
                  >
                    {hasPromotion && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          zIndex: 1,
                        }}
                      >
                        -{product.promotions[0].discountPercentage}%
                      </div>
                    )}
                    <img
                      src={`http://localhost:8080/api/products/image/${product.imageUrl}`}
                      alt={product.name}
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "12px" }}>
                      <h4 style={{ fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
                        {product.name}
                      </h4>
                      <div style={{ marginBottom: "10px" }}>
                        {hasPromotion && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              fontSize: "12px",
                              marginRight: "5px",
                            }}
                          >
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                        <span style={{ color: "#5c4033", fontWeight: "bold", fontSize: "15px" }}>
                          {discountedPrice.toLocaleString()}đ
                        </span>
                      </div>

                      {quantity > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => handleQuantityChange(product, -1)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "1px solid #5c4033",
                              backgroundColor: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Minus size={16} />
                          </button>
                          <span style={{ fontWeight: "bold", fontSize: "16px", minWidth: "30px", textAlign: "center" }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product, 1)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "none",
                              backgroundColor: "#5c4033",
                              color: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleQuantityChange(product, 1)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#5c4033",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <Plus size={16} />
                          Thêm
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="modal-footer"
          style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
            borderTop: "1px solid #ddd",
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Đã chọn: {selectedItems.length} món
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#5c4033" }}>
              Tổng: {getTotalAmount().toLocaleString("vi-VN")}₫
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: "10px 20px" }}
            >
              Hủy
            </button>
            <button
              className="btn-primary"
              onClick={handleConfirmAdd}
              disabled={selectedItems.length === 0}
              style={{
                padding: "10px 20px",
                opacity: selectedItems.length === 0 ? 0.5 : 1,
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <ShoppingCart size={18} style={{ marginRight: "5px" }} />
              Xác nhận thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuModalForOrder;