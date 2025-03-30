import { useState, useEffect } from "react";
import { Card, Table, Button, Input, Modal, Form, Space, Typography, Select, message, Row, Col, Checkbox, DatePicker, Divider } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined } from "@ant-design/icons";
import axios from 'axios';
import moment from 'moment';
import PaymentPage from '../../components/PaymentPage';

const { Title, Text } = Typography;
const { Option } = Select;

const API_URL = 'http://localhost:5001/api';

const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  if (moment.isMoment(dateInput)) {
    return dateInput.isValid() ? dateInput.format('DD/MM/YYYY') : 'N/A';
  }
  const date = moment(dateInput, moment.ISO_8601, true);
  return date.isValid() ? date.format('DD/MM/YYYY') : 'N/A';
};

const formatPrice = (price) => {
  if (!price) return '0 VNĐ';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};

// Danh sách các ghi chú mặc định (checkbox)
const predefinedNotes = [
  "Hút thuốc",
  "Phòng tầng cao",
  "Trẻ em hiếu động",
  "Ăn chay",
  "Có người khuyết tật",
  "Phụ nữ có thai",
];

const OrderManagement = () => {
  const [form] = Form.useForm();
  const [orders, setOrders] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTourSelection, setShowTourSelection] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
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

  // Hàm xử lý xác nhận tour
  const handleConfirmOrders = async () => {
    if (selectedOrders.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn hàng để xác nhận!');
      return;
    }

    try {
      setLoading(true);
      const confirmPromises = selectedOrders.map(async (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (order.status !== 'pending') {
          return Promise.reject(new Error(`Đơn hàng ${orderId} không ở trạng thái "Chờ xác nhận"!`));
        }
        return axios.put(`${API_URL}/orders/${orderId}/confirm`);
      });

      const results = await Promise.allSettled(confirmPromises);

      let successCount = 0;
      let errorMessages = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          const orderId = selectedOrders[index];
          errorMessages.push(`Đơn hàng ${orderId}: ${result.reason.message}`);
        }
      });

      if (successCount > 0) {
        message.success(`Xác nhận thành công ${successCount} đơn hàng!`);
      }
      if (errorMessages.length > 0) {
        message.error('Có lỗi xảy ra:\n' + errorMessages.join('\n'));
      }

      await fetchOrders();
      setSelectedOrders([]);
    } catch (error) {
      message.error('Lỗi khi xác nhận đơn hàng: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTour = (tourId) => {
    setSelectedTourId(tourId);
    setShowTourSelection(false);
    setShowBookingForm(true);
  };

  const calculateTotalAmount = (tourId, adults, childrenUnder5, children5_11, singleRooms) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return 0;

    const adultPrice = tour.prices?.find(p => p.age_group === "Adult")?.price || 0;
    const childPrice = tour.prices?.find(p => p.age_group === "Child")?.price || 0;
    const singleRoomPrice = tour.prices?.find(p => p.age_group === "Adult")?.single_room_price || 0;

    const adultsCount = adults || 0;
    const childrenUnder5Count = childrenUnder5 || 0;
    const children5_11Count = children5_11 || 0;
    const singleRoomsCount = singleRooms || 0;

    return (adultsCount * adultPrice) + 
           (children5_11Count * childPrice) + 
           (singleRoomsCount * singleRoomPrice);
  };

  const handleFormSubmit = async (values) => {
    try {
      const notes = values.notes || [];
      const additionalNotes = values.additional_notes || '';
      const specialRequests = [...notes, additionalNotes].filter(item => item).join(', ');
  
      // Danh sách người đi cùng từ form (không bao gồm Lead)
      const formattedCustomers = (values.customers || []).map(customer => ({
        full_name: customer.full_name,
        gender: customer.gender,
        birth_date: customer.birth_date ? customer.birth_date.format('YYYY-MM-DD') : null,
        phone: customer.phone || null,
        email: customer.email || null,
        single_room: customer.single_room || false,
        traveler_type: customer.traveler_type || "Người lớn", // Không gán "Lead" ở đây
        address: customer.address || null,
      }));
  
      // Dữ liệu gửi lên API
      const formattedValues = {
        full_name: values.full_name, // Thông tin khách hàng chính
        phone: values.phone,
        email: values.email,
        gender: values.gender,
        birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
        start_date: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        end_date: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        adults: values.adults || 0,
        children_under_5: values.children_under_5 || 0,
        children_5_11: values.children_5_11 || 0,
        single_rooms: values.single_rooms || 0,
        pickup_point: values.pickup_point,
        special_requests: specialRequests,
        payment_method: values.payment_method,
        total_amount: values.total_amount || 0,
        status: values.status,
        tour_id: values.tourId,
        customers: formattedCustomers, // Chỉ gửi danh sách người đi cùng
      };
  
      if (selectedOrder) {
        await axios.put(`${API_URL}/orders/${selectedOrder.id}`, formattedValues);
        message.success('Cập nhật đơn hàng thành công');
      } else {
        await axios.post(`${API_URL}/orders`, formattedValues);
        message.success('Tạo đơn hàng mới thành công');
      }
      fetchOrders();
      setShowEditModal(false);
      setSelectedOrder(null);
    } catch (error) {
      message.error('Lỗi khi lưu đơn hàng: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditOrder = (order) => {
    setSelectedTourId(order.tour_id);
    setSelectedOrder(order);
    setShowEditModal(true);
    setShowBookingForm(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/orders/${selectedOrder.id}`);
      message.success('Xóa đơn hàng thành công');
      fetchOrders();
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (error) {
      message.error('Lỗi khi xóa đơn hàng: ' + (error.response?.data?.error || error.message));
    }
  };

  const tourColumns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Tên tour", dataIndex: "name", sorter: (a, b) => a.name?.localeCompare(b.name) },
    { title: "Mã tour", dataIndex: "tour_code" },
    { title: "Ngày bắt đầu", dataIndex: "start_date", render: formatDate },
    { 
      title: "Số vé còn lại", 
      dataIndex: "remaining_tickets", 
      render: (text) => text === undefined || text === null ? 'N/A' : text 
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleSelectTour(record.id)}
            disabled={!record.remaining_tickets || record.remaining_tickets === 0}
          >
            Chọn tour
          </Button>
        </Space>
      ),
    },
  ];

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
          <Button type="primary" icon={<EyeOutlined />} onClick={() => { setSelectedOrder(record); setShowDetailModal(true); }}>Chi tiết</Button>
          <Button type="default" icon={<EditOutlined />} onClick={() => handleEditOrder(record)}>Sửa</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => { setSelectedOrder(record); setShowDeleteModal(true); }}>Xóa</Button>
        </Space>
      ),
    },
  ];

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

  useEffect(() => {
    if (selectedOrder && showEditModal) {
      // Tách special_requests thành notes và additional_notes
      const specialRequests = selectedOrder.special_requests || '';
      const specialRequestsArray = specialRequests.split(',').map(item => item.trim());
      const selectedNotes = specialRequestsArray.filter(item => predefinedNotes.includes(item));
      const additionalNotes = specialRequestsArray.find(item => !predefinedNotes.includes(item)) || '';
  
      // Lọc danh sách customers, loại bỏ khách hàng chính (Lead)
      const filteredCustomers = selectedOrder.customers
        ?.filter(customer => customer.traveler_type !== 'Lead')
        .map(customer => ({
          ...customer,
          birth_date: customer.birth_date ? moment(customer.birth_date) : null,
          traveler_type: customer.traveler_type || 'Người lớn', // Đảm bảo traveler_type được điền
        })) || [];
  
      // Điền dữ liệu vào form
      form.setFieldsValue({
        full_name: selectedOrder.full_name,
        phone: selectedOrder.phone,
        email: selectedOrder.email,
        gender: selectedOrder.gender,
        birth_date: selectedOrder.birth_date ? moment(selectedOrder.birth_date) : null,
        pickup_point: selectedOrder.pickup_point,
        tourId: selectedOrder.tour_id,
        status: selectedOrder.status,
        startDate: selectedOrder.start_date ? moment(selectedOrder.start_date) : null,
        endDate: selectedOrder.end_date ? moment(selectedOrder.end_date) : null,
        adults: selectedOrder.adults,
        children_under_5: selectedOrder.children_under_5,
        children_5_11: selectedOrder.children_5_11,
        single_rooms: selectedOrder.single_rooms,
        total_amount: selectedOrder.total_amount,
        payment_method: selectedOrder.payment_method,
        notes: selectedNotes,
        additional_notes: additionalNotes,
        customers: filteredCustomers,
      });
    } else if (!selectedOrder && showEditModal) {
      form.resetFields();
    }
  }, [selectedOrder, showEditModal, form]);

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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowTourSelection(true)}>
            Thêm đơn đặt tour
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleConfirmOrders}
            disabled={selectedOrders.length === 0} // Vô hiệu hóa nếu không có đơn hàng nào được chọn
          >
            Xác nhận tour
          </Button>
        </Space>

        <Modal
          title="Chọn tour để đặt"
          open={showTourSelection}
          onCancel={() => setShowTourSelection(false)}
          footer={null}
          width={800}
        >
          <Table
            rowKey="id"
            dataSource={tours}
            columns={tourColumns}
            pagination={{ pageSize: 5 }}
          />
        </Modal>

        {showBookingForm && (
          <div>
            <Button 
              style={{ marginBottom: 16 }} 
              onClick={() => {
                setShowBookingForm(false);
                setShowTourSelection(false);
                setSelectedOrder(null);
              }}
            >
              Quay lại
            </Button>
            <PaymentPage 
              tourId={selectedTourId} 
              orderData={selectedOrder}
              isEditing={!!selectedOrder}
              onSuccess={() => {
                setShowBookingForm(false);
                setSelectedOrder(null);
                fetchOrders();
              }}
            />
          </div>
        )}

        {!showBookingForm && (
          <Table
            rowKey="id"
            dataSource={getFilteredOrders()}
            columns={columns}
            loading={loading}
            rowSelection={{ selectedRowKeys: selectedOrders, onChange: setSelectedOrders }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
  title="Chi tiết đơn đặt tour"
  open={showDetailModal}
  onCancel={() => setShowDetailModal(false)}
  footer={null}
  width={800}
>
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
        <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.order_date)}</p>
        <p><strong>Ngày bắt đầu:</strong> {formatDate(selectedOrder.start_date)}</p>
        <p><strong>Ngày kết thúc:</strong> {formatDate(selectedOrder.end_date)}</p>
        <p><strong>Trạng thái:</strong> {selectedOrder.status === "confirmed" ? "Đã xác nhận" : selectedOrder.status === "pending" ? "Chờ xác nhận" : "Đã hủy"}</p>
        <p><strong>Người đi cùng:</strong></p>
        <ul>
          {selectedOrder.customers && selectedOrder.customers.length > 0 ? (
            selectedOrder.customers
              .filter(c => c.traveler_type !== 'Lead') // Loại bỏ khách hàng chính (Lead) khỏi danh sách người đi cùng
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
          <Typography.Title level={4} style={{ marginBottom: 16, color: '#003087' }}>Thông tin khách hàng</Typography.Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="full_name" label={<span>Họ và tên <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label={<span>Giới tính <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                <Select placeholder="Chọn giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="birth_date" label={<span>Ngày sinh <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label={<span>Số điện thoại <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
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

          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>Thông tin tour</Typography.Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tourId" label={<span>Chọn tour <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn tour" }]}>
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
              <Form.Item name="status" label={<span>Trạng thái <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
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
              <Form.Item name="startDate" label={<span>Ngày bắt đầu <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label={<span>Ngày kết thúc <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="adults" label={<span>Số người lớn <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng nhập số người lớn" }]}>
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
              <Form.Item name="single_rooms" label={<span>Số phòng đơn</span>}>
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
              <Form.Item name="total_amount" label="Tổng tiền" rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}>
                <Input type="number" disabled suffix="VND" />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>
            Thông tin người đi cùng
          </Typography.Title>
          <Form.List name="customers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  // Lấy traveler_type từ form để hiển thị tiêu đề động
                  const travelerType = form.getFieldValue(['customers', name, 'traveler_type']) || 'Người lớn';
                  
                  // Tạo tiêu đề động dựa trên traveler_type
                  let title = '';
                  if (travelerType === 'Em bé') {
                    title = `Em bé ${index + 1}`;
                  } else if (travelerType === 'Trẻ em') {
                    title = `Trẻ em ${index + 1}`;
                  } else {
                    title = `Người lớn ${index + 1}`; // Mặc định là "Người lớn"
                  }

                  return (
                    <div key={key} style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                      <Typography.Text strong>{title}</Typography.Text>
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
                          <Form.Item {...restField} name={[name, 'phone']} label="Số điện thoại">
                            <Input placeholder="Nhập số điện thoại" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, 'email']} label="Email">
                            <Input placeholder="Nhập email" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'single_room']}
                            label={<span>Phòng đơn <Text type="secondary">(Giá: {formatPrice(tours.find(t => t.id === form.getFieldValue('tourId'))?.prices?.find(p => p.age_group === "Adult")?.single_room_price || 500000)})</Text></span>}
                            valuePropName="checked"
                          >
                            <Checkbox>Chọn phòng đơn</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'traveler_type']}
                            label={<span>Loại khách hàng <span style={{ color: 'red' }}>*</span></span>}
                            rules={[{ required: true, message: 'Vui lòng chọn loại khách hàng' }]}
                          >
                            <Select placeholder="Chọn loại khách hàng">
                              <Option value="Người lớn">Người lớn</Option>
                              <Option value="Em bé">Em bé</Option>
                              <Option value="Trẻ em">Trẻ em</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      {index > 0 && (
                        <Button type="link" onClick={() => remove(name)} style={{ color: 'red', marginTop: 8 }}>
                          Xóa người đi cùng
                        </Button>
                      )}
                    </div>
                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm người đi cùng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi!</Typography.Title>
          <Form.Item name="notes">
            <Checkbox.Group>
              <Row gutter={[16, 16]}>
                <Col span={8}><Checkbox value="Hút thuốc">Hút thuốc</Checkbox></Col>
                <Col span={8}><Checkbox value="Phòng tầng cao">Phòng tầng cao</Checkbox></Col>
                <Col span={8}><Checkbox value="Trẻ em hiếu động">Trẻ em hiếu động</Checkbox></Col>
                <Col span={8}><Checkbox value="Ăn chay">Ăn chay</Checkbox></Col>
                <Col span={8}><Checkbox value="Có người khuyết tật">Có người khuyết tật</Checkbox></Col>
                <Col span={8}><Checkbox value="Phụ nữ có thai">Phụ nữ có thai</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Ghi chú thêm" name="additional_notes">
            <Input.TextArea placeholder="Ghi chú thêm" rows={4} />
          </Form.Item>

          <div style={{ marginTop: 24 }}>
            <Text>Bằng cách nhấn vào nút "LƯU" dưới đây, Khách hàng đồng ý rằng các Điều kiện điều khoản này sẽ được áp dụng. Vui lòng đọc kỹ Điều kiện điều khoản trước khi thực hiện chọn sử dụng dịch vụ.</Text>
            <Form.Item name="terms_accepted" valuePropName="checked" rules={[{ required: true, message: "Vui lòng đồng ý với điều khoản" }]}>
              <Checkbox>Tôi đã đọc và đồng ý với <a href="#">Điều khoản thanh toán</a></Checkbox>
            </Form.Item>
          </div>

          <Typography.Title level={4} style={{ marginBottom: 16, marginTop: 24, color: '#003087' }}>Phương thức thanh toán</Typography.Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="payment_method" label={<span>Phương thức thanh toán <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}>
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