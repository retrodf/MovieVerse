import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes dan Route
import { Button, Layout, theme } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "../admin/style/Sidebar.css";
import MenuList from "../admin/components/MenuList";
import Logo from "../admin/components/Logo";
import ToggleThemeButton from "../admin/components/ToggleThemeButton";

// Import halaman CMS
import CMSUserPage from "../admin/pages/CMSUserPage";
import CMSAwardsPage from "../admin/pages/CMSAwardsPage";
import CMSGenresPage from "../admin/pages/CMSGenresPage";
import CMSMoviesValPage from "../admin/pages/CMSMoviesValPage";
import CMSSeriesValPage from "../admin/pages/CMSSeriesValPage";
import CMSCountriesPage from "../admin/pages/CMSCountriesPage";
import CMSCelebsPage from "../admin/pages/CMSCelebsPage";
import CMSCommentsPage from "../admin/pages/CMSCommentsPage";
import CMSInputNewMoviesPage from "../admin/pages/CMSInputNewMoviesPage";
import CMSInputNewSeriesPage from "../admin/pages/CMSSeriesNewInputPage";

const { Header, Sider, Content } = Layout;

function CMSRoutes() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider 
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="sidebarCMS"
      >
        <Logo />
        <MenuList darkTheme={darkTheme}/>
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Header>
        <Content style={{ padding: 20, backgroundColor: colorBgContainer }}>
          {/* Tambahkan Routes di dalam Content */}
          <Routes>
            <Route path="/cms/users" element={<CMSUserPage />} />
            <Route path="/cms/awards" element={<CMSAwardsPage />} />
            <Route path="/cms/genres" element={<CMSGenresPage />} />
            <Route path="/cms/comments" element={<CMSCommentsPage />} />
            <Route path="/cms/movies-approved" element={<CMSMoviesValPage />} />
            <Route path="/cms/series-approved" element={<CMSSeriesValPage />} />
            <Route path="/cms/movies-input" element={<CMSInputNewMoviesPage />} />
            <Route path="/cms/series-input" element={<CMSInputNewSeriesPage />} />
            <Route path="/cms/countries" element={<CMSCountriesPage />} />
            <Route path="/cms/celebs" element={<CMSCelebsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default CMSRoutes;
