import React, { useEffect } from "react";
import "./OutfitDetailsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { outfitDetailsAction } from "../actions/outfitActions";
import ReadMoreLess from "../components/ReadMoreLess";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import BasicTabs from "../components/CustomTabPanel";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

function OutfitDetailsPage() {
  const dispatch = useDispatch();
  const { outfit } = useSelector((state) => state.outfitDetails);

  useEffect(() => {
    dispatch(outfitDetailsAction());
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
            <h3>
              {outfit?.clothing_item?.charAt(0).toUpperCase() +
                outfit?.clothing_item?.slice(1).toLowerCase()}
            </h3>
          </div>
          <div style={{ margin: "10px 0px" }}>
            <h4 style={{ color: "#fff" }}>Description:</h4>
            <ReadMoreLess
              text={outfit?.primary_color_details?.description}
              maxLength={60}
            />
          </div>
        </div>
      </div>
    );
  };

  const showRelevantOutfitSection = () => {
    return (
      <div style={{ padding: "5px 10px" }}>
        <Accordion
          sx={{ backgroundColor: "#222", color: "#fff" }}
          defaultExpanded
        >
          <AccordionSummary
            expandIcon={<ExpandCircleDownIcon style={{ color: "#fff" }} />}
          >
            <h3>Suggested Outfits:</h3>
          </AccordionSummary>
          <AccordionDetails>
            <BasicTabs tabsData={outfit?.complementary_colors} />
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
