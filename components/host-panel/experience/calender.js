import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Menu, Icon, Divider, Table, Calendar, Space } from "antd";
import moment from "moment";
import { $axios } from "../../../lib/http-service";
import s from '../style.module.css'

export default () => {
    const [ExperienceList, setExperienceList] = useState([]);
    const [selectedExperience, setExperience] = useState(null);
    const [selectedDates, setSelectedDates] = useState([])
    useEffect(() => {
        getExperienceList();
    }, []);


    const getExperienceList = () => {
        $axios.get('experience/experience_list').then((resp) => {
            if (resp && resp.status == 200) {
                setExperienceList(resp.data);
            }
        })
    }

    const selectExperience = (value) => {
        setExperience(value.key);
        $axios.get('experience/' + value.key + '/experience-calender-list').then((resp) => {
            if (resp && resp.status == 200) {
                let dateList = [];
                resp.data.forEach(element => {
                    dateList.push(element.blockDate);
                });

                setSelectedDates(dateList);
            }
        })
    }

    const updateDate = (value) => {
        const valueDate = value.format("YYYY-MM-DD");
        let obj = {
            blockDate: valueDate
        }
        obj = JSON.stringify(obj);
        //console.log(selectedExperience);
        $axios.put('experience/' + selectedExperience + '/experience-calender', obj).then((resp) => {
            if (resp && resp.status == 200) {
                selectExperience({ key: selectedExperience });
            }
        })
    }
    const disabledDate = (value) => {
        const valueDate = value.format("YYYY-MM-DD");
        if (selectedDates.includes(valueDate)) {
            return true;
        }

        const currentFirstDate = moment()
            .format("YYYY-MM-DD");
        if (!(valueDate >= currentFirstDate)) {
            return true;
        }
        return false;
    }

    return (
        <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4">

                <Menu mode="vertical" className={s.menuPanel} onClick={selectExperience}>
                    <p className="normal-text-bold text-center">
                        Listings
                    </p>
                    {ExperienceList.map((experience) => {
                        return (
                            <Menu.Item className={s.menubuttonList} key={experience.id}>
                                <p>{experience.title}</p>
                            </Menu.Item>
                        )
                    })}
                </Menu>
            </div>
            <div className="col-sm-12 col-md-8 col-lg-8 p-0 ">
                <div className="row hostCalender">
                    <div className="col-sm-12 col-md-7 col-lg-7">
                        <p className="normal-text-bold text-center pt-2">Calendar</p>
                        <div className="px-md-4 pb-5 pt-2">
                            <Card>
                                <Calendar fullscreen={false}
                                    onSelect={updateDate}
                                    disabledDate={disabledDate}
                                    dateFullCellRender={(value) => {
                                        const valueDate = value.format("YYYY-MM-DD");
                                        const currentFirstDate = moment()
                                            .startOf("month")
                                            .format("YYYY-MM-DD");
                                        let a = value.date();
                                        let check = false;
                                        let date = value.format("YYYY-MM-DD");
                                        if (selectedDates && selectedDates.length > 0) {
                                            check = selectedDates.includes(date);
                                        }
                                        let styleDate = { height: 35 };
                                        let styleValue = { color: "#231f1f" };
                                        if (check) {
                                            styleDate = { backgroundColor: "#FFD0B4" };
                                        }

                                        return (
                                            <div className="ant-fullcalendar-date" style={styleDate}>
                                                <div className="ant-fullcalendar-value ">
                                                    <span style={styleValue}>{a}</span>
                                                </div>
                                                <div className="ant-fullcalendar-content"></div>
                                            </div>
                                        );
                                    }}
                                />
                            </Card>
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-5 col-lg-5">
                        <div class="container h-100">
                            <div class="row align-items-center h-100">
                                <div class="mx-auto">
                                    <p className="normal-text-bold">When you are going to organize the Experience?</p>
                                    <p className="normal-text">Click on a specific date to create an event on that day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
