import { useState, useEffect } from "react";
import { Card, Table, Button, Input, Modal, Form, Space, Typography, Select, message, Row, Col, Checkbox, DatePicker, Divider } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const API_URL = 'http://localhost:5001/api';

// Hàm định dạng ngày
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = moment(dateString);
  if (!date.isValid()) return 'N/A';
  return date.format('DD/MM/YYYY');
};

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  if (!price) return '0 VNĐ';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};

const OrderManagement = () => {
  const [form] = Form.useForm();
  const [orders, setOrders] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchTours();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`);
      console.log('Danh sách đơn hàng:', response.data);
      setOrders(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await axios.get(`${API_URL}/tours`);
      setTours(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách tour: ' + (error.response?.data?.error || error.message));
    }
  };

  // Tính toán giá dựa trên số lượng người và phòng đơn
  const calculateTotalAmount = (tourId, adults, childrenUnder5, children5To11, singleRooms) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return 0;

    const basePrice = tour.price || 0; // Giá cơ bản cho mỗi người lớn
    const singleRoomPrice = tour.prices?.find(p => p.age_group === "Adult")?.single_room_price || 500000; // Lấy giá phòng đơn từ tour

    const adultPrice = adults * basePrice;
    const childrenUnder5Price = 0; // Trẻ dưới 5 tuổi: miễn phí
    const children5To11Price = children5To11 * (basePrice * 0.5); // Trẻ 5-11 tuổi: 50% giá
    const singleRoomTotalPrice = singleRooms * singleRoomPrice;

    return adultPrice + childrenUnder5Price + children5To11Price + singleRoomTotalPrice;
  };

  useEffect(() => {
    if (selectedOrder && showEditModal) {
      const parseDate = (dateString) => {
        if (!dateString) return null;
        const date = moment(dateString);
        return date.isValid() ? date : null;
      };

      const birthDate = parseDate(selectedOrder.birth_date);
      const startDate = parseDate(selectedOrder.start_date);
      const endDate = parseDate(selectedOrder.end_date);

      const customers = selectedOrder.customers?.map(customer => ({
        ...customer,
        birth_date: parseDate(customer.birth_date),
      })) || [];

      form.setFieldsValue({
        full_name: selectedOrder.full_name,
        tourId: selectedOrder.tour_id,
        phone: selectedOrder.phone,
        email: selectedOrder.email,
        gender: selectedOrder.gender,
        birth_date: birthDate,
        startDate: startDate,
        endDate: endDate,
        adults: selectedOrder.adults,
        children_under_5: selectedOrder.children_under_5,
        children_5_11: selectedOrder.children_5_11,
        single_rooms: selectedOrder.single_rooms,
        pickup_point: selectedOrder.pickup_point,
        special_requests: selectedOrder.special_requests,
        payment_method: selectedOrder.payment_method,
        total_amount: selectedOrder.total_amount,
        status: selectedOrder.status,
        customers: customers,
        health_info: selectedOrder.health_info || false,
        vegetarian_food: selectedOrder.vegetarian_food || false,
        disabled_child: selectedOrder.disabled_child || false,
        vegetarian: selectedOrder.vegetarian || false,
        disabled: selectedOrder.disabled || false,
        pregnant: selectedOrder.pregnant || false,
        terms_accepted: selectedOrder.terms_accepted || false,
      });
    } else {
      form.resetFields();
    }
  }, [selectedOrder, showEditModal, form]);

  const handleFormSubmit = async (values) => {
    try {
      const orderData = {
        full_name: values.full_name,
        tour_id: values.tourId,
        phone: values.phone,
        email: values.email,
        gender: values.gender,
        birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
        start_date: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        end_date: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        adults: values.adults,
        children_under_5: values.children_under_5,
        children_5_11: values.children_5_11,
        single_rooms: values.single_rooms,
        pickup_point: values.pickup_point,
        special_requests: values.special_requests,
        payment_method: values.payment_method,
        total_amount: calculateTotalAmount(values.tourId, values.adults, values.children_under_5, values.children_5_11, values.single_rooms),
        status: values.status,
        customers: values.customers?.map(customer => ({
          ...customer,
          birth_date: customer.birth_date ? customer.birth_date.format('YYYY-MM-DD') : null,
        })) || [],
        health_info: values.health_info,
        vegetarian_food: values.vegetarian_food,
        disabled_child: values.disabled_child,
        vegetarian: values.vegetarian,
        disabled: values.disabled,
        pregnant: values.pregnant,
        terms_accepted: values.terms_accepted,
      };

      if (selectedOrder) {
        await axios.put(`${API_URL}/orders/${selectedOrder.id}`, orderData);
        message.success('Cập nhật đơn hàng thành công');
      } else {
        await axios.post(`${API_URL}/tours/${values.tourId}/book`, orderData);
        message.success('Tạo đơn hàng thành công');
      }
      fetchOrders();
      setShowEditModal(false);
      setSelectedOrder(null);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu đơn hàng: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/orders/${selectedOrder.id}`);
      message.success('Xóa đơn hàng thành công');
      fetchOrders();
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (error) {
      message.error('Không thể xóa đơn hàng: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleConfirmOrders = async () => {
    try {
      await Promise.all(selectedOrders.map(id => axios.put(`${API_URL}/orders/${id}/confirm`)));
      message.success('Xác nhận đơn hàng thành công');
      fetchOrders();
      setSelectedOrders([]);
    } catch (error) {
      message.error('Không thể xác nhận đơn hàng: ' + (error.response?.data?.error || error.message));
    }
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const tour = tours.find(t => t.id === order.tour_id);
      return (
        (order.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
         (tour?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
         (tour?.tour_code || '').toLowerCase().includes(searchText.toLowerCase()) ||
         formatDate(order.order_date).includes(searchText)) &&
        (statusFilter ? order.status === statusFilter : true)
      );
    });
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Khách hàng", dataIndex: "full_name", sorter: (a, b) => a.full_name?.localeCompare(b.full_name) },
    { title: "Tour", render: (_, record) => tours.find(t => t.id === record.tour_id)?.name || 'N/A' },
    { title: "Mã tour", render: (_, record) => tours.find(t => t.id === record.tour_id)?.tour_code || 'N/A' },
    { title: "Ngày đặt", dataIndex: "order_date", render: formatDate, sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date) },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: status => {
        const color = status === "confirmed" ? "green" : status === "pending" ? "gold" : "red";
        const text = status === "confirmed" ? "Đã xác nhận" : status === "pending" ? "Chờ xác nhận" : "Đã hủy";
        return <span style={{ color }}>{text}</span>;
      },
      sorter: (a, b) => a.status?.localeCompare(b.status),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => { setSelectedOrder(record); setShowDetailModal(true); console.log('Đơn hàng được chọn:', record); }}>Chi tiết</Button>
          <Button type="default" icon={<EditOutlined />} onClick={() => { setSelectedOrder(record); setShowEditModal(true); }}>Sửa</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => { setSelectedOrder(record); setShowDeleteModal(true); }}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="order-management">
      <Card>
        <Title level={2}>Quản lý đặt tour</Title>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input placeholder="Tìm kiếm theo tên khách hàng, tour, mã tour hoặc ngày đặt" prefix={<SearchOutlined />} style={{ width: 425 }} onChange={(e) => setSearchText(e.target.value)} />
          <Select placeholder="Chọn trạng thái" style={{ width: 200 }} onChange={setStatusFilter} allowClear>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedOrder(null); setShowEditModal(true); }}>Thêm đơn đặt tour</Button>
          <Button type="default" icon={<PlusOutlined />} onClick={handleConfirmOrders} disabled={!selectedOrders.length} style={{ backgroundColor: selectedOrders.length ? 'green' : undefined, color: selectedOrders.length ? 'white' : undefined }}>
            Xác nhận đơn chọn
          </Button>
        </Space>
        <Table
          rowKey="id"
          dataSource={getFilteredOrders()}
          columns={columns}
          loading={loading}
          rowSelection={{ selectedRowKeys: selectedOrders, onChange: setSelectedOrders }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal title="Chi tiết đơn đặt tour" open={showDetailModal} onCancel={() => setShowDetailModal(false)} footer={null} width={800}>
        {selectedOrder && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <p><strong>Khách hàng (người đặt tour):</strong> {selectedOrder.full_name || 'N/A'}</p>
              <p><strong>Giới tính:</strong> {selectedOrder.gender || 'N/A'}</p>
              <p><strong>Ngày sinh:</strong> {formatDate(selectedOrder.birth_date)}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.phone || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedOrder.email || 'N/A'}</p>
              <p><strong>Tour:</strong> {tours.find(t => t.id === selectedOrder.tour_id)?.name || 'N/A'}</p>
              <p><strong>Mã tour:</strong> {tours.find(t => t.id === selectedOrder.tour_id)?.tour_code || 'N/A'}</p>
              <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.order_date) || 'N/A'}</p>
              <p><strong>Ngày bắt đầu:</strong> {formatDate(selectedOrder.start_date) || 'N/A'}</p>
              <p><strong>Ngày kết thúc:</strong> {formatDate(selectedOrder.end_date) || 'N/A'}</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.status === "confirmed" ? "Đã xác nhận" : selectedOrder.status === "pending" ? "Chờ xác nhận" : "Đã hủy"}</p>
              <p><strong>Người đi cùng:</strong></p>
              <ul>
                {selectedOrder.customers && selectedOrder.customers.length > 0 ? (
                  selectedOrder.customers
                    .filter(c => c.id !== selectedOrder.customer_id)
                    .map((customer, index) => (
                      <li key={index}>
                        {customer.traveler_type} {index + 1}: {customer.full_name} ({customer.gender}, {formatDate(customer.birth_date)})
                        {customer.phone && `, SĐT: ${customer.phone}`}
                        {customer.email && `, Email: ${customer.email}`}
                        {customer.single_room ? ', Phòng đơn' : ''}
                      </li>
                    ))
                ) : (
                  <li>Không có người đi cùng</li>
                )}
              </ul>
            </div>
            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <p><strong>Số người lớn:</strong> {selectedOrder.adults || 0}</p>
              <p><strong>Trẻ dưới 5 tuổi:</strong> {selectedOrder.children_under_5 || 0}</p>
              <p><strong>Trẻ 5-11 tuổi:</strong> {selectedOrder.children_5_11 || 0}</p>
              <p><strong>Số phòng đơn:</strong> {selectedOrder.single_rooms || 0}</p>
              <p><strong>Tổng tiền:</strong> {selectedOrder.total_amount?.toLocaleString() || 0} VND</p>
              <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method || 'N/A'}</p>
              <p><strong>Yêu cầu đặc biệt:</strong> {selectedOrder.special_requests || 'N/A'}</p>
              <p><strong>Điểm đón:</strong> {selectedOrder.pickup_point || 'N/A'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Chỉnh sửa/Thêm mới */}
      <Modal
        title={selectedOrder ? "Sửa thông tin đơn đặt tour" : "Thêm đơn đặt tour mới"}
        open={showEditModal}
        onOk={() => form.submit()}
        onCancel={() => { setShowEditModal(false); setSelectedOrder(null); }}
        width={900}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {/* Thông tin khách hàng */}
          <Typography.Title level={4} style={{ marginBottom: 16, color: '#003087' }}>Thông tin khách hàng</Typography.Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_name"
                label={<span>Họ và tên <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label={<span>Giới tính <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="birth_date"
                label={<span>Ngày sinh <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<span>Số điện thoại <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label={<span>Email <span style={{ color: 'red' }}>*</span></span>} rules={[{ type: 'email', required: true, message: 'Vui lòng nhập email hợp lệ!' }]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pickup_point" label={<span>Địa chỉ <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                <Input placeholder="Nhập địa chỉ liên hệ" />
              </Form.Item>
            </Col>
          </Row>

          {/* Thông tin tour */}
          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>Thông tin tour</Typography.Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tourId"
                label={<span>Chọn tour <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn tour" }]}
              >
                <Select
                  onChange={(value) => {
                    const total = calculateTotalAmount(
                      value,
                      form.getFieldValue('adults'),
                      form.getFieldValue('children_under_5'),
                      form.getFieldValue('children_5_11'),
                      form.getFieldValue('single_rooms')
                    );
                    form.setFieldsValue({ total_amount: total });
                  }}
                  placeholder="Chọn tour"
                >
                  {tours.map(tour => (
                    <Option key={tour.id} value={tour.id}>
                      {tour.name} ({tour.tour_code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span>Trạng thái <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="pending">Chờ xác nhận</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label={<span>Ngày bắt đầu <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label={<span>Ngày kết thúc <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="adults"
                label={<span>Số người lớn <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng nhập số người lớn" }]}
              >
                <Input
                  type="number"
                  min={0}
                  onChange={() => form.setFieldsValue({
                    total_amount: calculateTotalAmount(
                      form.getFieldValue('tourId'),
                      form.getFieldValue('adults'),
                      form.getFieldValue('children_under_5'),
                      form.getFieldValue('children_5_11'),
                      form.getFieldValue('single_rooms')
                    )
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="children_under_5" label={<span>Em bé <Text type="secondary">(Dưới 5 tuổi)</Text></span>}>
                <Input
                  type="number"
                  min={0}
                  onChange={() => form.setFieldsValue({
                    total_amount: calculateTotalAmount(
                      form.getFieldValue('tourId'),
                      form.getFieldValue('adults'),
                      form.getFieldValue('children_under_5'),
                      form.getFieldValue('children_5_11'),
                      form.getFieldValue('single_rooms')
                    )
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="children_5_11" label={<span>Trẻ em <Text type="secondary">(Từ 5 đến dưới 11 tuổi)</Text></span>}>
                <Input
                  type="number"
                  min={0}
                  onChange={() => form.setFieldsValue({
                    total_amount: calculateTotalAmount(
                      form.getFieldValue('tourId'),
                      form.getFieldValue('adults'),
                      form.getFieldValue('children_under_5'),
                      form.getFieldValue('children_5_11'),
                      form.getFieldValue('single_rooms')
                    )
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="single_rooms" label={
                <span>
                  Số phòng đơn <Text type="secondary">
                    (Phí: {formatPrice(tours.find(t => t.id === form.getFieldValue('tourId'))?.prices?.find(p => p.age_group === "Adult")?.single_room_price || 500000)})
                  </Text>
                </span>
              }>
                <Input
                  type="number"
                  min={0}
                  onChange={() => form.setFieldsValue({
                    total_amount: calculateTotalAmount(
                      form.getFieldValue('tourId'),
                      form.getFieldValue('adults'),
                      form.getFieldValue('children_under_5'),
                      form.getFieldValue('children_5_11'),
                      form.getFieldValue('single_rooms')
                    )
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="total_amount"
                label="Tổng tiền"
                rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
              >
                <Input type="number" disabled suffix="VND" />
              </Form.Item>
            </Col>
          </Row>

          {/* Thông tin người đi cùng */}
          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>Thông tin người đi cùng</Typography.Title>
          <Form.List name="customers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                    <Typography.Text strong>Người lớn {index + 1}</Typography.Text>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'full_name']}
                          label={<span>Họ và tên <span style={{ color: 'red' }}>*</span></span>}
                          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                          <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'gender']}
                          label={<span>Giới tính <span style={{ color: 'red' }}>*</span></span>}
                          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                          <Select placeholder="Chọn giới tính">
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'birth_date']}
                          label={<span>Ngày sinh <span style={{ color: 'red' }}>*</span></span>}
                          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                        >
                          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'phone']}
                          label="Số điện thoại"
                        >
                          <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'email']}
                          label="Email"
                        >
                          <Input placeholder="Nhập email" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'single_room']}
                          label={
                            <span>
                              Phòng đơn <Text type="secondary">
                                (Giá: {formatPrice(tours.find(t => t.id === form.getFieldValue('tourId'))?.prices?.find(p => p.age_group === "Adult")?.single_room_price || 500000)})
                              </Text>
                            </span>
                          }
                          valuePropName="checked"
                        >
                          <Checkbox>Chọn phòng đơn</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                    {index > 0 && (
                      <Button type="link" onClick={() => remove(name)} style={{ color: 'red', marginTop: 8 }}>
                        Xóa người đi cùng
                      </Button>
                    )}
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm người đi cùng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Yêu cầu đặc biệt của khách */}
          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>
            Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi!
          </Typography.Title>
          <Form.Item name="notes">
            <Checkbox.Group>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Checkbox value="Hút thuốc">Hút thuốc</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Phòng tầng cao">Phòng tầng cao</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Trẻ em hiếu động">Trẻ em hiếu động</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Ăn chay">Ăn chay</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Có người khuyết tật">Có người khuyết tật</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Phụ nữ có thai">Phụ nữ có thai</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Ghi chú thêm" name="additional_notes">
            <Input.TextArea placeholder="Ghi chú thêm" rows={4} />
          </Form.Item>

          {/* Điều khoản thanh toán */}
          <div style={{ marginTop: 24 }}>
            <Text>Bằng cách nhấn vào nút "LƯU" dưới đây, Khách hàng đồng ý rằng các Điều kiện điều khoản này sẽ được áp dụng. Vui lòng đọc kỹ Điều kiện điều khoản trước khi thực hiện chọn sử dụng dịch vụ.</Text>
            <Form.Item
              name="terms_accepted"
              valuePropName="checked"
              rules={[{ required: true, message: "Vui lòng đồng ý với điều khoản" }]}
            >
              <Checkbox>
                Tôi đã đọc và đồng ý với <a href="#">Điều khoản thanh toán</a>
              </Checkbox>
            </Form.Item>
          </div>

          {/* Phương thức thanh toán */}
          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>Phương thức thanh toán</Typography.Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="payment_method"
                label={<span>Phương thức thanh toán <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
              >
                <Select placeholder="Chọn phương thức thanh toán">
                  <Option value="Thanh toán tại văn phòng Lửa Việt">Thanh toán tại văn phòng Lửa Việt</Option>
                  <Option value="Thu tiền tại nhà">Thu tiền tại nhà</Option>
                  <Option value="Chuyển khoản">Chuyển khoản</Option>
                  <Option value="Thanh toán online">Thanh toán online</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => { setShowDeleteModal(false); setSelectedOrder(null); }}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa đơn đặt tour này?</p>
      </Modal>
    </div>
  );
};

export default OrderManagement;