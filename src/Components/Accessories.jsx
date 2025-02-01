import React, { useEffect, useState } from "react";
import "./Accessories.css";
import { generateShades } from "../utils/utility";

function Accessories({ accessories = {} }) {
  const gender = accessories?.gender?.toLowerCase();
  const [data, setData] = useState(
    gender === "men" ? accessories?.men : accessories?.women
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
      const totalColors = data[selectedFilter]?.hex_codes
        ?.map((color) => generateShades(color))
        .flat();

      setColors(totalColors);
    }
  }, [selectedFilter, data]);

  const handleSelectedFilter = (item) => {
    setSelectedFilter(item);
  };

  const palleteSection = () => {
    return (
      <div>
        <p>Color Palette:</p>
        <div className="color_pallete">
          {colors?.map((color, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: color,
                  width: "28px",
                  height: "100px",
                  borderRadius: "4px",
                  marginRight: "-10px",
                }}
              ></div>
            );
          })}
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
        </div>
      </div>
    );
  };

  return (
    <div>
      {filtersSection()}
      {detailsSection()}
    </div>
  );
}

export default Accessories;
