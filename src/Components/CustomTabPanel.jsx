import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ tabsData = {}, tabsColors = {} }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {Object.keys(tabsData)?.map((tab, index) => (
            <Tab label={tab} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {Object.keys(tabsData)?.map((tab, index) => (
        <CustomTabPanel value={value} index={index}>
          <div>
            {tabsData[tab]}
            <div style={{ display: "flex", margin: "10px 0px" }}>
              {tabsColors[tab]?.split(",")?.map((color) => {
                return (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      backgroundColor: `${color.trim()}`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </CustomTabPanel>
      ))}
    </Box>
  );
}
