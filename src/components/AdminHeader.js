import React from 'react';
import { Layout, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = () => {
    return (
        <Header style={{ background: '#EE8E3C', color: '#fff', padding: '16px' }}>
            <Title level={3} style={{ color: '#fff', margin: 0 }}><a href="/admin" style={{ color: '#fff' }}>Quản Lý Tour Du Lịch</a></Title>
        </Header>
    );
};

export default AdminHeader;