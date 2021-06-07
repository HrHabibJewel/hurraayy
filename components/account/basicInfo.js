import React, { useEffect, useState, useLayoutEffect } from "react";
import { Table, Spin, Calendar } from "antd";
import s from "../../components/host-panel/style.module.css";
import { $axios } from "../../lib/http-service";
import { Card, Form, Input, Button, Select } from "antd";
import Upload from "../ui/upload";
import { getUserInfo } from "../../lib/storage.service";
import { func } from "prop-types";

const edit_icon = (
  <svg
    width="19"
    height="18"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.4376 4H4.15952C3.60802 4 3.07911 4.21071 2.68913 4.58579C2.29916 4.96086 2.08008 5.46957 2.08008 6V20C2.08008 20.5304 2.29916 21.0391 2.68913 21.4142C3.07911 21.7893 3.60802 22 4.15952 22H18.7156C19.2671 22 19.7961 21.7893 20.186 21.4142C20.576 21.0391 20.7951 20.5304 20.7951 20V13"
      stroke="#343434"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.2354 2.50023C19.6491 2.1024 20.2101 1.87891 20.795 1.87891C21.38 1.87891 21.941 2.1024 22.3546 2.50023C22.7682 2.89805 23.0006 3.43762 23.0006 4.00023C23.0006 4.56284 22.7682 5.1024 22.3546 5.50023L12.4772 15.0002L8.31836 16.0002L9.35808 12.0002L19.2354 2.50023Z"
      stroke="#343434"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const card_style = {
  marginTop: 10,
  backgroundColor: "#f3f3f3",
};
const card_style2 = {
  marginTop: 10,
  backgroundColor: "#f3f3f3",
};
const row_text_style = {
  marginTop:-5
}

let dob;
let phoneCountryCode = "";
let phoneOriginalNumber = "";

export default () => {
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDOB, setDOB] = useState(false);
  const [editGender, setEditGender] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState(false);
  const [editGovtID, setEditGovtID] = useState(false);
  const [idFrontImg, setIdFrontImg] = useState(null);
  const [idPassportImg, setIdPassportImg] = useState(null);
  const [idBackImg, setIdBackImg] = useState(null);
  const [editAddress, setEditAddress] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState(null);
  const [gender, setGender] = useState(null);
  const [dateOfbirth, setDateofBirth] = useState(null);
  const [apartment, setapartment] = useState("");
  const [city, setcity] = useState("");
  const [country_id, setcountry_id] = useState(false);
  const [state, setstate] = useState(false);
  const [street, setstreet] = useState("");
  const [zipCode, setzipCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [email, setEmail] = useState(null);
  const [phonePrefix, setPhonePrefix] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [FrontImage, setFrontImage] = useState(null);
  const [PassportImage, setPassportImage] = useState(null);
  const [BackImage, setBackImage] = useState(null);
  const [isPassport, setisPassport] = useState();
  const [currentDate, setCurrentDate] = useState();
  const [submittedDocuments, setSubmittedDocuments] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    getCountry();
    getUserInfo();
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsDesktop(window.innerWidth > 770 ? true : false);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function getCountry() {
    $axios.get("/countries").then((resp) => {
      if (resp && resp.status == 200) {
        setCountryList(resp.data);
      }
    });
  }
  function getUserInfo() {
    // var userObj = JSON.parse(localStorage.getItem("user"));
    // if (userObj !== null) {
    //   // setName(userObj.name);
    //   setEmail(userObj.username);
    // }

    $axios.get("/account/current-user").then((resp) => {
      if (resp && resp.status == 200) {
        //console.log(resp.data);
        setUserInfo(resp.data);
        setGender(resp.data.gender);
        setEmail(resp.data.emailAddress);
        setPhoneNumber(resp.data.phoneNumber);
        setPhoneNumberPrefix(resp.data.phoneNumberPrefix);
        if (resp.data.phoneNumber !== null) {
          phoneCountryCode = resp.data.phoneNumber.substring(0, 3);
          phoneOriginalNumber = resp.data.phoneNumber.substring(2, 20);
        }

        setFirstName(resp.data.firstName);
        setLastName(resp.data.lastName);
        setFirstName(resp.data.firstName);
        // console.log("resp.data.dateOfBirth", resp.data.dateOfBirth);
        setCurrentDate(resp.data.dateOfBirth);
        var date = new Date(resp.data.dateOfBirth);
        // console.log("date",date);
        var day = date.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        var month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        var year = date.getFullYear();
        dob = year + "-" + month + "-" + day;
        setDateofBirth(dob);

        if (resp.data.address != null) {
          //console.log("country", resp.data.address);
          setapartment(resp.data.address.apartment);
          setcity(resp.data.address.city);
          setcountry_id(resp.data.address.countryVO.id);
          setstate(resp.data.address.state);
          setstreet(resp.data.address.street);
          setzipCode(resp.data.address.zipCode);
        }

        if (resp.data.documents != null && resp.data.documents.length > 0) {
          // console.log("resp.data.documents[0].documentType",resp.data.documents[0].documentType);
          onchangetype(resp.data.documents[0].documentType);
          setSubmittedDocuments(resp.data.documents);
          for (var i = 0; i < resp.data.documents.length; i++) {
            // console.log("path", <img src={resp.data.documents[i].documentPath}/> );
            if (resp.data.documents[i].documentType == "PASSPORT") {
              setisPassport(true);
              let path = {
                photoPath: resp.data.documents[i].documentPath,
              };

              setIdPassportImg(path);
            } else if (
              resp.data.documents[i].documentType == "DRIVING_LICENSE" ||
              resp.data.documents[i].documentType == "NATIONAL_ID"
            ) {
              var vPath = resp.data.documents[i].documentPath;
              var n = vPath.search("FRONT");
              //console.log("index", n);
              if (n != -1) {
                //n == -1 means the path is not for FRONT image. or FRONT word is not present in the path string
                let path = {
                  photoPath: resp.data.documents[i].documentPath,
                };
                setIdFrontImg(path);
              } else {
                let path2 = {
                  photoPath: resp.data.documents[i].documentPath,
                };
                setIdBackImg(path2);
              }
            }
          }
        }
      }
    });
  }

  const updateName = () => {
    // console.log(firstName + ' ' + lastName);
    var obj = {
      firstName: firstName,
      lastName: lastName,
    };
    obj = JSON.stringify(obj);
    $axios.put("/account", obj).then((resp) => {
      if (resp && resp.status == 200) {
        disableEditName();
      }
    });
    setEditName(false);
  };

  const updateDOB = () => {
    var obj = {
      dateOfBirth: dateOfbirth,
    };
    obj = JSON.stringify(obj);
    $axios.put("/account", obj).then((resp) => {
      if (resp && resp.status == 200) {
        disableDOB(null);
      }
    });
    setDOB(false);
  };
  const updateDocument = () => {
    let frontFormData = new FormData();
    let backFormData = new FormData();

    if (documentType === "PASSPORT") {
      frontFormData.append("file", PassportImage[0]);
      frontFormData.append("DocumentType", documentType);
      frontFormData.append("ImageSide", "FRONT");
      $axios
        .post("/account/upload-documents", frontFormData)
        .then(function (resp) {
          if (resp && resp.status == 200) {
            //console.log("Success!", resp);
          }
        });
    } else {
      frontFormData.append("file", FrontImage[0]);
      backFormData.append("file", BackImage[0]);

      frontFormData.append("DocumentType", documentType);
      backFormData.append("DocumentType", documentType);

      frontFormData.append("ImageSide", "FRONT");
      backFormData.append("ImageSide", "BACK");

      $axios
        .post("/account/upload-documents", frontFormData)
        .then(function (resp) {
          if (resp && resp.status == 200) {
            //console.log('Success!');
          }
        });
      $axios
        .post("/account/upload-documents", backFormData)
        .then(function (resp) {
          if (resp && resp.status == 200) {
            // console.log('Success!');
          }
        });
    }

    setEditGovtID(false);
  };
  const updatepPhoneNo = () => {
    var obj = {
      phoneNumber: phoneNumber,
      phoneNumberPrefix: phoneNumberPrefix,
    };
    // setPhoneNumber(phonePrefix + phoneNumber);
    setPhoneNumber(phoneNumber);
    obj = JSON.stringify(obj);
    $axios.put("/account", obj).then((resp) => {
      if (resp && resp.status == 200) {
        disableEditPhoneNumber(null);
      }
    });
    setEditPhoneNumber(false);
  };
  const updateAdress = () => {
    var obj = {
      address: {
        apartment: apartment,
        city: city,
        country_id: Number(country_id),
        state: state,
        street: street,
        zipCode: zipCode,
      },
    };
    obj = JSON.stringify(obj);
    //console.log(obj);
    $axios.put("/account", obj).then((resp) => {
      if (resp && resp.status == 200) {
        disableEditAddress(null);
      }
    });

    setEditAddress(false);
  };

  const updateGender = () => {
    var obj = {
      gender: gender,
    };
    obj = JSON.stringify(obj);
    // console.log(obj);
    $axios.put("/account", obj).then((resp) => {
      if (resp && resp.status == 200) {
        disableEditGender(null);
      }
    });
    setEditGender(false);
  };
  const enableEditName = (e) => {
    setEditName(true);
  };
  const disableEditName = (e) => {
    setEditName(false);
  };
  const enableDOB = (e) => {
    setDOB(true);
  };
  const disableDOB = (e) => {
    setDOB(false);
  };
  const enableEditGender = (e) => {
    setEditGender(true);
  };
  const disableEditGender = (e) => {
    setEditGender(false);
  };
  const enableEditPhoneNumber = (e) => {
    setEditPhoneNumber(true);
  };
  const disableEditPhoneNumber = (e) => {
    setEditPhoneNumber(false);
  };
  const enableEditGovtID = (e) => {
    setEditGovtID(true);
  };
  const disableEditGovtID = (e) => {
    setEditGovtID(false);
  };

  const onChangeDocuments = () => {
    let pSubmittedDocuments = [];
    let obj = {
      documentType: documentType,
    };
    pSubmittedDocuments.push(obj);
    setSubmittedDocuments(pSubmittedDocuments);
  };
  const idFrontImgUpload = (img) => {
    setIdFrontImg(img[0]);
    onChangeDocuments();
  };
  const idPassportImgUpload = (img) => {
    setIdPassportImg(img[0]);
    onChangeDocuments();
  };
  const idBackImgUpload = (img) => {
    setIdBackImg(img[0]);
    onChangeDocuments();
  };
  const enableEditAddress = (e) => {
    setEditAddress(true);
  };
  const disableEditAddress = (e) => {
    setEditAddress(false);
  };
  const onchangetype = (e) => {
    //console.log("drop down", e);
    setDocumentType(e);

    if (e === "PASSPORT") {
      setisPassport(true);
      //console.log("is passport", isPassport);
    } else {
      setisPassport(false);
    }
  };
  return (
    <div className="row">
      <div className="col-sm-12">
        <Spin spinning={loading} tip="Loading...">
          <div className="row" style={{marginTop:20}}>
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              {editName ? (
                <div></div>
              ) : (
                <Card hoverable className={`${s["cardstyle"]}`} size="small"
                >
                  <div className="row" style={row_text_style}>
                    <div className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                      <label>
                        <b className={`${s["account-title"]}`}>Name</b>
                      </label>
                    </div>
                    <div className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                    <div className={isDesktop ? "col-sm-4" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':160}}>
                      <span className={`${s["account-value"]}`}>{firstName + " " + lastName}
                      </span>
                    </div>

                    {isDesktop? 
                    <div className="col-sm-4" style={{marginLeft:0}}>
                      <a
                        onClick={enableEditName}
                        style={{ textAlign: "right" }}
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                    </div> : 
                    <a
                        onClick={enableEditName}
                        style={{ textAlign: "right" }}
                        className="col-sm-12"
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                   }
                  </div>
                </Card>
              )}

              {editName ? (
                <Card hoverable style={card_style2} size="small">
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        <b className={`${s["account-title"]}`}>Name</b>
                      </label>
                    </div>
                    <div className="col-sm-7">
                      <div className="row">
                        <div className="col-sm-6">
                          <label className={`${s["account-value"]}`}>First name</label>
                          <Form.Item>
                            <Input
                              onChange={(e) => setFirstName(e.target.value)}
                              value={firstName}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-sm-6">
                        <label className={`${s["account-value"]}`}>Last name</label>
                          <Form.Item>
                            <Input
                              onChange={(e) => setLastName(e.target.value)}
                              value={lastName}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="row" style={{ marginLeft: 3 }}>
                        <label className={`${s["account-value"]}`}>Name should match your ID card</label>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div
                        style={isDesktop? { position: "absolute", bottom: 0, right: 0 }:{ position: "inherit", bottom: 0, left: 125 }}
                      >
                        <div className="d-flex">
                          <a>
                            <Button
                              onClick={disableEditName}
                              className={s.cancleButton}
                              type="link"
                              style={{ color: "#000000" }}
                            >
                              <b>Cancel</b>
                            </Button>
                          </a>
                          <a style={{ marginLeft: 10 }}>
                            <Button
                              onClick={updateName}
                              type="link"
                              className={s.EditButton}
                            >
                              <b>Save</b>{" "}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              {editDOB ? (
                <div></div>
              ) : (
                <Card className={`${s["cardstyle"]}`} size="small" hoverable>
                  <div className="row"  style={row_text_style}>
                    <div  className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                      <label>
                        <b className={`${s["account-title"]}`}>Date of Birth</b>
                      </label>
                    </div>
                    <div  className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                    <div  className={isDesktop ? "col-sm-4" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':160}}>
                      <span className={`${s["account-value"]}`}>{dateOfbirth != null ? dateOfbirth : ""}</span>
                    </div>
                    {isDesktop? 
                      <div className="col-sm-4" style={{marginLeft:0}}>
                      <a
                        onClick={enableDOB}
                        style={{ textAlign: "right" }}
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                      </div> : 
                      <a
                        onClick={enableDOB}
                        style={{ textAlign: "right" }}
                        className="col-sm-12"
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                    }
                  </div>
                </Card>
              )}

              {editDOB ? (
                <Card style={card_style2} size="small" hoverable>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        <b className={`${s["account-title"]}`}>Date of Birth</b>
                      </label>
                    </div>
                    <div className="col-sm-7">
                      <div className="row">
                        <div className="col-sm-6">
                          <Form.Item>
                            <Input
                              type="date"
                              onChange={(e) => setDateofBirth(e.target.value)}
                              value={dateOfbirth}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div
                        style={{ position: "absolute", bottom: 0, right: 0 }}
                      >
                        <div className="d-flex">
                          <a>
                            <Button
                              onClick={disableDOB}
                              className={s.cancleButton}
                              type="link"
                              style={{ color: "#000000" }}
                            >
                              <b>Cancel</b>
                            </Button>
                          </a>
                          <a style={{ marginLeft: 10 }}>
                            <Button
                              onClick={updateDOB}
                              type="link"
                              className={s.EditButton}
                            >
                              <b>Save</b>{" "}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              {editGender ? (
                <div></div>
              ) : (
                <Card className={`${s["cardstyle"]}`} size="small" hoverable>
                  <div className="row"  style={row_text_style}>
                    <div  className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                      <label>
                        <b className={`${s["account-title"]}`}>Gender</b>
                      </label>
                    </div>
                    <div  className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                    <div className={isDesktop ? "col-sm-4" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':160}}>
                      <span className={`${s["account-value"]}`}>
                        {gender != null ? 
                        gender == "MALE"?"Male":gender=="FEMALE"?"Female":gender=="OTHER"?"Other":"N/A"
                        : ""}
                      </span>
                    </div>

                    {isDesktop? 
                      <div className="col-sm-4" style={{marginLeft:0}}>
                      <a
                        onClick={enableEditGender}
                        style={{ textAlign: "right" }}
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                      </div> : 
                      <a
                        onClick={enableEditGender}
                        style={{ textAlign: "right" }}
                        className="col-sm-12"
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                    }
                  </div>
                </Card>
              )}

              {editGender ? (
                <Card style={card_style2} size="small" hoverable>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        <b className={`${s["account-title"]}`}>Gender</b>
                      </label>
                    </div>
                    <div className="col-sm-7">
                      <div className="row">
                        <div className="col-sm-6">
                          <Form.Item>
                            <Select
                              onChange={setGender}
                              className="col-sm-12"
                              value={gender}
                            >
                              <Select.Option value="MALE">Male</Select.Option>
                              <Select.Option value="FEMALE">
                                Female
                              </Select.Option>
                              <Select.Option value="OTHERS">
                                Other
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div
                        style={{ position: "absolute", bottom: 0, right: 0 }}
                      >
                        <div className="d-flex">
                          <a>
                            <Button
                              onClick={disableEditGender}
                              className={s.cancleButton}
                              type="link"
                              style={{ color: "#000000" }}
                            >
                              <b>Cancel</b>
                            </Button>
                          </a>
                          <a style={{ marginLeft: 10 }}>
                            <Button
                              onClick={updateGender}
                              type="link"
                              className={s.EditButton}
                            >
                              <b>Save</b>{" "}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              {editPhoneNumber ? (
                <div></div>
              ) : (
                <Card size="small" hoverable style={isDesktop ? {height:40,marginTop:10,backgroundColor:"#f3f3f3"} : {height:75,marginTop:10,backgroundColor:"#f3f3f3"}}>
                  <div className="row"  style={row_text_style}>
                    <div className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                      <label>
                        <b className={`${s["account-title"]}`}>Phone Number</b>
                      </label>
                    </div>
                    <div className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                    <div className={isDesktop ? "col-sm-4" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':160}}>
                      <span className={`${s["account-value"]}`}>
                        {phoneNumber != null
                          ? phoneNumberPrefix + " " + phoneNumber
                          : ""}
                      </span>
                    </div>

                    {isDesktop? 
                      <div className="col-sm-4" style={{marginLeft:0}}>
                      <a
                        onClick={enableEditPhoneNumber}
                        style={{ textAlign: "right" }}
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                      </div> : 
                      <a
                        onClick={enableEditPhoneNumber}
                        style={{ textAlign: "right",marginTop:-10 }}
                        className="col-sm-12"
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                    }
                  </div>
                </Card>
              )}

              {editPhoneNumber ? (
                <Card style={card_style2} size="small" hoverable>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        <b className={`${s["account-title"]}`}>Phone Number</b>
                      </label>
                    </div>
                    <div className="col-sm-7">
                      <div className="row">
                        <div className="col-sm-6">
                          <Form.Item>
                            <Select
                              onChange={setPhoneNumberPrefix}
                              className="col-sm-12"
                              value={phoneNumberPrefix}
                            >
                              <Select.Option value="">
                                Please select your country!
                              </Select.Option>
                              {countryList.length > 0 &&
                                countryList.map((item, key) => {
                                  return (
                                    <Select.Option
                                      key={key}
                                      value={
                                        item.name + " (+" + item.phoneCode + ")"
                                      }
                                    >
                                      {item.name + "(+" + item.phoneCode + ")"}
                                    </Select.Option>
                                  );
                                })}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className="col-sm-6">
                          <Form.Item>
                            <Input
                              type="number"
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              //value={Number(phoneOriginalNumber) !== 0 ? Number(phoneOriginalNumber) : null}
                              value={phoneNumber}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div
                        style={{ position: "absolute", bottom: 0, right: 0 }}
                      >
                        <div className="d-flex">
                          <a>
                            <Button
                              onClick={disableEditPhoneNumber}
                              className={s.cancleButton}
                              type="link"
                              style={{ color: "#000000" }}
                            >
                              <b>Cancel</b>
                            </Button>
                          </a>
                          <a style={{ marginLeft: 10 }}>
                            <Button
                              onClick={updatepPhoneNo}
                              type="link"
                              className={s.EditButton}
                            >
                              <b>Save</b>{" "}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              <Card style={isDesktop ? {height:40,marginTop:10,backgroundColor:"#f3f3f3"} : {height:60,marginTop:10,backgroundColor:"#f3f3f3"}} size="small" hoverable>
                <div className="row"  style={row_text_style}>
                  <div className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                    <label>
                      <b className={`${s["account-title"]}`}>Email Address</b>
                    </label>
                  </div>
                  <div className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                  <div className={isDesktop ? "col-sm-4" : ""} style={{marginLeft: isDesktop ? 0 : 10}}>
                    <span className={`${s["account-value"]}`}>{email}</span>
                  </div>

                  <div className="col-sm-4"></div>
                </div>
              </Card>
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              {editGovtID ? (
                <div></div>
              ) : (
                <Card className={`${s["cardstyle"]}`} size="small" hoverable>
                  <div className="row"  style={row_text_style}>
                    <div className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                      <label>
                        <b className={`${s["account-title"]}`}>Government ID</b>
                      </label>
                    </div>
                    <div className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                    <div className={isDesktop ? "col-sm-4" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':160}}>
                      {submittedDocuments != null &&
                      submittedDocuments.length > 0 ? (
                        <span className={`${s["account-value"]}`}>
                          {submittedDocuments[0].documentType == "NATIONAL_ID" ? "National ID" 
                          : submittedDocuments[0].documentType == "DRIVING_LICENSE"? "Driving License"
                          : submittedDocuments[0].documentType == "PASSPORT"?"Passport":"N/A"}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    {isDesktop? 
                      <div className="col-sm-4" style={{marginLeft:0}}>
                      <a
                        onClick={enableEditGovtID}
                        style={{ textAlign: "right" }}
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                      </div> : 
                      <a
                        onClick={enableEditGovtID}
                        style={{ textAlign: "right",marginTop:-25 }}
                        className="col-sm-12"
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                    }
                  </div>
                </Card>
              )}

              {editGovtID ? (
                <Card style={card_style2} size="small" hoverable>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        <b className={`${s["account-title"]}`}>Government ID</b>
                      </label>
                    </div>
                    <div className="col-sm-7">
                      <div className="row">
                        <div className="col-sm-6">
                          <label className={`${s["account-value"]}`}>Choose an ID type to upload</label>
                          <Form.Item>
                            <Select
                              onChange={onchangetype}
                              className="col-sm-12"
                              id="documentTypeID"
                              value={documentType}
                            >
                              <Select.Option value="NATIONAL_ID">
                                National ID
                              </Select.Option>
                              <Select.Option value="DRIVING_LICENSE">
                                Driving License
                              </Select.Option>
                              <Select.Option value="PASSPORT">
                                Passport
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      {isPassport ? (
                        <div className="row">
                          <div className="col-sm-12">
                            <p className={`${s["account-value"]}`}>
                              Upload photo page of passport and it has to be
                              clear & good quality
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-sm-12">
                            <p className={`${s["account-value"]}`}>
                              Upload photo of both sides of your ID photo has to
                              be clear & good quality
                            </p>
                          </div>
                        </div>
                      )}

                      {isPassport ? (
                        <div className="row">
                          <div className="col-sm-12">
                            {idPassportImg ? (
                              <img
                                style={{ height: 300, width: 250 }}
                                src={idPassportImg.photoPath}
                              />
                            ) : (
                              <Upload
                                onChange={setPassportImage}
                                onPreview={idPassportImgUpload}
                              >
                                Upload photo page of passport <br /> JEPG or PNG
                              </Upload>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-sm-12">
                            {idFrontImg ? (
                              // <img
                              //   style={{ height: 200, width: 250 }}
                              //   src={idFrontImg.photoPath}
                              // />
                              <Upload
                                onChange={setFrontImage}
                                onPreview={idFrontImgUpload}
                              >
                                <img
                                  style={{ height: 200, width: 250 }}
                                  src={idFrontImg.photoPath}
                                />
                              </Upload>
                            ) : (
                              <Upload
                                onChange={setFrontImage}
                                onPreview={idFrontImgUpload}
                              >
                                Upload front side of ID. <br /> JEPG or PNG
                              </Upload>
                            )}
                          </div>
                          <div className="col-sm-12">
                            {idBackImg ? (
                              // <img
                              //   style={{ height: 200, width: 250 }}
                              //   src={idBackImg.photoPath}
                              // />
                              <Upload
                                onChange={setBackImage}
                                onPreview={idBackImgUpload}
                              >
                                <img
                                  style={{ height: 200, width: 250 }}
                                  src={idBackImg.photoPath}
                                />
                              </Upload>
                            ) : (
                              <Upload
                                onChange={setBackImage}
                                onPreview={idBackImgUpload}
                              >
                                Upload back side of ID. <br /> JEPG or PNG
                              </Upload>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-sm-2">
                      <div
                      style={isDesktop? { position: "absolute", bottom: 0, right: 0 }:{ position: "inherit", bottom: 0, left: 125 }}
                      >
                        {/* style={{ position: "absolute", bottom: 0, right: 0 }}
                      > */}
                        <div className="d-flex">
                          <a>
                            <Button
                              onClick={disableEditGovtID}
                              className={s.cancleButton}
                              type="link"
                              style={{ color: "#000000" }}
                            >
                              <b>Cancel</b>
                            </Button>
                          </a>
                          <a style={{ marginLeft: 10 }}>
                            <Button
                              onClick={updateDocument}
                              type="link"
                              className={s.EditButton}
                            >
                              <b>Save</b>{" "}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="row" style={{marginBottom:20}}>
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              {editAddress ? (
                <div></div>
              ) : (
                <Card
                  // style={{
                  //   marginBottom: 10,
                  // }}
                  style={isDesktop ? {height:40,marginTop:10,marginBottom: 10,backgroundColor:"#f3f3f3"} 
                  : {height:80,marginTop:10,marginBottom: 10,backgroundColor:"#f3f3f3"}}
                  size="small"
                  hoverable
                >
                  <div className="row" style={row_text_style}>
                    <div className={isDesktop ? "col-sm-3" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':90}}>
                      <label>
                        <b className={`${s["account-title"]}`}>Address</b>
                      </label>
                    </div>
                    <div className={isDesktop ? "col-sm-1" : ""} style={{marginLeft: isDesktop ? 0 : 0}}>:</div>
                    <div className={isDesktop ? "col-sm-5" : ""} style={{marginLeft: isDesktop ? 0 : 10, width:isDesktop?'':160}}>
                      <span className={`${s["account-value"]}`}>
                        {apartment != "" ? apartment + "," : ""}{" "}
                        {street != "" ? street + "," : ""}
                        {city != "" ? city + "-" : ""}{" "}
                        {zipCode != "" ? zipCode : ""}{", "}
                        {state != "" ? state:""}
                      </span>
                    </div>
                    {isDesktop? 
                      <div className="col-sm-3" style={{marginLeft:0}}>
                      <a
                        onClick={enableEditAddress}
                        style={{ textAlign: "right" }}
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                      </div> : 
                      <a
                        onClick={enableEditAddress}
                        style={{ textAlign: "right" }}
                        className="col-sm-12"
                      >
                        <p className={s.EditButton}>{edit_icon}</p>
                      </a>
                    }
                    
                  </div>
                </Card>
              )}

              {editAddress ? (
                <Card style={card_style2} size="small" hoverable>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>
                        <b className={`${s["account-title"]}`}>Address</b>
                      </label>
                    </div>
                    <div className="col-sm-7">
                      <div className="row">
                        <div className="col-sm-6">
                          <Form.Item>
                            <span className={`${s["account-value"]}`}>Country/Territory</span>
                            <Select
                              className="col-sm-12"
                              onChange={setcountry_id}
                              value={country_id}
                            >
                              <Select.Option value="">
                                Please select your country!
                              </Select.Option>
                              {countryList.length > 0 &&
                                countryList.map((item, key) => {
                                  return (
                                    <Select.Option
                                      onChange={setcountry_id}
                                      key={key}
                                      value={item.id}
                                    >
                                      {item.name}
                                    </Select.Option>
                                  );
                                })}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className="col-sm-6">
                          <Form.Item>
                          <span className={`${s["account-value"]}`}>City</span>
                            <Input
                              // key={"city"}
                              onChange={(e) => setcity(e.target.value)}
                              value={city}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <Form.Item>
                          <span className={`${s["account-value"]}`}>Street Address</span>
                            <Input
                              // key={"street"}
                              onChange={(e) => setstreet(e.target.value)}
                              value={street}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-sm-6">
                          <Form.Item>
                          <span className={`${s["account-value"]}`}>State/Province</span>
                            <Input
                              // key={"state"}
                              onChange={(e) => setstate(e.target.value)}
                              value={state}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <Form.Item>
                          <span className={`${s["account-value"]}`}>Apartment/Suite etc</span>
                            <Input
                              // key={"apartment"}
                              onChange={(e) => setapartment(e.target.value)}
                              value={apartment}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-sm-6">
                          <Form.Item >
                          <span className={`${s["account-value"]}`}>Post Code/Zip Code</span>
                            <Input
                              // key={"zipCode"}
                              onChange={(e) => setzipCode(e.target.value)}
                              value={zipCode}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div
                        style={{ position: "absolute", bottom: 0, right: 0 }}
                      >
                        <div className="d-flex">
                          <a>
                            <Button
                              onClick={disableEditAddress}
                              className={s.cancleButton}
                              type="link"
                              style={{ color: "#000000" }}
                            >
                              <b>Cancel</b>
                            </Button>
                          </a>
                          <a style={{ marginLeft: 10 }}>
                            <Button
                              onClick={updateAdress}
                              type="link"
                              className={s.EditButton}
                            >
                              <b>Save</b>{" "}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="col-sm-1"></div>
          </div>
        </Spin>
      </div>
    </div>
  );
};
