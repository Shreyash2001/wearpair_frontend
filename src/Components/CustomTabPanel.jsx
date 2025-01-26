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

export default function BasicTabs({ tabsData = {} }) {
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
          {Object.keys(tabsData)?.map(
            (tab, index) =>
              (tabsData[tab]?.description?.length ||
                tabsData[tab]?.hex_codes?.length) && (
                <Tab
                  key={tab}
                  label={
                    tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()
                  }
                  {...a11yProps(index)}
                  sx={{
                    textTransform: "none", // Remove the default uppercase transformation
                  }}
                />
              )
          )}
        </Tabs>
      </Box>
      {/* Tabs Content */}
      {Object.keys(tabsData)?.map((tab, index) => (
        <CustomTabPanel value={value} index={index} key={tab}>
          <div>
            {/* Description */}
            {tabsData[tab]?.description ? (
              <p style={{ color: "#222" }}>{tabsData[tab].description}</p>
            ) : (
              <p>No description available.</p>
            )}

            {/* Hex Colors */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {tabsData[tab]?.hex_codes?.length > 0 ? (
                tabsData[tab].hex_codes.map((color) => (
                  <div
                    key={color}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: color.trim(),
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                    }}
                    title={color} // Tooltip for color code
                  ></div>
                ))
              ) : (
                <p>No colors available.</p>
              )}
            </div>
          </div>
        </CustomTabPanel>
      ))}
    </Box>
  );
}
