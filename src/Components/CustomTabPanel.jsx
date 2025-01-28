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
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
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
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{
            style: {
              background: "linear-gradient(45deg, #ff8f8f, #ff6161)",
            },
          }}
          sx={{ flexGrow: 1 }}
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
                    flex: 1,
                    textTransform: "none",
                    color: "#fff", // Default white color
                    "&.Mui-selected": {
                      color: "#ff8f8f", // Ensure the selected text color stays as defined
                    },
                    fontWeight: value === index ? "bold" : "normal",
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
              <p
                style={{
                  margin: "10px 0px",
                  fontSize: "18px",
                  lineHeight: "26px",
                  fontWeight: "400",
                  fontStyle: "italic",
                }}
              >
                {tabsData[tab].description}
              </p>
            ) : (
              <p>No description available.</p>
            )}

            {/* Hex Colors */}
            <div style={{ marginTop: "20px" }}>
              <h3>Colors:</h3>
              <div style={{ display: "flex", gap: "10px", margin: "10px 0px" }}>
                {tabsData[tab]?.hex_codes?.length > 0 ? (
                  tabsData[tab].hex_codes.map((color) => (
                    <div
                      key={color}
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: color.trim(),
                        borderRadius: "12px",
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
          </div>
        </CustomTabPanel>
      ))}
    </Box>
  );
}
