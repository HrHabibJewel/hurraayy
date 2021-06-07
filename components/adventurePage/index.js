import { Row, Col, Pagination } from "antd";
import { $openAxios } from "../../lib/http-service";
import Router from "next/router";
import Banner from "./adventure-banner";
import Promotion from "./adventure-promotion";
import NewWay from "./adventure-new-way";
import CardExperience from "../ui/card-experience";
import React, { useState, useEffect } from "react";
import Search from "../pages/search";
import {encryption, decryption} from "../../lib/utils/utility";
const isServer = typeof window === "undefined";
import s from "./style.module.css";

export default () => {
    const [search, setSearch] = useState('');
    const [adventureList, setAdventureList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [current, setCurrent] = useState(1);
    const [isUpVisible, setIsUpVisible] = useState(false)
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
          setIsUpVisible(true)
        }
        loadData(1, 12,  _search, _dateRange);
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
          params["title"] = _search;
        }
        params["sortBy"] = "id:desc,title:desc";
        $openAxios.get("/adventure-open", { params: params }).then((resp) => {
            if (resp && resp.status == 200) {
            let data = resp.data.content;
            setAdventureList(data);
            setTotalElements(resp.data.totalElements);
            }
        });
    }
    function onChange(page, pageSize) {
        setCurrent(page);
        loadData(page, pageSize, criteria['search'], criteria['dateRange']);
    }

    function onChangeSearch(criteria) {
       // setIsUpVisible(searchVal.length >= 2 ? true : false)
       setIsUpVisible(true)
       setCriteria(criteria);
        loadData(1, 12, criteria['search'], criteria['dateRange'])
    }
    let _criteria = encryption(criteria);
  return (
      <div>
        <Search searchChange={onChangeSearch} placeHolder={'Search in Adventures'}/>
        {
          !isUpVisible && (
            <div>
              <Banner />
              <br/>
              <br/>
              <Promotion />
              <NewWay />
            </div>
          )
        }
        <div className="container">
          {
            !isUpVisible && (
              <div className="mt-5 mb-5">
                <h2 className="ff-heebo fs-28 title-2x" style={{color:"#333"}}>
                  Most popular adventures
                </h2>
              </div>
            )
          }

          {isUpVisible && (
            <div className="mt-5 mb-5">
            <h2 className="ff-heebo fs-28 title-2x" style={{color:"#333",marginTop: "-40px", marginLeft:"-10px"}}>
            Adventure search results
            </h2>
          </div>
          )}
      
      <div className="justify-content-left fc-primary">
        <Row gutter={16} className={`${s["list-style"]}`} >
        {adventureList.length > 0 &&
          adventureList.map((item, key) => {
            let city = "";
            if (item["city"] && item["city"]["name"]) {
              city = item["city"]["name"];
            }
            let image = "r_34.png";
            if (item["adventurePhotoVOList"] && item["adventurePhotoVOList"][0]) {
              image = item["adventurePhotoVOList"][0]["photoPath"];
            }
            return (
              <CardExperience info={{ 
                img: image,
                title:item['title'],
                countryCity:city,
                pricePerGuest:item['pricePerGuest'],
                id:item['id'],
                duration:item['duration']
              }} type = {2} 
              pathname="/adventure-details"  
              criteria={_criteria}/>
            );
          })}
          </Row>
          <Row>
            <Col span={24}>
              <Pagination
                style={{ textAlign: "center", marginTop:"20px", marginBottom: "20px"}}
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
