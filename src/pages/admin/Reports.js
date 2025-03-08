import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Select } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu mẫu cho báo cáo
const monthlyData = [
  { month: 'Tháng 1', doanhThu: 5000000, chiPhi: 2000000, loiNhuan: 3000000 },
  { month: 'Tháng 2', doanhThu: 7000000, chiPhi: 2500000, loiNhuan: 4500000 },
  { month: 'Tháng 3', doanhThu: 10000000, chiPhi: 3000000, loiNhuan: 7000000 },
  { month: 'Tháng 4', doanhThu: 9000000, chiPhi: 2800000, loiNhuan: 6200000 },
  { month: 'Tháng 5', doanhThu: 12000000, chiPhi: 3500000, loiNhuan: 8500000 },
];

const MonthlyReport = () => {
  const [selectedMonth, setSelectedMonth] = useState('Tất cả'); // Mặc định chọn "Tất cả"
  const filteredData = selectedMonth === 'Tất cả' ? monthlyData : monthlyData.filter((item) => item.month === selectedMonth);

  // Cột của bảng
  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'doanhThu',
      key: 'doanhThu',
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
    {
      title: 'Chi phí',
      dataIndex: 'chiPhi',
      key: 'chiPhi',
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'loiNhuan',
      key: 'loiNhuan',
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
  ];

  // Dữ liệu cho biểu đồ tròn (chỉ hiển thị khi chọn 1 tháng)
  const pieData = selectedMonth !== 'Tất cả' ? [
    { name: 'Doanh thu', value: filteredData[0].doanhThu, color: '#8884d8' },
    { name: 'Chi phí', value: filteredData[0].chiPhi, color: '#ff8042' },
    { name: 'Lợi nhuận', value: filteredData[0].loiNhuan, color: '#82ca9d' },
  ] : [];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Báo cáo theo tháng</Title>

      {/* Lọc dữ liệu theo tháng */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <strong>Chọn tháng:</strong>
          </Col>
          <Col>
            <Select
              value={selectedMonth}
              style={{ width: 200 }}
              onChange={(value) => setSelectedMonth(value)}
            >
              <Option value="Tất cả">Tất cả</Option>
              {monthlyData.map((item) => (
                <Option key={item.month} value={item.month}>
                  {item.month}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={filteredData.reduce((sum, item) => sum + item.doanhThu, 0)}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Chi phí"
              value={filteredData.reduce((sum, item) => sum + item.chiPhi, 0)}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Lợi nhuận"
              value={filteredData.reduce((sum, item) => sum + item.loiNhuan, 0)}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Card title={selectedMonth === 'Tất cả' ? 'Biểu đồ cột doanh thu, chi phí và lợi nhuận' : `Phân bổ doanh thu, chi phí và lợi nhuận (${selectedMonth})`} style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          {selectedMonth === 'Tất cả' ? (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="doanhThu" name="Doanh thu" fill="#8884d8" />
              <Bar dataKey="chiPhi" name="Chi phí" fill="#ff8042" />
              <Bar dataKey="loiNhuan" name="Lợi nhuận" fill="#82ca9d" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Card>

      {/* Bảng chi tiết */}
      <Card title="Chi tiết theo tháng">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="month"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default MonthlyReport;