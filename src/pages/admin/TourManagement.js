"use client";

import { useState, useEffect } from "react";
import { Table, Card, Input, Button, Space, Modal, Typography, message, Image } from "antd";
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TourEditForm from "../../components/TourEditForm";

const { Title } = Typography;

const API_BASE_URL = "http://localhost:5001/api/tours";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
};

// Hàm định dạng giá với dấu phân cách hàng nghìn
const formatPrice = (price) => {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Chưa có giá";
};

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourItinerary, setTourItinerary] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?search=${searchText}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dữ liệu từ API:", data);

      if (Array.isArray(data)) {
        const parsedData = data.map((tour) => {
          // Tìm giá người lớn (Adult) từ mảng prices
          const adultPrice = tour.prices?.find(price => price.age_group === "Adult")?.price || null;

          // Chuẩn hóa itinerary
          let itineraryArray = [];
          if (typeof tour.itinerary === "string") {
            try {
              itineraryArray = JSON.parse(tour.itinerary);
            } catch (error) {
              console.error("Lỗi khi parse itinerary:", error);
              itineraryArray = [];
            }
          } else if (Array.isArray(tour.itinerary)) {
            itineraryArray = tour.itinerary;
          }

          const standardizedItinerary = itineraryArray.map((day, index) => {
            let detailsObject = { Sáng: "", Trưa: "", Tối: "" };
            if (typeof day.details === "string") {
              try {
                const detailsArray = JSON.parse(day.details);
                detailsArray.forEach((detail) => {
                  if (detail.startsWith("Sáng:")) {
                    detailsObject.Sáng = detail.replace("Sáng:", "").trim();
                  } else if (detail.startsWith("Trưa:")) {
                    detailsObject.Trưa = detail.replace("Trưa:", "").trim();
                  } else if (detail.startsWith("Chiều:")) {
                    detailsObject.Trưa = detail.replace("Chiều:", "").trim();
                  } else if (detail.startsWith("Tối:")) {
                    detailsObject.Tối = detail.replace("Tối:", "").trim();
                  }
                });
              } catch (error) {
                console.error("Lỗi khi parse details:", error);
              }
            } else if (typeof day.details === "object" && day.details !== null) {
              detailsObject = {
                Sáng: day.details["Sáng"] || "",
                Trưa: day.details["Trưa"] || "",
                Tối: day.details["Tối"] || "",
              };
            }
            return {
              day_number: day.day_number || (index + 1),
              title: day.title || `Ngày ${index + 1}`,
              details: detailsObject,
            };
          });

          return {
            ...tour,
            highlights: typeof tour.highlights === "string" ? JSON.parse(tour.highlights) : tour.highlights || [],
            itinerary: standardizedItinerary,
            images: tour.images || [],
            price: adultPrice,
          };
        });
        setTours(parsedData);
      } else {
        throw new Error("Dữ liệu từ API không đúng định dạng!");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách tour!");
      console.error("Lỗi fetchTours:", error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTourItinerary = async (tourId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${tourId}/itineraries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API lịch trình: ${response.status}`);
      }

      const data = await response.json();
      console.log("Lịch trình từ API:", data);

      if (Array.isArray(data)) {
        const parsedItinerary = data.map((item) => ({
          ...item,
          details: typeof item.details === "string" ? JSON.parse(item.details) : item.details || [],
        }));
        setTourItinerary(parsedItinerary);
      } else {
        throw new Error("Dữ liệu lịch trình không đúng định dạng!");
      }
    } catch (error) {
      message.error("Lỗi khi tải lịch trình tour!");
      console.error("Lỗi fetchTourItinerary:", error);
      setTourItinerary([]);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [searchText]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedTour.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Endpoint xóa tour không tồn tại. Vui lòng kiểm tra backend!");
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Lỗi khi xóa tour: ${response.status}`);
      }

      await fetchTours();
      setShowDeleteModal(false);
      setSelectedTour(null);
      message.success("Xóa tour thành công!");
    } catch (error) {
      message.error(error.message || "Lỗi khi xóa tour!");
      console.error("Lỗi handleDelete:", error);
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên Tour",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày Khởi Hành",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => formatDate(text),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => formatPrice(text),
    },
    {
      title: "Thời gian",
      key: "duration",
      render: (_, record) => `${record.days} NGÀY ${record.nights} ĐÊM`,
    },
    {
      title: "Ảnh",
      key: "image",
      render: (_, record) => (
        record.images && record.images.length > 0 ? (
          <Image
            src={record.images[0].image_url}
            alt={record.name}
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
            preview={false}
            placeholder={<div style={{ width: 50, height: 50, background: '#f0f0f0' }}>Đang tải...</div>}
            fallback="/images/fallback.jpg"
          />
        ) : (
          <span>Chưa có ảnh</span>
        )
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTour(record);
              fetchTourItinerary(record.id);
              setShowDetailModal(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTour(record);
              setShowEditModal(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedTour(record);
              setShowDeleteModal(true);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="tour-management">
      <Card>
        <Title level={2}>Quản lý Tour</Title>

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Tìm kiếm tour..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowEditModal(true)}>
            Thêm tour mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tours}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal title="Chi tiết tour" open={showDetailModal} onCancel={() => setShowDetailModal(false)} footer={null}>
        {selectedTour && (
          <div>
            <p>
              <strong>Tên tour:</strong> {selectedTour.name}
            </p>
            <p>
              <strong>Thời gian:</strong> {selectedTour.days} NGÀY {selectedTour.nights} ĐÊM
            </p>
            <p>
              <strong>Ngày khởi hành:</strong> {formatDate(selectedTour.start_date)}
            </p>
            <p>
              <strong>Phương tiện:</strong> {selectedTour.transportation || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Điểm khởi hành:</strong> {selectedTour.departure_point || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Mã tour:</strong> {selectedTour.tour_code || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Đặc điểm nổi bật:</strong>
            </p>
            <ul>
              {Array.isArray(selectedTour.highlights) && selectedTour.highlights.length > 0 ? (
                selectedTour.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)
              ) : (
                <li>Chưa có thông tin</li>
              )}
            </ul>
            <p>
              <strong>Lịch trình:</strong>
            </p>
            {Array.isArray(tourItinerary) && tourItinerary.length > 0 ? (
              tourItinerary.map((item, index) => (
                <div key={index}>
                  <p>
                    <strong>
                      NGÀY {item.day_number}: {item.title}
                    </strong>
                  </p>
                  <ul>
                    {Array.isArray(item.details) && item.details.length > 0 ? (
                      item.details.map((detail, detailIndex) => <li key={detailIndex}>{detail}</li>)
                    ) : (
                      <li>Chưa có chi tiết</li>
                    )}
                  </ul>
                </div>
              ))
            ) : Array.isArray(selectedTour.itinerary) && selectedTour.itinerary.length > 0 ? (
              selectedTour.itinerary.map((item, index) => (
                <div key={index}>
                  <p>
                    <strong>
                      NGÀY {item.day_number}: {item.title}
                    </strong>
                  </p>
                  <ul>
                    {Object.entries(item.details).map(([key, value], detailIndex) => (
                      value ? <li key={detailIndex}>{`${key}: ${value}`}</li> : null
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>Chưa có lịch trình</p>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Chỉnh sửa/Thêm mới */}
      <Modal
        title={selectedTour ? "Sửa tour" : "Thêm tour mới"}
        open={showEditModal}
        onOk={() => setShowEditModal(false)}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedTour(null);
        }}
        footer={null}
      >
        <TourEditForm
          tour={selectedTour}
          onSubmit={() => {
            setShowEditModal(false);
            setSelectedTour(null);
            fetchTours();
          }}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTour(null);
          }}
        />
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn xóa tour "{selectedTour?.name}" không?</p>
      </Modal>
    </div>
  );
};

export default TourManagement;