import React from "react";
import { BackgroundContainer } from "../common/backgroundContainer";
import bgPhoto from "../../assets/images/formViewBg.png";
import { FormSection } from "../formSection";

const FormViewComponent = () => {
  return (
    <BackgroundContainer imageURL={bgPhoto}>
      <div className="d-flex justify-content-center h-100">
        <div className="w-75 d-flex align-items-center h-100">
          <div className="form-view-main">
            <div>
              <div className="font-40 font-weight-700">Book amazing restaurants</div>
              <div className="my-4">
                <div className="font-22 font-primary">
                  From local favorites to the trending restaurants, enjoy without the wait. Discover popular restaurants where you can skip
                  the wait by booking through TableCheck.
                </div>
              </div>
            </div>
            <FormSection />
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const FormView = React.memo(FormViewComponent);
