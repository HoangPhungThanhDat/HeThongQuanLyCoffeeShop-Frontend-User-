import React, { useState, useEffect } from "react";
import $ from "jquery";
window.jQuery = window.$ = $;
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

function SanPhamMoiNhat() {
  const [products, setProducts] = useState([]);

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
                      src={`http://localhost:8080/api/products/image/${product.imageUrl}`}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "220px", objectFit: "cover" }}
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
