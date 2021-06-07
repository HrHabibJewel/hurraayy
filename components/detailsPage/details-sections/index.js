import { Button, Icon, Input, Divider, Avatar, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as icon from "./icons";
import More from "./showMore";
import s from "./style.module.css";
import CardForm from "./cardForm";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { GEOCODE_KEY } from "../../../lib/constans";
import Calendar from "./calendar";
import { MinusOutlined, LineOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker;

function checkIfexists(object, prop) {
  if (object.hasOwnProperty(prop)) return `${prop} Exists, proceed to display`;
  else return `${prop} info does not exist`;
}

const Amenities = ({ data }) => {
  let amenitieList = [];
  let uniqAmenitie = [];
  let a = 0;
  data &&
    data.length &&
    data.map((item, key) => {
      let typeName = item["amenityTypeVO"]["name"];
      if (!uniqAmenitie[typeName]) {
        a = 0;
        //  console.log("typeName", typeName);
        amenitieList[typeName] = [];
        amenitieList[typeName][a] = {
          name: item["name"],
          iconPath: item["iconPath"],
          typeName: item["amenityTypeVO"]["name"],
        };
      } else {
        a++;
        amenitieList[typeName][a] = {
          name: item["name"],
          iconPath: item["iconPath"],
        };
      }
      uniqAmenitie[typeName] = true;
    });
  return (
    <div className="pt-3">
      {Object.keys(amenitieList).length > 0 &&
        Object.keys(amenitieList).map((item, key) => {
          return (
            <div key={key} className={`${s.info} ${s.amen}`}>
              <span className={s["third-title"]} style={{ margin: "20px 0" }}>
                {item}
              </span><br />
              <div className="row">
                {amenitieList[item] &&
                  amenitieList[item].length > 0 &&
                  amenitieList[item].map((item1, key1) => {
                    return (
                      // <span key={key + "_" + key1}>
                      //   {icon[item1["iconPath"]] || icon.location} {item1["name"]}
                      // </span>
                      <div className="col-sm-4 col-md-4 pt-2 pb-2">
                        <span key={key + "_" + key1}>
                          {item1["iconPath"] != null ? <img src={item1["iconPath"]} alt=""></img> : null} <b className="normal-text">{item1["name"]}</b>
                        </span>
                      </div>

                    );
                  })}
              </div>

            </div>
          );
        })}
    </div>
  );
};

const details = (props) => {
  const router = useRouter();
  const { data } = props;
  const [googleVisible, setGoogleVisible] = useState(false);
  // console.log(data);
  let id = 0;
  if (router["query"] && router["query"]["id"]) {
    id = router["query"]["id"];
  }
  const details = {
    name: "",
    location: "",
  };

  let hostName = "";
  let url = "./images/Avatar.jpg";
  if (data["host"] && data["host"]["firstName"] && data["host"]["lastName"]) {
    hostName = data["host"]["firstName"] + ' ' + data["host"]["lastName"]
  }

  if (data["host"] && data["host"]["profilePhotoPath"]) {
    url = data["host"]["profilePhotoPath"];
  }
  let descriptionAvailability = "";
  if (data["city"] && data["descriptionAvailability"]) {
    descriptionAvailability = data["descriptionAvailability"];
  }
  let city = "";
  let country = "";
  if (data["city"] && data["city"]["name"]) {
    city = data["city"]["name"];
    if (data["city"]["state"] && data["city"]["state"]["country"]) {
      country = data["city"]["state"]["country"]["name"]
        ? data["city"]["state"]["country"]["name"]
        : "";
    }
  }
  details.location = city + (country ? ", " + country : "");

  let propertyBedsList = [];
  let uniqBed = [];
  data["propertyBedsList"] &&
    Object.keys(data["propertyBedsList"]).length &&
    Object.keys(data["propertyBedsList"]).map((key) => {
      let item = data["propertyBedsList"][key];
      if (!uniqBed[item["bed_room_id"]]) {
        propertyBedsList[item["bed_room_id"]] = "";
        propertyBedsList[item["bed_room_id"]] +=
          item["bedCount"] + " " + item["name"];
      } else {
        propertyBedsList[item["bed_room_id"]] +=
          ", " + item["bedCount"] + " " + item["name"];
      }
      uniqBed[item["bed_room_id"]] = true;
    });

  const mapStyles = {
    width: "100%%",
    height: "100%%",
  };
  function fetchPlaces(mapProps, map) {
    setGoogleVisible(true)
  }

  let checkIn = ""
  let checkOut = "";

  if (data['propertyAvailabilitySetting'] != undefined) {
    checkIn = data['propertyAvailabilitySetting']['checkInFrom'] + '-' + data['propertyAvailabilitySetting']['checkInTo'];
    checkOut = data['propertyAvailabilitySetting']['checkOutTo'];
  }
  let guestName = (data["accommodatesCount"] == 1 || data["accommodatesCount"] == 0) ? "Guest" : "Guests";
  let bedName = (data["bedCount"] == 1 || data["bedCount"] == 0) ? "Bed" : "Beds";
  let bedRoomName = (data["bedroomCount"] == 1 || data["bedroomCount"] == 0) ? "Bedroom" : "Bedrooms";
  let bathRoomName = (data["bathroomCount"] == 1 || data["bathroomCount"] == 0) ? "Bath" : "Baths";

  const gotoProFile = () => {
    router.push('/user?id=' + data["user"]["id"]);
  }
  return (
    <div className="d-flex flex-row-reverse row" style={{ marginTop: 50 }}>
      <div className="col-md-4 col-sm-12">
        <div className="section titleDisplay">
          <h2 className="fc-dark ff-heebo fw-600 m-0 mb-3 title-2x">
            {data["name"]}
          </h2>
          <div className={s.info}>
            <span className={s["normal-text-bold"]}>
              {icon.location} <b className="normal-text">{details["location"]}</b>
            </span>
            {/* <span>{icon.star} 500(0)</span> */}
          </div>
          <div className={s.info}>
            <span className="normal-text">
              {icon.person} {data["accommodatesCount"]} {guestName}
            </span>
            <span className="normal-text">
              {icon.bed} {data["bedCount"]} {bedName}
            </span>
            <span className="normal-text">
              {icon.bedroom} {data["bedroomCount"]} {bedRoomName}
            </span>
            <span className="normal-text">
              {icon.bath} {data["bathroomCount"]} {bathRoomName}
            </span>
          </div>
          <hr className={s["divider"]} />
          <div>
            <More line={2} lineHeight={30} className="showMore">
              <p style={{ whiteSpace: "pre-wrap" }}>{data["descriptionSummery"]}</p>
            </More>
          </div>
        </div>

        <CardForm data={data} />
      </div>
      <div className="col-md-8 col-sm-12">
        <div className="section displayTitle">
          <h2 className="fc-dark ff-heebo fw-600 m-0 mb-3 title-2x">
            {data["name"]}
          </h2>
          <div className={s.info}>
            <span className={s["normal-text-bold"]}>
              {icon.location} <b className="normal-text">{details["location"]}</b>
            </span>
            {/* <span>{icon.star} 500(0)</span> */}
          </div>
          <div className={s.info}>
            <span className="normal-text">
              {icon.person} {data["accommodatesCount"]} {guestName}
            </span>
            <span className="normal-text">
              {icon.bed} {data["bedCount"]} {bedName}
            </span>
            <span className="normal-text">
              {icon.bedroom} {data["bedroomCount"]} {bedRoomName}
            </span>
            <span className="normal-text">
              {icon.bath} {data["bathroomCount"]} {bathRoomName}
            </span>
          </div>
          <hr className={s["divider"]} />
          <div className="pt-3">
            <More line={2} lineHeight={30} className="showMore">
              <p style={{ whiteSpace: "pre-wrap" }}>{data["descriptionSummery"]}</p>
            </More>
          </div>
        </div>
        <div className="section pt-3">
          <div className={s["sub-title"]}>
            Where?
          </div>
          <div className="pt-3" style={{ height: 300, width: "100%", position: "relative" }}>
            {data['latitude'] && data['langitude'] &&
              <Map
                google={props.google}
                style={mapStyles}
                containerStyle={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
                onReady={fetchPlaces}
                center={{
                  lat: data['latitude'],
                  lng: data['langitude'],
                }}
                zoom={15}
                visible={googleVisible}
              >
                <Marker
                  position={{
                    lat: data['latitude'],
                    lng: data['langitude'],
                  }}
                />
              </Map>
            }
          </div>
          <div className="pt-3 pb-2"><b className={s["normal-text"]}>{data['descriptionNeighborhood']}</b></div>
        </div>
        <hr className={s["divider"]} />
        <div className="section pt-3">
          <div
            className={s["sub-title"]}
          >
            Your host will be
          </div>
          <div className="d-flex pt-3">
            <div>
              <Avatar
                shape="circle"
                style={{
                  height: "100px", width: "100px", border: "1px solid #ddd",
                  background: "#ddd"
                }}
                src={url}
              />
            </div>
            <div
              style={{
                paddingLeft: 30,
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className={s.info, "pt-4"}>
                <span className="pt-5" >
                  <a onClick={gotoProFile}><b className={s["user-name"]}>{hostName}</b></a>
                </span>
                {/* <span>{icon.star} 0</span> */}
              </div>
              <p className="normal-text pt-2">
                {descriptionAvailability}
              </p>
              {/* <p>Cancún, Mexico · Joined in April 2011</p> */}
              {/* <Button type="primary">Message the host</Button> */}
            </div>
          </div>
          {/* <div style={{ paddingTop: 25 }}>
            <More line={2} lineHeight={30} className="showMore">
              Officia dolor cillum et eu reprehenderit. Voluptate est non sint
              Lorem commodo officia Lorem minim quis adipisicing aliquip culpa
              elit. Reprehenderit ea adipisicing aliqua fugiat irure dolor
              pariatur do consectetur. Officia dolor cillum et eu reprehenderit.
              Voluptate est non sint Lorem commodo officia Lorem minim quis
              adipisicing aliquip culpa elit. Reprehenderit ea adipisicing
              aliqua fugiat irure dolor pariatur do consectetur.
            </More>
          </div> */}
        </div>
        <hr className={s["divider"]} />
        <div className="section pt-3">
          <div
            className={s["sub-title"]}
          >
            Amenities
          </div>

          <More line={3} lineHeight={100}>
            <Amenities data={data["amenities"]} />
          </More>
        </div>
        <div className="section pt-3">
          <div
            className={s["sub-title"]}
          >
            Rooms & Beds
          </div>
          <div className="pt-3">
            {propertyBedsList.length > 0 &&
              propertyBedsList.map((item, key) => {
                return (
                  <div className="bed-card" key={key}>
                    <span>{icon.bedroom2}</span>
                    <p className={s["user-name"]} style={{ fontWeight: "500" }}>
                      {key == 0 ? "Common spaces" : "Bedroom " + key}
                    </p>
                    <p className={s["normal-text"]} style={{ fontWeight: "500" }}>{item}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="section pt-3">
          <div
            className={s["sub-title"]}
          >
            Availability
          </div>
          <div className="pt-3">
            <div
              style={{ width: 300, border: "1px solid #d9d9d9", borderRadius: 4 }}
            >
              {data["calenderVOList"] && (
                <Calendar propsVal={data["calenderVOList"]} />
              )}
            </div>
          </div>
        </div>
        <hr className={s["divider"]} />
        <div className="section pt-3">
          <div
            className={s["sub-title"]}
          >
            Know Before You Go
          </div>
          <div className={s.info, "pt-3"}>
            <b className="sub-title-text">Check In:</b>  <b className={s["normal-text"]}>{checkIn}</b>
          </div>
          <div className={s.info}>
            <b className="sub-title-text">Check Out:</b>  <b className={s["normal-text"]}>{checkOut}</b>
          </div>
        </div>
        <div className="section pt-3">
          <div
            className={s["sub-title"]}
          >
            House policies
          </div>
          {/* <div className={`${s.info} ${s.amen}`}>
            <ul class="list-unstyled pt-3">
              {data["houseRules"] &&
                data["houseRules"]["propertyHouseRuleList"] &&
                data["houseRules"]["propertyHouseRuleList"].length > 0 &&
                data["houseRules"]["propertyHouseRuleList"].map((item, key) => {
                  if (item["applicable"]) {
                    return (
                      // <span className={s["normal-text-bold"]} key={key}>

                      <li className={s["normal-text"]}>
                        <Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} />
                        &nbsp;{item["houseRule"] && item["houseRule"]["name"]}
                      </li>
                      // </span>
                      // <li><b className="normal-text"></b></li>
                    );
                  } else {
                    return (
                      // <span className={s["normal-text-bold"]} key={key}>

                      <li className={s["normal-text"]}>
                        <Icon type="close" style={{ color: '#FF6304', fontSize: '18px' }} />
                        &nbsp;{item["houseRule"] && item["houseRule"]["name"]}
                      </li>
                      // </span>
                      // <li><b className="normal-text"></b></li>
                    );
                  }
                })}
            </ul>
          </div> */}
          <div className={`${s.info} ${s.amen}`}>
            <ul class="list-unstyled">
              {data["houseRules"] &&
                data["houseRules"]["propertyHouseRuleAdditionalList"] &&
                data["houseRules"]["propertyHouseRuleAdditionalList"].length > 0 &&
                data["houseRules"]["propertyHouseRuleAdditionalList"].map((item, key) => {
                  return (
                    // <span className={s["normal-text"]} key={key}>
                    //   {item["ruleName"]}
                    // </span>
                    <li className={s["normal-text"]}>
                      <div className="d-flex flex-row align-content-start">
                        <div className="align-content-start">
                          <LineOutlined style={{ marginRight: "5px", color: '#FF6304', fontSize: "18px" }} />
                        </div>
                        <div className="pt-1" >{item["ruleName"]}
                        </div>
                      </div>

                    </li>
                  );
                })}
            </ul>
          </div>
          {/* <div style={{ paddingTop: 25 }}>
            <More line={2} lineHeight={30} className="showMore">
              Officia dolor cillum et eu reprehenderit. Voluptate est non sint
              Lorem commodo officia Lorem minim quis adipisicing aliquip culpa
              elit. Reprehenderit ea adipisicing aliqua fugiat irure dolor
              pariatur do consectetur. Officia dolor cillum et eu reprehenderit.
              Voluptate est non sint Lorem commodo officia Lorem minim quis
              adipisicing aliquip culpa elit. Reprehenderit ea adipisicing
              aliqua fugiat irure dolor pariatur do consectetur.
            </More>
          </div> */}
        </div>
        {/* <hr/> */}
        {/* <div className="title" style={{ margin: "40px 0" }}>
          Cancelation Policy
        </div>

        <div style={{ paddingTop: 25 }}>
          <More line={1} lineHeight={30} className="showMore">
            Cancel before 2:00PM on Jan 10 and get a 50% refund, minus the
            service fee.
          </More>
        </div> */}
      </div>

    </div >
  );
};
export default GoogleApiWrapper({
  apiKey: GEOCODE_KEY,
})(details);
