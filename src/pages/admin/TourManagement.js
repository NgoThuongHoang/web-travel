"use client";

import { useState, useEffect } from "react";
import { Table, Card, Input, Button, Space, Modal, Form, Typography, message, Image } from "antd";
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
  const [form] = Form.useForm();
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

          return {
            ...tour,
            highlights: typeof tour.highlights === "string" ? JSON.parse(tour.highlights) : tour.highlights || [],
            itinerary: typeof tour.itinerary === "string" ? JSON.parse(tour.itinerary) : tour.itinerary || [],
            images: tour.images || [], // Đảm bảo images luôn là mảng
            price: adultPrice, // Thêm giá người lớn vào dữ liệu tour
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

  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        itinerary: values.itinerary
          ? values.itinerary.split("\n").map((line) => {
              const [day, title] = line.split(": ");
              return { day, title, details: [] };
            })
          : [],
        highlights: values.highlights ? values.highlights.split("\n") : [],
      };

      const url = selectedTour ? `${API_BASE_URL}/${selectedTour.id}` : API_BASE_URL;
      const method = selectedTour ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) throw new Error(`Lỗi khi ${selectedTour ? "cập nhật" : "thêm"} tour`);
      await fetchTours();
      setShowEditModal(false);
      setSelectedTour(null);
      form.resetFields();
      message.success(selectedTour ? "Cập nhật tour thành công!" : "Thêm tour thành công!");
    } catch (error) {
      message.error(`Lỗi khi ${selectedTour ? "cập nhật" : "thêm"} tour!`);
      console.error(error);
    }
  };

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
      render: (text) => formatPrice(text), // Sử dụng hàm formatPrice để định dạng giá
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
            src={record.images[0].image_url} // Sử dụng image_url từ dữ liệu API
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

  useEffect(() => {
    if (selectedTour) {
      form.setFieldsValue({
        ...selectedTour,
        itinerary: selectedTour.itinerary
          ? selectedTour.itinerary.map((item) => `${item.day}: ${item.title}`).join("\n")
          : "",
        highlights: selectedTour.highlights ? selectedTour.highlights.join("\n") : "",
      });
    } else {
      form.resetFields();
    }
  }, [selectedTour, form]);

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
                      {item.day}: {item.title}
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
        onOk={() => form.submit()}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedTour(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Tên tour" rules={[{ required: true, message: "Vui lòng nhập tên tour" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Ngày khởi hành"
            rules={[{ required: true, message: "Vui lòng chọn ngày khởi hành" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item name="price" label="Giá">
            <Input />
          </Form.Item>
          <Form.Item name="days" label="Số ngày" rules={[{ required: true, message: "Vui lòng nhập số ngày" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="nights" label="Số đêm" rules={[{ required: true, message: "Vui lòng nhập số đêm" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="transportation" label="Phương tiện">
            <Input />
          </Form.Item>
          <Form.Item name="departure_point" label="Điểm khởi hành">
            <Input />
          </Form.Item>
          <Form.Item name="tour_code" label="Mã tour">
            <Input />
          </Form.Item>
          <Form.Item name="highlights" label="Đặc điểm nổi bật">
            <Input.TextArea rows={3} placeholder="Nhập mỗi đặc điểm trên một dòng" />
          </Form.Item>
          <Form.Item name="itinerary" label="Lịch trình">
            <Input.TextArea rows={4} placeholder="Nhập lịch trình theo định dạng: NGÀY 1: Tiêu đề" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng nhập trạng thái (active, pending, completed)" }]}
          >
            <Input placeholder="Nhập trạng thái: active, pending, hoặc completed" />
          </Form.Item>
        </Form>
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