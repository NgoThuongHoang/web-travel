import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Table, Typography, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu mẫu cho thống kê doanh thu
const DATA_REVENUE = [
  { month: 'Tháng 1', tours: 10, customers: 50, revenue: 50,  color: '#8884d8' },
  { month: 'Tháng 2', tours: 15, customers: 70, revenue: 70, color: '#82ca9d' },
  { month: 'Tháng 3', tours: 20, customers: 100, revenue: 100, color: '#ffc658' },
  { month: 'Tháng 4', tours: 18, customers: 90, revenue: 90, color: '#ff8042' },
  { month: 'Tháng 5', tours: 25, customers: 120, revenue: 120, color: '#0088FE' },
];

const RevenueStatistics = () => {
  const [month, setMonth] = useState(''); // Thêm state cho tháng
  const [currentData, setCurrentData] = useState(DATA_REVENUE); // Dữ liệu doanh thu hiện tại

  useEffect(() => {
    if (month) {
      // Lọc dữ liệu theo tháng được chọn
      const filteredData = DATA_REVENUE.filter((item) => item.month === month);
      setCurrentData(filteredData.length > 0 ? filteredData : []);
    } else {
      setCurrentData(DATA_REVENUE); // Hiển thị tất cả dữ liệu nếu không chọn tháng
    }
  }, [month]);

  // Cột của bảng
  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Số tour đã thực hiện',
      dataIndex: 'tours',
      key: 'tours',
    },
    {
      title: 'Số khách hàng',
      dataIndex: 'customers',
      key: 'customers',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${(revenue*1000000).toLocaleString()} VNĐ`, // Định dạng số tiền
    },
  ];

  return (
    <div style={{ padding: '24px', marginBottom: '80px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>Thống kê doanh thu</Title>
            <Select
              value={month}
              style={{ width: 200 }}
              onChange={(value) => setMonth(value)}
              placeholder="Chọn tháng"
            >
              <Option value="">Tất cả</Option>
              <Option value="Tháng 1">Tháng 1</Option>
              <Option value="Tháng 2">Tháng 2</Option>
              <Option value="Tháng 3">Tháng 3</Option>
              <Option value="Tháng 4">Tháng 4</Option>
              <Option value="Tháng 5">Tháng 5</Option>
            </Select>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Biểu đồ doanh thu" className="chart-card">
              <PieChart width={400} height={300}>
                <Pie
                  data={currentData}
                  cx={200}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Thống kê theo tháng" className="chart-card">
              <BarChart
                width={500}
                height={300}
                data={currentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Cột Số tour đã thực hiện */}
                <Bar dataKey="tours" name="Số tour đã thực hiện" fill="#0088FE" />
                {/* Cột Số khách hàng */}
                <Bar dataKey="customers" name="Số khách hàng" fill="#FF8042" />
                {/* Cột Doanh thu */}
                <Bar dataKey="revenue" name="Doanh thu" fill="#00C49F" />
              </BarChart>
            </Card>
          </Col>
        </Row>

        <Card title="Chi tiết doanh thu theo tháng">
          <Table
            columns={columns}
            dataSource={currentData}
            rowKey="month"
            pagination={false}
          />
        </Card>
      </Space>
    </div>
  );
};

export default RevenueStatistics;