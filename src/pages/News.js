import React from 'react';

function News() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadCrumbs">
                <div className="center">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a className="text-decoration-none" href="/"><span>Trang chủ</span></a>
                        </li>
                        <li className="breadcrumb-item active">
                            <span>Tin tức</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Nội dung chính */}
            <div id="container" className="center w-clear">
                <div className="title-main">
                    <h1>Tin tức</h1>
                    <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                </div>
                <div className="w-clear">
                    <div className="row">
                        {/* Tin tức 1 */}
                        <div className="custom-col col-md-4 col-sm-6 my-2">
                            <div className="news-item-wrapper">
                                <div className="news-item">
                                    <div className="news-image scale-img">
                                        <img src="./images/moi-mua-mien-bac-4731.jpg" alt="Kinh nghiệm du lịch miền Bắc mùa nào đẹp nhất và thơ mộng nhất trong năm" />
                                    </div>
                                    <div className="news-desc">
                                        <p className="news-time"><img src="./images/icon-tt.png" alt="Icon tin tức" /><span></span>21 Tháng Tám, 2023</p>
                                        <p className="news-name"><a href="kinh-nghiem-du-lich-mien-bac-mua-nao-dep-nhat-va-tho-mong-nhat-trong-nam">Kinh nghiệm du lịch miền Bắc mùa nào đẹp nhất và thơ mộng nhất trong năm</a></p>
                                        <p className="news-info text-split text-split-5">Mỗi mùa mỗi vùng miền đều có những vẻ đẹp rất riêng không thể hòa lẫn. Nhưng xét về khí hậu thì miền Bắc lại là vùng hầu như có đủ 4 mùa riêng biệt hơn miền Trung hay miền Nam. Cùng tham khảo bài viết dưới đây để biết được nên đi du lịch miền Bắc mùa nào đẹp nhất và cụ thể là vào tháng mấy nhé.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Tin tức 2 */}
                        <div className="custom-col col-md-4 col-sm-6 my-2">
                            <div className="news-item-wrapper">
                                <div className="news-item">
                                    <div className="news-image scale-img">
                                        <img src="./images/trai-nghiem-tour-nuoi-duong-tam-hon-3489.jpg" alt="Review các điểm du lịch nghỉ dưỡng miền Bắc dịp 30/4 đẹp như mơ" />
                                    </div>
                                    <div className="news-desc">
                                        <p className="news-time"><img src="./images/icon-tt.png" alt="Icon tin tức" /><span></span>21 Tháng Tám, 2023</p>
                                        <p className="news-name"><a href="review-cac-diem-du-lich-nghi-duong-mien-bac-dip-304-dep-nhu-mo">Review các điểm du lịch nghỉ dưỡng miền Bắc dịp 30/4 đẹp như mơ</a></p>
                                        <p className="news-info text-split text-split-5">Du lịch nghỉ dưỡng miền Bắc dịp 30/4, bạn chắc chắn không nên bỏ lỡ những điểm đến lý tưởng như thiên đường biên đảo Cô Tô, Cát Bà, di sản thiên nhiên thế giới Hạ Long, Tràng An hay một loạt các khu resort đẹp như tranh vẽ.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Tin tức 3 */}
                        <div className="custom-col col-md-4 col-sm-6 my-2">
                            <div className="news-item-wrapper">
                                <div className="news-item">
                                    <div className="news-image scale-img">
                                        <img src="./images/kinh-nghiem-du-lich-sau-dich-2-3179.jpg" alt="Kinh nghiệm du lịch sau dịch bạn cần biết để có một chuyến đi như ý" />
                                    </div>
                                    <div className="news-desc">
                                        <p className="news-time"><img src="./images/icon-tt.png" alt="Icon tin tức" /><span></span>21 Tháng Tám, 2023</p>
                                        <p className="news-name"><a href="kinh-nghiem-du-lich-sau-dich-ban-can-biet-de-co-mot-chuyen-di-nhu-y">Kinh nghiệm du lịch sau dịch bạn cần biết để có một chuyến đi như ý</a></p>
                                        <p className="news-info text-split text-split-5">Đây là tất tần tật kinh nghiệm du lịch sau dịch mà bạn cần biết để có một chuyến đi an toàn, trọn vẹn nhất trên khắp Việt Nam.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div className="pagination-home"></div>
                </div>
            </div>
        </>
    );
}

export default News;