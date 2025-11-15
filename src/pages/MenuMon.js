import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "../assets/css/MenuMon.css";

import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";
import "../assets/css/loader.css";
import socket from "../socket";

// ✅ Sử dụng biến môi trường cho API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function MenuMon() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addingStatus, setAddingStatus] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        const res = selectedCategory
          ? await productApi.getByCategory(selectedCategory)
          : await productApi.getAll();
        setProducts(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(2000 - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    socket.on("self-adding-to-cart", (data) => {
      console.log("Server phản hồi:", data);

      setAddingStatus((prev) => ({
        ...prev,
        [data.productId]: true,
      }));

      setTimeout(() => {
        setAddingStatus((prev) => {
          const updated = { ...prev };
          delete updated[data.productId];
          return updated;
        });
      }, 2000);
    });

    return () => {
      socket.off("self-adding-to-cart");
    };
  }, []);

  const createFlyingImage = (imgSrc, startElement) => {
    const cartButton = document.querySelector('a[href="/gio-hang"]');
    if (!cartButton) return;

    const flyingImg = document.createElement("img");
    flyingImg.src = imgSrc;
    flyingImg.className = "flying-img";

    const startRect = startElement.getBoundingClientRect();
    const endRect = cartButton.getBoundingClientRect();

    flyingImg.style.left = `${startRect.left + startRect.width / 2 - 40}px`;
    flyingImg.style.top = `${startRect.top + startRect.height / 2 - 40}px`;
    flyingImg.style.opacity = "1";
    flyingImg.style.transform = "rotate(0deg) scale(1)";

    document.body.appendChild(flyingImg);

    flyingImg.style.boxShadow = "0 0 20px 5px #FFD700";

    setTimeout(() => {
      flyingImg.style.left = `${endRect.left + endRect.width / 2 - 40}px`;
      flyingImg.style.top = `${endRect.top + endRect.height / 2 - 40}px`;
      flyingImg.style.transform = "scale(0.2) rotate(360deg)";
      flyingImg.style.opacity = "0.5";

      cartButton.style.transition = "transform 0.3s";
      cartButton.style.transform = "scale(1.3)";
      setTimeout(() => {
        cartButton.style.transform = "scale(1)";
      }, 300);
    }, 50);

    setTimeout(() => {
      document.body.removeChild(flyingImg);
    }, 1000);

    const audio = new Audio(process.env.PUBLIC_URL + "/sounds/cart-add.wav");
    audio.play();
  };

  // ✅ Hàm handleAddToCart đã được sửa với URL động
  const handleAddToCart = (product, event) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tính giá sau khuyến mãi
    const hasPromotion = product.promotions && product.promotions.length > 0;
    const finalPrice = hasPromotion
      ? product.price * (1 - product.promotions[0].discountPercentage / 100)
      : product.price;

    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      cart[index].qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: finalPrice,
        originalPrice: product.price,
        discountPercentage: hasPromotion ? product.promotions[0].discountPercentage : 0,
        qty: 1,
        image: `${API_URL}/api/products/image/${product.imageUrl}`, // ✅ Sửa URL
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    const imgElement = event.target.closest(".product-card").querySelector("img");
    const imgSrc = `${API_URL}/api/products/image/${product.imageUrl}`; // ✅ Sửa URL
    createFlyingImage(imgSrc, imgElement);

    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-circle-fill"></i> Đã thêm!';
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 1500);

    socket.emit("adding-to-cart", {
      productId: product.id,
      productName: product.name,
    });
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="coffee-loader"></div>
        <p className="text-light mt-3">
          Đang pha chế menu cà phê của bạn... ☕
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="menu-section">
        <div className="container">
          <div className="menu-header">
            <h1 className="menu-title">
              <i className="bi bi-cup-hot-fill"></i> Our Menu
            </h1>
            <p className="menu-subtitle">
              Khám phá những ly cà phê tuyệt vời và bánh ngọt thơm ngon được chế biến từ những nguyên liệu cao cấp nhất
            </p>
          </div>

          <div className="category-filter">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`category-btn ${selectedCategory === null ? "active" : ""}`}
            >
              <i className="bi bi-grid-fill"></i> Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product, index) => {
                const hasPromotion = product.promotions && product.promotions.length > 0;
                const discountedPrice = hasPromotion
                  ? product.price * (1 - product.promotions[0].discountPercentage / 100)
                  : product.price;

                return (
                  <div
                    key={product.id}
                    className="product-card"
                    style={{ '--card-index': index }}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={`${API_URL}/api/products/image/${product.imageUrl}`} // ✅ Sửa URL
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          // ✅ Xử lý lỗi nếu ảnh không tải được
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      {hasPromotion && (
                        <div className="promotion-badge">
                          <i className="bi bi-fire"></i> -{product.promotions[0].discountPercentage}%
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">
                        {product.description || "Thức uống tuyệt vời cho một ngày hoàn hảo"}
                      </p>

                      <div className="price-section">
                        {hasPromotion && (
                          <span className="original-price">
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                        <span className="current-price">
                          {discountedPrice.toLocaleString()}đ
                        </span>
                        {hasPromotion && (
                          <span className="discount-label">
                            Giảm {product.promotions[0].discountPercentage}%
                          </span>
                        )}
                      </div>

                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <i className="bi bi-cart-plus-fill"></i> Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>Không có sản phẩm nào trong danh mục này</p>
            </div>
          )}

          <div className="text-center">
            <Link to="/gio-hang" className="cart-button">
              <i className="bi bi-cart-check-fill"></i>
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default MenuMon;