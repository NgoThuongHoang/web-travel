import React, { useState } from "react";
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
const { Text } = Typography;

const API_BASE_URL = "http://localhost:5001/api/tours";

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // Chỉ cần boolean vì chỉ còn 1 dropdown

    const [form] = Form.useForm();
    const [priceRangeValue, setPriceRangeValue] = useState([0, 10000000]);

    const fetchTours = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.destination)
                queryParams.append("search", filters.destination);
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
            window.location.href = `/search-results?${queryParams.toString()}`;
        } catch (error) {
            message.error("Không thể tìm kiếm: " + error.message);
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
    };

    const handlePriceRangeChange = (value) => {
        setPriceRangeValue(value);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VNĐ";
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (menuOpen) setDropdownOpen(false); // Đóng dropdown khi đóng menu
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen); // Toggle dropdown
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-light"
            style={{ top: 0, width: "100%", zIndex: 1000, position: "sticky" }}
        >
            <div className="container">
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
                                onClick={toggleDropdown} // Toggle dropdown
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
                                onClick={() => setShowSearch(!showSearch)}
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
                                <Form.Item name="destination" label="Điểm đến">
                                    <Input
                                        placeholder="Nhập điểm đến (ví dụ: Hà Nội)"
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
                </div>
            )}
        </nav>
    );
};

export default Header;
