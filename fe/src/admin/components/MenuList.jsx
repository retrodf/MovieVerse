import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  VideoCameraOutlined,
  FlagOutlined,
  TrophyOutlined,
  TagsOutlined,
  UserOutlined,
  CommentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const MenuList = ({ darkTheme }) => {
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "movies",
      icon: <VideoCameraOutlined />,
      label: "Movies",
      children: [
        {
          key: "validateMovies",
          label: <Link to="/cms/movies-approved">Validate</Link>,
        },
        {
          key: "InputNewMovies",
          label: <Link to="/cms/movies-input">Input New Movies</Link>,
        },
      ],
    },
    {
      key: "series",
      icon: <VideoCameraOutlined />,
      label: "Series",
      children: [
        {
          key: "validateSeries",
          label: <Link to="/cms/series-approved">Validate</Link>,
        },
        {
          key: "InputNewseries",
          label: <Link to="/cms/series-input">Input New Series</Link>,
        },
      ],
    },
    {
      key: "countries",
      icon: <FlagOutlined />,
      label: <Link to="/cms/countries">Countries</Link>,
    },
    {
      key: "awards",
      icon: <TrophyOutlined />,
      label: <Link to="/cms/awards">Awards</Link>,
    },
    {
      key: "genres",
      icon: <TagsOutlined />,
      label: <Link to="/cms/genres">Genres</Link>,
    },
    {
      key: "actors",
      icon: <UserOutlined />,
      label: <Link to="/cms/actors">Actors</Link>,
    },
    {
      key: "directors",
      icon: <UserOutlined />,
      label: <Link to="/cms/directors">Directors</Link>,
    },
    {
      key: "comments",
      icon: <CommentOutlined />,
      label: <Link to="/cms/comments">Comments</Link>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/cms/users">Users</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menuCMS"
      items={menuItems}
    />
  );
};

export default MenuList;
