import s from "./style.module.css";
import { Col } from "antd";
import Router from "next/router";
export default ({ info }) => {
  let img = info['img'];
  let city = info['city'];
  let title = info['title'];
  let duration = info['duration'];
  let pricePerGuest = info['pricePerGuest'];
  let link = info['link'];
  let id = info['id'];
  return (
    <div className=" card_5 w-100"
    onClick={() => Router.push({ pathname: link, query: { id: id } })}>
      <div
        // className={s["img-hover-zoom"]}
        className="imgbox"
        style={{
          backgroundImage: `url("${img}")`,
          backgroundPosition: "center",
          backgroundSize:"cover",
          width:"100%",
          height:"305px"
        }}
      >
        {/* <img src={`${img}`} alt="" style={{ visibility: "hidden", width:"100%", position:"fixed" }} /> */}
      </div>
      <div className="infobox pt-3">
        <h2 className="title-1x" style={{color:"#333", fontFamily:"Heebo"}}>{city}</h2>
        <span style={{color:"#333", fontFamily:"Heebo"}}>{title}&nbsp;</span>
        <br/>
        <label style={{color:"#333", fontSize:"1rem", fontFamily:"Heebo"}}>
        ৳ <b style={{fontWeight:"600"}}>{pricePerGuest}</b> / person . {duration} days
        </label>
      </div> 
    </div>
  );
};
