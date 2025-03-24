import { useState, useEffect } from "react";
import { Card, Table, Button, Input, Modal, Form, Space, Typography, Select, message } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const API_URL = 'http://localhost:5001/api';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
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

  useEffect(() => {
    if (selectedOrder && showEditModal) {
      form.setFieldsValue({
        full_name: selectedOrder.full_name,
        tourId: selectedOrder.tour_id,
        phone: selectedOrder.phone,
        email: selectedOrder.email,
        birth_date: selectedOrder.birth_date ? new Date(selectedOrder.birth_date).toISOString().split('T')[0] : null,
        orderDate: selectedOrder.order_date ? new Date(selectedOrder.order_date).toISOString().split('T')[0] : null,
        startDate: selectedOrder.start_date ? new Date(selectedOrder.start_date).toISOString().split('T')[0] : null,
        endDate: selectedOrder.end_date ? new Date(selectedOrder.end_date).toISOString().split('T')[0] : null,
        adults: selectedOrder.adults,
        children_under_5: selectedOrder.children_under_5,
        children_5_11: selectedOrder.children_5_11,
        single_rooms: selectedOrder.single_rooms,
        pickup_point: selectedOrder.pickup_point,
        special_requests: selectedOrder.special_requests,
        payment_method: selectedOrder.payment_method,
        total_amount: selectedOrder.total_amount,
        status: selectedOrder.status,
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
        birth_date: values.birth_date,
        order_date: values.orderDate,
        start_date: values.startDate,
        end_date: values.endDate,
        adults: values.adults,
        children_under_5: values.children_under_5,
        children_5_11: values.children_5_11,
        single_rooms: values.single_rooms,
        pickup_point: values.pickup_point,
        special_requests: values.special_requests,
        payment_method: values.payment_method,
        total_amount: values.total_amount,
        status: values.status,
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
          <Button type="primary" icon={<EyeOutlined />} onClick={() => { setSelectedOrder(record); setShowDetailModal(true); }}>Chi tiết</Button>
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
            {/* Cột trái */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <p><strong>Khách hàng (người đặt tour):</strong> {selectedOrder.full_name}</p>
              <p><strong>Giới tính:</strong> {selectedOrder.travelers?.[0]?.gender || 'N/A'}</p>
              <p><strong>Ngày sinh:</strong> {selectedOrder.birth_date ? formatDate(selectedOrder.birth_date) : 'N/A'}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
              <p><strong>Tour:</strong> {tours.find(t => t.id === selectedOrder.tour_id)?.name || 'N/A'}</p>
              <p><strong>Mã tour:</strong> {tours.find(t => t.id === selectedOrder.tour_id)?.tour_code || 'N/A'}</p>
              <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.order_date)}</p>
              <p><strong>Ngày bắt đầu:</strong> {formatDate(selectedOrder.start_date)}</p>
              <p><strong>Ngày kết thúc:</strong> {formatDate(selectedOrder.end_date)}</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.status === "confirmed" ? "Đã xác nhận" : selectedOrder.status === "pending" ? "Chờ xác nhận" : "Đã hủy"}</p>
              <p><strong>Người đi cùng:</strong></p>
              <ul>
                {selectedOrder.travelers?.length > 0 ? (
                  selectedOrder.travelers.map((traveler, index) => (
                    <li key={index}>
                      {traveler.traveler_type} {index + 1}: {traveler.full_name} ({traveler.gender}, {formatDate(traveler.birth_date)})
                      {traveler.phone && `, SĐT: ${traveler.phone}`}
                      {traveler.single_room && ', Phòng đơn'}
                    </li>
                  ))
                ) : (
                  <li>Không có người đi cùng</li>
                )}
              </ul>
            </div>
            {/* Cột phải */}
            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <p><strong>Số người lớn:</strong> {selectedOrder.adults || 0}</p>
              <p><strong>Trẻ dưới 5 tuổi:</strong> {selectedOrder.children_under_5 || 0}</p>
              <p><strong>Trẻ 5-11 tuổi:</strong> {selectedOrder.children_5_11 || 0}</p>
              <p><strong>Số phòng đơn:</strong> {selectedOrder.single_rooms || 0}</p>
              <p><strong>Tổng tiền:</strong> {selectedOrder.total_amount?.toLocaleString() || 0} VND</p>
              <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method || 'N/A'}</p>
              <p><strong>Yêu cầu đặc biệt:</strong> {selectedOrder.special_requests || 'N/A'}</p>
              <p><strong>Điểm đón:</strong> {selectedOrder.pickup_point || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedOrder.email || 'N/A'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Chỉnh sửa/Thêm mới */}
      <Modal title={selectedOrder ? "Sửa thông tin đơn đặt tour" : "Thêm đơn đặt tour mới"} open={showEditModal} onOk={() => form.submit()} onCancel={() => { setShowEditModal(false); setSelectedOrder(null); }} width={800}>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="full_name" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tourId" label="Chọn tour" rules={[{ required: true, message: "Vui lòng chọn tour" }]}>
            <Select>
              {tours.map(tour => <Option key={tour.id} value={tour.id}>{tour.name} ({tour.tour_code})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="birth_date" label="Ngày sinh"><Input type="date" /></Form.Item>
          <Form.Item name="orderDate" label="Ngày đặt" rules={[{ required: true, message: "Vui lòng chọn ngày đặt" }]}><Input type="date" /></Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}><Input type="date" /></Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}><Input type="date" /></Form.Item>
          <Form.Item name="adults" label="Số người lớn" rules={[{ required: true, message: "Vui lòng nhập số người lớn" }]}><Input type="number" min={0} /></Form.Item>
          <Form.Item name="children_under_5" label="Trẻ dưới 5 tuổi"><Input type="number" min={0} /></Form.Item>
          <Form.Item name="children_5_11" label="Trẻ 5-11 tuổi"><Input type="number" min={0} /></Form.Item>
          <Form.Item name="single_rooms" label="Số phòng đơn"><Input type="number" min={0} /></Form.Item>
          <Form.Item name="pickup_point" label="Điểm đón"><Input /></Form.Item>
          <Form.Item name="special_requests" label="Yêu cầu đặc biệt"><Input /></Form.Item>
          <Form.Item name="payment_method" label="Phương thức thanh toán"><Input /></Form.Item>
          <Form.Item name="total_amount" label="Tổng tiền" rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}><Input type="number" /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
            <Select>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal title="Xác nhận xóa" open={showDeleteModal} onOk={handleDelete} onCancel={() => { setShowDeleteModal(false); setSelectedOrder(null); }}>
        <p>Bạn có chắc chắn muốn xóa đơn đặt tour này?</p>
      </Modal>
    </div>
  );
};

export default OrderManagement;