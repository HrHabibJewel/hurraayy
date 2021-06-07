import { Row, Col, Pagination } from "antd";
import { $openAxios } from "../../lib/http-service";
import Router from "next/router";
import React, { useState, useEffect } from "react";
import Search from "../pages/search";
import Banner from "./experience-banner";
import Promotion from "./experience-promotion";
import NewWay from "./experience-new-way";
import CardExperience from "../ui/card-experience";
import { encryption, decryption } from "../../lib/utils/utility";

export default () => {
  const [experienceList, setExperienceList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [current, setCurrent] = useState(1);
  const [isUpVisible, setIsUpVisible] = useState(false);
  const [criteria, setCriteria] = useState({
    search: "",
    dateRange: ["", ""],
    hurraayyType: 1,
    guestInfo: {
      adults: 0,
      children: 0,
      infants: 0,
    },
  });
  const limit = 12;

  useEffect(() => {
    let _search = "";
    let _dateRange = ["", ""];
    let _guestInfo = {};
    if (Router.query && Router.query.search) {
      let queryArr = decryption(Router.query.search);

      _search = queryArr[0];
      _dateRange[0] = queryArr[1]["dateRange"][0];
      _dateRange[1] = queryArr[1]["dateRange"][1];
      _guestInfo = queryArr[1]["guestInfo"];
      setCriteria({
        ...criteria,
        dateRange: _dateRange,
        guestInfo: _guestInfo,
      });
      setIsUpVisible(true);
    }
    loadData(1, 12, _search, _dateRange);
  }, []);

  function loadData(pageNo, pageSize, _search, _dateRange = ["", ""]) {
    let startDate = _dateRange[0] ? _dateRange[0] : "";
    let endDate = _dateRange[1] ? _dateRange[1] : "";
    let params = {};
    params["pageNo"] = pageNo;
    params["pageSize"] = pageSize;
    params["startDate"] = startDate;
    params["endDate"] = endDate;
    if (_search) {
      params["cityName"] = _search;
      params["title"] = _search;
    }
    params["sortBy"] = "id:desc,title:desc";
    $openAxios.get("/experience-open", { params: params }).then((resp) => {
      if (resp && resp.status == 200) {
        let data = resp.data.content;
        setExperienceList(data);
        setTotalElements(resp.data.totalElements);
      }
    });
  }

  function onChange(page, pageSize) {
    setCurrent(page);
    loadData(page, pageSize, criteria["search"], criteria["dateRange"]);
  }

  function onChangeSearch(criteria) {
    //setIsUpVisible(searchVal.length >= 2 ? true : false)
    setIsUpVisible(true);
    setCriteria(criteria);
    loadData(1, 12, criteria["search"], criteria["dateRange"]);
  }
  let _criteria = encryption(criteria);
  return (
    <div>
      <Search
        searchChange={onChangeSearch}
        placeHolder={"Search in Experiences"}
      />
      {!isUpVisible && (
        <div>
          <Banner />
          <Promotion />
          {/* <NewWay /> */}
        </div>
      )}
      <div className="container">
        {!isUpVisible && (
          <div className="mt-5 mb-5">
            <h2
              className="ff-heebo fs-28 fc-#333 fw-600 title-2x"
              style={{ color: "#333" }}
            >
              Most popular experiences
            </h2>
          </div>
        )}
        {isUpVisible && (
          <div className="mt-5 mb-5">
            <h2
              className="ff-heebo fs-28 title-2x"
              style={{ color: "#333", marginTop: "-40px", marginLeft:"-10px" }}
            >
              Experience search results
            </h2>
          </div>
        )}
        <div className="justify-content-left fc-primary">
          <Row gutter={[30, 30]} style={{marginLeft:"-20px", marginTop:"-40px"}}>
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
                let image = "r_34.png";
                if (
                  item["experiencePhotoVOList"] &&
                  item["experiencePhotoVOList"][0]
                ) {
                  image = item["experiencePhotoVOList"][0]["photoPath"];
                }
                return (
                  <CardExperience
                    info={{
                      img: image,
                      title: item["title"],
                      countryCity: countryCity,
                      duration: item["duration"],
                      pricePerGuest: item["pricePerGuest"],
                      id: item["id"],
                    }}
                    type={1}
                    pathname="/experience-details"
                    criteria={_criteria}
                  />
                );
              })}
          </Row>
          <Row>
            <Col span={24}>
              <Pagination
                style={{ textAlign: "center", marginTop:"20px", marginBottom: "20px" }}
                pageSize={limit}
                current={current}
                onChange={onChange}
                total={totalElements}
                showLessItems={true}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
