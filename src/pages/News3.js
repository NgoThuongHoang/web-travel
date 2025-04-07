import React from "react";
import "../styles/NewsDetail.css";

function News3() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    return (
        <div className="news-detail-container">
            <h1 className="news-title ">
                Kinh nghiệm du lịch sau dịch bạn cần biết để có một chuyến đi
                như ý
            </h1>

            {/* Menu */}
            <nav className="news-nav">
                <p className="news-nav-title">Mục lục bài viết:</p>
                <ul>
                    <li>
                        <a href="#news-mot">
                            1. Lên kế hoạch và chuẩn bị trước chuyến đi
                        </a>
                    </li>
                    <li>
                        <a href="#news-hai">
                            2. Chú trọng sức khỏe và an toàn trong suốt chuyến
                            đi
                        </a>
                    </li>
                    <li>
                        <a href="#news-ba">
                            3. Chọn lựa địa điểm ít đông đúc và phù hợp với tình
                            hình dịch bệnh
                        </a>
                    </li>
                    <li>
                        <a href="#news-bon">
                            4. Chính sách bảo hiểm du lịch và hỗ trợ y tế
                        </a>
                    </li>
                    <li>
                        <a href="#news-nam">
                            5. Địa điểm du lịch gợi ý sau dịch
                        </a>
                    </li>
                </ul>
            </nav>

            <p className="news-paragraph">
                Sau hơn một năm chịu ảnh hưởng của dịch bệnh, việc trở lại với
                những chuyến du lịch tưởng chừng như rất khó khăn. Tuy nhiên,
                giờ đây, khi tình hình đã dần ổn định, chúng ta có thể lên kế
                hoạch cho những chuyến đi đáng mong chờ. Nhưng du lịch hậu dịch
                đòi hỏi chúng ta phải có sự chuẩn bị kỹ lưỡng hơn bao giờ hết.
                Để có một chuyến đi an toàn và trọn vẹn, bạn cần lưu ý những
                điều sau đây để vừa tận hưởng kỳ nghỉ, vừa bảo vệ sức khỏe cho
                chính mình và cộng đồng. Hãy cùng khám phá những kinh nghiệm du
                lịch quan trọng ngay sau đây!
            </p>

            <div className="news-image-wrapper">
                <img
                    src="/images/news3-main.jpg"
                    alt="Kinh nghiệm du lịch sau dịch bạn cần biết để có một chuyến đi như ý"
                />
                <figcaption className="image-caption">
                    Kinh nghiệm du lịch sau dịch bạn cần biết để có một chuyến
                    đi như ý
                </figcaption>
            </div>

            {/* Lên kế hoạch và chuẩn bị trước chuyến đi */}
            <div>
                <h2 id="news-mot" className="news-subtitle ">
                    1. Lên kế hoạch và chuẩn bị trước chuyến đi
                </h2>

                <p className="news-paragraph">
                    Sau dịch, việc chuẩn bị kỹ càng trở nên quan trọng hơn bao
                    giờ hết. Bạn cần lên kế hoạch trước về điểm đến, tìm hiểu
                    các quy định về sức khỏe, an toàn của điểm đến, và các biện
                    pháp phòng ngừa dịch bệnh.
                </p>

                <p className="news-paragraph">
                    Kiểm tra các yêu cầu về chứng nhận tiêm phòng hoặc xét
                    nghiệm COVID-19 nếu có.
                </p>

                <p className="news-paragraph">
                    Đặt chỗ trước các dịch vụ như vé máy bay, khách sạn, và các
                    tour du lịch để tránh tình trạng hết chỗ, đồng thời có thể
                    dễ dàng thay đổi nếu cần.
                </p>
            </div>

            {/* Chú trọng sức khỏe và an toàn trong suốt chuyến đi */}
            <div>
                <h2 id="news-hai" className="news-subtitle ">
                    2. Chú trọng sức khỏe và an toàn trong suốt chuyến đi
                </h2>

                <p className="news-paragraph">
                    Mang theo khẩu trang, dung dịch rửa tay sát khuẩn và tuân
                    thủ các quy tắc vệ sinh cá nhân.
                </p>

                <p className="news-paragraph">
                    Nên kiểm tra sức khỏe thường xuyên và tuân thủ các biện pháp
                    an toàn phòng dịch của nơi bạn đến.
                </p>

                <p className="news-paragraph">
                    Tìm hiểu các cơ sở y tế gần khu vực bạn sẽ lưu trú, đề phòng
                    các tình huống khẩn cấp.
                </p>
            </div>

            {/* Chọn lựa địa điểm ít đông đúc và phù hợp với tình hình dịch bệnh */}
            <div>
                <h2 id="news-ba" className="news-subtitle ">
                    3. Chọn lựa địa điểm ít đông đúc và phù hợp với tình hình
                    dịch bệnh
                </h2>

                <p className="news-paragraph">
                    Các địa điểm du lịch ít người sẽ giúp bạn cảm thấy an toàn
                    và dễ dàng giữ khoảng cách xã hội.
                </p>

                <p className="news-paragraph">
                    Các hoạt động ngoài trời, như leo núi, tham quan thiên
                    nhiên, hoặc du lịch vùng nông thôn, sẽ là lựa chọn lý tưởng
                    trong giai đoạn này.
                </p>

                <p className="news-paragraph">
                    Lựa chọn những điểm đến không quá đông đúc, ít tập trung
                    đông người.
                </p>
            </div>

            {/* Chính sách bảo hiểm du lịch và hỗ trợ y tế */}
            <div>
                <h2 id="news-bon" className="news-subtitle ">
                    4. Chính sách bảo hiểm du lịch và hỗ trợ y tế
                </h2>

                <p className="news-paragraph">
                    Trong thời gian hậu dịch, các chuyến đi có thể gặp phải
                    nhiều tình huống bất ngờ. Vì vậy, bạn nên mua bảo hiểm du
                    lịch, bao gồm cả các khoản chi phí liên quan đến dịch bệnh,
                    như xét nghiệm, điều trị nếu bị nhiễm bệnh.
                </p>

                <p className="news-paragraph">
                    Hãy tìm hiểu kỹ về các gói bảo hiểm y tế quốc tế, cũng như
                    các dịch vụ hỗ trợ từ phía cơ quan chức năng hoặc công ty du
                    lịch.
                </p>
            </div>

            {/* Địa điểm du lịch gợi ý sau dịch */}
            <div>
                <h2 id="news-nam" className="news-subtitle ">
                    5. Địa điểm du lịch gợi ý sau dịch
                </h2>

                <p className="news-paragraph">
                    Vùng nông thôn hoặc các địa điểm gần thiên nhiên: Những khu
                    vực ít đông đúc, thoáng mát như các vùng núi, bãi biển hoang
                    sơ hay làng quê sẽ giúp bạn tận hưởng không khí trong lành
                    và tránh xa sự đông đúc.
                </p>

                <p className="news-paragraph">
                    Các điểm du lịch nội địa: Sau dịch, việc du lịch trong nước
                    có thể là lựa chọn an toàn và dễ dàng hơn. Những địa phương
                    như Hội An, Sapa, Phú Quốc, Ninh Bình, hay Đà Lạt đều là
                    những nơi thú vị và không quá đông người.
                </p>

                <p className="news-paragraph">
                    Du lịch sinh thái hoặc các khu nghỉ dưỡng riêng biệt: Các
                    khu resort hoặc khu nghỉ dưỡng có dịch vụ tách biệt và phong
                    cảnh thiên nhiên sẽ rất phù hợp để thư giãn và hạn chế tiếp
                    xúc với đám đông.
                </p>
            </div>
        </div>
    );
}

export default News3;
