import s from "./style.module.css";
import { Row } from "antd";
import CardExperience from "../../ui/card-experience";
import React, { useState, useEffect } from "react";
import { $openAxios } from "../../../lib/http-service";
import Router from "next/router";
import * as icon from "../../../components/icons";
export default () => {
  const [experienceList, setExperienceList] = useState([]);
  useEffect(() => {
    loadData(1, 8);
  }, []);
  function loadData(pageNo, pageSize) {
    let params = {};
    params["pageNo"] = pageNo;
    params["pageSize"] = pageSize;
    params["sortBy"] = "id:desc,title:desc";
    $openAxios.get("/experience-open", { params: params }).then((resp) => {
      if (resp && resp.status == 200) {
        let data = resp.data.content;
        setExperienceList(data);
      }
    });
  }
  return (
    <div className="container">
      <div className="hurray-cat position-relative">
        <h3 className="ff-heebo fs-28 fw-600 title-2x mt-5 mb-4" style={{color:"#333"}}>
          Hurraayy experiences
        </h3>
        {/* <a style={{ position: "absolute", top: 5, right: 5 }} onClick={() => Router.push({ pathname: '/experience' })}>view all</a> */}
        <a className={s["view-all"]} onClick={() => Router.push({ pathname: '/experience' })}>
          <span style={{fontFamily:"Heebo", color:"#808080",fontSize:"1rem", fontWeight:"600"}}>View All</span> 
          <p style={{ position: "absolute", top: 2, right: -20 }}>{icon.right_arrow}</p>
        </a>
      </div>
      <div className={s["hero-experience"]}>
        <Row gutter={[30, 30]}>
        {experienceList.length > 0 &&
            experienceList.map((item, key) => {
              let city = "";
              let country = "";
              if (item["city"] && item["city"]["name"]) {
                city = item["city"]["name"];
              }
              if (item["country"] && item["country"]["name"]) {
                country = item["country"]["name"];
              }
              let countryCity = city + (country ? ", " + country : "");
              let image = "./images/r_34.png";
              if (item["experiencePhotoVOList"] && item["experiencePhotoVOList"][0]) {
                image = item["experiencePhotoVOList"][0]["photoPath"];
              }
              return(
                <CardExperience info={{ 
                  id:item['id'],
                  img: image,
                  title:item['title'],
                  countryCity:countryCity,
                  duration:item['duration'],
                  pricePerGuest:item['pricePerGuest']
                }} />
              )
            })
        }
        </Row>
      </div>
    </div>
  );
};
