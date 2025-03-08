"use client"

import { useState } from "react"
import { Card, Table, Button, Input, Modal, Space, Typography, Select, Form, Checkbox } from "antd"
import { SearchOutlined, EyeOutlined, CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"

const { Title } = Typography
const { Option } = Select

// Dữ liệu mẫu
const INITIAL_CONSULTATIONS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    requestDate: "2024-03-01",
    status: "in_progress",
    content: "Cần tư vấn về dịch vụ du lịch Đà Nẵng.",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@example.com",
    requestDate: "2024-03-05",
    status: "completed",
    content: "Cần tư vấn về tour Hạ Long 3 ngày 2 đêm.",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    email: "levanc@example.com",
    requestDate: "2024-03-10",
    status: "canceled",
    content: "Cần tư vấn về dịch vụ du lịch Nha Trang.",
  },
]

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const ConsultationManagement = () => {
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS)
  const [selectedConsultations, setSelectedConsultations] = useState([]) // State for selected consultations
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRevertCompleteModal, setShowRevertCompleteModal] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editConsultation, setEditConsultation] = useState({})

  // Xử lý Đã tư vấn yêu cầu
  const handleComplete = (id) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "completed" } : c))
    )
    setShowCompleteModal(false)
  }

  // Xử lý hủy Đã tư vấn
  const handleRevertComplete = (id) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "in_progress" } : c))
    )
    setShowRevertCompleteModal(false)
  }

  // Xử lý xóa yêu cầu
  const handleDelete = (id) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id))
    setShowDeleteModal(false)
  }

  // Xử lý xác nhận nhiều yêu cầu
  const handleConfirmSelected = () => {
    setConsultations((prev) =>
      prev.map((c) =>
        selectedConsultations.includes(c.id) ? { ...c, status: "completed" } : c
      )
    )
    setSelectedConsultations([]) // Clear selection after confirmation
  }

  // Lọc danh sách yêu cầu
  const getFilteredConsultations = () => {
    return consultations.filter(
      (c) =>
        (c.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.phone.includes(searchText)) &&
        (statusFilter ? c.status === statusFilter : true)
    )
  }

  const handleEditClick = (record) => {
    setEditConsultation(record); // Thiết lập thông tin yêu cầu tư vấn đã chọn
    setShowEditModal(true); // Mở modal chỉnh sửa
  }

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedConsultations(checked ? consultations.map(c => c.id) : []);
          }}
          checked={selectedConsultations.length === consultations.length}
        />
      ),
      key: "select",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedConsultations.includes(record.id)}
          onChange={() =>
            setSelectedConsultations((prev) =>
              prev.includes(record.id)
                ? prev.filter((id) => id !== record.id)
                : [...prev, record.id]
            )
          }
        />
      ),
    },
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    { title: "Họ và tên", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (requestDate) => formatDate(requestDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "completed" ? "green" : status === "canceled" ? "red" : "orange" }}>
          {status === "completed" ? "Đã tư vấn" : status === "canceled" ? "Đã hủy" : "Đang xử lý"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => {
              setSelectedConsultation(record);
              setShowDetailModal(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedConsultation(record);
              setShowDeleteModal(true);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = () => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === editConsultation.id ? editConsultation : c
      )
    )
    setShowEditModal(false)
  }

  return (
    <div className="consultation-management">
      <Card>
        <Title level={2}>Quản lý yêu cầu tư vấn</Title>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="Tìm theo tên, SĐT"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: 200 }}
              onChange={(value) => setStatusFilter(value)}
              allowClear
            >
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="completed">Đã tư vấn</Option>
              <Option value="canceled">Đã hủy</Option>
            </Select>
            <Button
              type="primary"
              onClick={handleConfirmSelected}
              disabled={selectedConsultations.length === 0}
            >
              Xác nhận đã tư vấn
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={getFilteredConsultations()}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Chỉnh sửa yêu cầu tư vấn"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleEdit}
        width={800}
      >
        <Form layout="vertical" onFinish={handleEdit}>
          <Form.Item
            label={<span><strong style={{ color: 'red' }}>*</strong> <strong>Họ và tên:</strong></span>}
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input
              value={editConsultation.name}
              onChange={(e) =>
                setEditConsultation({ ...editConsultation, name: e.target.value })
              }
              placeholder="Họ và tên"
            />
          </Form.Item>
          <Form.Item
            label={<span><strong style={{ color: 'red' }}>*</strong> <strong>Số điện thoại:</strong></span>}
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input
              value={editConsultation.phone}
              onChange={(e) =>
                setEditConsultation({ ...editConsultation, phone: e.target.value })
              }
              placeholder="Số điện thoại"
            />
          </Form.Item>
          <Form.Item
            label={<span><strong style={{ color: 'red' }}>*</strong> <strong>Email:</strong></span>}
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input
              value={editConsultation.email}
              onChange={(e) =>
                setEditConsultation({ ...editConsultation, email: e.target.value })
              }
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            label={<span><strong style={{ color: 'red' }}>*</strong> <strong>Nội dung cần tư vấn:</strong></span>}
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input
              value={editConsultation.content}
              onChange={(e) =>
                setEditConsultation({ ...editConsultation, content: e.target.value })
              }
              placeholder="Nội dung cần tư vấn"
            />
          </Form.Item>
          <Form.Item
            label={<span><strong style={{ color: 'red' }}>*</strong> <strong>Trạng thái:</strong></span>}
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              value={editConsultation.status}
              onChange={(value) =>
                setEditConsultation({ ...editConsultation, status: value })
              }
              placeholder="Chọn trạng thái"
            >
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="completed">Đã tư vấn</Option>
              <Option value="canceled">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết yêu cầu tư vấn"
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedConsultation && (
          <div>
            <p>
              <strong>Họ và tên:</strong> {selectedConsultation.name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedConsultation.phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedConsultation.email}
            </p>
            <p>
              <strong>Ngày yêu cầu:</strong> {formatDate(selectedConsultation.requestDate)}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ color: selectedConsultation.status === "completed" ? "green" : selectedConsultation.status === "canceled" ? "red" : "orange" }}>
                {selectedConsultation.status === "completed" ? "Đã tư vấn" : selectedConsultation.status === "canceled" ? "Đã hủy" : "Đang xử lý"}
              </span>
            </p>
            <p>
              <strong>Nội dung cần tư vấn:</strong> {selectedConsultation.content}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa"
        visible={showDeleteModal}
        onOk={() => handleDelete(selectedConsultation?.id)}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn xóa yêu cầu tư vấn này?</p>
      </Modal>

      <Modal
        title="Xác nhận hủy Đã tư vấn"
        visible={showRevertCompleteModal}
        onOk={() => handleRevertComplete(selectedConsultation?.id)}
        onCancel={() => setShowRevertCompleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn hủy trạng thái Đã tư vấn của yêu cầu tư vấn này?</p>
      </Modal>

      <Modal
        title="Xác nhận Đã tư vấn"
        visible={showCompleteModal}
        onOk={() => handleComplete(selectedConsultation?.id)}
        onCancel={() => setShowCompleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn đánh dấu yêu cầu tư vấn này là Đã tư vấn?</p>
      </Modal>
    </div>
  )
}

export default ConsultationManagement
