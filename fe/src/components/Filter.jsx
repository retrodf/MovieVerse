import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import "../styles/Filter.css";

const DropdownFilterCustom = ({ label, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(label); // Default to label instead of "Select ..."

  const handleSelect = (option) => {
    setSelectedOption(option || label); // Show label if no option is selected
    onSelect(option);
  };

  return (
    <Dropdown className="dropdown-filter">
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {selectedOption}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelect(option)}>
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

DropdownFilterCustom.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DropdownFilterCustom;
