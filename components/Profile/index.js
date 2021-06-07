import React, { useState, useEffect } from "react";
import {
  Spin,
  Select,
  Col,
  Button,
  Menu,
  Icon,
  Divider,
  Table,
  Input,
  Checkbox,
} from "antd";
import { $axios } from "../../lib/http-service";
import s from "./style.module.css";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { withRouter, useRouter } from "next/router";
import profile from "../../pages/profile";
import { getAuthentication } from "../../lib/utils/utility";

function ProfileHome() {
  const [imageUrl, setImageUrl] = useState("./images/Avatar.jpg");
  const [bioButtonText, setBioButtonText] = useState("");
  const [haveBio, setHaveBio] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editBio, seteditBio] = useState(false);
  const [Bio, setBio] = useState();
  const [Profile, setProfile] = useState(null);
  const [Language, setLanguage] = useState([]);
  const [savedLanguages, setsavedLanguages] = useState([]);
  const [languageString, setlanguageString] = useState("");
  const [loading, setLoading] = useState(true);
  const [Image, setImage] = useState();
  const [selectedLanguages, setSelecedLanguages] = useState(null);
  const [Location, setLocation] = useState("");
  const { TextArea } = Input;
  const [cityList, setCityList] = useState([]);
  const [user, setUser] = useState();
  const userInfo = useSelector((state) => state.auth);
  const router = useRouter();


  useEffect(() => {
    if (!getAuthentication()) {
      router.push("/");
    }
    getCity();
    getProfile();

    if (Profile != null) {
      if (Profile.bio != null) {
        setHaveBio(true);
      }
      if (Profile && Profile["profilePhotoPath"]) {
        setImageUrl(Profile.profilePhotoPath);
      }

      languageStringBuid(Profile.languageVOList);
      // setProvided(Profile.provided);
    }
    getLanguage();
    setBioButtonText(haveBio ? "Edit Bio" : "Add Bio");
    setLoading(false);
  }, []);



  function getCity() {
    $axios.get("/cities").then((resp) => {
      if (resp && resp.status == 200) {
        setCityList(resp.data);
      }
    });
  }

  const getProfile = () => {
    $axios.get("/account/current-user").then((resp) => {
      if (resp && resp.status == 200) {
        setUser(resp.data);
      }
    });
    $axios.get("profile").then((resp) => {
      if (resp && resp.status == 200) {
        setProfile(resp.data);
        if (resp.data.profilePhotoPath) {
          setImageUrl(resp.data.profilePhotoPath);
        }
        var lang = "";
        var LanguageList = [];
        if (resp.data.languageVOList != null) {
          resp.data.languageVOList.forEach((element) => {
            LanguageList.push(Number(element.id));
            lang += element.name + ", ";
          });
          setsavedLanguages(LanguageList);
          lang = lang.slice(0, -2);
          setlanguageString(lang);
        }
      }
    });
  };


  let provided = [];
  if (Profile && Profile["provided"]) {
    provided = Profile["provided"];
  }


  const getLanguage = () => {
    $axios.get("language").then((resp) => {
      if (resp && resp.status == 200) {
        var languageList = [];
        resp.data.forEach((element) => {
          var language = {
            label: element.name,
            value: element.id,
          };
          languageList.push(language);
        });

        setLanguage(languageList);
      }
    });
  };

  const handleImageInputClick = (e) => {
    document.getElementById("imageInput").click();
  };

  const selectImage = (e) => {
    var fileToRead = document.getElementById("imageInput");
    var file = fileToRead.files[0];
    setImage(file);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImageUrl(reader.result);
    };
    reader.onerror = function (error) { };
  };

  const UpdateBio = () => {
    let formData = new FormData();
    if (Bio != null) {
      formData.append("bio", Bio);
    }
    formData.append("file", Image);
    $axios.post("profile", formData).then(function (resp) {
      if (resp && resp.status == 200) {
        setProfile(resp.data);
        setImageUrl(resp.data.profilePhotoPath);
        var lang = "";
        var LanguageList = [];
        if (resp.data.languageVOList != null) {
          resp.data.languageVOList.forEach((element) => {
            LanguageList.push("" + element.id + "");
            lang += element.name + ", ";
          });
          setsavedLanguages(LanguageList);
          lang = lang.slice(0, -2);
          setlanguageString(lang);
        }
        seteditBio(false);
        setBio(null);
      }
    });
  };

  const enableEditMode = (e) => {
    setEditMode(true);
  };
  const enableEditBio = (e) => {
    seteditBio(true);
  };

  const disableEditBio = (e) => {
    seteditBio(false);
  };
  const disableEditMode = (e) => {
    setEditMode(false);
  };

  const onChangeLanguage = (e) => {
    let lang = "";
    e.forEach((element) => {
      lang += element + ",";
    });
    lang = lang.slice(0, -1);
    setSelecedLanguages(lang);
    //console.log(lang


  };

  const getBio = (e) => {
    setBio(e.target.value);
  };

  const getLocation = (e) => {
    setLocation(e.target.value);
  };

  const updateLocationLanguage = () => {
    var obj = {
      languageIds: selectedLanguages,
      location: Location,
    };

    obj = JSON.stringify(obj);
    $axios.put("profile/profile-update", obj).then(function (resp) {
      if (resp && resp.status == 200) {
        setProfile(resp.data);
        var lang = "";
        var LanguageList = [];
        if (resp.data.languageVOList != null) {
          resp.data.languageVOList.forEach((element) => {
            LanguageList.push(Number(element.id));
            lang += element.name + ", ";
          });

          setsavedLanguages(LanguageList);

          lang = lang.slice(0, -2);
          setlanguageString(lang);
        }
        setEditMode(false);
        setSelecedLanguages(null);
        setLocation(null);
      }
    });
  };

  const languageStringBuid = (language) => {
    var lang = "";
    var LanguageList = [];
    if (language != null) {
      language.forEach((element) => {
        LanguageList.push("" + element.id + "");
        lang += element.name + ", ";
      });
      setsavedLanguages(LanguageList);
      lang = lang.slice(0, -2);
      setlanguageString(lang);
    }
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      {loading ? (
        <div style={{ height: "100vh" }}></div>
      ) : (
        <Fragment>
          <div className="container">
            <div className={s["padding"]}>
              <div className="row pt-2">
                <div className="mx-auto d-block">
                  <img
                    src={imageUrl}
                    className={s.ProfileImage}
                    alt="Upload a image"
                  />
                  <div className={s.ImgaeInputBox}>
                    <div className={s.ImgaeInputInside}>
                      <svg
                        width="1.5rem"
                        height="auto"
                        viewBox="0 0 34 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={handleImageInputClick}
                      >
                        <path
                          d="M31.1465 22.809H31.1157V23.059C31.1157 23.546 30.9274 23.976 30.6032 24.3002C30.2791 24.6243 29.849 24.8126 29.3621 24.8126H4.20952C3.72256 24.8126 3.29252 24.6243 2.96839 24.3002C2.64426 23.976 2.45595 23.546 2.45595 23.059V7.70856C2.45595 7.2216 2.64426 6.79155 2.96839 6.46742C3.29252 6.14329 3.72256 5.95499 4.20952 5.95499H10.1586C10.759 5.95499 11.2409 5.47317 11.2409 4.87273V3.97883C11.2409 3.69991 11.342 3.45723 11.5067 3.29253C11.6714 3.12783 11.9141 3.02669 12.193 3.02669H21.4094C21.6884 3.02669 21.931 3.12783 22.0957 3.29253C22.2604 3.45723 22.3616 3.69991 22.3616 3.97883V4.87273C22.3616 5.47317 22.8434 5.95499 23.4438 5.95499H29.3929C29.8799 5.95499 30.3099 6.14329 30.634 6.46742C30.9582 6.79155 31.1465 7.2216 31.1465 7.70856V22.809ZM32.0973 4.97334C31.4033 4.24848 30.4457 3.8213 29.3621 3.8213H24.4896C24.4437 3.0562 24.1197 2.32934 23.5871 1.82665C23.0179 1.25873 22.2469 0.923828 21.4094 0.923828H12.1622C11.294 0.923828 10.5216 1.25874 9.951 1.82931C9.42437 2.35594 9.09745 3.05569 9.05119 3.8213H4.20952C3.12484 3.8213 2.16646 4.2493 1.47228 4.97543C0.783509 5.66524 0.322266 6.65111 0.322266 7.70856V23.059C0.322266 24.1437 0.750268 25.1021 1.4764 25.7963C2.16622 26.485 3.15208 26.9463 4.20952 26.9463H29.3621C30.4468 26.9463 31.4051 26.5183 32.0993 25.7921C32.7881 25.1023 33.2493 24.1165 33.2493 23.059V7.70856C33.2493 6.62493 32.8222 5.66736 32.0973 4.97334Z"
                          fill="#616161"
                          stroke="#616161"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M22.4541 15.4144H22.4541L22.4542 15.4191C22.4836 16.9779 21.8372 18.3931 20.8025 19.4284C19.7663 20.4343 18.3484 21.0826 16.7859 21.0826C15.2234 21.0826 13.8054 20.4343 12.7693 19.4284C11.7372 18.3956 11.1176 16.9798 11.1176 15.4144C11.1176 13.8518 11.7659 12.4339 12.7719 11.3978C13.8046 10.3656 15.2205 9.74611 16.7859 9.74611C18.3484 9.74611 19.7663 10.3944 20.8025 11.4003C21.8346 12.4331 22.4541 13.8489 22.4541 15.4144ZM16.7859 7.55078C14.6206 7.55078 12.6468 8.44228 11.2457 9.84335C9.81326 11.2758 8.95312 13.219 8.95312 15.3835C8.95312 17.5488 9.84463 19.5227 11.2457 20.9237C12.6781 22.3562 14.6214 23.2163 16.7859 23.2163C18.9511 23.2163 20.925 22.3248 22.3261 20.9237C23.7585 19.4913 24.6186 17.548 24.6186 15.3835C24.6186 13.2183 23.7271 11.2444 22.3261 9.84335C20.925 8.44228 18.9511 7.55078 16.7859 7.55078Z"
                          fill="#616161"
                          stroke="#616161"
                          strokeWidth="0.5"
                        />
                        <path
                          d="M27.7565 11.0423C28.7287 11.0423 29.5169 10.2541 29.5169 9.28187C29.5169 8.30964 28.7287 7.52148 27.7565 7.52148C26.7842 7.52148 25.9961 8.30964 25.9961 9.28187C25.9961 10.2541 26.7842 11.0423 27.7565 11.0423Z"
                          fill="#616161"
                          stroke="#616161"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  id="imageInput"
                  multiple={false}
                  onChange={selectImage}
                  className={s.FileInput}
                ></input>
              </div>
              <div className="row">
                <div className="mx-auto d-block text-center">
                  <p className={s.Name}>
                    {user != null ? user.firstName + " " + user.lastName : null}
                  </p>
                  <div className="px-3">
                    <p
                      className="normal-text"
                      style={{ display: editBio ? "none" : "inline" }}
                    >
                      {Profile != null ? Profile.bio : null}
                    </p>
                  </div>

                  <div className="px-3" >
                    {editBio ? (
                      <TextArea
                        defaultValue={Profile != null ? Profile.bio : null}
                        id="bio"
                        onChange={getBio}
                        style={{ display: editBio ? "inline" : "none" }}
                        rows={4}
                        cols={100}
                      />
                    ) : null}
                    {editBio ? null : (
                      <div className="pt-2">
                        <a onClick={enableEditBio}>
                          <p className={s.TextButton}>{bioButtonText}</p>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {editBio ? (
                <div className="d-flex flex-row-reverse pt-2">
                  <a>
                    {" "}
                    <div onClick={UpdateBio} className={s.EditButton}>
                      Save{" "}
                    </div>
                  </a>
                  <a>
                    <div onClick={disableEditBio} className={s.cancleButton}>
                      Cancel
                  </div>
                  </a>
                </div>
              ) : null}
              <Divider style={{ margin: "4px !important" }}></Divider>
            </div>
            <div className={s["padding"]}>
              <div className="row d-flex justify-content-between">
                <div className="col"></div>
                <div className="col text-center">
                  <p className={s.intorText}>Intro</p>
                </div>
                {editMode ? (
                  <div className="col"></div>
                ) : (
                  <div className="col">
                    <a onClick={enableEditMode}>
                      <p className={s.EditButton}>Edit Profile</p>
                    </a>
                  </div>
                )}
              </div>
              {editMode ? null : (
                <div className="container pl-md-5">
                  <div className="d-flex justify-content-left pl-md-3">
                    <div className="py-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 34 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M28.4551 31.9999H6.54102C4.90623 31.9999 3.57617 30.6241 3.57617 28.933V12.7972C3.57617 12.2081 4.03785 11.7305 4.60742 11.7305C5.177 11.7305 5.63867 12.2081 5.63867 12.7972V28.933C5.63867 29.4477 6.04344 29.8664 6.54102 29.8664H28.4551C28.9527 29.8664 29.3574 29.4477 29.3574 28.933V12.7972C29.3574 12.2081 29.8191 11.7305 30.3887 11.7305C30.9583 11.7305 31.4199 12.2081 31.4199 12.7972V28.933C31.4199 30.6241 30.09 31.9999 28.4551 31.9999Z"
                          fill="#808080"
                        />
                        <path
                          d="M32.9668 16.5306C32.7029 16.5306 32.439 16.4264 32.2377 16.2181L19.4122 2.95134C18.3568 1.85953 16.6394 1.85953 15.5839 2.95134L2.75851 16.2181C2.3558 16.6348 1.70283 16.6348 1.30012 16.2181C0.897355 15.8016 0.897355 15.1261 1.30012 14.7096L14.1255 1.4427C15.9851 -0.4809 19.011 -0.4809 20.8706 1.4427L33.696 14.7095C34.0987 15.1261 34.0987 15.8015 33.696 16.2181C33.4947 16.4264 33.2308 16.5306 32.9668 16.5306Z"
                          fill="#808080"
                        />
                        <path
                          d="M21.6231 32.0005H13.373C12.8035 32.0005 12.3418 31.5228 12.3418 30.9337V21.4664C12.3418 19.6283 13.7875 18.1328 15.5645 18.1328H19.4316C21.2086 18.1328 22.6543 19.6283 22.6543 21.4664V30.9337C22.6543 31.5228 22.1926 32.0005 21.6231 32.0005ZM14.4043 29.867H20.5918V21.4664C20.5918 20.8047 20.0713 20.2663 19.4316 20.2663H15.5645C14.9248 20.2663 14.4043 20.8047 14.4043 21.4664V29.867Z"
                          fill="#808080"
                        />
                      </svg>
                    </div>
                    <div className="p-2 align-self-center pt-1 pl-3">
                      <p className={s.desText}>
                        Lives in {Profile && Profile.location ? Profile.location + "." : null}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-left pl-md-3">
                    <div className="py-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M28.5714 0.00195312H3.42857C1.53502 0.00195312 0 1.53697 0 3.43052V21.7162C0 23.6098 1.53502 25.1448 3.42857 25.1448H7.48573L6.86404 30.7334C6.79473 31.3608 7.24714 31.9255 7.87453 31.9948C8.1985 32.0305 8.52234 31.9263 8.76461 31.7082L16.0583 25.1448H28.5714C30.465 25.1448 32 23.6098 32 21.7162V3.43052C32 1.53697 30.465 0.00195312 28.5714 0.00195312ZM29.7142 21.7162C29.7142 22.3475 29.2026 22.8591 28.5714 22.8591H15.6194C15.337 22.8592 15.0647 22.9639 14.8548 23.1528L9.4674 28.002L9.89825 24.1288C9.9683 23.5016 9.51662 22.9363 8.8893 22.8662C8.84711 22.8615 8.80473 22.8591 8.76227 22.8591H3.42857C2.79736 22.8591 2.28569 22.3475 2.28569 21.7162V3.43052C2.28569 2.79932 2.79736 2.28764 3.42857 2.28764H28.5714C29.2026 2.28764 29.7143 2.79932 29.7143 3.43052V21.7162H29.7142Z"
                          fill="#808080"
                        />
                      </svg>
                    </div>
                    <div className="p-2 align-self-center pt-1 pl-3">
                      <p className="normal-text">
                        Speaks {Profile != null ? languageString + "." : null}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {editMode ? (
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h4 className={s.headingText}>Location</h4>
                    </div>

                    <div className="col-12 ">
                      <div className="row">
                        <div className="col-sm-6 col-md-4 col-lg-3 pr-0">
                          {/* <Input id='location' onChange={getLocation} placeholder="Location" /> */}
                          <Select
                            defaultValue={
                              Profile != null ? Profile.location : null
                            }
                            onChange={setLocation}
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Please select your city"
                          >
                            {/* <Option value="">Please select your city</Option> */}
                            {cityList.length > 0 &&
                              cityList.map((item, key) => {
                                return (
                                  <Option
                                    key={key}
                                    value={
                                      item.name + ", " + item.state.country.name
                                    }
                                  >
                                    {item.name + ", " + item.state.country.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-4">
                    <div className="col-12">
                      <h4 className={s.headingText}>Language</h4>
                    </div>

                    <div className="col-12 ">
                      <Checkbox.Group
                        options={Language}
                        defaultValue={savedLanguages}
                        onChange={onChangeLanguage}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {editMode ? (
                <div className="d-flex flex-row-reverse ">
                  <a>
                    <div
                      onClick={updateLocationLanguage}
                      className={s.EditButton}
                    >
                      Save{" "}
                    </div>
                  </a>
                  <a>
                    <div onClick={disableEditMode} className={s.cancleButton}>
                      Cancel
                  </div>
                  </a>
                </div>
              ) : null}
              <Divider></Divider>
              <div className="container pl-md-5">
                <div className="d-flex justify-content-left">
                  <div className="pl-md-3">
                    <p className={s.desText}>
                      {user != null ? user.firstName + " " + user.lastName : null}{" "}
                    provided followings to Hurraayy
                  </p>
                  </div>
                </div>
                <div className="d-flex justify-content-left">
                  <div className="pl-md-3">
                    <ul className="list-unstyled">
                      {provided.map((item, i) => {
                        return (
                          <li className={s.desText}>
                            <Icon
                              type="check"
                              style={{ color: "rgb(255, 98, 4)", paddingBlock: "3px" }}
                            />{" "}
                          &nbsp;{item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Spin>
  );
}
export default ProfileHome;
