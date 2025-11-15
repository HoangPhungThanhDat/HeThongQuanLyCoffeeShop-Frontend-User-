import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import coffeeBeans from "../assets/images/coffee-beans.png";

function Menu() {
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🔹 Đếm số loại sản phẩm khác nhau trong giỏ hàng (không phải tổng số lượng)
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCount = cart.length;
    
    // Trigger animation nếu số lượng tăng
    if (newCount > cartCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    
    setCartCount(newCount);
  };

  // 🔹 Lấy số lượng giỏ hàng khi component mount
  useEffect(() => {
    updateCartCount();

    // Lắng nghe sự kiện storage để cập nhật khi giỏ hàng thay đổi
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Tạo custom event để cập nhật trong cùng tab
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, [cartCount]);

  // 🔹 Thêm CSS cho badge animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes cartBadgePop {
        0% {
          transform: scale(1);
        }
        25% {
          transform: scale(1.4) rotate(-10deg);
        }
        50% {
          transform: scale(1.2) rotate(10deg);
        }
        75% {
          transform: scale(1.3) rotate(-5deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }

      @keyframes cartBadgePulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(220, 53, 69, 0);
        }
      }

      @keyframes cartIconShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-5deg); }
        75% { transform: translateX(3px) rotate(5deg); }
      }

      .cart-badge {
        position: absolute;
        top: -8px;
        right: -12px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        font-size: 11px;
        font-weight: bold;
        padding: 4px 7px;
        min-width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(220, 53, 69, 0.4),
                    0 0 0 2px white,
                    0 0 0 3px #dc3545;
        z-index: 10;
        animation: cartBadgePulse 2s infinite;
      }

      .cart-badge.animating {
        animation: cartBadgePop 0.6s ease-out, cartBadgePulse 2s infinite;
      }

      .cart-link-wrapper {
        position: relative;
        display: inline-flex !important;
        align-items: center;
        gap: 6px;
      }

      .cart-link-wrapper.animating .bi-cart-fill {
        animation: cartIconShake 0.4s ease-in-out;
      }

      .cart-link-wrapper:hover .cart-badge {
        background: linear-gradient(135deg, #ff4757 0%, #dc3545 100%);
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.6),
                    0 0 0 2px white,
                    0 0 0 3px #dc3545;
      }

      .cart-nav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s ease;
      }

      .cart-nav-link:hover {
        color: #8B4513 !important;
      }

      .cart-icon-coffee {
        font-size: 1.1rem;
        transition: transform 0.3s ease;
      }

      .cart-link-wrapper:hover .cart-icon-coffee {
        transform: translateY(-2px);
      }

      /* Hiệu ứng ripple khi hover */
      .cart-link-wrapper::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(220, 53, 69, 0.1);
        transform: translate(-50%, -50%);
        transition: width 0.4s ease, height 0.4s ease;
      }

      .cart-link-wrapper:hover::before {
        width: 120%;
        height: 120%;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <a
            className="navbar-brand d-flex align-items-center"
            href="#section_1"
          >
            <img
              src={coffeeBeans}
              className="navbar-brand-image img-fluid"
              alt="Coffee Shop Logo"
            />
            Coffee Shop
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-lg-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link click-scroll smoothscroll">
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link click-scroll smoothscroll"
                  href="#section_2"
                >
                  Giới thiệu
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link click-scroll smoothscroll"
                  href="#section_3"
                >
                  Thực đơn
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link click-scroll smoothscroll"
                  href="#section_4"
                >
                  Đánh giá
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link click-scroll smoothscroll"
                  href="#section_5"
                >
                  Liên hệ
                </a>
              </li>
              <li className="nav-item">
                <Link 
                  to="/gio-hang" 
                  className={`nav-link cart-nav-link cart-link-wrapper ${isAnimating ? 'animating' : ''}`}
                >
                  <i className="bi bi-cart-fill cart-icon-coffee"></i>
                  Giỏ hàng
                  {cartCount > 0 && (
                    <span className={`cart-badge ${isAnimating ? 'animating' : ''}`}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>

            <div className="ms-lg-3">
              <Link to="/chon-ban" className="btn custom-btn custom-border-btn">
                Chọn bàn
                <i className="bi-arrow-up-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Menu;