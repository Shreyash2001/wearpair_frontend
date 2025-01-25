import React, { useEffect } from "react";
import "./OutfitDetailsPage.css";
import { useDispatch, useSelector } from "react-redux";
import {
  outfitDetailsAction,
  resetOutfitDetails,
} from "../actions/outfitActions";
import ReadMoreLess from "../components/ReadMoreLess";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import BasicTabs from "../components/CustomTabPanel";

function OutfitDetailsPage() {
  const dispatch = useDispatch();
  const { outfit } = useSelector((state) => state.outfitDetails);
  console.log(outfit);

  useEffect(() => {
    dispatch(resetOutfitDetails());
  }, []);
  const showCapturedOutfitSection = () => {
    return (
      <div className="outfitDetails_top_container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div className="outfitDetails_imageContainer">
            <img
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={outfit?.selectedOutfit}
              alt="Outfit"
            />
          </div>
        </div>
        <div>
          <div>
            <h4 style={{ margin: "5px 0px" }}>Clothing Item:</h4>
            <h3>{outfit?.clothing_item}</h3>
          </div>
          <div style={{ margin: "10px 0px" }}>
            <h4 style={{ color: "#fff" }}>Description:</h4>
            <ReadMoreLess text={outfit?.primary_color} maxLength={60} />
          </div>
        </div>
      </div>
    );
  };

  const showRelevantOutfitSection = () => {
    const data = {
      tab_details: outfit?.complementary_colors,
      tab_colors: outfit?.hex_codes,
    };
    return (
      <div>
        <Accordion defaultExpanded>
          <AccordionSummary>Suggested Outfits:</AccordionSummary>
          <AccordionDetails>
            <BasicTabs
              tabsData={outfit?.complementary_colors}
              tabsColors={outfit?.hex_codes}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  return (
    <div>
      {showCapturedOutfitSection()}
      {showRelevantOutfitSection()}
    </div>
  );
}

export default OutfitDetailsPage;
