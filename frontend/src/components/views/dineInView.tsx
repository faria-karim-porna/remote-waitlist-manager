import React from "react";
import { BgImageContainer } from "../common/bgImageContainer";
import bgPhoto from "../../assets/images/dineInBg.jpg";

const DineInViewComponent = () => {
  return (
    <BgImageContainer imageURL={bgPhoto}>
      <div className="w-100 d-flex justify-content-center h-100">
        <div className="w-75 h-100">
          <div className="w-40 dine-in-view-main">
            <div className="dine-in-view-title">Enjoy your meal!!</div>
            <div className="dine-in-view-subtitle">
              We’re thrilled to serve you today and can’t wait for you to experience the delicious meal we’ve prepared. Each dish is crafted
              with care, bringing together the freshest ingredients and bold flavors just for you. From the first bite to the last, we hope
              every mouthful delights your senses and makes your dining experience unforgettable.
            </div>
          </div>
        </div>
      </div>
    </BgImageContainer>
  );
};

export const DineInView = React.memo(DineInViewComponent);
