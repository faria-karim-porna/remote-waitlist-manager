import React from "react";
import { useAppDispatch } from "./core/redux/store";
import { deleteUser } from "./core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { clearSessionStorage } from "./storages/localStorage";
import { UserAction } from "./core/redux/slices/userSlice";
import { TextSection } from "./textSection";

type RejoinSectionProps = {
  name?: string;
};

const RejoinSectionComponent = (props: RejoinSectionProps) => {
  const { name } = props;
  const dispatch = useAppDispatch();

  const handleJoinAgain = (name: string) => {
    dispatch(deleteUser(name))
      .then(unwrapResult)
      .then((response) => {
        if (response) {
          clearSessionStorage();
          dispatch(UserAction.removeUserInfo());
        }
      });
  };
  return (
    <>
      <TextSection
        titles={["Thanks for dining with us!"]}
        subTitles={[
          "Thank you for choosing our restaurant! We hope your meal was delightful and look forward to welcoming you back soon.",
          "Want to join us again for another delicious meal? Click below to rejoin, and we’ll save your spot!",
        ]}
      />
      <div className="d-flex mt-4">
        <button onClick={() => handleJoinAgain(name ?? "")} className="oval-button">
          Join with us again
        </button>
      </div>
    </>
  );
};

export const RejoinSection = React.memo(RejoinSectionComponent);
