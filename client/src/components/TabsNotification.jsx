import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TabsNotification = ({ tabs, activeTab, setActiveTab }) => {
  const [value, setValue] = useState(activeTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setActiveTab(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.name} />
        ))}
      </Tabs>
      {tabs.map((tab, i) => (
        <Box key={i} hidden={value !== i}>
          {tab.component}
        </Box>
      ))}
    </>
  );
};

TabsNotification.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.element.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default TabsNotification;
