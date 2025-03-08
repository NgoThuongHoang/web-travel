"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Input, Modal, Form, Space, Typography, List } from "antd"
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import moment from "moment"

const { Title } = Typography

// Dữ liệu mẫu
const INITIAL_CUSTOMERS = [
  {
    id: 1,
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0901234567",
    address: "Hà Nội",
    createdAt: "2024-01-15",
    participatedTours: [
      { name: "Tour Đà Nẵng", code: "DN001" },
      { name: "Tour Hạ Long", code: "HL002" },
    ],
  },
  {
    id: 2,
    fullName: "Trần Thị Bình",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    address: "Hồ Chí Minh",
    createdAt: "2024-01-16",
    participatedTours: [{ name: "Tour Phú Quốc", code: "PQ003" }],
  },
  {
    id: 3,
    fullName: "Lê Văn Cường",
    email: "levanc@gmail.com",
    phone: "0923456789",
    address: "Đà Nẵng",
    createdAt: "2024-01-17",
    participatedTours: [],
  },
]

const CustomerManagement = () => {
  const [form] = Form.useForm()
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    if (selectedCustomer && showEditModal) {
      form.setFieldsValue({
        fullName: selectedCustomer.fullName,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
      })
    } else {
      form.resetFields()
    }
  }, [selectedCustomer, showEditModal, form])

  const handleFormSubmit = (values) => {
    if (selectedCustomer) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === selectedCustomer.id
            ? { ...customer, ...values, participatedTours: customer.participatedTours || [] }
            : customer,
        ),
      )
    } else {
      const newCustomer = {
        id: Date.now(),
        ...values,
        createdAt: moment().format("YYYY-MM-DD"),
        participatedTours: [],
      }
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer])
    }
    setShowEditModal(false)
    setSelectedCustomer(null)
  }

  const getFilteredCustomers = () => {
    return customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText),
    )
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY"),
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
              setSelectedCustomer(record)
              setShowDetailModal(true)
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedCustomer(record)
              setShowEditModal(true)
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedCustomer(record)
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
    <div className="customer-management">
      <Card>
        <Title level={2}>Quản lý khách hàng</Title>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
              prefix={<SearchOutlined />}
              style={{ width: 330 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedCustomer(null)
                setShowEditModal(true)
              }}
            >
              Thêm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={getFilteredCustomers()}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: getFilteredCustomers().length,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
            showSizeChanger: false,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal
        title="Chi tiết khách hàng"
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedCustomer && (
          <div>
            <p>
              <strong>Họ và tên:</strong> {selectedCustomer.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedCustomer.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedCustomer.address}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {moment(selectedCustomer.createdAt).format("DD/MM/YYYY")}
            </p>
            <div>
              <strong>Tour đã tham gia:</strong>
              {selectedCustomer.participatedTours && selectedCustomer.participatedTours.length > 0 ? (
                <List
                  dataSource={selectedCustomer.participatedTours}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta title={item.name} description={`Mã tour: ${item.code}`} />
                    </List.Item>
                  )}
                />
              ) : (
                <p>Chưa tham gia tour nào</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Chỉnh sửa/Thêm mới */}
      <Modal
        title={selectedCustomer ? "Sửa thông tin khách hàng" : "Thêm khách hàng mới"}
        visible={showEditModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedCustomer(null)
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa"
        visible={showDeleteModal}
        onOk={() => {
          setCustomers(customers.filter((customer) => customer.id !== selectedCustomer.id))
          setShowDeleteModal(false)
          setSelectedCustomer(null)
        }}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedCustomer(null)
        }}
      >
        <p>Bạn có chắc chắn muốn xóa khách hàng này?</p>
      </Modal>
    </div>
  )
}

export default CustomerManagement

