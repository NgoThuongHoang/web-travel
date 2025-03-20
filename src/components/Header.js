import React, { useState } from "react";
import "../styles/Header.css";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Chỉ cần boolean vì chỉ còn 1 dropdown

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
      style={{ top: 0, width: "100%", zIndex: 1000, position: "fixed" }}
    >
      <div className="container">
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
                <i className="fas fa-home" style={{ marginRight: "5px" }}></i>{" "}
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
                className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
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
                      <h5 className="tour-title">MIỀN BẮC</h5>
                      <a className="dropdown-item" href="/tour-xuyen-bac">
                        TOUR XUYÊN BẮC
                      </a>
                      <a className="dropdown-item" href="/tour-ha-giang">
                        TOUR HÀ GIANG
                      </a>
                      <a className="dropdown-item" href="/tour-sa-pa">
                        TOUR SA PA
                      </a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN TRUNG</h5>
                      <a className="dropdown-item" href="/tour-hue">
                        TOUR HUẾ
                      </a>
                      <a className="dropdown-item" href="/tour-quang-tri">
                        TOUR QUẢNG TRỊ
                      </a>
                      <a className="dropdown-item" href="/tour-quang-binh">
                        TOUR QUẢNG BÌNH
                      </a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN NAM</h5>
                      <a className="dropdown-item" href="/tour-can-tho">
                        TOUR CẦN THƠ
                      </a>
                      <a className="dropdown-item" href="/tour-an-giang">
                        TOUR AN GIANG
                      </a>
                      <a className="dropdown-item" href="/tour-ca-mau">
                        TOUR CÀ MAU
                      </a>
                      <a className="dropdown-item" href="/tour-vung-tau">
                        TOUR VŨNG TÀU
                      </a>
                      <a className="dropdown-item" href="/tour-dong-thap">
                        TOUR ĐỒNG THÁP
                      </a>
                      <a className="dropdown-item" href="/tour-ben-tre">
                        TOUR BẾN TRE
                      </a>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">TÂY NGUYÊN</h5>
                      <a className="dropdown-item" href="/tour-gia-lai">
                        TOUR GIA LAI
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tour-ngoai-nuoc" title="Tour ngoài nước">
                TOUR NGOÀI NƯỚC
              </a>
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
              <a className="nav-link active" href="/dang-nhap" title="Đăng nhập">
                <i className="fas fa-user" style={{ marginRight: "5px" }}></i>{" "}
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
            background: "#f0f0f0",
            padding: "10px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn"
                type="button"
                style={{
                  backgroundColor: "orange",
                  borderColor: "orange",
                }}
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;