"use client";

import { useState, useEffect } from "react";
import { Table, Card, Input, Button, Space, Modal, Typography, message, Image, Select } from "antd";
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TourEditForm from "../../components/TourEditForm";

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5001/api/tours";

const formatDate = (dateString) => {
  if (!dateString) return "Chưa có thông tin";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  } catch (error) {
    console.error("Lỗi khi định dạng ngày:", error);
    return dateString;
  }
};

const formatPrice = (price) => {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Chưa có giá";
};

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Thêm state để lưu trạng thái lọc
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourItinerary, setTourItinerary] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTours = async () => {
    setLoading(true);
    try {
      // Tạo query string với cả search và status
      const query = new URLSearchParams();
      if (searchText) query.append("search", searchText);
      if (filterStatus) query.append("status", filterStatus);

      const response = await fetch(`${API_BASE_URL}?${query.toString()}`, {
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
          const adultPrice = tour.prices?.find(price => price.age_group === "Adult")?.price || null;

          return {
            ...tour,
            highlights: typeof tour.highlights === "string" ? JSON.parse(tour.highlights) : tour.highlights || [],
            images: tour.images || [],
            price: adultPrice,
            displayStatus: tour.status === "pending" ? "Đang chờ" : "Hoạt động",
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
        const parsedItinerary = data.map((item) => {
          let detailsObject = { Sáng: "", Trưa: "", Chiều: "", Tối: "" };

          try {
            let detailsArray = [];
            if (typeof item.details === "string") {
              detailsArray = JSON.parse(item.details);
            } else if (Array.isArray(item.details)) {
              detailsArray = item.details;
            }

            if (Array.isArray(detailsArray)) {
              detailsArray.forEach((detail) => {
                if (typeof detail === "string") {
                  if (detail.startsWith("Sáng:")) {
                    detailsObject.Sáng = detail.replace("Sáng:", "").trim();
                  } else if (detail.startsWith("Trưa:")) {
                    detailsObject.Trưa = detail.replace("Trưa:", "").trim();
                  } else if (detail.startsWith("Chiều:")) {
                    detailsObject.Chiều = detail.replace("Chiều:", "").trim();
                  } else if (detail.startsWith("Tối:")) {
                    detailsObject.Tối = detail.replace("Tối:", "").trim();
                  }
                }
              });
            }
          } catch (error) {
            console.error("Lỗi khi parse details:", error);
          }

          return {
            ...item,
            details: detailsObject,
          };
        });
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

  // Gọi fetchTours khi searchText hoặc filterStatus thay đổi
  useEffect(() => {
    fetchTours();
  }, [searchText, filterStatus]);

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

  const handleSubmit = async (tourData) => {
    try {
      const tourPayload = {
        name: tourData.title || "Tour không có tiêu đề",
        days: parseInt(tourData.days) || 1,
        nights: parseInt(tourData.nights) || 0,
        start_date: tourData.departureDate || new Date().toISOString().split('T')[0],
        status: tourData.status || "active",
        star_rating: parseInt(tourData.star_rating) || 3,
        transportation: tourData.transportation || "Không xác định",
        departure_point: tourData.departurePoint || "Không xác định",
        highlights: tourData.highlights || [],
        itinerary: tourData.itinerary || [],
        prices: tourData.prices || [],
        images: (tourData.images || [])
          .filter(image => image.image_url)
          .map((image) => ({
            image_url: image.image_url,
            caption: image.caption || null,
          })),
        region: tourData.region || "Không xác định",
      };

      console.log("tourPayload:", tourPayload);

      let tourResponse;
      if (selectedTour) {
        tourResponse = await fetch(`${API_BASE_URL}/${selectedTour.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tourPayload),
        });
      } else {
        tourResponse = await fetch(`${API_BASE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tourPayload),
        });
      }

      if (!tourResponse.ok) {
        const errorData = await tourResponse.json();
        throw new Error(errorData.error || `Lỗi khi ${selectedTour ? 'cập nhật' : 'tạo'} tour: ${tourResponse.status} - Không có thông tin lỗi chi tiết`);
      }

      message.success(selectedTour ? "Cập nhật tour thành công!" : "Thêm tour thành công!");
      await fetchTours();
    } catch (error) {
      message.error(error.message || `Lỗi khi ${selectedTour ? 'cập nhật' : 'tạo'} tour!`);
      console.error("Lỗi handleSubmit:", error);
    } finally {
      setShowEditModal(false);
      setSelectedTour(null);
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
      title: "Khu vực",
      dataIndex: "region",
      key: "region",
      render: (text) => text || "Không xác định",
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
      title: "Trạng thái",
      dataIndex: "displayStatus",
      key: "status",
      render: (text, record) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "16px",
            backgroundColor: record.status === "active" ? "#52c41a" : "#fadb14", // Xanh cho active, vàng cho pending
            color: record.status === "active" ? "#fff" : "#000",
            fontWeight: "500",
          }}
        >
          {text}
        </span>
      ),
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
            placeholder="Tìm kiếm theo tên tour hoặc mã tour..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value="">Tất cả</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="pending">Đang chờ</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setSelectedTour(null);
            setShowEditModal(true);
          }}>
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

      <Modal title="Chi tiết tour" open={showDetailModal} onCancel={() => setShowDetailModal(false)} footer={null}>
        {selectedTour && (
          <div>
            <p>
              <strong>Tên tour:</strong> {selectedTour.name}
            </p>
            <p>
              <strong>Khu vực:</strong> {selectedTour.region || "Không xác định"}
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
              <strong>Trạng thái:</strong> {selectedTour.status === "pending" ? "Đang chờ" : "Hoạt động"}
            </p>
            <p>
              <strong>Giá tour:</strong>
            </p>
            {selectedTour.prices && selectedTour.prices.length > 0 ? (
              selectedTour.prices.map((price, index) => (
                <div key={index}>
                  <Text strong>{price.age_group === "Under 5" ? "Trẻ dưới 5 tuổi" : price.age_group === "5-11" ? "Trẻ 5-11 tuổi" : "Người lớn"}: </Text>
                  <Text>{formatPrice(price.price)} VNĐ</Text>
                  {price.single_room_price && (
                    <>
                      <Text> (Phòng đơn: {formatPrice(price.single_room_price)} VNĐ)</Text>
                    </>
                  )}
                  <br />
                  <Text>{price.description}</Text>
                  <br />
                </div>
              ))
            ) : (
              <p>Chưa có thông tin giá</p>
            )}
          </div>
        )}
      </Modal>

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
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTour(null);
          }}
        />
      </Modal>

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