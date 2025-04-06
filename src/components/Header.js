import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import "../styles/Header.css";
import "antd/dist/reset.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [domesticDropdownOpen, setDomesticDropdownOpen] = useState(false);
  const [internationalDropdownOpen, setInternationalDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDomesticDropdownOpen(false);
        setInternationalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      setDomesticDropdownOpen(false);
      setInternationalDropdownOpen(false);
    }
  };

  const toggleDomesticDropdown = (e) => {
    e.preventDefault();
    setDomesticDropdownOpen(!domesticDropdownOpen);
    setInternationalDropdownOpen(false);
  };

  const toggleInternationalDropdown = (e) => {
    e.preventDefault();
    setInternationalDropdownOpen(!internationalDropdownOpen);
    setDomesticDropdownOpen(false);
  };

  const handleSearchClick = () => {
    if (location.pathname === "/") {
      const searchSection = document.getElementById("tour-search-section");
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: "smooth" });
        // Thêm offset để cuộn lên trên một chút
        setTimeout(() => {
          window.scrollBy({ top: 150, behavior: "smooth" }); // Cuộn lên 100px
        }, 500); // Delay để đảm bảo scrollIntoView hoàn tất
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const searchSection = document.getElementById("tour-search-section");
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: "smooth" });
          // Thêm offset sau khi chuyển hướng
          setTimeout(() => {
            window.scrollBy({ top: 150, behavior: "smooth" }); // Cuộn lên 100px
          }, 500);
        }
      }, 100);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ top: 0, width: "100%", zIndex: 1000, position: "sticky" }}
    >
      <div className="container" style={{ padding: "0px", height: "80px" }}>
        <a className="navbar-brand logo" href="/">
          <img
            onError={(e) => {
              e.target.src = "thumbs/170x85x2/assets/images/noimage.png";
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
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/" title="Trang chủ">
                <i className="fas fa-home" style={{ marginRight: "5px" }}></i> TRANG CHỦ
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownDomestic"
                role="button"
                onClick={toggleDomesticDropdown}
                aria-haspopup="true"
                aria-expanded={domesticDropdownOpen}
              >
                TOUR TRONG NƯỚC
              </a>
              <div
                className={`dropdown-menu ${domesticDropdownOpen ? "show" : ""}`}
                aria-labelledby="navbarDropdownDomestic"
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
                      <h5 className="tour-title">MIỀN BẮC</h5>
                      <a className="dropdown-item" href="/tour-xuyen-bac">TOUR XUYÊN BẮC</a>
                      <a className="dropdown-item" href="/tour-ha-giang">TOUR HÀ GIANG</a>
                      <a className="dropdown-item" href="/tour-sa-pa">TOUR SA PA</a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN TRUNG</h5>
                      <a className="dropdown-item" href="/tour-hue">TOUR HUẾ</a>
                      <a className="dropdown-item" href="/tour-quang-tri">TOUR QUẢNG TRỊ</a>
                      <a className="dropdown-item" href="/tour-quang-binh">TOUR QUẢNG BÌNH</a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN NAM</h5>
                      <a className="dropdown-item" href="/tour-can-tho">TOUR CẦN THƠ</a>
                      <a className="dropdown-item" href="/tour-an-giang">TOUR AN GIANG</a>
                      <a className="dropdown-item" href="/tour-ca-mau">TOUR CÀ MAU</a>
                      <a className="dropdown-item" href="/tour-vung-tau">TOUR VŨNG TÀU</a>
                      <a className="dropdown-item" href="/tour-dong-thap">TOUR ĐỒNG THÁP</a>
                      <a className="dropdown-item" href="/tour-ben-tre">TOUR BẾN TRE</a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">TÂY NGUYÊN</h5>
                      <a className="dropdown-item" href="/tour-gia-lai">TOUR GIA LAI</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownInternational"
                role="button"
                onClick={toggleInternationalDropdown}
                aria-haspopup="true"
                aria-expanded={internationalDropdownOpen}
              >
                TOUR NGOÀI NƯỚC
              </a>
              <div
                className={`dropdown-menu dropdown-menu2 ${internationalDropdownOpen ? "show" : ""}`}
                aria-labelledby="navbarDropdownInternational"
              >
                <div className="tour-container">
                  <div className="tour-row">
                    <div className="tour-column">
                      <img
                        src="./images/tour-ngoai-nuoc.jpg"
                        alt="Tour ngoài nước"
                        className="tour-image"
                      />
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <a className="dropdown-item" href="/tour-thai-lan">TOUR THÁI LAN</a>
                      <a className="dropdown-item" href="/tour-singapore">TOUR SINGAPORE</a>
                      <a className="dropdown-item" href="/tour-nhat-ban">TOUR NHẬT BẢN</a>
                      <a className="dropdown-item" href="/tour-han-quoc">TOUR HÀN QUỐC</a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <a className="dropdown-item" href="/tour-phap">TOUR PHÁP</a>
                      <a className="dropdown-item" href="/tour-duc">TOUR ĐỨC</a>
                      <a className="dropdown-item" href="/tour-y">TOUR Ý</a>
                      <a className="dropdown-item" href="/tour-anh">TOUR ANH</a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU MỸ</h5>
                      <a className="dropdown-item" href="/tour-my">TOUR MỸ</a>
                      <a className="dropdown-item" href="/tour-canada">TOUR CANADA</a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÚC</h5>
                      <a className="dropdown-item" href="/tour-uc">TOUR ÚC</a>
                      <a className="dropdown-item" href="/tour-new-zealand">TOUR NEW ZEALAND</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/ve-chung-toi" title="Về chúng tôi">
                VỀ CHÚNG TÔI
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tin-tuc" title="Tin tức">
                TIN TỨC
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/lien-he" title="Liên hệ">
                LIÊN HỆ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tour-info-page" title="Tra cứu">
                TRA CỨU
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/dang-nhap" title="Đăng nhập">
                <i className="fas fa-user" style={{ marginRight: "5px" }}></i>
              </a>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link"
                onClick={handleSearchClick}
                style={{ fontSize: "18px", marginTop: "2px" }}
              >
                <i className="fas fa-search"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;