import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Button, Layout, theme } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "../admin/style/CMSLayout.css";
import MenuList from "../admin/components/MenuList";
import Logo from "../admin/components/Logo";
import ToggleThemeButton from "../admin/components/ToggleThemeButton";

import CMSUserPage from "../admin/pages/CMSUserPage";
import CMSGenresPage from "../admin/pages/CMSGenresPage";
import CMSMoviesValPage from "../admin/pages/CMSMoviesValPage";
import CMSCountriesPage from "../admin/pages/CMSCountriesPage";
import CMSCelebsPage from "../admin/pages/CMSCelebsPage";
import CMSDirectorsPage from "../admin/pages/CMSDirectorsPage";
import CMSCommentsPage from "../admin/pages/CMSCommentsPage";

console.log("Sider rendered");

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
      <MenuList darkTheme={darkTheme} />
      <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
    </Sider>
    <Layout style={{ marginLeft: collapsed ? '80px' : '200px' }}>
      <Content style={{ padding: 10, backgroundColor: colorBgContainer }} class name="contentCMS">
        <Routes>
          <Route path="/cms/users" element={<CMSUserPage />} />
          <Route path="/cms/genres" element={<CMSGenresPage />} />
          <Route path="/cms/comments" element={<CMSCommentsPage />} />
          <Route path="/cms/movies-approved" element={<CMSMoviesValPage />} />
          <Route path="/cms/series-approved" element={<CMSSeriesValPage />} />
          <Route path="/cms/movies-input" element={<CMSInputNewMoviesPage />} />
          <Route path="/cms/series-input" element={<CMSInputNewSeriesPage />} />
          <Route path="/cms/countries" element={<CMSCountriesPage />} />
          <Route path="/cms/celebs" element={<CMSCelebsPage />} />
          <Route path="/cms/directors" element={<CMSDirectorsPage />} />
        </Routes>
      </Content>
    </Layout>
  </Layout>
  );
}

export default CMSRoutes;