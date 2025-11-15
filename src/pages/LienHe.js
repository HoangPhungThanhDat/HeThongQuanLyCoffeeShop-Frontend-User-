import React, { useState, useEffect } from "react";
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
function LienHe() {
  return (
    <div>
   <section className="contact-section section-padding" id="section_5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12">
              <em className="text-white">Liên hệ với chúng tôi</em>
              <h2 className="text-white mb-4 pb-lg-2">Thông tin liên hệ</h2>
            </div>

            <div className="col-lg-6 col-12">
              <form
                action="#"
                method="post"
                className="custom-form contact-form"
                role="form"
              >
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <label for="name" className="form-label">
                      Họ và tên <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                      placeholder="Nguyễn Văn A"
                      required=""
                    />
                  </div>

                  <div className="col-lg-6 col-12">
                    <label for="email" className="form-label">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      pattern="[^ @]*@[^ @]*"
                      className="form-control"
                      placeholder="nguyenvana@gmail.com"
                      required=""
                    />
                  </div>

                  <div className="col-12">
                    <label for="message" className="form-label">
                      Chúng tôi có thể giúp gì cho bạn?
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control"
                      id="message"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      required=""
                    ></textarea>
                  </div>
                </div>

                <div className="col-lg-5 col-12 mx-auto mt-3">
                  <button type="submit" className="form-control">
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-6 col-12 mx-auto mt-5 mt-lg-0 ps-lg-5">
              <iframe
                className="google-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502345128809!2d106.70042367480486!3d10.773374989376898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3e6c4c8e3f%3A0x1f6a6e8bdbd7a69e!2zVGjDoG5oIHBo4buRIFRQLiBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1692722771770!5m2!1svi!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LienHe;
