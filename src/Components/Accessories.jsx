import React, { useEffect, useState } from "react";
import "./Accessories.css";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Accessories({ accessories = {} }) {
  const gender = accessories?.gender?.toLowerCase();
  const [data, setData] = useState(
    gender === "men" ? accessories?.men : accessories?.women
  );
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [selectedAccessoriesImages, setSelectedAccessoriesImages] = useState(
    []
  );
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    setData(gender === "men" ? accessories?.men : accessories?.women);
  }, [gender, accessories]);

  useEffect(() => {
    setSelectedFilter(data && Object.keys(data)[0]);
  }, [data]);

  useEffect(() => {
    if (data) {
      const totalColors = data[selectedFilter]?.hex_codes;

      setColors(totalColors);
      console.log(data[selectedFilter]?.recommended_types);
      setRecommendedImages(data[selectedFilter]?.recommended_types);
    }
  }, [selectedFilter, data]);

  const handleSelectedFilter = (item) => {
    setSelectedFilter(item);
  };

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
                  width: "35px",
                  height: "35px",
                  marginRight: "10px",
                  borderRadius: "22px",
                }}
              ></div>
            );
          })}
        </div>
      </div>
    );
  };
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen, images) => () => {
    setOpen(newOpen);
    setSelectedAccessoriesImages(images);
  };

  const imageSection = (recommend) => {
    return (
      <div
        key={recommend?.title}
        onClick={toggleDrawer(true, recommend)}
        style={{
          position: "relative",
          borderRadius: "5px",
          width: "140px",
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
            background: "rgb(249, 76, 76)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h5 style={{ margin: "5px 5px" }}>View More {recommend?.title}</h5>
        </div>
      </div>
    );
  };

  const filtersSection = () => {
    return (
      <div className="accessory_filter_container">
        {data &&
          Object.keys(data)?.map((item, index) => {
            var value =
              item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
            if (item === "additional_accessories") {
              value = "Extras";
            }
            return (
              <div
                onClick={() => handleSelectedFilter(item)}
                className={`${
                  selectedFilter === item
                    ? "accessory_filters_selected"
                    : "accessory_filters"
                }`}
                key={index}
              >
                <p>{value}</p>
              </div>
            );
          })}
      </div>
    );
  };

  const detailsSection = () => {
    return (
      <div style={{ margin: "20px 0px" }}>
        <p
          style={{
            margin: "10px 0px",
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: "700",
            fontStyle: "italic",
          }}
        >
          {data && data[selectedFilter]?.description}
        </p>
        <div>
          <div
            style={{
              display: "flex",
              margin: "10px 0px",
              flexWrap: "wrap",
            }}
          >
            {palleteSection()}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {recommendedImages?.map((recommend) => imageSection(recommend))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {filtersSection()}
      {detailsSection()}
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
            <h4>View all {selectedAccessoriesImages?.title}</h4>
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
            {selectedAccessoriesImages?.image?.map((item, index) => (
              <img
                key={index}
                style={{
                  width: "150px",
                  height: "250px",
                  objectFit: "cover",
                  marginRight: "30px",
                  borderRadius: "12px",
                }}
                src={item || null}
                alt=""
              />
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default Accessories;
