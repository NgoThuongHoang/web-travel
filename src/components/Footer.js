import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; // Import file CSS nếu cần

const Footer = () => {
    useEffect(() => {
        // Tạo fb-root nếu chưa có
        if (!document.getElementById("fb-root")) {
            const fbRoot = document.createElement("div");
            fbRoot.id = "fb-root";
            document.body.appendChild(fbRoot);
        }

        // Nhúng Facebook SDK
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.src =
            "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v20.0";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            id="footer"
            style={{
                backgroundImage: "url('./images/bg-footer.jpg')",
                backgroundSize: "cover",
            }}
        >
            <div className="footer-top py-4">
                <div className="container d-flex flex-wrap align-items-start justify-content-between">
                    <div className="footer-1 col-md-3">
                        <h5 className="footer-tit2">
                            Công ty TNHH Du lịch Sky Travel
                        </h5>
                        <div className="footer-content">
                            <p>
                                Địa chỉ: Kp5, Đ.Nguyễn Khuyến, P. Trảng Dài,
                                Tp.Biên Hoà, T.Đồng Nai
                            </p>
                            <p>Hotline: 0984.046.668</p>
                            <p>Email: skytravel@gmail.com</p>
                            <p>
                                Website:{" "}
                                <a
                                    href="http://Skytravel.com"
                                    className="text-decoration-none"
                                >
                                    skytravel.com
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="footer-2 col-md-3">
                        <h5 className="footer-tit">Dịch vụ</h5>
                        <ul className="footer-list list-unstyled">
                            <li>
                                <a
                                    className="text-decoration-none"
                                    href="tour-ngan-ngay"
                                    title="Tour ngắn ngày"
                                >
                                    Tour ngắn ngày
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-decoration-none"
                                    href="tour-dai-ngay"
                                    title="Tour dài ngày"
                                >
                                    Tour dài ngày
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-3 col-md-3">
                        <h5 className="footer-tit">Góc khách hàng</h5>
                        <ul className="footer-list list-unstyled">
                            <li>
                                <Link
                                    className="text-decoration-none"
                                    to="/ho-tro-dat-tour"
                                    title="Hỗ trợ đặt tour"
                                >
                                    Hỗ trợ đặt tour
                                </Link>
                            </li>
                            <li>
                                <a
                                    className="text-decoration-none"
                                    href="chinh-sach-bao-mat"
                                    title="Chính sách bảo mật"
                                >
                                    Chính sách bảo mật
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-decoration-none"
                                    href="chinh-sach-bao-hanh"
                                    title="Phiếu góp ý"
                                >
                                    Phiếu góp ý
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-4 col-md-3">
                        <p className="footer-tit">FANPAGE FACEBOOK</p>
                        <div id="fanpage-facebook">
                            <div
                                className="fb-page"
                                data-href="https://www.facebook.com/profile.php?id=61574793104293" // Link từ hình bạn cung cấp
                                data-tabs="" // Không hiển thị timeline, chỉ hiển thị header
                                data-width="500" // Chiều rộng phù hợp
                                data-height="130" // Chiều cao phù hợp
                                data-small-header="false" // Hiển thị header đầy đủ (ảnh bìa)
                                data-adapt-container-width="true" // Tự động điều chỉnh chiều rộng
                                data-hide-cover="false" // Hiển thị ảnh bìa
                                data-show-facepile="false" // Không hiển thị danh sách người thích
                            >
                                <blockquote
                                    cite="https://www.facebook.com/profile.php?id=61574793104293"
                                    className="fb-xfbml-parse-ignore"
                                >
                                    <a href="https://www.facebook.com/profile.php?id=61574793104293">
                                        Sky Travel
                                    </a>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom py-2">
                <div className="container text-center">
                    <p className="copyright m-0">
                        Copyright © 2024. Design by{" "}
                        <a
                            href="https://vinasoftware.com.vn/"
                            className="text-decoration-none"
                        >
                            Student DNTU
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
