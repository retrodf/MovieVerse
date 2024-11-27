import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import PropTypes from "prop-types"; // Import PropTypes

const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle-theme-btn">
      <Button onClick={toggleTheme}>
        {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </div>
  );
};

// Validasi properti dengan PropTypes
ToggleThemeButton.propTypes = {
  darkTheme: PropTypes.bool.isRequired, // darkTheme harus boolean
  toggleTheme: PropTypes.func.isRequired, // toggleTheme harus fungsi
};

// Nilai default jika tidak diberikan (opsional)
ToggleThemeButton.defaultProps = {
  darkTheme: false,
};

export default ToggleThemeButton;
