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
  InputNumber,
  Select,
  Divider,
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
const { Option } = Select;

const API_BASE_URL = "http://localhost:5001/api/tours";

// Hàm định dạng ngày
const formatDate = (dateString) => {
  if (!dateString) return "Chưa có thông tin";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  } catch (error) {
    console.error("Lỗi khi định dạng ngày:", error);
    return dateString;
  }
};

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
  const [prices, setPrices] = useState([
    { age_group: "Under 5", price: 0, single_room_price: null, description: "Miễn phí cho trẻ dưới 5 tuổi" },
    { age_group: "5-11", price: "", single_room_price: "", description: "" },
    { age_group: "Adult", price: "", single_room_price: "", description: "" },
  ]);
  const [selectedRegion, setSelectedRegion] = useState(""); // State để lưu giá trị dropdown khu vực
  const [customRegion, setCustomRegion] = useState(""); // State để lưu khu vực tùy chỉnh
  const [regionInput, setRegionInput] = useState('');
  const [availableRegions, setAvailableRegions] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Gọi API lấy danh sách khu vực khi component mount
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/regions`);
        if (response.ok) {
          const data = await response.json();
          setAvailableRegions(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khu vực:", error);
      }
    };
    fetchRegions();
  }, []);

  // Hàm lấy lịch trình từ API
  const fetchItinerary = async (tourId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${tourId}/itineraries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API lịch trình: ${response.status}`);
      }

      const data = await response.json();
      console.log("Lịch trình từ API trong TourEditForm:", data);

      if (Array.isArray(data)) {
        const standardizedItinerary = data.map((day) => {
          let detailsObject = { Sáng: "", Trưa: "", Chiều: "", Tối: "" };

          try {
            let detailsArray = [];
            if (typeof day.details === "string") {
              detailsArray = JSON.parse(day.details);
            } else if (Array.isArray(day.details)) {
              detailsArray = day.details;
            }

            if (Array.isArray(detailsArray)) {
              detailsArray.forEach((detail) => {
                if (typeof detail === "string") {
                  if (detail.startsWith("Sáng:")) {
                    detailsObject.Sáng = detail.replace("Sáng:", "").trim();
                  } else if (detail.startsWith("Trưa:")) {
                    detailsObject.Trưa = detail.replace("Trưa:", "").trim();
                  } else if (detail.startsWith("Chiều:")) {
                    detailsObject.Chiều = detail.replace("Chiều:", "").trim();
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
            day_number: day.day_number,
            title: day.title,
            details: detailsObject,
            id: day.id,
          };
        });

        setItineraryDays(standardizedItinerary);
      } else {
        throw new Error("Dữ liệu lịch trình không đúng định dạng!");
      }
    } catch (error) {
      console.error("Lỗi fetchItinerary:", error);
      setItineraryDays([]);
    }
  };

  // Gọi API để lấy lịch trình khi tour thay đổi
  useEffect(() => {
    if (tour?.region) {
      setRegionInput(tour.region);
      form.setFieldsValue({ region: tour.region });
    } else {
      setRegionInput('');
      form.setFieldsValue({ region: '' });
    }
  }, [tour, form]);

  // Chuyển đổi tour?.images, tour?.prices và tour?.highlights sang định dạng phù hợp
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
      setFileList(formattedFileList);
    } else {
      setFileList([]);
    }

    if (tour?.prices && Array.isArray(tour.prices)) {
      const formattedPrices = [
        { age_group: "Under 5", price: 0, single_room_price: null, description: "Miễn phí cho trẻ dưới 5 tuổi" },
        { age_group: "5-11", price: "", single_room_price: "", description: "" },
        { age_group: "Adult", price: "", single_room_price: "", description: "" },
      ];

      tour.prices.forEach((price) => {
        const index = formattedPrices.findIndex((p) => p.age_group === price.age_group);
        if (index !== -1) {
          formattedPrices[index] = {
            age_group: price.age_group,
            price: price.price || "",
            single_room_price: price.single_room_price || "",
            description: price.description || "",
          };
        }
      });
      setPrices(formattedPrices);
    }

    if (tour?.highlights && Array.isArray(tour.highlights)) {
      setHighlights(tour.highlights);
    } else {
      setHighlights([]);
    }

    // Cập nhật giá trị khu vực
    if (tour?.region) {
      const predefinedRegions = ["Miền Bắc", "Miền Trung", "Miền Nam", "Nước ngoài"];
      if (predefinedRegions.includes(tour.region)) {
        setSelectedRegion(tour.region);
        setCustomRegion("");
      } else {
        setSelectedRegion("Khác");
        setCustomRegion(tour.region);
      }
    } else {
      setSelectedRegion("");
      setCustomRegion("");
    }

    // Thay vì chỉ resetFields, chúng ta set giá trị cụ thể
    form.setFieldsValue({
      title: tour?.name || "",
      tour_code: tour?.tour_code || "",
      days: tour?.days || "",
      nights: tour?.nights || "",
      departureDate: tour?.start_date
        ? new Date(tour.start_date).toISOString().split("T")[0]
        : "",
      transportation: tour?.transportation || "",
      departurePoint: tour?.departure_point || "",
      status: tour?.status || "active",
      star_rating: tour?.star_rating || 3,
      region: tour?.region || "",
      country: tour?.country || "",
      suggestions: tour?.suggestions || "",
      total_tickets: tour?.total_tickets || 0,
      customRegion: tour?.region || "",
    });
  }, [tour, form]);

  // Định dạng start_date thành yyyy-MM-dd để phù hợp với Input type="date"
  const formattedStartDate = tour?.start_date
    ? new Date(tour.start_date).toISOString().split("T")[0]
    : "";

  // Khởi tạo giá trị ban đầu cho form
  const initialValues = {
    title: tour?.name || "",
    tour_code: tour?.tour_code || "",
    days: tour?.days || "",
    nights: tour?.nights || "",
    departureDate: formattedStartDate,
    transportation: tour?.transportation || "",
    departurePoint: tour?.departure_point || "",
    status: tour?.status || "active",
    star_rating: tour?.star_rating || 3,
    region: tour?.region || "",
    country: tour?.country || "",
    suggestions: tour?.suggestions || "",
    total_tickets: tour?.total_tickets || 0,
    customRegion: tour?.region || "",
  };

  const onFinish = (values) => {
    // Xử lý khu vực: Nếu chọn "Khác", lấy giá trị từ customRegion
    const finalRegion = selectedRegion === "Khác" ? customRegion : selectedRegion;

    const data = {
      ...values,
      images: fileList.map((file) => ({
        id: file.uid,
        image_url: file.url || file.thumbUrl,
        caption: file.caption || null,
      })),
      itinerary: itineraryDays.map((day) => ({
        day_number: day.day_number,
        title: day.title,
        details: [
          `Sáng: ${day.details.Sáng || ""}`,
          `Trưa: ${day.details.Trưa || ""}`,
          `Chiều: ${day.details.Chiều || ""}`,
          `Tối: ${day.details.Tối || ""}`,
        ].filter((detail) => !detail.endsWith(":")), // Loại bỏ các mục trống
      })),
      highlights: highlights,
      prices: prices.map((price) => ({
        age_group: price.age_group,
        price: parseFloat(price.price) || 0,
        single_room_price: price.single_room_price ? parseFloat(price.single_room_price) : null,
        description: price.description || "",
      })),
      region: regionInput || values.region || "Không xác định",
      country: values.country || "Không xác định",
      suggestions: values.suggestions || "",
      total_tickets: parseInt(values.total_tickets) || 0,
    };
    console.log("Data gửi từ TourEditForm:", data);
    setPreviewData(data);
    setIsPreviewVisible(true);
  };

  // Thêm hàm xử lý khi đóng modal preview
  const handleClosePreview = () => {
    setIsPreviewVisible(false);
  };

  // Hàm xử lý thay đổi giá
  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index][field] = value;
    setPrices(updatedPrices);
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
      details: { Sáng: "", Trưa: "", Chiều: "", Tối: "" },
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
    // Cập nhật lại day_number cho các ngày còn lại
    const reindexedDays = updatedDays.map((day, index) => ({
      ...day,
      day_number: index + 1,
      title: `Ngày ${index + 1}`,
    }));
    setItineraryDays(reindexedDays);
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
            <Col span={24}>
              <Form.Item
                label="Tiêu đề tour"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề tour" }]}
              >
                <Input style={{ width: "100%" }} placeholder="Nhập tiêu đề tour" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
              label="Khu vực"
              name="region"
              rules={[{ required: true, message: "Vui lòng nhập khu vực" }]}
            >
              <Input
                value={regionInput}
                onChange={(e) => {
                  setRegionInput(e.target.value);
                  form.setFieldsValue({ region: e.target.value });
                }}
                placeholder="Nhập khu vực (ví dụ: Miền Bắc, Châu Á, Châu Mỹ...)"
              />
            </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quốc gia"
                name="country"
              >
                <Input placeholder="Nhập quốc gia" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Gợi ý"
                name="suggestions"
              >
                <TextArea placeholder="Nhập gợi ý cho tour" rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thời gian">
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name="days"
                      rules={[{ required: true, message: "Vui lòng nhập số ngày" }]}
                      noStyle
                    >
                      <InputNumber
                        min={1}
                        placeholder="Số ngày"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="nights"
                      rules={[{ required: true, message: "Vui lòng nhập số đêm" }]}
                      noStyle
                    >
                      <InputNumber
                        min={0}
                        placeholder="Số đêm"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày khởi hành"
                name="departureDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày khởi hành" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phương tiện"
                name="transportation"
                rules={[{ required: true, message: "Vui lòng nhập phương tiện" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Điểm khởi hành"
                name="departurePoint"
                rules={[{ required: true, message: "Vui lòng nhập điểm khởi hành" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Hoạt động</Option>
                  <Option value="pending">Đang chờ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đánh giá sao"
                name="star_rating"
                rules={[{ required: true, message: "Vui lòng nhập đánh giá sao" }]}
              >
                <InputNumber min={1} max={5} placeholder="Nhập số sao (1-5)" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số vé hiện có"
                name="total_tickets"
                rules={[{ required: true, message: "Vui lòng nhập số vé hiện có" }]}
              >
                <InputNumber min={0} placeholder="Nhập số vé hiện có" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Giá tour" style={{ marginTop: 16 }}>
          {prices.map((price, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <Title level={5}>{price.age_group === "Under 5" ? "Trẻ dưới 5 tuổi" : price.age_group === "5-11" ? "Trẻ 5-11 tuổi" : "Người lớn"}</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Giá">
                    <Input
                      value={price.price}
                      onChange={(e) => handlePriceChange(index, "price", e.target.value)}
                      disabled={price.age_group === "Under 5"}
                      placeholder="Nhập giá"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Giá phòng đơn">
                    <Input
                      value={price.single_room_price}
                      onChange={(e) => handlePriceChange(index, "single_room_price", e.target.value)}
                      disabled={price.age_group === "Under 5"}
                      placeholder="Nhập giá phòng đơn (nếu có)"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Mô tả">
                    <Input
                      value={price.description}
                      onChange={(e) => handlePriceChange(index, "description", e.target.value)}
                      placeholder="Nhập mô tả"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
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
            style={{ width: "91%", marginTop: 16 }}
          >
            Thêm điểm nổi bật
          </Button>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteDay();
                          }}
                        />
                        <Button
                          icon={<CloseOutlined />}
                          type="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelDeleteDay();
                          }}
                        />
                      </Space>
                    ) : (
                      <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDay(index);
                        }}
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
                <Form.Item label="Buổi chiều">
                  <TextArea
                    value={day.details?.["Chiều"] || ""}
                    onChange={(e) => updateDayDetails(index, "Chiều", e.target.value)}
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

        <Card title="Ảnh tour" style={{ marginTop: 16 }}>
          <Form.Item name="images">
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
                    <EnvironmentOutlined /> Khu vực: {previewData.region || "Không xác định"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <EnvironmentOutlined /> Quốc gia: {previewData.country || "Không xác định"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <CalendarOutlined /> Thời gian: {previewData.days} NGÀY {previewData.nights} ĐÊM
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <ClockCircleOutlined /> Khởi hành: {formatDate(previewData.departureDate)}
                  </Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text>
                    <span role="img" aria-label="suggestion">💡</span> Gợi ý: {previewData.suggestions || "Không có gợi ý"}
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
                    <span role="img" aria-label="star">⭐</span> Đánh giá: {previewData.star_rating} sao
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <span role="img" aria-label="money">💰</span> Giá người lớn: {previewData.prices.find(p => p.age_group === "Adult")?.price || "Liên hệ"} VNĐ
                  </Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Text>
                    <span role="img" aria-label="ticket">🎫</span> Số vé hiện có: {previewData.total_tickets || "0"}
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
                  <Text strong>Buổi sáng: </Text>
                  <Text>{day.details?.find(d => d.startsWith("Sáng:"))?.replace("Sáng:", "").trim() || ""}</Text>
                  <br />
                  <Text strong>Buổi trưa: </Text>
                  <Text>{day.details?.find(d => d.startsWith("Trưa:"))?.replace("Trưa:", "").trim() || ""}</Text>
                  <br />
                  <Text strong>Buổi chiều: </Text>
                  <Text>{day.details?.find(d => d.startsWith("Chiều:"))?.replace("Chiều:", "").trim() || ""}</Text>
                  <br />
                  <Text strong>Buổi tối: </Text>
                  <Text>{day.details?.find(d => d.startsWith("Tối:"))?.replace("Tối:", "").trim() || ""}</Text>
                </Card>
              ))}

              <Title level={3}>Giá tour</Title>
              {previewData.prices.map((price, index) => (
                <div key={index}>
                  <Text strong>{price.age_group === "Under 5" ? "Trẻ dưới 5 tuổi" : price.age_group === "5-11" ? "Trẻ 5-11 tuổi" : "Người lớn"}: </Text>
                  <Text>{price.price} VNĐ</Text>
                  {price.single_room_price && (
                    <>
                      <Text> (Phòng đơn: {price.single_room_price} VNĐ)</Text>
                    </>
                  )}
                  <br />
                  <Text>{price.description}</Text>
                  <br />
                </div>
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