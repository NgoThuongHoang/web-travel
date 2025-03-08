"use client"

import { useState, useEffect } from "react"
import { Table, Card, Input, Select, Button, Tag, Space, Modal, Form, Typography } from "antd"
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"

const { Title } = Typography
const { Option } = Select

// Dữ liệu mẫu cho các tour
const mockTours = [
  {
    _id: 1,
    name: "Tour Đà Nẵng",
    startDate: "2024-03-20",
    price: "2,000,000 VNĐ",
    status: "active",
    duration: "4 NGÀY 3 ĐÊM",
    transportation: "MÁY BAY",
    departurePoint: "TP HCM",
    tourCode: "DN123",
    highlights: ["Tham quan Bà Nà Hills", "Khám phá Cầu Vàng", "Thưởng thức đặc sản Đà Nẵng"],
    itinerary: [
      {
        day: "NGÀY 1",
        title: "TP.HCM - ĐÀ NẴNG - NGŨ HÀNH SƠN - HỘI AN (Ăn trưa, tối)",
        details: [
          "Sáng: Đón khách tại sân bay Tân Sơn Nhất làm thủ tục bay đến Đà Nẵng.",
          "Tham quan Ngũ Hành Sơn và làng đá mỹ nghệ Non Nước.",
          "Chiều: Di chuyển đến Hội An, tham quan phố cổ.",
          "Tối: Thưởng thức đặc sản cao lầu, mì Quảng.",
        ],
      },
    ],
  },

  {
    _id: 2,
    name: "Tour Nha Trang",
    startDate: "2024-04-15",
    price: "3,000,000 VNĐ",
    status: "pending",
    duration: "3 NGÀY 2 ĐÊM",
    transportation: "XE KHÁCH",
    departurePoint: "HÀ NỘI",
    tourCode: "NT456",
    highlights: [
      "Tắm biển tại Bãi Dài",
      "Tham quan VinWonders Nha Trang",
      "Khám phá Tháp Bà Ponagar",
    ],
    itinerary: [
      {
        day: "NGÀY 1",
        title: "HÀ NỘI - NHA TRANG - VINWONDERS (Ăn trưa, tối)",
        details: [
          "Sáng: Bay từ Hà Nội vào Nha Trang, nhận phòng khách sạn.",
          "Tham quan VinWonders Nha Trang.",
          "Tối: Khám phá chợ đêm Nha Trang.",
        ],
      },
    ],
  },
  
  // ... other tour data
]

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const TourManagement = () => {
  const [tours, setTours] = useState([])
  const [searchText, setSearchText] = useState("")
  const [selectedTour, setSelectedTour] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [form] = Form.useForm()
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    setTours(mockTours)
  }, [])

  const handleFormSubmit = async (values) => {
    const formattedValues = {
      ...values,
      itinerary: Array.isArray(values.itinerary)
        ? values.itinerary
        : values.itinerary.split("\n").map((line) => {
            const [day, title] = line.split(": ")
            return { day, title, details: [] }
          }),
    }

    if (selectedTour) {
      setTours((prevTours) =>
        prevTours.map((tour) => (tour._id === selectedTour._id ? { ...tour, ...formattedValues } : tour)),
      )
    } else {
      const newTour = { _id: Date.now(), ...formattedValues }
      setTours((prevTours) => [...prevTours, newTour])
    }
    setShowEditModal(false)
    setSelectedTour(null)
    form.resetFields()
  }

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
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : status === "pending" ? "gold" : "red"}>
          {status === "active" ? "Đang diễn ra" : status === "pending" ? "Chờ triển khai" : "Đã hoàn thành"}
        </Tag>
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
              setSelectedTour(record)
              setShowDetailModal(true)
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTour(record)
              setShowEditModal(true)
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedTour(record)
              setShowDeleteModal(true)
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    if (selectedTour) {
      form.setFieldsValue({
        ...selectedTour,
        itinerary: selectedTour.itinerary.map((item) => `${item.day}: ${item.title} (${item.details.join(", ")})`).join("\n"),
      })
    } else {
      form.resetFields()
    }
  }, [selectedTour, form])

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
          <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
            <Option value="all">Tất cả</Option>
            <Option value="active">Đang diễn ra</Option>
            <Option value="pending">Chờ triển khai</Option>
            <Option value="completed">Đã hoàn thành</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowEditModal(true)}>
            Thêm tour mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tours.filter((tour) => {
            const matchesName = tour.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = filterStatus === "all" || tour.status === filterStatus;
            return matchesName && matchesStatus;
          })}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal title="Chi tiết tour" visible={showDetailModal} onCancel={() => setShowDetailModal(false)} footer={null}>
        {selectedTour && (
          <div>
            <p>
              <strong>Tên tour:</strong> {selectedTour.name}
            </p>
            <p>
              <strong>Thời gian:</strong> {selectedTour.duration}
            </p>
            <p>
              <strong>Ngày khởi hành:</strong> {formatDate(selectedTour.startDate)}
            </p>
            <p>
              <strong>Phương tiện:</strong> {selectedTour.transportation}
            </p>
            <p>
              <strong>Điểm khởi hành:</strong> {selectedTour.departurePoint}
            </p>
            <p>
              <strong>Mã tour:</strong> {selectedTour.tourCode}
            </p>
            <p>
              <strong>ĐẶC ĐIỂM NỔI BẬT:</strong>
            </p>
            <ul>
              {selectedTour.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
            <p>
              <strong>Lịch trình:</strong>
            </p>
            {selectedTour.itinerary.map((item, index) => (
              <div key={index}>
                <p>
                  <strong>
                    {item.day}: {item.title}
                  </strong>
                </p>
                <ul>
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal Chỉnh sửa/Thêm mới */}
      <Modal
        title={selectedTour ? "Sửa tour" : "Thêm tour mới"}
        visible={showEditModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedTour(null)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Tên tour" rules={[{ required: true, message: "Vui lòng nhập tên tour" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày khởi hành"
            rules={[{ required: true, message: "Vui lòng chọn ngày khởi hành" }]}
          >
            <Input type="date" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian" rules={[{ required: true, message: "Vui lòng nhập thời gian" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="transportation"
            label="Phương tiện"
            rules={[{ required: true, message: "Vui lòng nhập phương tiện" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="departurePoint"
            label="Điểm khởi hành"
            rules={[{ required: true, message: "Vui lòng nhập điểm khởi hành" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="tourCode" label="Mã tour" rules={[{ required: true, message: "Vui lòng nhập mã tour" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="itinerary"
            label="Lịch trình"
            rules={[{ required: true, message: "Vui lòng nhập lịch trình" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
            <Select>
              <Option value="active">Đang diễn ra</Option>
              <Option value="pending">Chờ triển khai</Option>
              <Option value="completed">Đã hoàn thành</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa"
        visible={showDeleteModal}
        onOk={() => {
          setTours(tours.filter((tour) => tour._id !== selectedTour._id))
          setShowDeleteModal(false)
        }}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn xóa tour "{selectedTour?.name}" không?</p>
      </Modal>
    </div>
  )
}

export default TourManagement

