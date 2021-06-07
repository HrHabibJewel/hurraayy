import { Row, Col } from "antd";
import CardAccommodation from "../../ui/card-accommodation";
import React, { useState, useEffect } from "react";
import { $openAxios } from "../../../lib/http-service";
import Router from "next/router";
import * as icon from "../../../components/icons";
import s from "../adventure/style.module.css";

export default ({ limit = 8 }) => {
  const [accommodationList, setAccommodationList] = useState([]);
  useEffect(() => {
    loadData(1, limit);
  }, []);
  function loadData(pageNo, pageSize) {
    let params = {};
    params["pageNo"] = pageNo;
    params["pageSize"] = pageSize;
    params["sortBy"] = "id:desc,name:desc";
    $openAxios.get("/accommodations", { params: params }).then((resp) => {
      if (resp && resp.status == 200) {
        let data = resp.data.content;
        setAccommodationList(data);
      }
    });
  }
  return (
    <div className="container">
      <div className="hurray-cat position-relative">
        <h3 className=" ff-heebo fs-28 fw-600 title-2x mt-5 mb-4" style={{color:"#333"}}>
          {/* Amazing places for staying */}
          Places for staying
        </h3>
        <a className={s["view-all2"]} onClick={() => Router.push({ pathname: '/accomodation' })}>
          <span style={{fontFamily:"Heebo", color:"#808080",fontSize:"1rem", fontWeight:"600"}}>View All</span> 
          <p style={{ position: "absolute", top: 2, right: -20 }}>{icon.right_arrow}</p>
        </a>
        {/* <a style={{ position: "absolute", top: 5, right: 5 }} onClick={() => Router.push({ pathname: '/accomodation' })}>View All</a> */}
      </div>
      <div className="hero-adventure">
        <Row gutter={[30, 30]}>
          {accommodationList.length > 0 &&
            accommodationList.map((item, key) => {
              let image = "./images/r_18.png";
              if (item["propertyPhotoVOS"] && item["propertyPhotoVOS"][0]) {
                image = item["propertyPhotoVOS"][0]["photoPath"];
              }
              let id = item["id"];
              let name = item["name"] ? item["name"] : "";
              let city = "";
              let country = "";
              if (item["city"] && item["city"]["name"]) {
                city = item["city"]["name"];
                if (item["city"]["state"] && item["city"]["state"]["country"]) {
                  country = item["city"]["state"]["country"]["name"]
                    ? item["city"]["state"]["country"]["name"]
                    : "";
                }
              }
              let location = city + (country ? ", " + country : "");
              let price = item["price"] ? item["price"] : "";
              let currency = item["currency"] ? item["currency"]["symbol"] :"";

              return (
                <CardAccommodation
                  key={key}
                  info={{
                    img: image,
                    name: name,
                    location: location,
                    price: price,
                    currency: currency,
                    id: id,
                  }}
                />
              );
            })}
        </Row>
      </div>
    </div>
  );
};
