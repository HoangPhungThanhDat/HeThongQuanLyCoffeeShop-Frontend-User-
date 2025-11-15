import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import productApi from "../api/productApi";
window.jQuery = window.$ = $;

// ✅ Giữ lại API_URL cho các API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// ✅ Base64 placeholder image để tránh lỗi network
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='220'%3E%3Crect width='300' height='220' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23adb5bd'%3ENo Image%3C/text%3E%3C/svg%3E";

function SanPhamMoiNhat() {
  const [products, setProducts] = useState([]);
  const [imageErrors, setImageErrors] = useState({}); // ✅ Track image errors

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getNewest();
        console.log("Dữ liệu sản phẩm:", response);
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      new Swiper(".mySwiper", {
        modules: [Navigation, Autoplay],
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          992: { slidesPerView: 4 },
        },
      });
    }
  }, [products]);

  // ✅ Xử lý lỗi hình ảnh - chỉ chạy 1 lần
  const handleImageError = (productId, e) => {
    // Nếu đã xử lý lỗi cho ảnh này rồi thì không làm gì nữa
    if (imageErrors[productId]) {
      return;
    }

    // Đánh dấu là đã xử lý lỗi
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));

    // Set placeholder image
    e.target.src = PLACEHOLDER_IMAGE;
    
    console.warn(`Không thể tải hình ảnh cho sản phẩm ID: ${productId}`);
  };

  return (
    <section
      className="barista-section section-padding section-bg"
      id="new-products"
    >
      <div className="container text-center">
        <h2 className="mb-3" style={{ color: "#000" }}>
          Sản phẩm cà phê mới nhất
        </h2>
        <p style={{ color: "#000" }}>
          Khám phá những hương vị cà phê mới được chúng tôi chọn lọc kỹ lưỡng,
          mang đến trải nghiệm đậm đà và tinh tế nhất.
        </p>

        <div className="swiper mySwiper mt-5">
          <div className="swiper-wrapper">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="swiper-slide" key={product.id}>
                  <div className="card border-0 shadow-lg h-100">
                    <img
                      src={product.imageUrl || PLACEHOLDER_IMAGE}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "220px", objectFit: "cover" }}
                      onError={(e) => handleImageError(product.id, e)}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-dark">{product.name}</h5>
                      <p className="card-text text-muted small">
                        {product.description
                          ? product.description.slice(0, 60) + "..."
                          : "Không có mô tả"}
                      </p>
                      <strong className="text-dark d-block mb-2">
                        {product.price?.toLocaleString()}đ
                      </strong>
                      <Link
                        to="/chon-ban"
                        className="btn btn-dark btn-sm rounded-pill px-3"
                      >
                        Đặt ngay
                        <i className="bi-arrow-up-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted mt-3">Đang tải sản phẩm...</p>
            )}
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </div>
    </section>
  );
}

export default SanPhamMoiNhat;