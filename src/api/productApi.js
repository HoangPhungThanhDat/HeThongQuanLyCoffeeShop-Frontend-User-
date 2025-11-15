import axiosClient from "./axiosClient";
import axios from "axios";

const productApi = {
  getAll: () => axiosClient.get("/products"),
  getById: (id) => axiosClient.get(`/products/${id}`),
  getByCategory: (categoryId) =>
    axiosClient.get(`/products/category/${categoryId}`),
  getNewest: () => axiosClient.get("/products/newest"),
  //  Giảm tồn kho
  updateStock: (id, qty) => {
    return axiosClient.put(`/products/${id}/reduce-stock?qty=${qty}`);
  },

  //  Lấy sản phẩm kèm khuyến mãi
  getWithPromotions: () => axiosClient.get("/products/with-promotions"),
};

export default productApi;
