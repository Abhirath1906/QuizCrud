"use client";
import { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Divider,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./styles/global.css";

const { Header, Content, Sider } = Layout;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const [filtered, setFiltered] = useState([]);

  const [Search,setSearch] = useState("")


  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students", { cache: "no-store" });
      const data = await res.json();

      console.log("🔥 DATA API ASLI:", data);

      const allStudents = data?.body?.data || [];
      setStudents(allStudents);
    } catch (error) {
      message.error("Gagal mengambil data siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();


    
  }, []);
  

  useEffect(() => {
    const result = students.filter((item) => {
      const q = Search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.nis?.toLowerCase().includes(q) ||
        item.class_name?.toLowerCase().includes(q) ||
        item.major?.toLowerCase().includes(q)
      );
    });
    setFiltered(result);
  }, [Search, students]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Gagal");

      message.success("berhasil");
      setIsModalOpen(false);
      form.resetFields();
      fetchStudents();
    } catch (error) {
      console.error("Add error:", error);
      message.error("Gagal menambah siswa");
    }
  };


  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(`/api/students?id=${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Gagal mengubah data siswa");

      message.success("Siswa berhasil diperbarui!");
      setIsModalOpen(false);
      setEditingStudent(null);
      form.resetFields();
      fetchStudents();
    } catch (error) {
      console.error("Edit error:", error);
      message.error("Gagal mengubah siswa");
    }
  };


  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Gagal");

      message.success("berhasil");
      fetchStudents();
    } catch (error) {
      message.error("Gagal");
    }
  };


  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "NIS", dataIndex: "nis", key: "nis" },
    { title: "Class", dataIndex: "class_name", key: "class_name" },
    { title: "Major", dataIndex: "major", key: "major" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingStudent(record);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Yakin ingin menghapus siswa ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleSubmit = () => {
    if (editingStudent) handleEdit();
    else handleAdd();
  };

  return (
    <Layout>
      <Sider
        style={{ backgroundColor: "black", color: "white", height: "150vh" }}
        collapsed={!open}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={[{ key: "1", label: <Link href="/">Home</Link> }]}
          style={{ backgroundColor: "black", marginTop: "100px", padding: "40px" }}
        />
      </Sider>

      <Layout>
        <Header style={{ backgroundColor: "black", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <MenuOutlined onClick={() => setOpen(!open)} style={{ fontSize: "30px" }} />
            <p style={{ fontSize: "40px" }}>ABBYY</p>
            <Input
            value={Search}
            onChange={(e) => setSearch(e.target.value)}
             placeholder="Search Students" />
          </div>
        </Header>

        <Content style={{ padding: "50px" }}>
          <p style={{ fontSize: "50px" }}>Student List</p>
          <Divider />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingStudent(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
            style={{ marginBottom: "20px" }}
          >
            Add Student
          </Button>

          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            loading={loading}
            bordered
          />

          <Modal
            title={editingStudent ? "Edit Student" : "Add New Student"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSubmit}
            okText="Submit"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Masukkan nama siswa" }]}
              >
                <Input placeholder="Nama siswa" />
              </Form.Item>

              <Form.Item
                label="NIS"
                name="nis"
                rules={[{ required: true, message: "Masukkan NIS siswa" }]}
              >
                <Input placeholder="NIS siswa" />
              </Form.Item>

              <Form.Item
                label="Class"
                name="class_name"
                rules={[{ required: true, message: "Pilih kelas siswa" }]}
              >
                <Select placeholder="Pilih kelas">
                  <Select.Option value="X RPL 1">X RPL 1</Select.Option>
                  <Select.Option value="X RPL 2">X RPL 2</Select.Option>
                  <Select.Option value="X RPL 3">X RPL 3</Select.Option>
                  <Select.Option value="X RPL 4">X RPL 4</Select.Option>
                  <Select.Option value="X RPL 5">X RPL 5</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Major"
                name="major"
                rules={[{ required: true, message: "Masukkan jurusan" }]}
              >
                <Input placeholder="Rekayasa Perangkat Lunak" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
