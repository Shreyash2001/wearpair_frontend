import React, { useEffect, useState } from "react";

function Accessories({ accessories = {} }) {
  const gender = accessories?.gender?.toLowerCase();
  const [data, setData] = useState(
    gender === "men" ? accessories?.men : accessories?.women
  );
  useEffect(() => {
    setData(gender === "men" ? accessories?.men : accessories?.women);
  }, [gender, accessories]);

  return (
    <div style={{ display: "flex", alignItems: "center", overflowX: "scroll" }}>
      {data &&
        Object.keys(data)?.map((item, index) => {
          var value =
            item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
          if (item === "additional_accessories") {
            value = "Extras";
          }
          return (
            <div
              key={index}
              style={{
                border: "1px solid lightgrey",
                padding: "10px 20px",
                borderRadius: "22px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0px 10px",
              }}
            >
              <p>{value}</p>
            </div>
          );
        })}
    </div>
  );
}

export default Accessories;
