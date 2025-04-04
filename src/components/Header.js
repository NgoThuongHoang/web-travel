import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Form,
    Input,
    Select,
    DatePicker,
    Slider,
    Button,
    Checkbox,
    Row,
    Col,
    Typography,
    Divider,
    Card,
    message,
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
} from "@ant-design/icons";
import "../styles/Header.css";
import "antd/dist/reset.css";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const API_BASE_URL = "http://localhost:5001/api/tours";

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [priceRangeValue, setPriceRangeValue] = useState([0, 10000000]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const searchRef = useRef(null);
    const location = useLocation(); // Thêm hook location
    const [form] = Form.useForm();

    // Thêm useEffect để đóng form khi chuyển trang
    useEffect(() => {
        setShowSearch(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                // Kiểm tra không phải là nút search
                const searchButton = document.querySelector(".fa-search");
                if (!searchButton || !searchButton.contains(event.target)) {
                    setShowSearch(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Thêm hàm xử lý khi click vào tour
    const handleTourClick = () => {
        setShowSearch(false);
    };

    const fetchTours = async (filters = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.destination) queryParams.append("search", filters.destination);
            if (filters.dateRange) {
                queryParams.append(
                    "startDate",
                    filters.dateRange[0].format("YYYY-MM-DD")
                );
                queryParams.append(
                    "endDate",
                    filters.dateRange[1].format("YYYY-MM-DD")
                );
            }
            if (filters.tourType) queryParams.append("type", filters.tourType);
            if (filters.priceRange) {
                queryParams.append("minPrice", filters.priceRange[0]);
                queryParams.append("maxPrice", filters.priceRange[1]);
            }
            if (filters.amenities && filters.amenities.length > 0) {
                queryParams.append("amenities", filters.amenities.join(","));
            }

            const response = await fetch(
                `${API_BASE_URL}?${queryParams.toString()}`
            );
            if (!response.ok) throw new Error("Lỗi khi lấy danh sách tour");
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            message.error("Không thể tìm kiếm: " + error.message);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = (values) => {
        const filters = {
            destination: values.destination || "",
            dateRange: values.dateRange || null,
            tourType: values.tourType || "",
            priceRange: values.priceRange || null,
            amenities: values.amenities || [],
        };
        fetchTours(filters);
    };

    const onReset = () => {
        form.resetFields();
        setPriceRangeValue([0, 10000000]);
        setSearchResults([]);
    };

    const handlePriceRangeChange = (value) => {
        setPriceRangeValue(value);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VNĐ";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa có thông tin";
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (menuOpen) setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setSearchResults([]);
            form.resetFields();
            setPriceRangeValue([0, 10000000]);
        }
    };

    return (
        <>
            {/* Overlay khi search hiển thị */}
            {showSearch && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 998,
                    }}
                />
            )}

            <nav
                className="navbar navbar-expand-lg navbar-light bg-light"
                style={{ top: 0, width: "100%", zIndex: 1000, position: "sticky" }}
            >
                <div className="container" style={{ padding: "0px" }}>
                    <a className="navbar-brand logo" href="/">
                        <img
                            onError={(e) => {
                                e.target.src =
                                    "thumbs/170x85x2/assets/images/noimage.png";
                            }}
                            src="./images/logo.png"
                            alt="Công ty TNHH Du lịch Ngôi Sao Biên Hoà"
                        />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleMenu}
                        aria-controls="navbarNav"
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className={`collapse navbar-collapse ${
                            menuOpen ? "show" : ""
                        }`}
                        id="navbarNav"
                    >
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    href="/"
                                    title="Trang chủ"
                                >
                                    <i
                                        className="fas fa-home"
                                        style={{ marginRight: "5px" }}
                                    ></i>{" "}
                                    TRANG CHỦ
                                </a>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    onClick={toggleDropdown}
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen}
                                >
                                    TOUR TRONG NƯỚC
                                </a>
                                <div
                                    className={`dropdown-menu ${
                                        dropdownOpen ? "show" : ""
                                    }`}
                                    aria-labelledby="navbarDropdown"
                                >
                                    <div className="tour-container">
                                        <div className="tour-row">
                                            <div className="tour-column">
                                                <img
                                                    src="./images/tour-trong-nuoc.jpg"
                                                    alt="Tour trong nước"
                                                    className="tour-image"
                                                />
                                            </div>
                                            <div className="tour-column">
                                                <h5 className="tour-title">
                                                    MIỀN BẮC
                                                </h5>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-xuyen-bac"
                                                >
                                                    TOUR XUYÊN BẮC
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-ha-giang"
                                                >
                                                    TOUR HÀ GIANG
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-sa-pa"
                                                >
                                                    TOUR SA PA
                                                </a>
                                            </div>
                                            <div className="tour-column">
                                                <h5 className="tour-title">
                                                    MIỀN TRUNG
                                                </h5>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-hue"
                                                >
                                                    TOUR HUẾ
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-quang-tri"
                                                >
                                                    TOUR QUẢNG TRỊ
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-quang-binh"
                                                >
                                                    TOUR QUẢNG BÌNH
                                                </a>
                                            </div>
                                            <div className="tour-column">
                                                <h5 className="tour-title">
                                                    MIỀN NAM
                                                </h5>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-can-tho"
                                                >
                                                    TOUR CẦN THƠ
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-an-giang"
                                                >
                                                    TOUR AN GIANG
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-ca-mau"
                                                >
                                                    TOUR CÀ MAU
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-vung-tau"
                                                >
                                                    TOUR VŨNG TÀU
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-dong-thap"
                                                >
                                                    TOUR ĐỒNG THÁP
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-ben-tre"
                                                >
                                                    TOUR BẾN TRE
                                                </a>
                                            </div>
                                            <div className="tour-column">
                                                <h5 className="tour-title">
                                                    TÂY NGUYÊN
                                                </h5>
                                                <a
                                                    className="dropdown-item"
                                                    href="/tour-gia-lai"
                                                >
                                                    TOUR GIA LAI
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/tour-ngoai-nuoc"
                                    title="Tour ngoài nước"
                                >
                                    TOUR NGOÀI NƯỚC
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/ve-chung-toi"
                                    title="Về chúng tôi"
                                >
                                    VỀ CHÚNG TÔI
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/tin-tuc"
                                    title="Tin tức"
                                >
                                    TIN TỨC
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/lien-he"
                                    title="Liên hệ"
                                >
                                    LIÊN HỆ
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/tour-info-page"
                                    title="Tra cứu"
                                >
                                    TRA CỨU
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    href="/dang-nhap"
                                    title="Đăng nhập"
                                >
                                    <i
                                        className="fas fa-user"
                                        style={{ marginRight: "5px" }}
                                    ></i>{" "}
                                </a>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-link"
                                    onClick={toggleSearch}
                                    style={{ fontSize: "18px", marginTop: "2px" }}
                                >
                                    <i className="fas fa-search"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Ô tìm kiếm */}
                {showSearch && (
                    <div
                        ref={searchRef}
                        className="container"
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#fff",
                            padding: "20px",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                            width: "100%",
                            maxWidth: "1200px",
                            zIndex: 999,
                        }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                priceRange: [0, 10000000],
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item name="destination" label="Tìm kiếm (tên tour, điểm đến, quốc gia)">
                                        <Input
                                            placeholder="Nhập tên tour, điểm đến hoặc quốc gia"
                                            prefix={<SearchOutlined />}
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item
                                        name="dateRange"
                                        label="Ngày khởi hành"
                                    >
                                        <RangePicker
                                            format="DD/MM/YYYY"
                                            placeholder={["Từ ngày", "Đến ngày"]}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item name="tourType" label="Loại tour">
                                        <Select
                                            placeholder="Chọn loại tour"
                                            allowClear
                                        >
                                            <Option value="Trong nước">
                                                Trong nước
                                            </Option>
                                            <Option value="Nước ngoài">
                                                Nước ngoài
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Form.Item
                                        name="priceRange"
                                        label="Khoảng giá (VNĐ)"
                                    >
                                        <div style={{ minWidth: "200px" }}>
                                            <Slider
                                                range
                                                min={0}
                                                max={20000000}
                                                step={500000}
                                                value={priceRangeValue}
                                                onChange={handlePriceRangeChange}
                                                tooltip={{
                                                    formatter: (value) =>
                                                        `${value.toLocaleString()} VNĐ`,
                                                }}
                                                style={{ width: "100%" }}
                                            />
                                            <Text
                                                style={{
                                                    display: "block",
                                                    marginTop: "8px",
                                                    minWidth: "200px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {formatPrice(priceRangeValue[0])} -{" "}
                                                {formatPrice(priceRangeValue[1])}
                                            </Text>
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={10}>
                                    <Form.Item
                                        name="amenities"
                                        label="Tiện ích đi kèm"
                                    >
                                        <Checkbox.Group>
                                            <Row gutter={[8, 8]}>
                                                <Col span={12}>
                                                    <Checkbox value="Hướng dẫn viên">
                                                        Hướng dẫn viên
                                                    </Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="Ăn uống">
                                                        Ăn uống
                                                    </Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="Khách sạn 4 sao">
                                                        Khách sạn 4 sao
                                                    </Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="Khách sạn 5 sao">
                                                        Khách sạn 5 sao
                                                    </Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Row gutter={[8, 0]} justify="end">
                                        <Col>
                                            <Button
                                                type="primary"
                                                icon={<FilterOutlined />}
                                                htmlType="submit"
                                                style={{ marginTop: "30px" }}
                                                loading={loading}
                                            >
                                                Tìm
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                icon={<ClearOutlined />}
                                                onClick={onReset}
                                                style={{ marginTop: "30px" }}
                                            >
                                                Xóa
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>

                        {/* Kết quả tìm kiếm */}
                        {searchResults.length > 0 && (
                            <div style={{ marginTop: "20px" }}>
                            <Divider>Kết quả tìm kiếm ({searchResults.length})</Divider>
                            <div 
                                style={{ 
                                display: "flex",
                                gap: "20px",
                                overflowX: "auto",
                                padding: "10px 0",
                                scrollbarWidth: "thin"
                                }}
                            >
                                {searchResults.map((tour) => (
                                <Card 
                                    key={tour.id}
                                    hoverable 
                                    style={{ 
                                    minWidth: "280px",
                                    margin: "0",
                                    flexShrink: 0
                                    }}
                                >
                                    <img
                                    src={tour.images?.[0]?.image_url || "/default-tour-image.jpg"}
                                    alt={tour.name}
                                    style={{ 
                                        width: "100%", 
                                        height: "150px", 
                                        objectFit: "cover", 
                                        marginBottom: "12px" 
                                    }}
                                    />
                                    <Link 
                                    to={`/chi-tiet-tour/${tour.id}`}
                                    onClick={handleTourClick} // Thêm onClick
                                    style={{
                                        color: "#333",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        marginBottom: "8px",
                                        display: "block",
                                        textDecoration: "none"
                                    }}
                                    className="tour-name-link"
                                    >
                                    {tour.name}
                                    </Link>
                                    <Text style={{ display: "block", marginBottom: "4px" }}>
                                    <strong>Điểm đến:</strong> {tour.departure_point}
                                    </Text>
                                    <Text style={{ display: "block", marginBottom: "4px" }}>
                                    <strong>Thời gian:</strong> {tour.days} ngày {tour.nights} đêm
                                    </Text>
                                    <Text style={{ display: "block", marginBottom: "4px" }}>
                                    <strong>Ngày khởi hành:</strong> {formatDate(tour.start_date)}
                                    </Text>
                                    <Text style={{ 
                                    display: "block", 
                                    marginBottom: "12px", 
                                    color: "#ff7b00", 
                                    fontWeight: "bold" 
                                    }}>
                                    {formatPrice(tour.prices?.find(p => p.age_group === "Adult")?.price || 0)}
                                    </Text>
                                    <Button 
                                    type="primary" 
                                    style={{ 
                                        backgroundColor: "#ff7b00", 
                                        borderColor: "#ff7b00",
                                        width: "100%"
                                    }}
                                    onClick={handleTourClick} // Thêm onClick
                                    >
                                    Xem chi tiết
                                    </Button>
                                </Card>
                                ))}
                            </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
};

export default Header;