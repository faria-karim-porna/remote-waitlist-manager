import React from "react";
import { UserSvg } from "../assets/svg/userSvg";


type WaitingSectionProps = {
  waitingPosition?: number;
};

const WaitingSectionComponent = (props: WaitingSectionProps) => {
  const { waitingPosition } = props;
  return (
    <div>
      <div className="font-25 font-primary font-weight-500">Thank you for choosing us – we'll seat you soon!</div>
      <div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex align-items-center">
            <UserSvg small={true} />
            <UserSvg small={true} />
            <UserSvg small={true} />
            <UserSvg />
            <UserSvg small={true} />
            <UserSvg small={true} />
            <UserSvg small={true} />
          </div>
          <div className="wait-list-view-small-text">
            You're <span className="font-22 font-primary font-weight-500">#{waitingPosition}</span> on the waitlist. Please wait.
          </div>
        </div>
      </div>
    </div>
  );
};

export const WaitingSection = React.memo(WaitingSectionComponent);
