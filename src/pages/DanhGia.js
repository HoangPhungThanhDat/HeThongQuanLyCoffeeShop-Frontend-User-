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
import sandra from "../assets/images/reviews/user.png";
window.jQuery = window.$ = $;
function DanhGia() {
  return (
    <div>
   <section
        className="reviews-section section-padding section-bg"
        id="section_4"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-12 text-center mb-4 pb-lg-2">
              <em className="text-white">Đánh giá từ khách hàng</em>
              <h2 className="text-white">Cảm nhận của khách hàng</h2>
            </div>

            <div className="timeline">
              {/* <!-- Đánh giá 1 --> */}
              <div className="timeline-container timeline-container-left">
                <div className="timeline-content">
                  <div className="reviews-block">
                    <div className="reviews-block-image-wrap d-flex align-items-center">
                      <img
                        src={sandra}
                        className="reviews-block-image img-fluid"
                        alt="Khách hàng Sandra"
                      />

                      <div>
                        <h6 className="text-white mb-0">Quân</h6>
                        <em className="text-white">Khách hàng</em>
                      </div>
                    </div>

                    <div className="reviews-block-info">
                      <p>
                        Không gian quán rất ấm cúng, âm nhạc nhẹ nhàng và cà phê
                        cực kỳ thơm ngon. Đây chắc chắn là nơi lý tưởng để thư
                        giãn sau những giờ làm việc căng thẳng.
                      </p>

                      <div className="d-flex border-top pt-3 mt-4">
                        <strong className="text-white">
                          4.5 <small className="ms-2">Điểm đánh giá</small>
                        </strong>

                        <div className="reviews-group ms-auto">
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Đánh giá 2 --> */}
              <div className="timeline-container timeline-container-right">
                <div className="timeline-content">
                  <div className="reviews-block">
                    <div className="reviews-block-image-wrap d-flex align-items-center">
                      <img
                        src={sandra}
                        className="reviews-block-image img-fluid"
                        alt="Khách hàng Don"
                      />

                      <div>
                        <h6 className="text-white mb-0">Thảo</h6>
                        <em className="text-white">Khách hàng thân thiết</em>
                      </div>
                    </div>

                    <div className="reviews-block-info">
                      <p>
                        Tôi đã thử rất nhiều quán cà phê ở CAang, nhưng Cafe CA
                        vẫn là nơi tôi quay lại nhiều nhất. Cà phê đậm đà, phục
                        vụ chu đáo và luôn có cảm giác thân quen mỗi khi ghé.
                      </p>

                      <div className="d-flex border-top pt-3 mt-4">
                        <strong className="text-white">
                          5.0 <small className="ms-2">Điểm đánh giá</small>
                        </strong>

                        <div className="reviews-group ms-auto">
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Đánh giá 3 --> */}
              <div className="timeline-container timeline-container-left">
                <div className="timeline-content">
                  <div className="reviews-block">
                    <div className="reviews-block-image-wrap d-flex align-items-center">
                      <img
                        src={sandra}
                        className="reviews-block-image img-fluid"
                        alt="Khách hàng Olivia"
                      />

                      <div>
                        <h6 className="text-white mb-0">Mai</h6>
                        <em className="text-white">Khách hàng</em>
                      </div>
                    </div>

                    <div className="reviews-block-info">
                      <p>
                        Nhân viên rất dễ thương và phục vụ nhanh chóng. Đồ uống
                        được trình bày đẹp mắt, hương vị tuyệt vời – đặc biệt là
                        cà phê sữa đá, rất đúng gu của tôi!
                      </p>

                      <div className="d-flex border-top pt-3 mt-4">
                        <strong className="text-white">
                          4.8 <small className="ms-2">Điểm đánh giá</small>
                        </strong>

                        <div className="reviews-group ms-auto">
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-fill"></i>
                          <i className="bi-star-half"></i>
                        </div>
                      </div>
                    </div>
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

export default DanhGia;
