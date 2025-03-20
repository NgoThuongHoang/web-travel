import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Row,
  Col,
  Collapse,
  Image,
  Space,
  Modal,
  Typography,
  Carousel,
  List,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import "../styles/TourEditForm.css";


const { TextArea } = Input;
const { Panel } = Collapse;
const { Title, Text } = Typography;


const TourEditForm = ({ initialValues, onSave }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState(initialValues.images || []);
  const [itineraryDays, setItineraryDays] = useState(initialValues.itinerary || []);
  const [highlights, setHighlights] = useState(initialValues.highlights || []);
  const [deletingDayIndex, setDeletingDayIndex] = useState(null);
  const [deletingHighlightIndex, setDeletingHighlightIndex] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // State cho modal thành công

  const carouselRef = useRef(null);

  const onFinish = (values) => {
    const data = {
      ...values,
      images: fileList,
      itinerary: itineraryDays,
      highlights: highlights,
    };
    setPreviewData(data);
    setIsPreviewVisible(true);
  };

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const addNewDay = () => {
    const newDay = {
      day_number: itineraryDays.length + 1,
      title: `Ngày ${itineraryDays.length + 1}`,
      details: { morning: "", afternoon: "", evening: "" },
    };
    setItineraryDays([...itineraryDays, newDay]);
  };

  const updateDayDetails = (dayIndex, key, value) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].details[key] = value;
    setItineraryDays(updatedDays);
  };

  const handleDeleteDay = (index) => {
    setDeletingDayIndex(index);
  };

  const confirmDeleteDay = () => {
    const updatedDays = itineraryDays.filter((_, i) => i !== deletingDayIndex);
    setItineraryDays(updatedDays);
    setDeletingDayIndex(null);
  };

  const cancelDeleteDay = () => {
    setDeletingDayIndex(null);
  };

  const handleSave = () => {
    onSave(previewData); // Gọi hàm onSave để lưu dữ liệu
    setIsPreviewVisible(false); // Đóng modal xem trước
    setIsSuccessModalVisible(true); // Mở modal thành công
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false); // Đóng modal thành công
  };

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const updateHighlight = (index, value) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = value;
    setHighlights(updatedHighlights);
  };

  const handleDeleteHighlight = (index) => {
    setDeletingHighlightIndex(index);
  };

  const confirmDeleteHighlight = () => {
    const updatedHighlights = highlights.filter((_, i) => i !== deletingHighlightIndex);
    setHighlights(updatedHighlights);
    setDeletingHighlightIndex(null);
  };

  const cancelDeleteHighlight = () => {
    setDeletingHighlightIndex(null);
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  const next = () => {
    carouselRef.current.next();
  };

  return (
    <>
      <Form form={form} initialValues={initialValues} onFinish={onFinish} layout="vertical">
        <Card title="Thông tin chung">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tiêu đề tour" name="title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời gian" name="duration" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngày khởi hành" name="departureDate" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phương tiện" name="transportation" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Điểm khởi hành" name="departurePoint" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giá tour" name="price">
                <Input placeholder="Nhập giá (hoặc để 'Liên hệ')" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Điểm nổi bật" style={{ marginTop: 16 }}>
          {highlights.map((highlight, index) => (
            <Row key={index} className="highlight-item">
              <Col span={24}>
                <Form.Item label={`Điểm nổi bật ${index + 1}`}>
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    addonAfter={
                      deletingHighlightIndex === index ? (
                        <Space>
                          <Button
                            icon={<CheckOutlined />}
                            type="text"
                            danger
                            onClick={confirmDeleteHighlight}
                          />
                          <Button
                            icon={<CloseOutlined />}
                            type="text"
                            onClick={cancelDeleteHighlight}
                          />
                        </Space>
                      ) : (
                        <Button
                          icon={<DeleteOutlined />}
                          type="text"
                          danger
                          onClick={() => handleDeleteHighlight(index)}
                        />
                      )
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            onClick={addHighlight}
            block
            icon={<PlusOutlined />}
            className="highlight-add-button"
          >
            Thêm điểm nổi bật
          </Button>
        </Card>

        <Card title="Ảnh tour" style={{ marginTop: 16 }}>
          <Form.Item name="images">
            <Row gutter={[8, 8]}>
              {fileList.map((file, index) => (
                <Col key={index} span={6}>
                  <div className="image-container">
                    <Image
                      src={file.thumbUrl || file.url}
                      alt={`Ảnh tour ${index + 1}`}
                      width={300}
                      height={300}
                      preview={{
                        mask: <EyeOutlined style={{ fontSize: "20px", color: "white" }} />,
                      }}
                    />
                    <div className="image-actions">
                      <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={onFileChange}
                      >
                        <Button icon={<UploadOutlined />} type="text" />
                      </Upload>
                    </div>
                  </div>
                </Col>
              ))}
              <Col span={6}>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onFileChange}
                  beforeUpload={() => false}
                >
                  {fileList.length < 5 && <UploadOutlined />}
                </Upload>
              </Col>
            </Row>
          </Form.Item>
        </Card>

        <Card title="Lịch trình" style={{ marginTop: 16 }}>
          <Collapse>
            {itineraryDays.map((day, index) => (
              <Panel
                header={
                  <Space>
                    {`Ngày ${day.day_number}: ${day.title}`}
                    {deletingDayIndex === index ? (
                      <Space>
                        <Button
                          icon={<CheckOutlined />}
                          type="text"
                          danger
                          onClick={confirmDeleteDay}
                        />
                        <Button
                          icon={<CloseOutlined />}
                          type="text"
                          onClick={cancelDeleteDay}
                        />
                      </Space>
                    ) : (
                      <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => handleDeleteDay(index)}
                      />
                    )}
                  </Space>
                }
                key={index}
              >
                <Form.Item label="Tiêu đề ngày">
                  <Input
                    value={day.title}
                    onChange={(e) => {
                      const updatedDays = [...itineraryDays];
                      updatedDays[index].title = e.target.value;
                      setItineraryDays(updatedDays);
                    }}
                  />
                </Form.Item>
                <Form.Item label="Buổi sáng">
                  <TextArea
                    value={day.details.morning}
                    onChange={(e) => updateDayDetails(index, "morning", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Buổi trưa">
                  <TextArea
                    value={day.details.afternoon}
                    onChange={(e) => updateDayDetails(index, "afternoon", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Buổi tối">
                  <TextArea
                    value={day.details.evening}
                    onChange={(e) => updateDayDetails(index, "evening", e.target.value)}
                  />
                </Form.Item>
              </Panel>
            ))}
          </Collapse>
          <Button type="dashed" onClick={addNewDay} block icon={<PlusOutlined />}>
            Thêm ngày
          </Button>
        </Card>

        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Xem trước
          </Button>
        </Form.Item>

        <Modal
          title="Xem trước tour"
          open={isPreviewVisible}
          onCancel={() => setIsPreviewVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsPreviewVisible(false)}>
              Thoát
            </Button>,
            <Button key="save" type="primary" onClick={handleSave}>
              Lưu thay đổi
            </Button>,
          ]}
          width="90%" // Giữ độ rộng modal hợp lý
          className="custom-modal"
          centered
        >
          {previewData && (
            <div>
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

              <div className="carousel-container">
                <Carousel autoplay ref={carouselRef}>
                  {previewData.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.thumbUrl || image.url || "/placeholder.svg"}
                        alt={`Ảnh tour ${index + 1}`}
                        style={{ width: "600px", height: "600px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </Carousel>
                <div className="carousel-arrow prev-arrow" onClick={prev}>
                  <LeftOutlined />
                </div>
                <div className="carousel-arrow next-arrow" onClick={next}>
                  <RightOutlined />
                </div>
              </div>

              <Title level={3}>Điểm nổi bật</Title>
              <List
                dataSource={previewData.highlights}
                renderItem={(item, index) => (
                  <List.Item>
                    <Text>{`${index + 1}. ${item}`}</Text>
                  </List.Item>
                )}
              />

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
            </div>
          )}
        </Modal>

        {/* Modal thông báo thành công */}
        <Modal
          title="Thông báo"
          open={isSuccessModalVisible}
          onOk={handleCloseSuccessModal}
          onCancel={handleCloseSuccessModal}
          footer={[
            <Button key="ok" type="primary" onClick={handleCloseSuccessModal}>
              Đóng
            </Button>,
          ]}
          centered
          className="success-modal"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <CheckCircleOutlined style={{ fontSize: "40px", color: "#52c41a" }} />
            <p>Đã lưu thành công!</p>
          </div>
        </Modal>
      </Form>
    </>
  );
};

export default TourEditForm;