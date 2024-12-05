import React from "react";
import bgPhoto from "../../assets/images/rejoinBg.jpg";
import { BackgroundContainer } from "../common/backgroundContainer";
import { useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { RejoinSection } from "../rejoinSection";

const RejoinViewComponent = () => {
  const store = useAppSelector(
    (state) => ({
      user: state.user.userInfo,
    }),
    shallowEqual
  );
  return (
    <BackgroundContainer imageURL={bgPhoto}>
      <div className="w-100 d-flex justify-content-center h-100">
        <div className="w-75 h-100 d-flex align-items-center">
          <div className="main-view">
            <RejoinSection name={store.user?.name} />
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const RejoinView = React.memo(RejoinViewComponent);
