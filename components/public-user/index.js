import React, { useState, useEffect } from 'react';
import { Spin, Select, Col, Button, Menu, Icon, Divider, Table, Input, Checkbox } from "antd";
import { $openAxios } from "../../lib/http-service";
import s from './style.module.css'
import { Fragment } from 'react';
import { withRouter, useRouter } from "next/router";

const PublicProfile = () => {
    // const [imageUrl, setImageUrl] = useState('./images/Avatar.jpg');
    const [Profile, setProfile] = useState(null);
    // const [languageString, setlanguageString] = useState('');
    const [loading, setLoading] = useState(true);
    // const [provided, setProvided] = useState([]);
    const router = useRouter();
    useEffect(() => {

        getProfile();
        if (Profile != null) {
            setImageUrl(Profile.profilePhotoPath)
            languageStringBuid(Profile.languageVOList);
        }

    }, []);

    let imageUrl = './images/Avatar.jpg';
    if (Profile && Profile["profilePhotoPath"]) {
        imageUrl = Profile["profilePhotoPath"];
    }

    let languageString = "";
    if (Profile && Profile["languageVOList"]) {
        Profile["languageVOList"].forEach(element => {
            languageString += element.name + ', ';
        });
        languageString = languageString.slice(0, -1);
    }

    let provided = [];
    if (Profile && Profile["provided"]) {
        provided = Profile["provided"];
    }
    const getProfile = () => {
        const { id } = router.query;

        $openAxios.get(`/user/${id}`).then((resp) => {
            if (resp && resp.status == 200) {
                setProfile(resp.data);
                // setImageUrl(resp.data.profilePhotoPath);
                // var lang = '';
                // var LanguageList = [];
                // if (resp.data.languageVOList != null) {
                //     resp.data.languageVOList.forEach(element => {
                //         LanguageList.push(Number(element.id))
                //         lang += element.name + ',';
                //     });
                //     // setsavedLanguages(LanguageList);
                //     lang = lang.slice(0, -1);
                //     setlanguageString(lang);


                // }
                // console.log(Profile);
                setLoading(false);
            } else {
                router.push('/')
            }
        },
            (error) => {
                router.push('/')
            })


    }

    const languageStringBuid = (language) => {
        var lang = '';
        var LanguageList = [];
        if (language != null) {
            language.forEach(element => {
                LanguageList.push('' + element.id + '')
                lang += element.name + ', ';
            });
            //  setsavedLanguages(LanguageList);
            lang = lang.slice(0, -1);
            setlanguageString(lang);
        }
    }
    return (
        <Spin spinning={loading} tip="Loading...">
            {loading ? <div style={{ height: '100vh' }}></div> :
                <Fragment>
                    <div className="container">
                        <div className="row pt-4">
                            <div className="mx-auto d-block">
                                <img src={imageUrl} className={s.ProfileImage} alt="" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mx-auto d-block text-center">
                                <p className={s.Name}>{Profile != null ? Profile.firstName + ' ' + Profile.lastName : null}</p>
                                <p className={s.desText}>{Profile != null ? Profile.bio : null}</p>

                            </div>
                        </div>
                        <Divider style={{ margin: '4px !important' }}></Divider>
                        <div className="d-flex justify-content-between">
                            <div></div>
                            <div className="align-self-center"><p className={s.intorText}>Intro</p></div>
                            <div></div>
                        </div>
                        <div className='container pl-md-5'>
                            <div className="d-flex justify-content-left">
                                <div className='p-2'>
                                    <svg width="3vw" height="3vh" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M28.4551 31.9999H6.54102C4.90623 31.9999 3.57617 30.6241 3.57617 28.933V12.7972C3.57617 12.2081 4.03785 11.7305 4.60742 11.7305C5.177 11.7305 5.63867 12.2081 5.63867 12.7972V28.933C5.63867 29.4477 6.04344 29.8664 6.54102 29.8664H28.4551C28.9527 29.8664 29.3574 29.4477 29.3574 28.933V12.7972C29.3574 12.2081 29.8191 11.7305 30.3887 11.7305C30.9583 11.7305 31.4199 12.2081 31.4199 12.7972V28.933C31.4199 30.6241 30.09 31.9999 28.4551 31.9999Z" fill="#808080" />
                                        <path d="M32.9668 16.5306C32.7029 16.5306 32.439 16.4264 32.2377 16.2181L19.4122 2.95134C18.3568 1.85953 16.6394 1.85953 15.5839 2.95134L2.75851 16.2181C2.3558 16.6348 1.70283 16.6348 1.30012 16.2181C0.897355 15.8016 0.897355 15.1261 1.30012 14.7096L14.1255 1.4427C15.9851 -0.4809 19.011 -0.4809 20.8706 1.4427L33.696 14.7095C34.0987 15.1261 34.0987 15.8015 33.696 16.2181C33.4947 16.4264 33.2308 16.5306 32.9668 16.5306Z" fill="#808080" />
                                        <path d="M21.6231 32.0005H13.373C12.8035 32.0005 12.3418 31.5228 12.3418 30.9337V21.4664C12.3418 19.6283 13.7875 18.1328 15.5645 18.1328H19.4316C21.2086 18.1328 22.6543 19.6283 22.6543 21.4664V30.9337C22.6543 31.5228 22.1926 32.0005 21.6231 32.0005ZM14.4043 29.867H20.5918V21.4664C20.5918 20.8047 20.0713 20.2663 19.4316 20.2663H15.5645C14.9248 20.2663 14.4043 20.8047 14.4043 21.4664V29.867Z" fill="#808080" />
                                    </svg>

                                </div>
                                <div className='p-2 align-self-center pt-1'>
                                    <p className={s.desText}>Lives in {Profile != null ? Profile.location + "." : null}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-left">
                                <div className='p-2'>
                                    <svg width="3vw" height="3vh" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M28.5714 0.00195312H3.42857C1.53502 0.00195312 0 1.53697 0 3.43052V21.7162C0 23.6098 1.53502 25.1448 3.42857 25.1448H7.48573L6.86404 30.7334C6.79473 31.3608 7.24714 31.9255 7.87453 31.9948C8.1985 32.0305 8.52234 31.9263 8.76461 31.7082L16.0583 25.1448H28.5714C30.465 25.1448 32 23.6098 32 21.7162V3.43052C32 1.53697 30.465 0.00195312 28.5714 0.00195312ZM29.7142 21.7162C29.7142 22.3475 29.2026 22.8591 28.5714 22.8591H15.6194C15.337 22.8592 15.0647 22.9639 14.8548 23.1528L9.4674 28.002L9.89825 24.1288C9.9683 23.5016 9.51662 22.9363 8.8893 22.8662C8.84711 22.8615 8.80473 22.8591 8.76227 22.8591H3.42857C2.79736 22.8591 2.28569 22.3475 2.28569 21.7162V3.43052C2.28569 2.79932 2.79736 2.28764 3.42857 2.28764H28.5714C29.2026 2.28764 29.7143 2.79932 29.7143 3.43052V21.7162H29.7142Z" fill="#808080" />
                                    </svg>
                                </div>
                                <div className='p-2 align-self-center pt-1'>
                                    <p className={s.desText}>Speaks {Profile != null ? languageString + "." : null}</p>
                                </div>
                            </div>
                        </div>
                        <Divider style={{ margin: '4px !important' }}></Divider>
                        <div className='container pl-md-5'>
                            <div className="d-flex justify-content-left">
                                <div className='pl-3'>
                                    <p className={s.desText}>{Profile != null ? Profile.firstName + ' ' + Profile.lastName : null} provided followings to Hurraayy</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-left">
                                <div className='pl-3'>
                                    <ul className="list-unstyled">
                                        {
                                            provided.map((item, i) => {
                                                return (
                                                    <li className={s.desText}><Icon type="check" style={{ color: 'red', padding: "3px" }} /> &nbsp;{item}</li>)
                                            })
                                        }

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>}
        </Spin>
    );
};
export default PublicProfile;