import { Button, Icon } from "antd";
import { useState, useRef } from "react";
import s from "./style.module.css";

export default ({ src }) => {
  const [position, setPosition] = useState({
    backgroundImage: `url(${src})`,
  });

  const zoom = useRef();
  const img = useRef();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = img.current.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    let x = e.pageX - left;
    let y = e.pageY - top;
    let bw = 3;
    let w = zoom.current.offsetWidth / 2;
    let h = zoom.current.offsetHeight / 2;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    /*set the position of the magnifier glass:*/
    zoom.current.style.left = x - w + "px";
    zoom.current.style.top = y - h + "px";

    zoom.current.style.backgroundPosition =
      (x * 100) / width + "% " + (y * 100) / height + "%";
  };

  return (
    <div className={s.zoom_con} onMouseMove={(e) => handleMouseMove(e)}>
      <div className={s.zoom} style={position} ref={zoom}></div>
      {/* <div className="img" style={{ backgroundImage: `url(${src})` }}></div>
       */}
      <img src={src} className={s.img} ref={img} />
    </div>
  );
};
