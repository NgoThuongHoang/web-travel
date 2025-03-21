import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons'; // Thêm icon HomeOutlined
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, resetLogout } from '../features/auth/authSlice';

const { Header } = Layout;
const { Title, Text } = Typography;

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userName = user?.fullName || 'Người dùng';

  const handleLogout = () => {
    console.log('Đăng xuất, chuyển về /');
    dispatch(logout()); // Gọi action logout để cập nhật state
    navigate('/', { replace: true }); // Chuyển hướng về trang chủ ngay lập tức
    dispatch(resetLogout()); // Reset trạng thái isLoggingOut
  };

  const handleTitleClick = () => {
    navigate('/admin');
  };

  const handleHomeClick = () => {
    navigate('/'); // Chuyển hướng về trang chủ
  };

  return (
    <Header
      style={{
        background: '#EE8E3C',
        color: '#fff',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Title
        level={3}
        style={{ color: '#fff', margin: 0, cursor: 'pointer' }}
        onClick={handleTitleClick}
      >
        Quản Lý Tour Du Lịch
      </Title>

      {/* Icon Home nằm giữa */}
      <Button
        type="text"
        icon={<HomeOutlined style={{ fontSize: '24px' }} />}
        onClick={handleHomeClick}
        style={{
          color: '#fff',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#F5A252'; // Hover sáng hơn
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#fff'; // Trở lại màu trắng
        }}
      />

      <Space>
        <Text style={{ color: '#fff' }}>Xin chào: {userName}</Text>
        <Button
          type="primary"
          icon={<i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }} />}
          onClick={handleLogout}
          style={{
            background: '#D97A2A',
            borderColor: '#D97A2A',
            color: '#fff',
            borderRadius: '5px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F5A252'; 
            e.currentTarget.style.borderColor = '#F5A252';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#D97A2A';
            e.currentTarget.style.borderColor = '#D97A2A';
          }}
        >
          Đăng xuất
        </Button>
      </Space>
    </Header>
  );
};

export default AdminHeader;