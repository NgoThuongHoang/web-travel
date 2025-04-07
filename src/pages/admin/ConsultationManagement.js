"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Input, Modal, Space, Typography, Select, Form, Checkbox } from "antd"
import { SearchOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"

const { Title } = Typography
const { Option } = Select

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const ConsultationManagement = () => {
  const [consultations, setConsultations] = useState([])
  const [selectedConsultations, setSelectedConsultations] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRevertCompleteModal, setShowRevertCompleteModal] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editConsultation, setEditConsultation] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, body: ${text.substring(0, 100)}`)
      }

      const data = await response.json()
      console.log('Raw data from API:', data)

      const mappedData = data.map(item => ({
        id: item.id,
        name: item.ten || 'N/A',
        phone: item.dienthoai || 'N/A',
        address: item.diachi || 'N/A',
        email: item.email || 'N/A',
        content: item.noidung || 'N/A',
        requestDate: item.created_at || new Date(),
        status: item.status || 'in_progress'
      }))
      
      console.log('Mapped consultations:', mappedData)
      setConsultations(mappedData)
    } catch (error) {
      console.error('Error fetching consultations:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'completed' })
      })
      if (!response.ok) throw new Error('Failed to update status')
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: "completed" } : c))
      setShowCompleteModal(false)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleRevertComplete = async (id) => {
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'in_progress' })
      })
      if (!response.ok) throw new Error('Failed to revert status')
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: "in_progress" } : c))
      setShowRevertCompleteModal(false)
    } catch (error) {
      console.error('Error reverting status:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/contact/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete')
      setConsultations(prev => prev.filter(c => c.id !== id))
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting consultation:', error)
    }
  }

  const handleConfirmSelected = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/contact/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedConsultations, status: 'completed' })
      })
      if (!response.ok) throw new Error('Failed to bulk update')
      setConsultations(prev => prev.map(c => selectedConsultations.includes(c.id) ? { ...c, status: "completed" } : c))
      setSelectedConsultations([])
    } catch (error) {
      console.error('Error bulk updating:', error)
    }
  }

  const getFilteredConsultations = () => {
    return consultations.filter(c =>
      (c.name.toLowerCase().includes(searchText.toLowerCase()) ||
       c.phone.includes(searchText)) &&
      (statusFilter ? c.status === statusFilter : true)
    )
  }

  const handleEditClick = (record) => {
    setEditConsultation(record)
    setShowEditModal(true)
  }

  const handleEdit = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editConsultation.id,
          name: editConsultation.name,
          phone: editConsultation.phone,
          address: editConsultation.address,
          email: editConsultation.email,
          content: editConsultation.content,
          status: editConsultation.status
        })
      })
      if (!response.ok) throw new Error('Failed to update consultation')
      setConsultations(prev => prev.map(c => c.id === editConsultation.id ? editConsultation : c))
      setShowEditModal(false)
    } catch (error) {
      console.error('Error updating consultation:', error)
    }
  }

  const columns = [
    {
      title: <Checkbox
        onChange={(e) => setSelectedConsultations(e.target.checked ? consultations.map(c => c.id) : [])}
        checked={selectedConsultations.length === consultations.length}
      />,
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedConsultations.includes(record.id)}
          onChange={() => setSelectedConsultations(prev =>
            prev.includes(record.id) ? prev.filter(id => id !== record.id) : [...prev, record.id]
          )}
        />
      ),
    },
    { title: "STT", key: "index", width: 60, render: (_, __, index) => index + 1 },
    { title: "Họ và tên", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestDate",
      key: "requestDate",
      render: formatDate,
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
          <Button icon={<EyeOutlined />} type="primary" onClick={() => { setSelectedConsultation(record); setShowDetailModal(true); }}>
            Chi tiết
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)}>Sửa</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => { setSelectedConsultation(record); setShowDeleteModal(true); }}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="consultation-management">
      <Card>
        <Title level={2}>Quản lý yêu cầu tư vấn</Title>
        {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
        {loading && <p>Đang tải dữ liệu...</p>}
        
        <Space style={{ marginBottom: 16 }} wrap>
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
          <Button type="primary" onClick={handleConfirmSelected} disabled={selectedConsultations.length === 0}>
            Xác nhận đã tư vấn
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={getFilteredConsultations()}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Chỉnh sửa yêu cầu tư vấn"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleEdit}
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label="Họ và tên" required>
            <Input value={editConsultation.name} onChange={(e) => setEditConsultation({ ...editConsultation, name: e.target.value })} />
          </Form.Item>
          <Form.Item label="Số điện thoại" required>
            <Input value={editConsultation.phone} onChange={(e) => setEditConsultation({ ...editConsultation, phone: e.target.value })} />
          </Form.Item>
          <Form.Item label="Địa chỉ" required>
            <Input value={editConsultation.address} onChange={(e) => setEditConsultation({ ...editConsultation, address: e.target.value })} />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input value={editConsultation.email} onChange={(e) => setEditConsultation({ ...editConsultation, email: e.target.value })} />
          </Form.Item>
          <Form.Item label="Nội dung" required>
            <Input.TextArea value={editConsultation.content} onChange={(e) => setEditConsultation({ ...editConsultation, content: e.target.value })} />
          </Form.Item>
          <Form.Item label="Trạng thái" required>
            <Select value={editConsultation.status} onChange={(value) => setEditConsultation({ ...editConsultation, status: value })}>
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="completed">Đã tư vấn</Option>
              <Option value="canceled">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết yêu cầu tư vấn"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedConsultation && (
          <div>
            <p><strong>Họ và tên:</strong> {selectedConsultation.name}</p>
            <p><strong>Số điện thoại:</strong> {selectedConsultation.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedConsultation.address}</p>
            <p><strong>Email:</strong> {selectedConsultation.email}</p>
            <p><strong>Ngày yêu cầu:</strong> {formatDate(selectedConsultation.requestDate)}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ color: selectedConsultation.status === "completed" ? "green" : selectedConsultation.status === "canceled" ? "red" : "orange" }}>
                {selectedConsultation.status === "completed" ? "Đã tư vấn" : selectedConsultation.status === "canceled" ? "Đã hủy" : "Đang xử lý"}
              </span>
            </p>
            <p><strong>Nội dung:</strong> {selectedConsultation.content}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={() => handleDelete(selectedConsultation?.id)}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn xóa yêu cầu tư vấn này?</p>
      </Modal>

      <Modal
        title="Xác nhận hủy Đã tư vấn"
        open={showRevertCompleteModal}
        onOk={() => handleRevertComplete(selectedConsultation?.id)}
        onCancel={() => setShowRevertCompleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn hủy trạng thái Đã tư vấn?</p>
      </Modal>

      <Modal
        title="Xác nhận Đã tư vấn"
        open={showCompleteModal}
        onOk={() => handleComplete(selectedConsultation?.id)}
        onCancel={() => setShowCompleteModal(false)}
      >
        <p>Bạn có chắc chắn muốn đánh dấu là Đã tư vấn?</p>
      </Modal>
    </div>
  )
}

export default ConsultationManagement