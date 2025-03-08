"use client"

import { useState } from "react"
import { Card, Input, Button, Table, Space, Modal, Checkbox, Select } from "antd"
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"

// Dữ liệu mẫu (có thể thay thế bằng dữ liệu thực tế từ các trang khác)
const mockData = [
  // Dữ liệu từ TourManagement
  { id: 1, type: "tour", name: "Tour Đà Nẵng", details: "Thông tin chi tiết về Tour Đà Nẵng" },
  { id: 2, type: "booking", name: "Đặt Tour Đà Nẵng", details: "Thông tin đặt tour" },
  { id: 3, type: "consultation", name: "Tư vấn Tour", details: "Thông tin tư vấn" },
  { id: 4, type: "user", name: "Nguyễn Văn An", details: "Thông tin khách hàng" },
]

const SearchInfo = () => {
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState(mockData)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [searchCategory, setSearchCategory] = useState("all")

  const handleSearch = () => {
    const filtered = mockData.filter(item =>
      (searchCategory === "all" || item.type === searchCategory) &&
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredData(filtered)
  }

  const handleEdit = (item) => {
    // Logic chỉnh sửa
    console.log("Chỉnh sửa:", item)
  }

  const handleDelete = (item) => {
    // Logic xóa
    console.log("Xóa:", item)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(mockData.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelect = (item, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, item.id])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== item.id))
    }
  }

  const columns = [
    {
      title: (
        <Checkbox onChange={handleSelectAll} />
      ),
      dataIndex: "selectAll",
      key: "selectAll",
      render: () => (
        <Checkbox checked={selectedItems.length === mockData.length} />
      ),
    },
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedItem(record)
              setShowDetailModal(true)
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="search-info">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Select
            defaultValue="all"
            style={{ width: 200, marginRight: 16 }}
            onChange={setSearchCategory}
          >
            <Select.Option value="all">Bỏ lọc</Select.Option>
            <Select.Option value="tour">Quản lý tour</Select.Option>
            <Select.Option value="user">Quản lý người dùng</Select.Option>
            <Select.Option value="booking">Quản lý đặt tour</Select.Option>
            <Select.Option value="consultation">Chăm sóc khách hàng</Select.Option>
            <Select.Option value="report">Báo cáo</Select.Option>
            <Select.Option value="revenue">Thống kê doanh thu</Select.Option>
          </Select>

          <Input
            placeholder="Tìm kiếm thông tin..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Modal Chi tiết */}
      <Modal
        title="Chi tiết thông tin"
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
      >
        {selectedItem && (
          <div>
            <p><strong>Tên:</strong> {selectedItem.name}</p>
            <p><strong>Loại:</strong> {selectedItem.type}</p>
            <p><strong>Chi tiết:</strong> {selectedItem.details}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SearchInfo
