import React, { useEffect } from "react";
import $ from "jquery";

// Import CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
window.jQuery = window.$ = $;

function ThucDon() {

  const formatVND = (value) => {
    return value.toLocaleString("vi-VN") + " ₫";
  };

  return (
    <div>
      <section className="menu-section section-padding" id="section_3">
        <div className="container">
          <div className="row">

            {/* Bữa sáng */}
            <div className="col-lg-6 col-12 mb-4 mb-lg-0">
              <div className="menu-block-wrap">
                <div className="text-center mb-4 pb-lg-2">
                  <em className="text-white">Thực đơn hấp dẫn</em>
                  <h4 className="text-white">Bữa sáng</h4>
                </div>

                <div className="menu-block">
                  <div className="d-flex">
                    <h6>Bánh Pancake</h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(22500)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Cà phê rang xay và sữa nóng thơm béo</small>
                  </div>
                </div>

                <div className="menu-block my-4">
                  <div className="d-flex">
                    <h6>Bánh Waffle Nướng</h6>
                    <span className="underline"></span>
                    <strong className="text-white ms-auto">
                      <del>{formatVND(16500)}</del>
                    </strong>
                    <strong className="ms-2">{formatVND(32000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Kết hợp cùng cà phê pha mới và sữa tươi nóng</small>
                  </div>
                </div>

                <div className="menu-block">
                  <div className="d-flex">
                    <h6>
                      Khoai Tây Chiên
                      <span className="badge ms-3">Đề xuất</span>
                    </h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(15000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Phục vụ cùng sữa tươi béo và lớp bọt mịn</small>
                  </div>
                </div>

                <div className="menu-block my-4">
                  <div className="d-flex">
                    <h6>Bánh Pancake</h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(19500)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Cà phê pha mới và sữa nóng thơm ngậy</small>
                  </div>
                </div>

                <div className="menu-block">
                  <div className="d-flex">
                    <h6>Bánh Chuối</h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(18000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Sữa tươi và lớp bọt sánh mịn</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Cà phê */}
            <div className="col-lg-6 col-12">
              <div className="menu-block-wrap">
                <div className="text-center mb-4 pb-lg-2">
                  <em className="text-white">Thức uống được yêu thích</em>
                  <h4 className="text-white">Cà phê</h4>
                </div>

                <div className="menu-block">
                  <div className="d-flex">
                    <h6>Latte</h6>
                    <span className="underline"></span>
                    <strong className="text-white ms-auto">
                      <del>{formatVND(42500)}</del>
                    </strong>
                    <strong className="ms-2">{formatVND(35000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Cà phê pha mới hòa quyện cùng sữa tươi nóng</small>
                  </div>
                </div>

                <div className="menu-block my-4">
                  <div className="d-flex">
                    <h6>
                      Cà phê Sữa Trắng
                      <span className="badge ms-3">Đề xuất</span>
                    </h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(45900)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Cà phê đậm đà và sữa tươi mịn màng</small>
                  </div>
                </div>

                <div className="menu-block">
                  <div className="d-flex">
                    <h6>Sữa Socola</h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(55000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Sữa tươi kết hợp với socola thơm béo</small>
                  </div>
                </div>

                <div className="menu-block my-4">
                  <div className="d-flex">
                    <h6>Trà Xanh</h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(25000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Trà xanh thanh mát pha cùng sữa tươi</small>
                  </div>
                </div>

                <div className="menu-block">
                  <div className="d-flex">
                    <h6>Socola Đậm</h6>
                    <span className="underline"></span>
                    <strong className="ms-auto">{formatVND(45000)}</strong>
                  </div>
                  <div className="border-top mt-2 pt-2">
                    <small>Sữa tươi béo mịn và hương socola nồng nàn</small>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ThucDon;