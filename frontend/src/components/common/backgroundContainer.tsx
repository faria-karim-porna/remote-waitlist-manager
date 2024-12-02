import React from "react";

type BackgroundContainerProps = {
  imageURL?: string;
  gradientColor?: string;
};

const BackgroundContainerComponent: React.FC<React.PropsWithChildren<BackgroundContainerProps>> = ({ imageURL, gradientColor, children }) => {
  return (
    <div
      className="bg-photo"
      style={{ backgroundImage: imageURL ? `url(${imageURL})` : gradientColor ? `linear-gradient(${gradientColor})` : "" }}
    >
      {children}
    </div>
  );
};

export const BackgroundContainer = React.memo(BackgroundContainerComponent);
