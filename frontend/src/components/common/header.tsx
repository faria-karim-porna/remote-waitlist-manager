import React from "react";
import { LogoSVG } from "../../assets/svg/logoSvg";
import { useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";

const HeaderComponent = () => {
  const store = useAppSelector(
    (state) => ({
      user: state.user.userInfo,
    }),
    shallowEqual
  );
  return (
    <div className="header w-100 d-flex justify-content-center align-items-center fixed-top">
      <div className="d-flex w-75 align-items-center position-relative justify-content-between">
        <LogoSVG />
        <div className="text-white font-22 font-weight-500 username">{store.user?.name}</div>
      </div>
    </div>
  );
};

export const Header = React.memo(HeaderComponent);
