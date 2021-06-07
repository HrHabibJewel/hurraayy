import { Avatar } from "antd";
import { useState } from "react";
import s from "./style.module.css";
import Router from "next/router";

export default ({ size, txt, img, link }) => (
  // <div className="text-center" style={{ width: "33.33%" }}></div>
  <div className="text-center">
    <Avatar
      size={size}
      onClick={() => Router.push({ pathname: `${link}` })}
      className="avatar-img"
      src={img}
      style={{ cursor: "pointer" }}
    />
    <h4
      onClick={() => Router.push({ pathname: `${link}` })}
      className={s["avatar-title"]}
      style={{ cursor: "pointer", textAlign:"center" }}
    >
      {txt}
    </h4>
  </div>
);
