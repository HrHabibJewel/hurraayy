import s from "./style.module.css";
import {useState,useLayoutEffect } from "react";
export default () => {
  const [isDesktop, setIsDesktop] = useState(false);
  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsDesktop(window.innerWidth > 550 ? true : false);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <div
      className={s.banner}
      // style={{marginTop:"20px"}}
      // style={{ backgroundImage: `url("images/adventure_banner2.jpg")` }}
    >
      <h2 className="fc-white ff-heebo fw-600 ls-1 title-3x mb-1" style={{marginTop:"-150px", textAlign:"center",marginRight:isDesktop?0:30}}>
        Hurraayy Adventures
      </h2>
      {/* <p className="fc-white fw-300 sub-2x" style={{ maxWidth: 300 }}>
      Our adventures includes accommodations and food.
      </p> */}
    </div>
  );
};
