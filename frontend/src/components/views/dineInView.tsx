import React from "react";
import { BackgroundContainer } from "../common/backgroundContainer";
import bgPhoto from "../../assets/images/dineInBg.jpg";
import { TextSection } from "../textSection";

const DineInViewComponent = () => {
  return (
    <BackgroundContainer imageURL={bgPhoto}>
      <div className="w-100 d-flex justify-content-center h-100">
        <div className="w-75 h-100 d-flex align-items-center">
          <div className="main-view">
            <TextSection
              titles={["Enjoy your meal!!"]}
              subTitles={[
                "We’re thrilled to serve you today and can’t wait for you to experience the delicious meal we’ve prepared. Each dish is crafted with care, bringing together the freshest ingredients and bold flavors just for you. From the first bite to the last, we hope every mouthful delights your senses and makes your dining experience unforgettable.",
              ]}
            />
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const DineInView = React.memo(DineInViewComponent);
