import { Row, Col } from "antd";
import CardAccommodation from "../ui/card-accommodation";
import { Pagination } from "antd";
import React, { useState, useEffect } from "react";
import { $openAxios } from "../../lib/http-service";
import Search from "../pages/search";
import Router from "next/router";
import Banner from "./accomodation-banner";
import Promotion from "./accomodation-promotion";
import {encryption, decryption} from "../../lib/utils/utility";

export default () => {
  const [accommodationList, setAccommodationList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [current, setCurrent] = useState(1);
  const [criteria, setCriteria] = useState({
    search:"",
    dateRange: ["", ""],
    hurraayyType: 1,
    guestInfo: {
      adults: 0,
      children: 0,
      infants: 0,
    }
  });
  
  const limit = 12;
  useEffect(() => {
      let _search = '';
      let _dateRange = ["", ""]
      let _guestInfo = {}
      if(Router.query && Router.query.search) {
       let queryArr = decryption(Router.query.search);
       
       _search = queryArr[0]
       _dateRange[0] = queryArr[1]['dateRange'][0]
       _dateRange[1] = queryArr[1]['dateRange'][1]
       _guestInfo = queryArr[1]['guestInfo'];
       setCriteria({ ...criteria, dateRange:_dateRange, guestInfo:_guestInfo});
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
    if(_search) {
      params["cityName"] = _search;
      params["name"] = _search;
    }
    params["sortBy"] = "id:desc,name:desc";
    $openAxios.get("/accommodations", { params: params }).then((resp) => {
      if (resp && resp.status == 200) {
        let data = resp.data.content;
        setAccommodationList(data);
        setTotalElements(resp.data.totalElements);
      }
    });
  }
  function onChange(page, pageSize) {
    setCurrent(page);
    loadData(page, pageSize, criteria['search'], criteria['dateRange']);
  }

  function onChangeSearch(criteria) {
    setCriteria(criteria);
    loadData(1, 12, criteria['search'], criteria['dateRange'])
  }
  let _criteria = encryption(criteria);
  return (
    <div>
    <Search searchChange={onChangeSearch} placeHolder={'Search in Accomodations'}/>
    <Banner />
    <Promotion />
    <div className="container">
      <div className="hurray-cat position-relative">
        <h3 className="ff-heebo fs-28 fc-#333 fw-600 title-2x mt-5 mb-4" style={{color:"#333"}}>
          Amazing places for staying
        </h3>
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
                  criteria={_criteria}
                />
              );
            })}
        </Row>
        {/* {totalElements} */}
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
