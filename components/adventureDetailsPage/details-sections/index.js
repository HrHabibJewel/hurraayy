import { Button, Icon, Divider, Avatar, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as icon from "../../icons";
import More from "./showMore";
import s from "./style.module.css";
import CardForm from "./cardForm";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { GEOCODE_KEY } from "../../../lib/constans";
import { Card, Row, Col } from 'antd';
import { $openAxios } from "../../../lib/http-service";


const { RangePicker } = DatePicker;
// export default GoogleApiWrapper({
//   apiKey: GEOCODE_KEY
// })

function checkIfexists(object, prop) {
  if (object.hasOwnProperty(prop)) return `${prop} Exists, proceed to display`;
  else return `${prop} info does not exist`;
}

const details = (props) => {
  const router = useRouter();
  const [googleVisible, setGoogleVisible] = useState(false);
  const { data } = props;
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
  if (data["hostProfile"] && data["hostProfile"]["firstName"] && data["hostProfile"]["lastName"]) {
    hostName = data["hostProfile"]["firstName"] + ' ' + data["hostProfile"]["lastName"]
  }

  if (data["hostProfile"] && data["hostProfile"]["profilePhotoPath"]) {
    url = data["hostProfile"]["profilePhotoPath"];
  }



  let city = "";
  let country = "";
  if (data["city"] && data["city"]["name"]) {
    city = data["city"]["name"];
    if (data["country"] && data["country"]["name"]) {
      country = data["country"]["name"];
    }
  }
  details.location = city + (country ? ", " + country : "");

  /*       provide          */
  let provideStr = "";
  let provide = "";
  let kArr = [];
  let provide1 = [];
  let provieArr = [];
  if (data['adventureProvideGroups']) {
    for (let key in data['adventureProvideGroups']) {
      let groupId = data['adventureProvideGroups'][key]['adventureProvideVO']['name'];
      if (!provieArr[groupId]) {
        provideStr += data['adventureProvideGroups'][key]['adventureProvideVO']['name'] + ", ";
      }
      if (!provide1[groupId]) {
        kArr[groupId] = 0
        provide1[groupId] = [];
        provide1[groupId][kArr[groupId]] = data['adventureProvideGroups'][key]['name']
      } else {
        kArr[groupId]++;
        provide1[groupId][kArr[groupId]] = data['adventureProvideGroups'][key]['name']
      }
      provieArr[groupId] = true;
    }
  }

  /*   durationDescriptions Itinerary */
  let durationDescriptions = [];
  if (data['durationDescriptions']) {
    durationDescriptions = JSON.parse(data['durationDescriptions']);
  }

  let guestBring = "";
  if (data['guestBring']) {
    guestBring = data['guestBring'].replace(/_/g, ", ");
  }

  const mapStyles = {
    width: "100%%",
    height: "100%%",
  };

  const gotoProFile = () => {
    router.push('/user?id=' + data["host"]["id"]);
  }
  function fetchPlaces(mapProps, map) {
    setGoogleVisible(true)
  }

  return (
    <div className="d-flex flex-row-reverse row" style={{ marginTop: 50 }}>
      <div className="col-md-4 col-sm-12 mb-5">
        <div className={`section mb-3 ${s.titleDisplay}`}>
          <h2 className="fc-dark ff-heebo fw-600 m-0 mb-3 title-2x">
            {data["title"]}
          </h2>
          <div className={s.info}>
            {/* <span>{icon.star} 500(0)</span> */}
            <span>
              {icon.location} <b className="normal-text">{details["location"]}</b>
            </span>
          </div>
          <Divider />
        </div>
        <CardForm data={data} />
      </div>

      <div className="col-md-8 col-sm-12">
        <div className={`section mb-3 ${s.displayTitle}`}>
          <h2 className="fc-dark ff-heebo fw-600 m-0 mb-3 title-2x">
            {data["title"]}
          </h2>
          <div className={s.info}>
            {/* <span>{icon.star} 500(0)</span> */}
            <span>
              {icon.location} <b className="normal-text">{details["location"]}</b>
            </span>
          </div>
          <Divider />
        </div>
        { /*         key info     */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Key Information</b>
          </div>
          <div className="pl-4 pt-2">
            <div className="flex-container">
              <div className="flex-item key-info-border">
                <div className="flex-container-inner">
                  <div className="flex-item-inner-left">
                    <span className="key-text">{icon.clock} <b className='key-info-icon-text'>Duration</b> </span>
                  </div>
                  <div className="flex-item-inner-right">
                    <span className="normal-text">{data['duration'] > 1 ? data['duration'] + " days" : data['duration'] + " day"}</span>
                  </div>
                </div>
              </div>
              <div className="flex-item key-info-border">
                <div className="flex-container-inner">
                  <div className="flex-item-inner-left">
                    <span className="key-text">{icon.inclusive} <b className='key-info-icon-text'>Inclusive of</b> </span>
                  </div>
                  <div className="flex-item-inner-right">
                    <span className="normal-text">{provideStr.slice(0, -2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-container">
              <div className="flex-item key-info-border">
                <div className="flex-container-inner">
                  <div className="flex-item-inner-left">
                    <span className="key-text">{icon.moderate} <b className='key-info-icon-text'>Activity level </b> </span>
                  </div>
                  <div className="flex-item-inner-right">
                    <span className="normal-text">{data['activityLevelExpectation'] || ""}</span>
                  </div>
                </div>
              </div>
              <div className="flex-item key-info-border">
                <div className="flex-container-inner">
                  <div className="flex-item-inner-left">
                    <span className="key-text">{icon.commentary} <b className='key-info-icon-text'>Commentary </b> </span>
                  </div>
                  <div className="flex-item-inner-right">
                    <span className="normal-text">{(data['language'] && data['language']['name']) ? data['language']['name'] : ""}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-12 col-xl-6 d-flex flex-column mb-2 ">
                <div className="flex-fill p-4 key-info-card">
                  <div className="d-flex flex-row">
                    <div className="key-info-col col-md-6 col-lg-5 col-sm-6 d-flex">
                      <span className="key-info-left align-self-center">{icon.moderate} <b className='key-info-icon-text'>Activity level</b> </span>
                    </div>
                    <div className="col-md-8 col-sm-6 d-flex justify-content-center">
                      <span className="key-value align-self-center">{data['activityLevelExpectation'] || ""}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-6 d-flex flex-column mb-2 ">
                <div className="flex-fill p-4 key-info-card">
                  <div className="d-flex flex-row">
                    <div className="key-info-col col-md-6 col-lg-5 col-sm-6 d-flex">
                      <span className="key-info-left align-self-center">{icon.commentary} <b className='key-info-icon-text'>Commentary</b> </span>
                    </div>
                    <div className="col-md-8 col-sm-6 d-flex justify-content-center">
                      <span className="key-value align-self-center">{(data['language'] && data['language']['name']) ? data['language']['name'] : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

          </div>
        </div>
        { /*         Why Hurraayy     */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Why Hurraayy?</b></div>
          <div className='pl-4 pt-2'>
            <ul class="list-unstyled">
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >Payments are handled by secure platform</div>
                </div>
              </li>
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start "><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >Our hosts are experts in ther domain</div>
                </div>
              </li>
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >Packages are designed to give you excellent experiences</div>
                </div>
              </li>
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >Best price guranteed</div>
                </div>
              </li>
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >24 hours live support</div>
                </div>
              </li>
              {/* <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;Packages are designed to give you excellent experienees</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li> */}
            </ul>
          </div>
        </div>
        { /*         Your Adventure      */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Your Adventure</b>
          </div>
          <div className='pl-4 pt-2'>
            <More line={17} lineHeight={10} className="showMore">
              {/* {data['aboutYourSelf']} */}
              <p style={{ whiteSpace: "pre-wrap" }}>{data['aboutYouWill']}</p>
            </More>
          </div>
        </div>
        { /*         Inclusive of      */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Inclusive of</b>
          </div>
          <div className='pl-4 pt-2'>
            <div className="row">
              {
                provide1 && Object.keys(provide1).length > 0 && Object.keys(provide1).map((item, key) => {
                  return (
                    <div className="col-sm-6 col-md-4" key={key}>
                      <h6><span className={s["inclusive-icon"]}>&nbsp;</span><b style={{ paddingLeft: "5px" }} className={s["sub-title"]}>{item}</b></h6>
                      <ul class="pl-2 list-unstyled">
                        {
                          provide1[item] && provide1[item].length && provide1[item].map((item1, key1) => {
                            return (
                              <li className={s["normal-text"]} key={key1}>{item1}</li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        { /*         Itinerary      */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Itinerary</b>
          </div>
          <div className='pl-4 pt-2'>
            {
              durationDescriptions && durationDescriptions.map((item, key) => {
                return (
                  <div className="sinlge-adventure-itinerary" key={key}>
                    <b className={s["sub-title"]}>Day {item['key']}</b>
                    <p className="normal-text">{item['text']}</p>
                  </div>
                );
              })
            }
          </div>

        </div>
        { /*         Health, Safety & Covid-19      */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Health, Safety & Covid-19</b>
          </div>
          <div className='pl-4 pt-2'>
            <p className={s["normal-text"]}>Hurraayy follows COVID-19 guidelines set by the  World health Organization (WHO) and local health authorities.</p>
            <p className={s["normal-text"]}>This Includes but not limited to :</p>
            <ul class="list-unstyled">
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >All travellers must wear face masks</div>
                </div>
              </li>
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >Safe physical distancing Maintained</div>
                </div>
              </li>
              <li className={s["normal-text"]}>
                <div className="d-flex flex-row align-content-start">
                  <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                  <div className="pl-1" >Places/vehicles/equipments are sanitized properly</div>
                </div>
              </li>
              {/* <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;All travellers must wear face masks</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;Safe physical distancing Maintained</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;Places/vehicles/equipments are sanitize properly</li> */}
            </ul>
          </div>
        </div>
        { /*         Where      */}
        <div className="section mb-4 pt-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Where?</b>
          </div>
          <div className='pl-4 pt-2'>
            <div style={{ height: 300, width: "100%", position: "relative" }}>
              {data['adventureLocaton'] && data['adventureLocaton']['latitude'] && data['adventureLocaton']['longitude'] &&
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
                    lat: data['adventureLocaton']['latitude'],
                    lng: data['adventureLocaton']['longitude'],
                  }}
                  zoom={15}
                  visible={googleVisible}
                >
                  <Marker
                    position={{
                      lat: data['adventureLocaton']['latitude'],
                      lng: data['adventureLocaton']['longitude'],
                    }}
                  />
                </Map>
              }
            </div>
          </div>
        </div>
        { /*         Where      */}
        <div className="section   pb-2" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>The Adventure is Hosted By</b>
          </div>
          <div className='pl-4 pt-2'>
            <div className="d-flex">
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
                <div className={s.info}>
                  <a onClick={gotoProFile}> <b className="text-bold">
                    {hostName}
                  </b>
                  </a>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: 25 }}>
              <More line={2} lineHeight={30} className="showMore">
                {/* {data['aboutYouWill']} */}
                <p style={{ whiteSpace: "pre-wrap" }}>{data['aboutYourSelf']}</p>
              </More>
            </div>
          </div>
        </div>
        { /*         Know Before You Go     */}
        <div className="section pt-4" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Know Before You Go</b>
          </div>
          <div className='pl-4 pt-2'>
            <ul class="list-unstyled">
              <li><span className={s["inclusive-icon"]}>&nbsp;</span><big style={{ paddingLeft: "5px" }} className={s["sub-title"]}>What to bring with you</big><p className="normal-text pl-2">{guestBring}</p></li>
              <li><span className={s["inclusive-icon"]}>&nbsp;</span><big style={{ paddingLeft: "5px" }} className={s["sub-title"]}>Identity Card</big><p className="normal-text pl-2">Bring along your government ID such as national ID, passport or driving license with you as a proof of Identity.</p></li>
              <li><span className={s["inclusive-icon"]}>&nbsp;</span><big style={{ paddingLeft: "5px" }} className={s["sub-title"]}>Guests Informations</big>
                <p className="normal-text pl-2">Group size :{data["minimumGroupSize"]}</p>
                {/* <p className="normal-text pl-2">Childrens under 2 years of age can be brought along with parents without additional fees.</p> */}
              </li>
              <li><span className={s["inclusive-icon"]}>&nbsp;</span><big style={{ paddingLeft: "5px" }} className={s["sub-title"]}>Additional Notes</big>
                <p className="normal-text pl-2">{data['additionalNote']}</p></li>
            </ul>
          </div>
        </div>
        { /*         Responsible Travelling    */}
        <div className="section" style={{ position: "relative" }}>
          <div className={s['title-head']}>
            <span className={s["title-left"]}>&nbsp;</span>
            <b className={s["title"]}>Responsible Travelling</b>
          </div>
          <div className='pl-4 pt-2 '>
            <div className="box-shadow ant-card-body-deatil">
              <h6 className={s["sub-title"]}>Do's</h6>
              <ul class="pl-4 pt-2 list-unstyled">
                <li className={s["normal-text"]}>
                  <div className="d-flex flex-row align-content-start">
                    <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                    <div className="pl-1" >Respect the people, culture and environment of the places you visit.</div>
                  </div>
                </li>
                <li className={s["normal-text"]}>
                  <div className="d-flex flex-row align-content-start">
                    <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                    <div className="pl-1" >Respect local dress codes.</div>
                  </div>
                </li>
                <li className={s["normal-text"]}>
                  <div className="d-flex flex-row align-content-start">
                    <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                    <div className="pl-1" >Eat local foods, experience the local culture and heritage.</div>
                  </div>
                </li>
                {/* <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li>
                <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li>
                <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li> */}
              </ul>
              <h6 className={s["sub-title"]}>Don'ts</h6>
              <ul class="pl-4 pt-2 list-unstyled" style={{ marginBottom: "0px !important" }}>
                <li className={s["normal-text"]}>
                  <div className="d-flex flex-row align-content-start">
                    <div className="align-content-start"><Icon type="close" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                    <div className="pl-1" >Do not throw away your garbage (i.e. water bottles) in tourist places, keep the places clean as much as possible.</div>
                  </div>
                </li>
                <li className={s["normal-text"]}>
                  <div className="d-flex flex-row align-content-start">
                    <div className="align-content-start"><Icon type="close" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                    <div className="pl-1" >Don't be loud in public places.</div>
                  </div>
                </li>
                {/* <li className={s["normal-text"]}><Icon type="close" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp; </li>
                <li className={s["normal-text"]}><Icon type="close" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GoogleApiWrapper({
  apiKey: GEOCODE_KEY,
})(details);
