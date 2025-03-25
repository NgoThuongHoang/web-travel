import React, { useState, useEffect } from "react";
import { Card, Table, Button, Input, Modal, Form, Space, Typography, message, Row, Col } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import moment from 'moment';
import '../../styles/AccountManagement.css';

const { Title } = Typography;

const API_BASE_URL = "http://localhost:5001/api/customers";

const AccountManagement = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Hàm lấy danh sách khách hàng từ API
  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}?search=${searchText}&page=${page}&pageSize=${pageSize}`,
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
      console.log("Dữ liệu khách hàng từ API:", data);

      setCustomers(data.customers || []);
      setTotalCustomers(data.total || 0);
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng!");
      console.error("Lỗi fetchCustomers:", error);
      setCustomers([]);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thông tin chi tiết của một khách hàng theo ID
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      message.error("Lỗi khi tải thông tin chi tiết khách hàng!");
      console.error("Lỗi fetchCustomerDetails:", error);
      return null;
    }
  };

  // Hàm xử lý khi nhấp vào icon "Chi tiết" của một khách hàng trong phần "Thông tin người tham gia tour"
  const handleViewParticipantDetails = async (participant) => {
    const customerDetails = await fetchCustomerDetails(participant.id);
    if (customerDetails) {
      setSelectedCustomer(customerDetails); // Cập nhật selectedCustomer để hiển thị trong modal
      setShowDetailModal(true); // Mở lại modal "Chi tiết khách hàng"
    }
  };

  // Gọi API khi có thay đổi về tìm kiếm hoặc trang
  useEffect(() => {
    fetchCustomers(currentPage);
  }, [searchText, currentPage]);

  // Điền thông tin khách hàng vào form khi mở modal chỉnh sửa
  useEffect(() => {
    if (selectedCustomer && showEditModal) {
      form.setFieldsValue({
        fullName: selectedCustomer.fullName,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
      });
    } else {
      form.resetFields();
    }
  }, [selectedCustomer, showEditModal, form]);

  // Xử lý submit form (thêm hoặc sửa khách hàng)
  const handleFormSubmit = async (values) => {
    try {
      const url = selectedCustomer ? `${API_BASE_URL}/${selectedCustomer.id}` : API_BASE_URL;
      const method = selectedCustomer ? "PUT" : "POST";
  
      const customerData = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
      };
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
  
      if (!response.ok) throw new Error("Lỗi khi lưu thông tin khách hàng");
      await fetchCustomers(currentPage);
      setShowEditModal(false);
      setSelectedCustomer(null);
      message.success(selectedCustomer ? "Cập nhật khách hàng thành công!" : "Thêm khách hàng thành công!");
    } catch (error) {
      message.error("Lỗi khi lưu thông tin khách hàng!");
      console.error(error);
    }
  };

  // Xử lý xóa khách hàng
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedCustomer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Lỗi khi xóa khách hàng");
      await fetchCustomers(currentPage);
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      message.success("Xóa khách hàng thành công!");
    } catch (error) {
      message.error("Lỗi khi xóa khách hàng!");
      console.error(error);
    }
  };

  // Định dạng ngày sinh
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = moment(dateString);
    if (!date.isValid()) return 'N/A';
    return date.format('DD/MM/YYYY');
  };

  // Cấu hình cột cho bảng
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
      responsive: ["md"],
      render: (email) => email || "N/A",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      responsive: ["sm"],
      render: (phone) => phone || "N/A",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
      render: (address) => address || "N/A",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => formatDate(created_at),
      responsive: ["md"],
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
              setSelectedCustomer(record);
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
              setSelectedCustomer(record);
              setShowEditModal(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size={window.innerWidth < 768 ? "small" : "middle"}
            onClick={() => {
              setSelectedCustomer(record);
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
    <div className="customer-management" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Card style={{ flex: 1 }}>
        <Title level={2}>QUẢN LÝ KHÁCH HÀNG</Title>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo họ tên, email hoặc số điện thoại"
              prefix={<SearchOutlined />}
              style={{ width: 350 }}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedCustomer(null);
                setShowEditModal(true);
              }}
            >
              Thêm mới
            </Button>
          </Space>
        </div>

        {console.log("Danh sách khách hàng:", customers)}
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCustomers,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
            showSizeChanger: false,
            showQuickJumper: true,
            className: "fixed-pagination",
          }}
          style={{ marginBottom: 60 }}
        />
      </Card>

      {/* Modal Chi tiết khách hàng */}
      <Modal
        title="Chi tiết khách hàng"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedCustomer && (
          <div>
            <p><strong>Họ và tên:</strong> {selectedCustomer.fullName}</p>
            <p><strong>Email:</strong> {selectedCustomer.email || "N/A"}</p>
            <p><strong>Số điện thoại:</strong> {selectedCustomer.phone || "N/A"}</p>
            <p><strong>Địa chỉ:</strong> {selectedCustomer.address || "N/A"}</p>
            <p><strong>Ngày tạo:</strong> {formatDate(selectedCustomer.created_at)}</p>
            <p>
              <strong>Tour đã tham gia:</strong>{" "}
              {selectedCustomer.tours && selectedCustomer.tours.length > 0
                ? selectedCustomer.tours
                    .map((tour) => `${tour.name} - Mã tour: ${tour.tour_code}`)
                    .join(", ")
                : "Chưa tham gia tour"}
            </p>
            {/* Hiển thị thông tin người đặt tour và các khách hàng trong cùng đơn đặt tour */}
            {selectedCustomer.tours && selectedCustomer.tours.length > 0 && (
              <div>
                {selectedCustomer.tours.map((tour) => (
                  <div key={tour.tour_id} style={{ marginBottom: '20px' }}>
                    {/* Hiển thị các khách hàng đi cùng trong cùng đơn đặt tour với icon "Chi tiết" */}
                    {tour.participants && tour.participants.length > 0 ? (
                      <div>
                        <p><strong>Người đi cùng:</strong></p>
                        <ul>
                          {tour.participants.map((participant) => (
                            <li key={participant.id}>
                              {participant.fullName}{" "}
                              <EyeOutlined
                                style={{ cursor: "pointer", color: "#1890ff" }}
                                onClick={() => handleViewParticipantDetails(participant)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>Không có người đi cùng.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Thêm/Sửa khách hàng */}
      <Modal
        title={selectedCustomer ? "Sửa thông tin khách hàng" : "Thêm khách hàng mới"}
        open={showEditModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
        }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại phải có 10-11 chữ số!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="address" label="Địa chỉ">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal Xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
        }}
      >
        <p>Bạn có chắc chắn muốn xóa khách hàng này?</p>
      </Modal>
    </div>
  );
};

export default AccountManagement;