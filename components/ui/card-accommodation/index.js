import s from "./style.module.css";
import { Col, Button, Icon } from "antd";
import Link from "next/link";

export default ({ info, criteria }) => {
  const img = info["img"];
  const name = info["name"];
  const location = info["location"];
  const price = info["price"];
  const currency = info["currency"];
  const id = info["id"];
  return (
    <Col xs={24} sm={12} md={6} style={{ cursor: "pointer" }}>
      <Link href={{ pathname: "/details", query: { id: id, criteria:criteria } }}>
        <div className={s["accommodation-single-card"]}>
          <div
            className={s["accommodation-image"]}
            style={{ backgroundImage: `url(${img})` }}
          >
            {/* <img src={img} /> */}
          </div>
          <div className={s["accommodation-info"]}>
            {/* <Button>
            <span>SUPERHOST</span>
          </Button> */}
            <Icon type="environment" theme="filled" style={{color:"#616161"}} />
            <label style={{fontFamily:"Heebo", color:"#616161", fontWeight:"500", fontSize:"13px",lineHeight:"15px"}}>{location}</label>
            {/* <span className={s["number"]}>
              <Icon type="star" theme="filled" />
              5.00 (0)
            </span> */}
            <br/>
            <label className={s.label}>{name.length < 27 ? name : name.substring(0,27)+"..."}</label>
            <div className={s.price}>
            <p style={{color:"#333",marginTop:"5px"}}>{currency}{" "}
              <b style={{fontWeight:"600"}}>
                
                {price}
              </b>{" "}
              / night</p>
            </div>
          </div>
        </div>
      </Link>
    </Col>
  );
};
