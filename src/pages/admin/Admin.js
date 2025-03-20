import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Tabs, message, Layout, Typography, Card, Row, Col, Statistic, Space, Divider } from 'antd';
import { TeamOutlined, ProjectOutlined, ScheduleOutlined, FileSearchOutlined, BarsOutlined, SolutionOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import CountUpStatistic from '../../components/CountUpStatistic';
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;
const { Content } = Layout;

const features = [
    {
        title: 'Quản lý tour',
        icon: <ProjectOutlined style={{ fontSize: '24px' }} />,
        description: 'Quản lý thông tin các tour du lịch',
        path: '/admin/quan-ly-tour',
        color: '#1890ff' // Xanh dương
    },
    {
        title: 'Quản lý người dùng',
        icon: <TeamOutlined style={{ fontSize: '24px' }} />,
        description: 'Quản lý thông tin người dùng',
        path: '/admin/quan-ly-nguoi-dung',
        color: '#52c41a' // Xanh lá
    },
    {
        title: 'Thống kê doanh thu',
        icon: <FileSearchOutlined style={{ fontSize: '24px' }} />,
        description: 'Xem thống kê doanh thu từ các tour',
        path: '/admin/thong-ke-doanh-thu',
        color: '#fa8c16' // Cam
    },
    {
        title: 'Quản lý đặt tour',
        icon: <BarsOutlined style={{ fontSize: '24px' }} />,
        description: 'Quản lý các đơn đặt tour',
        path: '/admin/quan-ly-dat-tour',
        color: '#722ed1' // Tím
    },
    {
        title: 'Chăm sóc khách hàng',
        icon: <SolutionOutlined style={{ fontSize: '24px' }} />,
        description: 'Quản lý thông tin chăm sóc khách hàng',
        path: '/admin/cham-soc-khach-hang',
        color: '#ff4d4f' // Đỏ
    },
    {
        title: 'Tra cứu',
        icon: <FileSearchOutlined style={{ fontSize: '24px' }} />,
        description: 'Tra cứu thông tin liên quan',
        path: '/admin/tra-cuu',
        color: '#2f54eb' // Xanh dương đậm (thay vì trùng #1890ff)
    },
    {
        title: 'Báo cáo',
        icon: <SolutionOutlined style={{ fontSize: '24px' }} />,
        description: 'Tạo báo cáo',
        path: '/admin/bao-cao',
        color: '#13c2c2' // Xanh ngọc
    },
    {
        title: 'Sửa nội dung',
        icon: <EditOutlined style={{ fontSize: '24px' }} />,
        description: 'Sửa nội dung các trang',
        path: '/admin/sua-noi-dung',
        color: '#eb2f96' // Hồng đậm (thay vì #23A1BA để đa dạng hơn)
    },
    {
        title: 'Quản lý tài khoản',
        icon: <TeamOutlined style={{ fontSize: '24px' }} />,
        description: 'Quản lý tài khoản',
        path: '/admin/quan-ly-tai-khoan',
        color: '#4d178b' // Hồng đậm (thay vì#4d178b để đa dạng hơn)
    }
];

const statisticsData = [
    {
        title: 'Tổng số tour',
        value: 120, // Thay đổi giá trị này theo dữ liệu thực tế
        prefix: <ProjectOutlined />,
        color: '#fa8c16'
    },
    {
        title: 'Số lượng khách hàng',
        value: 3500, // Thay đổi giá trị này theo dữ liệu thực tế
        prefix: <TeamOutlined />,
        color: '#1890ff'
    },
    {
        title: 'Đơn đặt tour chờ xác nhận',
        value: 15, // Thay đổi giá trị này theo dữ liệu thực tế
        prefix: <BarsOutlined />,
        color: '#fa8c16'
    },
    {
        title: 'Tour hoàn thành trong tháng',
        value: 25, // Thay đổi giá trị này theo dữ liệu thực tế
        prefix: <ScheduleOutlined />,
        color: '#722ed1'
    }
];

const Admin = () => {
    const [tours, setTours] = useState([]);
    const [users, setUsers] = useState([]);
    const [isTourModalVisible, setIsTourModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [currentTour, setCurrentTour] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const showTourModal = (tour) => {
        setCurrentTour(tour);
        setIsTourModalVisible(true);
    };

    const showUserModal = (user) => {
        setCurrentUser(user);
        setIsUserModalVisible(true);
    };

    const handleTourOk = (values) => {
        if (currentTour) {
            // Cập nhật tour
            setTours(tours.map(t => (t.id === currentTour.id ? { ...t, ...values } : t)));
        } else {
            // Thêm tour mới
            setTours([...tours, { id: tours.length + 1, ...values }]);
        }
        setIsTourModalVisible(false);
        setCurrentTour(null);
    };

    const handleUserOk = (values) => {
        if (currentUser) {
            // Cập nhật người dùng
            setUsers(users.map(u => (u.id === currentUser.id ? { ...u, ...values } : u)));
        } else {
            // Thêm người dùng mới
            setUsers([...users, { id: users.length + 1, ...values }]);
        }
        setIsUserModalVisible(false);
        setCurrentUser(null);
    };

    const handleCancel = () => {
        setIsTourModalVisible(false);
        setIsUserModalVisible(false);
        setCurrentTour(null);
        setCurrentUser(null);
    };

    const handleDeleteTour = (tourId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tour này?',
            onOk: () => {
                setTours(tours.filter(t => t.id !== tourId));
                message.success('Xóa tour thành công!');
            },
        });
    };

    const handleDeleteUser = (userId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
            onOk: () => {
                setUsers(users.filter(u => u.id !== userId));
                message.success('Xóa người dùng thành công!');
            },
        });
    };

    const tourColumns = [
        { title: 'Tên Tour', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Hành Động', key: 'action', render: (_, tour) => (
            <>
                <Button onClick={() => showTourModal(tour)}>Sửa</Button>
                <Button onClick={() => handleDeleteTour(tour.id)} style={{ marginLeft: 8 }} danger>Xóa</Button>
            </>
        ) },
    ];

    const userColumns = [
        { title: 'Tên Người Dùng', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Hành Động', key: 'action', render: (_, user) => (
            <>
                <Button onClick={() => showUserModal(user)}>Sửa</Button>
                <Button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: 8 }} danger>Xóa</Button>
            </>
        ) },
    ];

    return (
        <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', marginBottom: '60px' }}>
            <div style={{ textAlign: 'center' }}>
                <Title style={{ fontSize: '35px', fontWeight: 'bold', marginTop: '20px' }}>HỆ THỐNG 
                QUẢN LÝ TOUR DU LỊCH</Title>
                <Paragraph style={{ fontSize: 14 }}>
                    Hệ thống quản lý tour du lịch, nhằm tăng cường hiệu quả quản lý và nâng cao chất lượng dịch vụ.
                </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
                {statisticsData.map((stat, index) => (
                    <Col key={index} span={6}>
                        <CountUpStatistic {...stat} />
                    </Col>
                ))}
            </Row>

            <Title level={2} style={{ textAlign: 'center', margin: '50px 0', fontWeight: 'bold' }}>Các chức năng</Title>

            <Row gutter={[24, 24]}>
                {features.map((feature, index) => (
                    <Col key={index} xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            style={{ height: '100%' }}
                            onClick={() => navigate(feature.path)}
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '40px',
                                    color: feature.color,
                                    background: `${feature.color}10`,
                                    padding: '16px',
                                    borderRadius: '50%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '80px',
                                    height: '80px',
                                    aspectRatio: '1',
                                }}>
                                    {feature.icon}
                                </div>
                                <Title level={4} style={{ margin: 0 }}>{feature.title}</Title>
                                <Paragraph style={{ margin: 0 }}>{feature.description}</Paragraph>
                                <Button type="primary" style={{ background: feature.color, borderColor: feature.color }}>
                                    Truy cập
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ marginBottom: '60px' }} />
        </Content>
    );
};

export default Admin;