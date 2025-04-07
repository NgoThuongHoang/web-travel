import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
                      <Link className="dropdown-item" to="/chi-tiet-tour/23">TOUR HÀ NỘI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/24">TOUR HẠ LONG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/25">TOUR HÀ GIANG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/26">TOUR SA PA</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN TRUNG</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/27">TOUR HUẾ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/28">TOUR QUẢNG TRỊ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/29">TOUR QUẢNG BÌNH</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/59">TOUR NINH THUẬN</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/60">TOUR ĐÀ NẴNG</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN NAM</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/30">TOUR CẦN THƠ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/31">TOUR AN GIANG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/32">TOUR CÀ MAU</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/33">TOUR VŨNG TÀU</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/34">TOUR ĐỒNG THÁP</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/35">TOUR BẾN TRE</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">TÂY NGUYÊN</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/36">TOUR GIA LAI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/61">BUÔN MA THUỘT</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/62">TOUR ĐÀ LẠT</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/63">TOUR KON TUM</Link>
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
                    {/* Cột 1: Châu Á (4 tour) */}
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/40">TOUR BANGKOK</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/41">TOUR ẤN ĐỘ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/42">TOUR PHNOM PENH</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/43">TOUR HONG KONG</Link>
                    </div>
                    {/* Cột 2: Châu Á (4 tour) */}
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/44">TOUR BALI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/45">TOUR KYOTO</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/46">TOUR SEOUL</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/47">TOUR SINGAPORE</Link>
                    </div>
                    {/* Cột 1: Châu Âu (4 tour) */}
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/48">TOUR PRAGUE</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/49">TOUR ATHENS</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/50">TOUR PARIS</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/51">TOUR BARCELONA</Link>
                    </div>
                    {/* Cột 2: Châu Âu (4 tour) */}
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/52">TOUR ROME</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/53">TOUR LONDON</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/54">TOUR AMSTERDAM</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/55">TOUR VIENNA</Link>
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