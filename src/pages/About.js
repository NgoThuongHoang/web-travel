import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Row, Statistic, Typography, Divider } from 'antd';
import { 
    UserOutlined, 
    GlobalOutlined, 
    RocketOutlined, 
    HomeOutlined, 
    InfoCircleOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About = () => {
    const [customers, setCustomers] = useState(0);
    const [trips, setTrips] = useState(0);
    const [locations, setLocations] = useState(0);

    const countUp = (target, setCount) => {
        let count = 0;
        const increment = Math.ceil(target / 100);
        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(interval);
            }
            setCount(count);
        }, 10);
    };

    useEffect(() => {
        countUp(2536, setCustomers);
        countUp(560, setTrips);
        countUp(132, setLocations);
    }, []);

    return (
        <>
            {/* Breadcrumb */}
            <div className="breadCrumbs">
                <div className="center">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a className="text-decoration-none" href="/"><span>Trang chủ</span></a>
                        </li>
                        <li className="breadcrumb-item active">
                            <span>Về chúng tôi</span>
                        </li>
                    </ol>
                </div>
            </div>
            
            <div className="container mt-4">
            {/* Giới thiệu công ty */}
            <Title level={2} className="text-center" style={{ color: '#fa8c16' }}>
                Giới thiệu về Sky Travel
            </Title>
            <Paragraph className="text-center">
                Chúng tôi là một doanh nghiệp hoạt động trong lĩnh vực du lịch với nhiều năm kinh nghiệm, 
                cung cấp dịch vụ chất lượng cao cho khách hàng.
            </Paragraph>

            <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={12}>
                    <img 
                        src="images/logo.png" 
                        alt="Sky Travel" 
                        style={{ width: '100%', borderRadius: '10px' }} 
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Title level={3} style={{ color: '#fa8c16' }}>Về Chúng Tôi</Title>
                    <Paragraph>
                        Sky Travel chuyên cung cấp dịch vụ du lịch chất lượng, từ tour nội địa và quốc tế, 
                        đặt vé máy bay, đến các dịch vụ khác liên quan đến du lịch.
                    </Paragraph>
                    <Paragraph>
                        Với phương châm "Trải nghiệm tuyệt vời - Giá cả hợp lý", chúng tôi cam kết mang đến dịch vụ tốt nhất cho khách hàng.
                    </Paragraph>
                </Col>
            </Row>

            <Divider />

            {/* Thống kê */}
            <Title level={2} className="text-center" style={{ color: '#fa8c16' }}>Thành tựu đạt được</Title>
            <Row gutter={16} justify="center">
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="text-center">
                        <Statistic
                            title="Khách hàng"
                            value={customers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="text-center">
                        <Statistic
                            title="Chuyến đi"
                            value={trips}
                            prefix={<RocketOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="text-center">
                        <Statistic
                            title="Địa điểm"
                            value={locations}
                            prefix={<GlobalOutlined />}
                            valueStyle={{ color: '#fa541c' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Thông tin công ty */}
            <Title level={2} style={{ color: '#fa8c16' }}>
                CÔNG TY DU LỊCH SKY TRAVEL
            </Title>
            <Paragraph>
                Biên Hòa Star Travel là một doanh nghiệp du lịch uy tín với các dịch vụ chủ lực như:
            </Paragraph>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li>✅ Voucher nghỉ dưỡng tại FLC, Vinpearl, Flamingo</li>
                <li>✅ Tour du lịch trong và ngoài nước</li>
                <li>✅ Đặt vé máy bay giá rẻ</li>
                <li>✅ Cho thuê xe du lịch, tổ chức team building</li>
            </ul>

            <Title level={3} style={{ color: '#fa8c16' }}>Định vị thương hiệu</Title>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li>⭐ Công ty du lịch 5 sao, chuyên nghiệp và thân thiện.</li>
                <li>⭐ Chuyên tổ chức team building kết hợp du lịch.</li>
                <li>⭐ Tour nghỉ dưỡng đạt chuẩn quốc tế.</li>
            </ul>

            <Title level={3} style={{ color: '#fa8c16' }}>Mục tiêu</Title>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li>🎯 Trở thành công ty du lịch uy tín hàng đầu.</li>
                <li>🎯 Đem đến sự hài lòng tuyệt đối cho khách hàng.</li>
                <li>🎯 Hướng tới dịch vụ cao cấp với giá tốt nhất.</li>
            </ul>
        </div>
        </>
    );
};

export default About;
