import React, { useState, useEffect } from "react";
import $ from "jquery";

// Import CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vegas/dist/vegas.min.css";
import "../assets/css/tooplate-barista.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import videoFile from "../assets/video/Download.mp4";
import anhMinh from "../assets/images/team/portrait-elegant-old-man-wearing-suit.jpg";
import chiLan from "../assets/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg";
import anhTuan from "../assets/images/team/small-business-owner-drinking-coffee.jpg";
import maiAnh from "../assets/images/team/smiley-business-woman-working-cashier.jpg";
window.jQuery = window.$ = $;
function GioiThieu() {
  return (
    <div>
      <section className="about-section section-padding" id="section_2">
        <div className="section-overlay"></div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12">
              <div className="ratio ratio-1x1">
                <video
                  autoPlay
                  loop
                  muted={true}
                  playsInline
                  className="custom-video"
                >
                  <source src={videoFile} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>

                <div className="about-video-info d-flex flex-column">
                  <h4 className="mt-auto">Chúng tôi bắt đầu hành trình </h4>

                  <h4>từ năm 2025</h4>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-12 mt-4 mt-lg-0 mx-auto">
              <em className="text-white">Coffee Shop</em>

              <h2 className="text-white mb-3">
                Cafe CA – Hương vị đậm đà, không gian ấm áp
              </h2>

              <p className="text-white">
                Tọa lạc giữa lòng thị trấn yên bình, Cafe CA là điểm đến quen
                thuộc của những ai yêu thích hương vị cà phê nguyên chất và
                không gian thư giãn nhẹ nhàng.
              </p>

              <p className="text-white">
                Quán được sáng lập và vận hành bởi một nhóm bạn trẻ đầy nhiệt
                huyết, mang trong mình niềm đam mê với hạt cà phê và khát khao
                tạo nên không gian gặp gỡ, sẻ chia cho mọi người.
              </p>

              <a
                href="#barista-team"
                className="smoothscroll btn custom-btn custom-border-btn mt-3 mb-4"
              >
                Gặp gỡ đội ngũ Coffee Shop
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="barista-section section-padding section-bg"
        id="barista-team"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-12 text-center mb-4 pb-lg-2">
              <h2 className="text-white">Đội ngũ Coffee Shop</h2>
              <p className="text-white-50">
                Những con người tận tâm mang đến cho bạn ly cà phê hoàn hảo mỗi
                ngày.
              </p>
            </div>

            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="team-block-wrap">
                <div className="team-block-info d-flex flex-column">
                  <div className="d-flex mt-auto mb-3">
                    <h4 className="text-white mb-0">Anh Minh</h4>
                    <p className="badge ms-4">
                      <em>Chủ quán</em>
                    </p>
                  </div>
                  <p className="text-white mb-0">
                    Người sáng lập Coffee Shop với niềm đam mê cà phê bất tận.
                  </p>
                </div>

                <div className="team-block-image-wrap">
                  <img
                    src={anhMinh}
                    className="team-block-image img-fluid"
                    alt="Anh Minh - Chủ quán"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="team-block-wrap">
                <div className="team-block-info d-flex flex-column">
                  <div className="d-flex mt-auto mb-3">
                    <h4 className="text-white mb-0">Chị Lan</h4>
                    <p className="badge ms-4">
                      <em>Quản lý</em>
                    </p>
                  </div>
                  <p className="text-white mb-0">
                    Luôn đảm bảo mỗi khách hàng đều nhận được trải nghiệm tốt
                    nhất.
                  </p>
                </div>

                <div className="team-block-image-wrap">
                  <img
                    src={chiLan}
                    className="team-block-image img-fluid"
                    alt="Chị Lan - Quản lý"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="team-block-wrap">
                <div className="team-block-info d-flex flex-column">
                  <div className="d-flex mt-auto mb-3">
                    <h4 className="text-white mb-0">Anh Tuấn</h4>
                    <p className="badge ms-4">
                      <em>Trưởng pha chế</em>
                    </p>
                  </div>
                  <p className="text-white mb-0">
                    Chuyên gia tạo ra những hương vị cà phê đậm đà, độc đáo.
                  </p>
                </div>

                <div className="team-block-image-wrap">
                  <img
                    src={anhTuan}
                    className="team-block-image img-fluid"
                    alt="Anh Tuấn - Trưởng pha chế"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-12">
              <div className="team-block-wrap">
                <div className="team-block-info d-flex flex-column">
                  <div className="d-flex mt-auto mb-3">
                    <h4 className="text-white mb-0">Mai Anh</h4>
                    <p className="badge ms-4">
                      <em>Nhân viên pha chế</em>
                    </p>
                  </div>
                  <p className="text-white mb-0">
                    Luôn phục vụ với nụ cười và niềm đam mê dành cho cà phê.
                  </p>
                </div>

                <div className="team-block-image-wrap">
                  <img
                    src={maiAnh}
                    className="team-block-image img-fluid"
                    alt="Mai Anh - Nhân viên pha chế"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GioiThieu;
