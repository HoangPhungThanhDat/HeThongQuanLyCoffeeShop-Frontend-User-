import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/css/tooplate-barista.css";
import "../assets/css/ChonBan.css";
import TableAPI from "../api/tableApi";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

function ChonBan() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingTables, setSelectingTables] = useState({});
  const [hoveredTable, setHoveredTable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    socket.on("table-being-selected", (data) => {
      setSelectingTables((prev) => ({
        ...prev,
        [data.tableNumber]: data.userName,
      }));

      setTimeout(() => {
        setSelectingTables((prev) => {
          const updated = { ...prev };
          delete updated[data.tableNumber];
          return updated;
        });
      }, 40000);
    });

    socket.on("table-unselected", (data) => {
      setSelectingTables((prev) => {
        const updated = { ...prev };
        delete updated[data.tableNumber];
        return updated;
      });
    });

    return () => {
      socket.off("table-being-selected");
      socket.off("table-unselected");
    };
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const startTime = Date.now(); // Lưu thời điểm bắt đầu
      
      const response = await TableAPI.getAll();
      const tablesData = response.data || response;

      const formattedTables = tablesData.map((table) => ({
        ...table,
        status:
          table.status === "FREE"
            ? "available"
            : table.status === "OCCUPIED"
            ? "occupied"
            : table.status === "RESERVED"
            ? "reserved"
            : "available",
      }));

      setTables(formattedTables);
      
      // Tính thời gian đã trôi qua
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(5000 - elapsed, 0); // 60000ms = 1 phút
      
      // Chờ đủ 1 phút trước khi tắt loading
      setTimeout(() => {
        setLoading(false);
      }, remaining);
      
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bàn:", error);
      
      // Vẫn đợi 1 phút ngay cả khi có lỗi
      setTimeout(() => {
        setLoading(false);
      }, 5000);

      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tải danh sách bàn. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d1a86d",
      });
      setTables([]);
    }
  };

  const handleSelectTable = (number, status) => {
    if (status !== "available") {
      Swal.fire({
        title: "Bàn không khả dụng!",
        text: "Bàn này đã được đặt hoặc đang sử dụng.",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#d1a86d",
      });
      return;
    }

    if (selectedTable && selectedTable !== number) {
      socket.emit("table-unselecting", {
        tableNumber: selectedTable,
      });
    }

    socket.emit("table-selecting", {
      tableNumber: number,
      userName: "Khách",
    });

    setSelectedTable(number);
  };

  const handleConfirmTable = async () => {
    console.log("handleConfirmTable called");
    console.log("selectedTable:", selectedTable);
    
    if (!selectedTable) {
      Swal.fire({
        title: "Chưa chọn bàn!",
        text: "Vui lòng chọn bàn trước khi tiếp tục.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#d1a86d",
      });
      return;
    }

    try {
      const selectedTableData = tables.find((t) => t.number === selectedTable);
      console.log("selectedTableData:", selectedTableData);

      if (!selectedTableData) {
        Swal.fire({
          title: "Lỗi!",
          text: "Không tìm thấy thông tin bàn.",
          icon: "error",
          confirmButtonColor: "#d1a86d",
        });
        return;
      }

      localStorage.setItem(
        "selectedTable",
        JSON.stringify({
          id: selectedTableData.id,
          tableNumber: selectedTableData.number,
          time: new Date().toISOString(),
        })
      );

      Swal.fire({
        title: "Chọn bàn thành công! ☕",
        html: `
          <p><b>Bàn số:</b> ${selectedTable}</p>
          <p>Chúc bạn có trải nghiệm tuyệt vời tại quán!</p>
        `,
        icon: "success",
        confirmButtonText: "Tiếp tục chọn món 🍰",
        confirmButtonColor: "#5c4033",
      }).then(() => {
        navigate("/menu-mon");
      });
    } catch (error) {
      console.error("Lỗi khi chọn bàn:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể chọn bàn. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d1a86d",
      });
    }
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="coffee-cup-loader">
          <div className="cup">
            <div className="steam steam1"></div>
            <div className="steam steam2"></div>
            <div className="steam steam3"></div>
          </div>
        </div>
        <p className="loading-text">Đang tải danh sách bàn...</p>
        <p className="loading-subtext" style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
          Vui lòng chờ trong giây lát ☕
        </p>
      </div>
    );
  }

  const availableCount = tables.filter((t) => t.status === "available").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;

  return (
    <>
      <div className="booking-wrapper">
        <div className="container">
          <div className="booking-header">
            <h1 className="booking-title">
              <i className="bi bi-shop"></i> Chọn Bàn
            </h1>
            <p className="booking-subtitle">
              Chọn bàn yêu thích của bạn và tận hưởng không gian cà phê tuyệt vời cùng bạn bè
            </p>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-icon available">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <div className="stat-text">
                <span className="stat-label">Còn trống</span>
                <span className="stat-value">{availableCount}</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon occupied">
                <i className="bi bi-x-circle-fill"></i>
              </div>
              <div className="stat-text">
                <span className="stat-label">Đang dùng</span>
                <span className="stat-value">{occupiedCount}</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon reserved">
                <i className="bi bi-clock-fill"></i>
              </div>
              <div className="stat-text">
                <span className="stat-label">Đã đặt</span>
                <span className="stat-value">{reservedCount}</span>
              </div>
            </div>
          </div>

          {tables.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p style={{ fontSize: '1.3rem' }}>
                Không có bàn nào khả dụng. Vui lòng thử lại sau.
              </p>
            </div>
          ) : (
            <div className="tables-grid">
              {tables.map((table, index) => (
                <div
                  key={table.number}
                  className={`table-card ${table.status} ${
                    selectedTable === table.number ? "selected" : ""
                  }`}
                  style={{ '--card-index': index }}
                  onClick={() => handleSelectTable(table.number, table.status)}
                  onMouseEnter={() => setHoveredTable(table.number)}
                  onMouseLeave={() => setHoveredTable(null)}
                >
                  {selectingTables[table.number] && (
                    <div className="selecting-indicator">
                      <i className="bi bi-person-fill"></i> {selectingTables[table.number]} đang chọn
                    </div>
                  )}

                  <div className="table-icon-wrapper">
                    <i
                      className={`bi ${
                        table.status === "occupied"
                          ? "bi-cup-hot-fill"
                          : "bi-cup-hot"
                      }`}
                    ></i>
                  </div>

                  <div className="table-number">Bàn {table.number}</div>

                  <div className="text-center">
                    <span
                      className={`table-status-badge ${
                        table.status === "available"
                          ? "available-badge"
                          : table.status === "occupied"
                          ? "occupied-badge"
                          : "reserved-badge"
                      }`}
                    >
                      {table.status === "available" && (
                        <>
                          <i className="bi bi-circle-fill"></i> Trống
                        </>
                      )}
                      {table.status === "occupied" && (
                        <>
                          <i className="bi bi-circle-fill"></i> Đang dùng
                        </>
                      )}
                      {table.status === "reserved" && (
                        <>
                          <i className="bi bi-circle-fill"></i> Đã đặt
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="confirm-section">
            <button
              className="confirm-button"
              onClick={handleConfirmTable}
              disabled={tables.length === 0 || !selectedTable}
              type="button"
            >
              <i className="bi bi-check-circle-fill"></i> Xác nhận bàn
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChonBan;