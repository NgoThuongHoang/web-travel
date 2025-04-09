import React from "react";
import { useEffect } from "react";
import "../styles/TourGuide.css"; // Đảm bảo import đúng CSS

const TourGuide = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn về đầu trang khi component render
    }, []);
    return (
        <div className="tour-guide-container">
            <h1 className="tour-guide-title">Hướng dẫn đặt tour</h1>

            {/* Step 1 */}
            <div className="tour-guide-step">
                <h2 id="step1" className="tour-guide-heading">
                    Bước 1: Chọn Tour mà bạn muốn đặt.
                </h2>
                <p className="tour-guide-text">
                    👉 Ngay tại trang chủ, bạn có thể xem các tour mà chúng tôi
                    có
                </p>
                <p className="tour-guide-text">
                    👉 Click vào tour mà bạn muốn đặt để tới trang thông tin của
                    tour.
                </p>
            </div>

            {/* Step 2 */}
            <div className="tour-guide-step">
                <h2 id="step2" className="tour-guide-heading">
                    Bước 2: Xem thông tin của tour và gửi yêu cầu hỗ trợ nếu cần
                    thiết.
                </h2>

                <p className="tour-guide-text">
                    👉 Khi click vào tour bạn muốn đặt, bạn sẽ thấy các thông
                    tin của tour ở trang thông tin của tour.
                </p>
                <p className="tour-guide-text">
                    👉 Kéo xuống một chút sẽ có các thông tin như: giá tour,
                    lịch trình, ngày khởi hành… hãy đọc các thông tin đó để xem
                    đó có phải tour phù hợp với bạn hay không.
                </p>

                <img
                    className="tour-guide-image"
                    src="./images/gt-step2-1.png"
                    alt="Thông tin tour"
                />

                <p className="tour-guide-text">
                    👉 Nếu bạn có bất kỳ thắc mắc nào về chuyến đi, vui lòng
                    click vào nút “Gửi yêu cầu tư vấn” ở đầu trang. Chúng tôi
                    sẵn lòng giúp đỡ !
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step2-2.png"
                    alt="Gửi yêu cầu tư vấn"
                />

                <p className="tour-guide-text">
                    👉 Sau khi đã chọn được tour ưng ý của mình, bạn hãy click
                    vào nút "Đặt tour “ để tiến hành đặt tour.
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step2-3.png"
                    alt="Đặt tour"
                />
            </div>

            {/* Step 3 */}
            <div className="tour-guide-step">
                <h2 id="step3" className="tour-guide-heading">
                    Bước 3: Tiến hành đặt tour.
                </h2>
                <p className="tour-guide-text">
                    👉 Tại trang thanh toán, bạn vui lòng nhập các thông tin bắt
                    buộc trong form.
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-1.png"
                    alt="Thông tin khách hàng"
                />

                <p className="tour-guide-text">
                    👉 Sau khi nhập đầy đủ thông tin cũng như dịch vụ đi kèm,
                    bạn sẽ thấy thông tin về tour của bạn bao gồm: mã tour, ngày
                    khởi hành - ngày kết thúc… và tổng chi phí.
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-2.png"
                    alt="Thông tin tour"
                />

                <p className="tour-guide-text">
                    👉 Sau khi đọc và kiểm tra lại thông tin của bạn, đừng quên
                    nhấn tích vào ô “Tôi đã đọc và đồng ý với Điều khoản thanh
                    toán”
                </p>
                <p className="tour-guide-text">
                    👉 Chúng tôi có hai hình thức thanh toán là: thanh toán tại
                    văn phòng và khoản để bạn có thể lựa chọn.
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-4.png"
                    alt="Hình thức thanh toán và điều khoản"
                />

                <p className="tour-guide-text">
                    👉 Sau khi đọc và kiểm tra lại thông tin của bạn, nhấn vào
                    nút “Đặt ngay” để hoàn tất việc đặt tour.
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-3.png"
                    alt="Đặt ngay"
                />

                <p className="tour-guide-text">Đặt tour thành công.</p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-5.png"
                    alt="Đặt thành công"
                />

                <p className="tour-guide-text">
                    👉 Chúng tôi sẽ liên hệ để duyệt đơn của bạn trong thời gian
                    sớm nhất.
                </p>
                <p className="tour-guide-text">
                    👉 Đồng thời chúng tôi sẽ gửi vé tour tới email của bạn.
                </p>
                <p className="tour-guide-text">
                    👉 Vui lòng kiểm tra vé tour trong email của bạn.
                </p>
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-6.png"
                    alt="Gửi tới email"
                />
                <img
                    className="tour-guide-image"
                    src="./images/gt-step3-7.png"
                    alt="Vé tour"
                />
            </div>
        </div>
    );
};

export default TourGuide;
