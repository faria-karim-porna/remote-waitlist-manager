import React from "react";

type BgImageContainerProps = {
  imageURL?: string;
};

const BgImageContainerComponent: React.FC<React.PropsWithChildren<BgImageContainerProps>> = ({ imageURL, children }) => {
  return (
    <div className="bg-photo" style={{ background: `url(${imageURL})` }}>
      {children}
    </div>
  );
};

export const BgImageContainer = React.memo(BgImageContainerComponent);
