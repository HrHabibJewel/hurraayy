import React, { useState, useEffect } from "react";

import { Carousel } from "react-responsive-carousel";
export default ({ images }) => {
  return (
    <div>
      <Carousel carousel-root={false} swipeable={true}>
        {images &&
          images.map((img) => (
            // <div>
            <img src={img.photoPath} alt="image" />
            // </div>
          ))}
      </Carousel>
    </div>
  );
};
