import s from "./style.module.css";
import { Row, Icon } from "antd";
import CardAdventure from "../../ui/card-adventure";
import React, { useState, useEffect } from "react";
import { $openAxios } from "../../../lib/http-service";
import Slider from "react-slick";
import Router from "next/router";
import * as icon from "../../../components/icons";
let slider = null;
function next() {
  slider.slickNext();
}
function previous() {
  slider.slickPrev();
}

export default () => {
  const [adventureList, setAdventureList] = useState([]);
  const [slideShow, setSlideShow] = useState(0);
  const [slideScroll, setSlideScroll] = useState(0);
  let settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: slideShow, //3,
    
    responsive: [
      {
        breakpoint: 2200,
        settings: {
          slidesToShow: slideShow,//3,
          slidesToScroll: slideScroll,//3,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: slideShow,//3,
          slidesToScroll: slideScroll,//3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: slideShow,//3,
          slidesToScroll: slideScroll,//3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  useEffect(() => {
    let params = {};
    params["pageNo"] = 1;
    params["pageSize"] = 30;
    params["sortBy"] = "id:desc,title:desc";
    $openAxios.get("/adventure-open", { params: params }).then((resp) => {
      if (resp && resp.status == 200) {
        let data = resp.data.content;
        //console.log("advnturelist", data);
        setAdventureList(data);

        //Habib [27-03-2021]
        if(data.length < 6){
          // pSlideToShow = data.length;
          setSlideShow(data.length);
          setSlideScroll(data.length);
        }
        else{
          setSlideShow(5);
          setSlideScroll(5);
        }
        // console.log("settings", settings);
        
      }
    });
  }, [])
  return (
    <div className="container">
      <div className="hurray-cat position-relative  mb-4">
        <h3 className="ff-heebo fs-28 fw-600 title-2x mt-5 mb-1"  style={{color:"#333"}}>
          Hurraayy adventures
        </h3>
        <small>Includes accommodations, food etc.</small>
        <a className={s["view-all"]} onClick={() => Router.push({ pathname: '/adventure' })}>
          <span style={{fontFamily:"Heebo", color:"#808080",fontSize:"1rem", fontWeight:"600"}}>View All</span> 
          <p style={{ position: "absolute", top: 2, right: -20 }}>{icon.right_arrow}</p>
        </a>
        
      </div>
      <div className={s["hero-adventure"]} style={{cursor: "pointer"}}>
        <Row>
          <Slider ref={(c) => (slider = c)} {...settings}>
          {adventureList.length > 0 &&
            adventureList.map((item, key) => {
              let city = "";
              if (item["city"] && item["city"]["name"]) {
                city = item["city"]["name"];
              }
              let image = "./images/r_8.png";
              if (item["adventurePhotoVOList"] && item["adventurePhotoVOList"][0]) {
                image = item["adventurePhotoVOList"][0]["photoPath"];
              }

              return(
                <CardAdventure 
                  info ={{
                    img:image,
                    city:city,
                    title:item['title'],
                    duration:item['duration'],
                    pricePerGuest:item['pricePerGuest'],
                    link:"/adventure-details",
                    id:item.id
                  }} />
              )
            })
          }
          </Slider>
          <div style={{ textAlign: "center" }}>
            <div
              className={`${s["slick-prev"]} ${s["slick-arrow"]}`}
              onClick={previous}
              style={{marginTop: -25}}
            >
              {/* <Icon type="left" /> */}
              {icon.left_arrow_circle}
            </div>
            <div
              className={`${s["slick-next"]} ${s["slick-arrow"]}`}
              onClick={next}
              style={{marginBottom: 35}}
            >
              {/* <Icon type="right" /> */}
              {icon.right_arrow_circle}
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};
