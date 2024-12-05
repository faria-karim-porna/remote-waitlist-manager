import React from "react";

type TextSectionProps = {
  titles?: string[];
  subTitles?: string[];
};

const TextSectionComponent = (props: TextSectionProps) => {
  const { titles, subTitles } = props;
  const hasSubtitles = () => (subTitles?.length ?? 0) > 0;
  return (
    <>
      {titles?.map((title, index) => (
        <div className={`font-70 font-secondary font-weight-700 ${hasSubtitles() ? "mb-4" : ""}`} key={index}>
          {title}
        </div>
      ))}
      {subTitles?.map((subTitle, index) => {
        const isLastSubtitle = (subTitles?.length ?? 0) - 1 === index;
        return (
          <div className={`font-22 font-secondary ${!isLastSubtitle ? "mb-4" : ""}`} key={index}>
            {subTitle}
          </div>
        );
      })}
    </>
  );
};

export const TextSection = React.memo(TextSectionComponent);
