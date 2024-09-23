import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";

const { Header, Sider, Content } = Layout;

const CMSLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme={darkTheme ? "dark" : "light"}
      >
        <div className="logo" style={{ padding: "16px", textAlign: "center" }}>
          <img
            src={darkTheme ? "/path/to/dark-logo.png" : "/path/to/light-logo.png"}
            alt="Logo"
            style={{ maxWidth: "100%" }}
          />
        </div>
        <MenuList darkTheme={darkTheme} />
        <div style={{ padding: "16px" }}>
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </div>
      </Sider>

      {/* Konten utama */}
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, background: darkTheme ? "#001529" : "#fff" }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              marginLeft: 16,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: darkTheme ? "#001529" : "#fff",
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CMSLayout;
