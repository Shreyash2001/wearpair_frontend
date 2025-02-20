import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { generateShades } from "../utils/utility";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { outfitFilterForEachTabAction } from "../actions/outfitActions";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const validTabs = Object.keys(tabsData).filter(
    (tab) =>
      tabsData[tab]?.description?.trim().length > 0 &&
      tabsData[tab]?.hex_codes?.length > 0
  );

  const [value, setValue] = React.useState(0);
  const [colors, setColors] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    dispatch(outfitFilterForEachTabAction(tabsData, validTabs[newValue]));
  };

  React.useEffect(() => {
    const totalColors = tabsData[validTabs[value]]?.hex_codes
      ?.map((color) => generateShades(color))
      .flat();

    setColors(totalColors);
  }, [tabsData, value]);

  const palleteSection = () => {
    return (
      <div>
        <p>Color Palette:</p>
        <div style={{ display: "flex", margin: "10px 0px" }}>
          {colors?.map((color, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: color,
                  width: "25px",
                  height: "100px",
                  borderRadius: "5px",
                  marginRight: "-10px",
                }}
              ></div>
            );
          })}
        </div>
      </div>
    );
  };

  const [recommendedImages, setRecommendedImages] = React.useState([]);

  const imageSection = (recommend) => {
    return (
      <div
        onClick={toggleDrawer(true, recommend)}
        style={{
          position: "relative",
          borderRadius: "5px",
          width: "120px",
          height: "200px",
          overflow: "hidden",
          margin: "5px 10px",
        }}
      >
        <img
          src={recommend?.image[0] || null}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            background:
              "linear-gradient(45deg, #ff7eb3, #ff758c, #ff6a57, #ff8e57)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h5 style={{ margin: "5px 10px" }}>More {recommend?.title}</h5>
        </div>
      </div>
    );
  };

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen, images) => () => {
    setOpen(newOpen);
    setRecommendedImages(images);
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
      {validTabs.map((tab, index) => {
        return (
          <CustomTabPanel value={value} index={index} key={tab}>
            <div key={index}>
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
                <div>
                  <h4>Outfits:</h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      margin: "10px 0px",
                      width: "100%",
                    }}
                  >
                    {tabsData[tab]?.recommended_types?.map((recommend, i) => (
                      <div
                        style={{
                          padding: "8px 10px",
                          borderRadius: "22px",
                          margin: "5px 10px 5px 0px",
                          background: "#f94c4c",
                        }}
                        key={i}
                      >
                        <p
                          style={{ fontSize: "13px", fontWeight: "600" }}
                          key={i}
                        >
                          {recommend?.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {tabsData[tab]?.recommended_types?.map((recommend, i) => (
                  <div key={i}>{imageSection(recommend)}</div>
                ))}
              </div>
              {palleteSection()}
            </div>
          </CustomTabPanel>
        );
      })}
      <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
        <div style={{ background: "#222", padding: "10px 10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "10px 0px",
            }}
          >
            <h4>View all {recommendedImages?.title}</h4>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon style={{ color: "#fff", fontSize: "25px" }} />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              overflow: "scroll",
              marginTop: "20px",
            }}
          >
            {recommendedImages?.image?.map((item, index) => (
              <img
                key={index}
                style={{
                  width: "150px",
                  height: "250px",
                  objectFit: "cover",
                  marginRight: "30px",
                  borderRadius: "12px",
                }}
                src={item}
                alt=""
              />
            ))}
          </div>
        </div>
      </Drawer>
    </Box>
  );
}
