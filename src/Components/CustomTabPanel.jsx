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
  const validTabs = Object.keys(tabsData).filter(
    (tab) => tabsData[tab]?.description?.trim().length > 0
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {validTabs.length > 0 && (
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
            {validTabs.map((tab, index) => (
              <Tab
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()}
                {...a11yProps(index)}
                sx={{
                  flex: 1,
                  textTransform: "none",
                  color: "#fff",
                  "&.Mui-selected": {
                    color: "#ff8f8f",
                  },
                  fontWeight: value === index ? "bold" : "normal",
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}
      {/* Tabs Content */}
      {validTabs.map((tab, index) => (
        <CustomTabPanel value={value} index={index} key={tab}>
          <div>
            <p
              style={{
                margin: "10px 0px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "400",
                fontStyle: "italic",
              }}
            >
              {tabsData[tab].description}
            </p>
            <div style={{ marginTop: "20px", display: "flex" }}>
              <div style={{ margin: "0px 20px" }}>
                <h4>Outfits:</h4>
                {tabsData[tab]?.recommended_types?.map((recommend, i) => (
                  <ul key={i} style={{ margin: "10px 0px", padding: "0px" }}>
                    <li>{recommend}</li>
                  </ul>
                ))}
              </div>
              <div>
                <h4>Colors:</h4>
                <div
                  style={{
                    display: "flex",
                    margin: "10px 0px",
                    flexWrap: "wrap",
                  }}
                >
                  {tabsData[tab]?.hex_codes?.map((color) => (
                    <div
                      key={color}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: color.trim(),
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        margin: "10px 5px",
                      }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CustomTabPanel>
      ))}
    </Box>
  );
}
