import React, { useState } from "react";
import { Layout, Input, Button, Card, Typography, Row, Col, Carousel } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import TourEditForm from "../../components/TourEditForm";
import "../../styles/TourEditPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const TourEditPage = () => {
  const [tourLink, setTourLink] = useState("");
  const [tourData, setTourData] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const fetchTourData = async (link) => {
    const mockData = {
      title: "HCM - Ninh Bình – Sapa",
      duration: "3 NGÀY",
      departureDate: "02/08",
      transportation: "MÁY BAY",
      departurePoint: "TP HCM",
      price: "Liên hệ",
      highlights: [
        "Khám phá Thủ đô Hà Nội với: Văn Miếu Quốc Tử Giám, Quảng Trường Ba Đình, Bảo tàng Hồ Chí Minh, Nhà sàn, Chùa Một Cột.",
        "Thăm quan Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới.",
        "Thưởng thức những món ăn đặc sản tươi ngon trên Du thuyền Hạ Long.",
        "Chòng chành non nước Ninh Bình di sản thế giới Bái Đính - Tràng An.",
        "Chiêm ngưỡng nét đẹp thơ mộng, trữ tình của Sapa, khám phá sắc màu văn hoá vùng cao.",
      ],
      itinerary: [
        {
          day_number: 1,
          title: "TP.HCM - ĐÀ NẴNG",
          details: {
            morning: "Bay từ TP.HCM đến Đà NẴNG - BÀ NÀ HILLS",
            afternoon: "",
            evening: "",
          },
        },
      ],
      images: [
        {
          url: "/images/images_tour/anh_tour_viet_nam/ba-na1-2013.jpg",
          thumbUrl: "/images/images_tour/anh_tour_viet_nam/ba-na1-2013.jpg",
        },
        {
          url: "/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
          thumbUrl: "/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
        },
        {
          url: "/images/images_tour/anh_tour_viet_nam/chua-bai-dinh-2071-3727.png",
          thumbUrl: "/images/images_tour/anh_tour_viet_nam/chua-bai-dinh-2071-3727.png",
        },
      ],
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 1000);
    });
  };

  const handleLoadTour = async () => {
    if (!tourLink) {
      return; // Không hiển thị lỗi vì đã bỏ message
    }

    try {
      const data = await fetchTourData(tourLink);
      setTourData(data);
      setPreviewData(null); // Ẩn xem trước khi tải tour mới
    } catch (error) {
      // Không hiển thị lỗi vì đã bỏ message
    }
  };

  const handlePreview = (values) => {
    setPreviewData(values);
  };

  const handleSave = (values) => {
    setTourData(values);
    setPreviewData(null); // Ẩn xem trước sau khi lưu
    // Không cần thông báo message nữa, modal thành công được xử lý trong TourEditForm
  };

  return (
    <Layout className="tour-edit-page">
      <Content>
        <Card title="Nhập link tour cần sửa" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập link tour..."
            value={tourLink}
            onChange={(e) => setTourLink(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={handleLoadTour}>
            Tải tour
          </Button>
        </Card>

        {tourData && (
          <TourEditForm
            initialValues={tourData}
            onPreview={handlePreview}
            onSave={handleSave}
          />
        )}

        {previewData && (
          <Card title="Xem trước tour" style={{ marginTop: 16 }}>
            <Title level={2}>{previewData.title}</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Text>
                  <CalendarOutlined /> Thời gian: {previewData.duration}
                </Text>
              </Col>
              <Col span={12}>
                <Text>
                  <ClockCircleOutlined /> Khởi hành: {previewData.departureDate}
                </Text>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Text>
                  <TeamOutlined /> Phương tiện: {previewData.transportation}
                </Text>
              </Col>
              <Col span={12}>
                <Text>
                  <EnvironmentOutlined /> Điểm khởi hành: {previewData.departurePoint}
                </Text>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Text>
                  <span role="img" aria-label="money">💰</span> Giá: {previewData.price || "Liên hệ"}
                </Text>
              </Col>
            </Row>

            <Carousel autoplay>
              {previewData.images.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={`Ảnh tour ${index + 1}`} style={{ width: "100%" }} />
                </div>
              ))}
            </Carousel>

            <Title level={3}>Lịch trình</Title>
            {previewData.itinerary.map((day, index) => (
              <Card key={index} title={`Ngày ${day.day_number}: ${day.title}`} style={{ marginBottom: 16 }}>
                <Text strong>Buổi sáng:</Text>
                <Text>{day.details.morning}</Text>
                <br />
                <Text strong>Buổi trưa:</Text>
                <Text>{day.details.afternoon}</Text>
                <br />
                <Text strong>Buổi tối:</Text>
                <Text>{day.details.evening}</Text>
              </Card>
            ))}
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default TourEditPage;