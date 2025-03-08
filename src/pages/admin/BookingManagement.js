import { useState, useEffect } from "react"
import { Card, Table, Button, Input, Modal, Form, Space, Typography, List, Select, Checkbox } from "antd"
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"

const { Title } = Typography
const { Option } = Select

// Dữ liệu mẫu
const INITIAL_ORDERS = [
  {
    id: 1,
    customerName: "Nguyễn Văn An",
    tourName: "Tour Đà Nẵng",
    tourCode: "DN001",
    orderDate: "2024-03-01",
    startDate: "2024-05-15",
    endDate: "2024-05-20",
    status: "confirmed",
    participants: [
      { name: "Nguyễn Văn An", phone: "0901234567" },
      { name: "Trần Thị B", phone: "0912345678" },
    ],
  },
  {
    id: 2,
    customerName: "Trần Thị Bình",
    tourName: "Tour Hạ Long",
    tourCode: "HL002",
    orderDate: "2024-03-05",
    startDate: "2024-06-10",
    endDate: "2024-06-17",
    status: "pending",
    participants: [
      { name: "Trần Thị Bình", phone: "0923456789" },
      { name: "Lê Văn C", phone: "0934567890" },
      { name: "Phạm Thị D", phone: "0945678901" },
    ],
  },
  {
    id: 3,
    customerName: "Lê Văn Cường",
    tourName: "Tour Phú Quốc",
    tourCode: "PQ003",
    orderDate: "2024-03-10",
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    status: "cancelled",
    participants: [
      { name: "Lê Văn Cường", phone: "0956789012" },
      { name: "Nguyễn Thị E", phone: "0967890123" },
    ],
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

const OrderManagement = () => {
  const [form] = Form.useForm()
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [customerFilter, setCustomerFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrders, setSelectedOrders] = useState([])

  useEffect(() => {
    if (selectedOrder && showEditModal) {
      form.setFieldsValue({
        customerName: selectedOrder.customerName,
        tourName: selectedOrder.tourName,
        tourCode: selectedOrder.tourCode,
        orderDate: selectedOrder.orderDate,
        startDate: selectedOrder.startDate,
        endDate: selectedOrder.endDate,
        status: selectedOrder.status,
        participants: selectedOrder.participants,
      })
    } else {
      form.resetFields()
    }
  }, [selectedOrder, showEditModal, form])

  const handleFormSubmit = (values) => {
    const newOrder = {
      id: selectedOrder ? selectedOrder.id : Date.now(),
      ...values,
      orderDate: values.orderDate,
      startDate: values.startDate,
      endDate: values.endDate,
      itinerary: selectedOrder ? selectedOrder.itinerary : [],
    }
    if (selectedOrder) {
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === selectedOrder.id ? newOrder : order)))
    } else {
      setOrders((prevOrders) => [...prevOrders, newOrder])
    }
    setShowEditModal(false)
    setSelectedOrder(null)
  }

  const getFilteredOrders = () => {
    return orders.filter(
      (order) =>
        (order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          order.tourName.toLowerCase().includes(searchText.toLowerCase()) ||
          order.tourCode.toLowerCase().includes(searchText.toLowerCase()) ||
          formatDate(order.orderDate).includes(searchText)) &&
        (statusFilter ? order.status === statusFilter : true)
    )
  }

  const handleSelectOrder = (selectedRowKeys) => {
    setSelectedOrders(selectedRowKeys)
  }

  const markAsConfirmed = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        selectedOrders.includes(order.id) ? { ...order, status: "confirmed" } : order
      )
    )
    setSelectedOrders([])
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Tour",
      dataIndex: "tourName",
      key: "tourName",
      sorter: (a, b) => a.tourName.localeCompare(b.tourName),
    },
    {
      title: "Mã tour",
      dataIndex: "tourCode",
      key: "tourCode",
      sorter: (a, b) => a.tourCode.localeCompare(b.tourCode),
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => formatDate(orderDate),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "confirmed" ? "green" : status === "pending" ? "gold" : "red"
        const text = status === "confirmed" ? "Đã xác nhận" : status === "pending" ? "Chờ xác nhận" : "Đã hủy"
        return <span style={{ color: color }}>{text}</span>
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record)
              setShowDetailModal(true)
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedOrder(record)
              setShowEditModal(true)
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedOrder(record)
              setShowDeleteModal(true)
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="order-management">
      <Card>
        <Title level={2}>Quản lý đặt tour</Title>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, tour, mã tour hoặc ngày đặt"
              prefix={<SearchOutlined />}
              style={{ width: 425 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: 200 }}
              onChange={(value) => setStatusFilter(value)}
              allowClear
            >
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowEditModal(true)}
            >
              Thêm đơn đặt tour
            </Button>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={markAsConfirmed}
              disabled={selectedOrders.length === 0}
              style={{ backgroundColor: selectedOrders.length > 0 ? 'green' : undefined, color: selectedOrders.length > 0 ? 'white' : undefined }}
            >
              Xác nhận đơn chọn
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          dataSource={getFilteredOrders()}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: orders.length,
            onChange: (page) => setCurrentPage(page),
          }}
          rowSelection={{
            selectedRowKeys: selectedOrders,
            onChange: handleSelectOrder,
          }}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal
        title="Chi tiết đơn đặt tour"
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Tour:</strong> {selectedOrder.tourName}
            </p>
            <p>
              <strong>Mã tour:</strong> {selectedOrder.tourCode}
            </p>
            <p>
              <strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}
            </p>
            <p>
              <strong>Ngày bắt đầu:</strong> {formatDate(selectedOrder.startDate)}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong> {formatDate(selectedOrder.endDate)}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selectedOrder.status === "confirmed"
                ? "Đã xác nhận"
                : selectedOrder.status === "pending"
                  ? "Chờ xác nhận"
                  : "Đã hủy"}
            </p>
            <p>
              <strong>Số người tham gia:</strong> {selectedOrder.participants.length}
            </p>
            <strong>Chi tiết người tham gia:</strong>
            <List
              dataSource={selectedOrder.participants}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta title={`${index + 1}. ${item.name}`} description={`Số điện thoại: ${item.phone}`} />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>

      {/* Modal Chỉnh sửa/Thêm mới */}
      <Modal
        title={selectedOrder ? "Sửa thông tin đơn đặt tour" : "Thêm đơn đặt tour mới"}
        visible={showEditModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedOrder(null)
        }}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="customerName"
            label="Khách hàng:"
            rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
            style={{ fontWeight: "bold" }}
          >
            <Input />
          </Form.Item>
          <Form.Item name="tourName" label="Tour:" rules={[{ required: true, message: "Vui lòng nhập tên tour" }]} style={{ fontWeight: "bold" }}>
            <Input />
          </Form.Item>
          <Form.Item name="tourCode" label="Mã tour:" rules={[{ required: true, message: "Vui lòng nhập mã tour" }]} style={{ fontWeight: "bold" }}>
            <Input />
          </Form.Item>
          <Form.Item name="orderDate" label="Ngày đặt:" rules={[{ required: true, message: "Vui lòng chọn ngày đặt" }]} style={{ fontWeight: "bold" }}>
            <Input type="date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu:"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
            style={{ fontWeight: "bold" }}
          >
            <Input type="date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc:"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
            style={{ fontWeight: "bold" }}
          >
            <Input type="date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái:" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]} style={{ fontWeight: "bold" }}>
            <Select>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            {/* Các trường nhập liệu khác */}
            <Form.Item
              name="customerName"
              label="Khách hàng:"
              rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
              style={{ fontWeight: "bold" }}
            >
              <Input />
            </Form.Item>
            <Form.Item name="tourName" label="Tour:" rules={[{ required: true, message: "Vui lòng nhập tên tour" }]} style={{ fontWeight: "bold" }}>
              <Input />
            </Form.Item>
            {/* ... */}

            {/* Phần Chi tiết người tham gia */}
            <Form.Item label="Chi tiết người tham gia:" required style={{ fontWeight: "bold" }}>
              <Form.List name="participants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 12, gap: 8 }} // Giảm margin và thêm gap
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                          style={{ marginBottom: 0 }} // Loại bỏ margin dưới của Form.Item
                        >
                          <Input placeholder="Tên người tham gia" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "phone"]}
                          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                          style={{ marginBottom: 0 }} // Loại bỏ margin dưới của Form.Item
                        >
                          <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Xóa
                        </Button>
                      </Space>
                    ))}
                    <Form.Item style={{ marginBottom: 0 }}> {/* Loại bỏ margin dưới của Form.Item */}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm người tham gia
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Form>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa"
        visible={showDeleteModal}
        onOk={() => {
          setOrders(orders.filter((order) => order.id !== selectedOrder.id))
          setShowDeleteModal(false)
          setSelectedOrder(null)
        }}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedOrder(null)
        }}
      >
        <p>Bạn có chắc chắn muốn xóa đơn đặt tour này?</p>
      </Modal>
    </div>
  )
}

export default OrderManagement
