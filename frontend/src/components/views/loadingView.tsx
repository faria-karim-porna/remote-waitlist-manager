import React from "react";
import { BackgroundContainer } from "../common/backgroundContainer";
import { LogoSmallSVG } from "../../assets/svg/logoSmallSvg";

const LoadingViewComponent = () => {
  return (
    <BackgroundContainer gradientColor={"280deg, #68007a 6%, #1f053d 84%"}>
      <div className="d-flex justify-content-center h-100">
        <div className="w-75 d-flex align-items-center justify-content-center h-100">
          <div className="d-flex font-secondary font-22 font-weight-500">
            <LogoSmallSVG />
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const LoadingView = React.memo(LoadingViewComponent);
