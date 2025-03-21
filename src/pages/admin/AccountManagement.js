import { useState, useEffect } from "react"
import { Card, Table, Button, Input, Modal, Form, Space, Typography, message, Select } from "antd"
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, KeyOutlined } from "@ant-design/icons"
import '../../styles/AccountManagement.css'

const { Title } = Typography
const { Option } = Select

const API_BASE_URL = "http://localhost:5001/api/accounts"

const AccountManagement = () => {
  const [form] = Form.useForm()
  const [resetForm] = Form.useForm()
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5) // Sửa pageSize thành 5
  const [loading, setLoading] = useState(false)
  const [totalAccounts, setTotalAccounts] = useState(0) // Thêm state để lưu tổng số tài khoản

  const fetchAccounts = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}?search=${searchText}&status=${statusFilter}&page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dữ liệu từ API:", data);

      // Giả sử API trả về dữ liệu dạng { accounts: [], total: number }
      // Nếu API của bạn không trả về total, bạn có thể dùng data.length
      setAccounts(data.accounts || data || []);
      setTotalAccounts(data.total || data.length || 0); // Cập nhật tổng số tài khoản
    } catch (error) {
      message.error("Lỗi khi tải danh sách tài khoản!");
      console.error("Lỗi fetchAccounts:", error);
      setAccounts([]);
      setTotalAccounts(0);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts(currentPage); // Gọi API với trang hiện tại
  }, [searchText, statusFilter, currentPage]) // Thêm currentPage vào dependencies

  useEffect(() => {
    if (selectedAccount && showEditModal) {
      form.setFieldsValue({
        username: selectedAccount.username,
        email: selectedAccount.email,
        fullName: selectedAccount.fullName,
        role: selectedAccount.role,
        status: selectedAccount.status,
      })
    } else {
      form.resetFields()
    }
  }, [selectedAccount, showEditModal, form])

  const handleFormSubmit = async (values) => {
    try {
      const url = selectedAccount ? `${API_BASE_URL}/${selectedAccount.id}` : API_BASE_URL
      const method = selectedAccount ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Lỗi khi lưu tài khoản")
      await fetchAccounts(currentPage) // Gọi lại API với trang hiện tại
      setShowEditModal(false)
      setSelectedAccount(null)
      message.success(selectedAccount ? "Cập nhật tài khoản thành công!" : "Thêm tài khoản thành công!")
    } catch (error) {
      message.error("Lỗi khi lưu tài khoản!")
      console.error(error)
    }
  }

  const handleResetPassword = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedAccount.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword }),
      })

      if (!response.ok) throw new Error("Lỗi khi đặt lại mật khẩu")
      setShowResetPasswordModal(false)
      setSelectedAccount(null)
      resetForm.resetFields()
      message.success("Mật khẩu đã được đặt lại thành công!")
    } catch (error) {
      message.error("Lỗi khi đặt lại mật khẩu!")
      console.error(error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedAccount.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Lỗi khi xóa tài khoản")
      await fetchAccounts(currentPage) // Gọi lại API với trang hiện tại
      setShowDeleteModal(false)
      setSelectedAccount(null)
      message.success("Xóa tài khoản thành công!")
    } catch (error) {
      message.error("Lỗi khi xóa tài khoản!")
      console.error(error)
    }
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      responsive: ["sm"], // Chỉ hiển thị từ small breakpoint trở lên
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"], // Chỉ hiển thị từ medium breakpoint trở lên
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "Hoạt động" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space direction={window.innerWidth < 768 ? "vertical" : "horizontal"}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size={window.innerWidth < 768 ? "small" : "middle"}
            onClick={() => {
              setSelectedAccount(record);
              setShowDetailModal(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size={window.innerWidth < 768 ? "small" : "middle"}
            onClick={() => {
              setSelectedAccount(record);
              setShowEditModal(true);
            }}
          >
            Sửa
          </Button>
          <Button
            icon={<KeyOutlined />}
            style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16", color: "#fff" }}
            size={window.innerWidth < 768 ? "small" : "middle"}
            onClick={() => {
              setSelectedAccount(record);
              setShowResetPasswordModal(true);
            }}
          >
            Đặt lại MK
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size={window.innerWidth < 768 ? "small" : "middle"}
            onClick={() => {
              setSelectedAccount(record);
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
    <div className="account-management" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Card style={{ flex: 1 }}>
        <Title level={2}>QUẢN LÝ TÀI KHOẢN</Title>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tên đăng nhập, email hoặc họ tên"
              prefix={<SearchOutlined />}
              style={{ width: 350 }}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
              }}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 200 }}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset về trang 1 khi lọc
              }}
              allowClear
            >
              <Option value="">Tất cả</Option>
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Không hoạt động">Không hoạt động</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedAccount(null)
                setShowEditModal(true)
              }}
            >
              Thêm mới
            </Button>
          </Space>
        </div>

        {/* Thêm console.log ngay trước <Table> */}
        {console.log("State accounts:", accounts)}
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalAccounts, // Sử dụng totalAccounts từ API
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tài khoản`,
            showSizeChanger: false,
            showQuickJumper: true,
            className: "fixed-pagination", // Thêm class để cố định pagination
          }}
          style={{ marginBottom: 60 }} // Đảm bảo có khoảng trống cho pagination cố định
        />
      </Card>

      <Modal
        title="Chi tiết tài khoản"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedAccount && (
          <div>
            <p><strong>Tên đăng nhập:</strong> {selectedAccount.username}</p>
            <p><strong>Email:</strong> {selectedAccount.email}</p>
            <p><strong>Họ và tên:</strong> {selectedAccount.fullName}</p>
            <p><strong>Vai trò:</strong> {selectedAccount.role}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ color: selectedAccount.status === "Hoạt động" ? "green" : "red" }}>
                {selectedAccount.status}
              </span>
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title={selectedAccount ? "Sửa thông tin tài khoản" : "Thêm tài khoản mới"}
        open={showEditModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedAccount(null)
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
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
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          {!selectedAccount && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Không hoạt động">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        open={showResetPasswordModal}
        onOk={() => resetForm.submit()}
        onCancel={() => {
          setShowResetPasswordModal(false)
          setSelectedAccount(null)
          resetForm.resetFields()
        }}
      >
        <Form form={resetForm} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedAccount(null)
        }}
      >
        <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
      </Modal>
    </div>
  )
}

export default AccountManagement