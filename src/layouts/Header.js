import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// Import hình
import banner1 from "../assets/images/banner2.jpg";
import banner2 from "../assets/images/banner3.webp";
import banner3 from "../assets/images/happy-waitress-giving-coffee-customers-while-serving-them-coffee-shop.jpg";

function Header() {
  useEffect(() => {
    // Chỉ import vegas khi jQuery đã gán
    import("vegas/dist/vegas.min.js").then(() => {
      $(".hero-slides").vegas({
        slides: [{ src: banner1 }, { src: banner2 }, { src: banner3 }],
        delay: 4000,
        timer: false,
        animation: "kenburnsUp",
        transition: "fade",
        transitionDuration: 2000,
      });
    });
  }, []);

  return (
    <div>
      <section
        className="hero-section d-flex justify-content-center align-items-center"
        id="section_1"
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      >
        <div className="container position-relative text-center text-white">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12 mx-auto text-center">
              <em className="small-text">Chào mừng bạn đến với Coffee Shop</em>
              <h1>Coffee shop</h1>
              <p className="text-white mb-4 pb-lg-2">
                Cuộc sống hàng ngày của bạn với loại cà phê yêu thích.
              </p>

              <a
                className="btn custom-btn custom-border-btn smoothscroll me-3"
                href="#section_2"
              >
                Giới thiệu
              </a>

              <a
                className="btn custom-btn smoothscroll me-2 mb-2"
                href="#section_3"
              >
                <strong>Thực đơn</strong>
              </a>
            </div>
          </div>
        </div>

        {/* Vegas background */}
        <div className="hero-slides"></div>
      </section>
    </div>
  );
}

export default Header;
