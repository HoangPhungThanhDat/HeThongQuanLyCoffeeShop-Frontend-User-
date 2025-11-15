
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Menu from "../layouts/Menu";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import SanPhamMoiNhat from "../pages/SanPhamMoiNhat";
import ThucDon from "../pages/ThucDon";
import GioiThieu from "../pages/GioiThieu";
import DanhGia from "../pages/DanhGia";
import LienHe from "../pages/LienHe";
import ChonBan01 from "../pages/ChonBan";
import MenuMon01 from "../pages/MenuMon";
import GioHang01 from "../pages/GioHang";
import TrangThaiDonHang01 from "../pages/TrangThaiDonHang";
import PaymentResult from "../pages/PaymentResult";
import MoMoPaymentResult  from "../pages/MoMoPaymentResult";




function HomePage() {
  return (
    <div>
      <Menu />
      <Header />
      <SanPhamMoiNhat />
      <ThucDon />
      <GioiThieu />
      <DanhGia />
      <LienHe />
      <Footer />
    </div>
  );
}

function ChonBan() {
  return (
    <>
      <Menu/>
      <ChonBan01 />  
      <Footer />
    </>
  );
}

function MenuMon() {
  return (
    <>
      <Menu/>
      <MenuMon01 />  
      <Footer />
    </>
  );
}

function GioHang() {
  return (
    <>
      <Menu/>
      <GioHang01 />  
      <Footer />
    </>
  );
}

function TrangThaiDonHang() {
  return (
    <>
      <TrangThaiDonHang01 />
      <Footer /> 
    </>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chon-ban" element={<ChonBan />} />
      <Route path="/menu-mon" element={<MenuMon />} />
      <Route path="/gio-hang" element={<GioHang />} />
      {/* ⭐ Route mới với tham số orderId */}
      <Route path="/trang-thai-don-hang/:orderId" element={<TrangThaiDonHang />} />
      {/* Route cũ (không có orderId) - redirect về trang chủ hoặc giữ lại */}
      <Route path="/trang-thai-don-hang" element={<TrangThaiDonHang />} />
      <Route path="/payment-result" element={<PaymentResult />} />
      <Route path="/payment/momo/return" element={<MoMoPaymentResult />} />
      <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
    </Routes>
  );
}
