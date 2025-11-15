import React, { useState } from "react";
import $ from "jquery";
window.jQuery = window.$ = $;

// Import CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            {/* <!-- Địa chỉ --> */}
            <div className="col-lg-4 col-12 me-auto">
              <em className="text-white d-block mb-4">Địa chỉ của chúng tôi</em>
              <strong className="text-white">
                <i className="bi-geo-alt me-2"></i>
                123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh, Việt Nam
              </strong>

              <ul className="social-icon mt-4">
                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-facebook"></a>
                </li>
                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-instagram"></a>
                </li>
                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-whatsapp"></a>
                </li>
              </ul>
            </div>

            {/* <!-- Liên hệ --> */}
            <div className="col-lg-3 col-12 mt-4 mb-3 mt-lg-0 mb-lg-0">
              <em className="text-white d-block mb-4">Liên hệ</em>
              <p className="d-flex mb-1">
                <strong className="me-2">Điện thoại:</strong>
                <a href="tel:0909123456" className="site-footer-link">
                  0909 123 456
                </a>
              </p>
              <p className="d-flex">
                <strong className="me-2">Email:</strong>
                <a
                  href=""
                  className="site-footer-link"
                >
                  
                </a>
              </p>
            </div>

            {/* <!-- Giờ mở cửa --> */}
            <div className="col-lg-5 col-12">
              <em className="text-white d-block mb-4">Giờ mở cửa</em>
              <ul className="opening-hours-list">
                <li className="d-flex">
                  Thứ Hai - Thứ Sáu <span className="underline"></span>
                  <strong>7:30 - 21:00</strong>
                </li>
                <li className="d-flex">
                  Thứ Bảy <span className="underline"></span>
                  <strong>8:00 - 20:00</strong>
                </li>
                <li className="d-flex">
                  Chủ Nhật <span className="underline"></span>
                  <strong>8:00 - 18:00</strong>
                </li>
              </ul>
            </div>

            {/* <!-- Bản quyền --> */}
            <div className="col-lg-8 col-12 mt-4">
              <p className="copyright-text mb-0 text-white">
                © 2025 Coffee Shop Việt Nam. Thiết kế bởi
                <a href="#"></a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* <!-- ✅ Footer di động (Hiện khi màn hình nhỏ) --> */}
      <nav className="mobile-bottom-nav d-md-none">
        <Link to="/" className="nav-item active">
          <i className="bi bi-house-door"></i>
          <span>Trang chủ</span>
        </Link>

        <Link to="/chon-ban" className="nav-item">
          <i className="bi bi-cup-hot"></i>
          <span>Chọn Bàn</span>
        </Link>

        <Link to="/gio-hang" className="nav-item">
          <i className="bi bi-cart3"></i>
          <span>Giỏ hàng</span>
        </Link>

        <Link to="/tai-khoan" className="nav-item">
          <i className="bi bi-person-circle"></i>
          <span>Tài khoản</span>
        </Link>
      </nav>
    </div>
  );
}

export default Footer;
