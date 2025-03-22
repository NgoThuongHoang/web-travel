import React, { useState, useEffect, useRef } from "react";
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
  CheckCircleOutlined,
} from "@ant-design/icons";
import "../styles/TourEditForm.css";

const { TextArea } = Input;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const TourEditForm = ({ tour, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [deletingDayIndex, setDeletingDayIndex] = useState(null);
  const [deletingHighlightIndex, setDeletingHighlightIndex] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const carouselRef = useRef(null);

  useEffect(() => {
    if (tour?.itinerary) {
      const standardizedItinerary = tour.itinerary.map((day) => {
        let detailsObject = { Sáng: "", Trưa: "", Tối: "" };

        try {
          let detailsArray = [];
          if (typeof day.details === "string") {
            detailsArray = JSON.parse(day.details);
          } else if (Array.isArray(day.details)) {
            detailsArray = day.details;
          } else if (typeof day.details === "object" && day.details !== null) {
            detailsObject = {
              Sáng: day.details["Sáng"] || "",
              Trưa: day.details["Trưa"] || "",
              Tối: day.details["Tối"] || "",
            };
            return {
              ...day,
              details: detailsObject,
            };
          }

          if (Array.isArray(detailsArray)) {
            detailsArray.forEach((detail) => {
              if (typeof detail === "string") {
                if (detail.startsWith("Sáng:")) {
                  detailsObject.Sáng = detail.replace("Sáng:", "").trim();
                } else if (detail.startsWith("Trưa:")) {
                  detailsObject.Trưa = detail.replace("Trưa:", "").trim();
                } else if (detail.startsWith("Chiều:")) {
                  detailsObject.Trưa = detail.replace("Chiều:", "").trim();
                } else if (detail.startsWith("Tối:")) {
                  detailsObject.Tối = detail.replace("Tối:", "").trim();
                }
              }
            });
          }
        } catch (error) {
          console.error("Lỗi khi parse details:", error);
        }

        return {
          ...day,
          details: detailsObject,
        };
      });

      setItineraryDays(standardizedItinerary);
    } else {
      setItineraryDays([]);
    }
  }, [tour]);

  // Chuyển đổi tour?.images sang định dạng fileList cho Upload
  useEffect(() => {
    if (tour?.images && Array.isArray(tour.images)) {
      const formattedFileList = tour.images.map((image, index) => {
        let imageUrl = image.image_url;
        if (imageUrl.startsWith('http://localhost:5001')) {
          imageUrl = imageUrl.replace('http://localhost:5001', '');
        }
        return {
          uid: image.id.toString(),
          name: imageUrl.split('/').pop(),
          status: 'done',
          url: imageUrl,
        };
      });
      // Không giới hạn số lượng ảnh
      setFileList(formattedFileList);
    } else {
      setFileList([]);
    }
    setHighlights(tour?.highlights || []);
    form.resetFields();
  }, [tour, form]);

  // Định dạng start_date thành yyyy-MM-dd để phù hợp với Input type="date"
  const formattedStartDate = tour?.start_date
    ? new Date(tour.start_date).toISOString().split("T")[0]
    : "";

  // Khởi tạo giá trị ban đầu cho form
  const initialValues = {
    title: tour?.name || "",
    duration: tour?.days && tour?.nights ? `${tour.days} NGÀY ${tour.nights} ĐÊM` : "",
    departureDate: formattedStartDate,
    transportation: tour?.transportation || "",
    departurePoint: tour?.departure_point || "",
    price: tour?.price || "",
  };

  const onFinish = (values) => {
    const data = {
      ...values,
      images: fileList.map((file) => ({
        id: file.uid,
        image_url: file.url || file.thumbUrl,
        caption: file.caption || null,
      })),
      itinerary: itineraryDays,
      highlights: highlights,
    };
    setPreviewData(data);
    setIsPreviewVisible(true);
  };

  // Hàm xử lý upload ảnh tại vị trí cụ thể (cho các ô ảnh trong danh sách)
  const onFileChange = (index) => ({ file }) => {
    const newFileList = [...fileList];
    const newFile = {
      uid: file.uid || Date.now().toString(),
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      file: file,
    };
    newFileList[index] = newFile;
    setFileList(newFileList);
  };

  // Hàm xử lý upload ảnh từ ô upload riêng biệt
  const onFileChangeSeparate = ({ file }) => {
    const newFile = {
      uid: file.uid || Date.now().toString(),
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      file: file,
    };

    const updatedFileList = [...fileList, newFile];
    setFileList(updatedFileList);
  };

  const handleRemoveImage = (index) => {
    const updatedFileList = [...fileList];
    updatedFileList.splice(index, 1);
    setFileList(updatedFileList);
  };

  const addNewDay = () => {
    const newDay = {
      day_number: itineraryDays.length + 1,
      title: `Ngày ${itineraryDays.length + 1}`,
      details: { Sáng: "", Trưa: "", Tối: "" },
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
    onSubmit(previewData);
    setIsPreviewVisible(false);
    setIsSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
    onCancel();
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
              <Form.Item label="Tiêu đề tour" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề tour" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời gian" name="duration" rules={[{ required: true, message: "Vui lòng nhập thời gian" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngày khởi hành" name="departureDate" rules={[{ required: true, message: "Vui lòng chọn ngày khởi hành" }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phương tiện" name="transportation" rules={[{ required: true, message: "Vui lòng nhập phương tiện" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Điểm khởi hành" name="departurePoint" rules={[{ required: true, message: "Vui lòng nhập điểm khởi hành" }]}>
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
            style={{ width: "100%", marginTop: 16 }}
          >
            Thêm điểm nổi bật
          </Button>
        </Card>

        <Card title="Ảnh tour" style={{ marginTop: 16 }}>
          <Form.Item name="images">
            {/* Hiển thị danh sách ảnh theo dạng lưới 2 cột */}
            <Row gutter={[16, 16]}>
              {fileList.map((file, index) => (
                <Col span={12} key={index}>
                  <div className="image-container" style={{ position: "relative", textAlign: "center" }}>
                    <Image
                      src={file.url || file.thumbUrl || "/placeholder.svg"}
                      alt={`Ảnh tour ${index + 1}`}
                      width={150}
                      height={150}
                      preview={{
                        mask: <EyeOutlined style={{ fontSize: "20px", color: "white" }} />,
                      }}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="image-actions" style={{ position: "absolute", bottom: 5, right: 5 }}>
                      <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={onFileChange(index)}
                      >
                        <Button icon={<UploadOutlined />} type="text" />
                      </Upload>
                      <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Ô upload ảnh riêng biệt */}
            <Row justify="center" style={{ marginTop: 16 }}>
              <Col>
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={onFileChangeSeparate}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <UploadOutlined style={{ fontSize: 24, color: "#999" }} />
                    <Text style={{ marginTop: 8, color: "#999" }}>
                      Thêm ảnh
                    </Text>
                  </div>
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
                    value={day.details?.["Sáng"] || ""}
                    onChange={(e) => updateDayDetails(index, "Sáng", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Buổi trưa">
                  <TextArea
                    value={day.details?.["Trưa"] || ""}
                    onChange={(e) => updateDayDetails(index, "Trưa", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Buổi tối">
                  <TextArea
                    value={day.details?.["Tối"] || ""}
                    onChange={(e) => updateDayDetails(index, "Tối", e.target.value)}
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
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            Hủy
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
          width="90%"
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
                  {(previewData.images || []).map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.image_url || "/placeholder.svg"}
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
                  <Text>{day.details?.["Sáng"] || "Chưa có thông tin"}</Text>
                  <br />
                  <Text strong>Buổi trưa:</Text>
                  <Text>{day.details?.["Trưa"] || "Chưa có thông tin"}</Text>
                  <br />
                  <Text strong>Buổi tối:</Text>
                  <Text>{day.details?.["Tối"] || "Chưa có thông tin"}</Text>
                </Card>
              ))}
            </div>
          )}
        </Modal>

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