import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Card, DatePicker, Button, Menu, Icon, Divider, Table, Calendar } from "antd";
import { $axios } from "../../../lib/http-service";
import s from '../style.module.css'
import moment from "moment";


export default () => {

    const [AdventureList, setAdventureList] = useState([]);
    const [selectedAdventure, setAdventure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDates, setSelectedDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getAdventureList();
    }, []);

    const setStartDateOnChange = (value) => {
        if (value != null) {
            setStartDate(value.format("YYYY-MM-DD"));
        }

        console.log(startDate);
    }

    const setEndDateOnChange = (value) => {
        if (value != null) {
            setEndDate(value.format("YYYY-MM-DD"));
        }
        console.log(endDate);
    }
    const getAdventureList = () => {
        $axios.get('adventure/experience_list').then((resp) => {
            if (resp && resp.status == 200) {
                setAdventureList(resp.data);
            }
            setLoading(false);
        });
    }

    const updateDate = () => {
        let obj = {
            endDate: endDate,
            startDate: startDate
        }
        obj = JSON.stringify(obj);
        if (selectedAdventure != null) {
            $axios.put('adventure/' + selectedAdventure + '/adventure-calender', obj).then((resp) => {
                if (resp && resp.status == 200) {
                    selectAdventure({ key: selectedAdventure });
                }
            })
        }

    }

    const selectAdventure = (value) => {
        setAdventure(value.key);
        $axios.get('adventure/' + value.key + '/adventure-calender-list').then((resp) => {
            if (resp && resp.status == 200) {
                var dateArray = [];
                resp.data.forEach(element => {
                    var currentDate = moment(element.startDate);
                    var endDate = moment(element.endDate);
                    while (currentDate <= endDate) {
                        dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
                        currentDate = moment(currentDate).add(1, 'days');
                    }
                });
                setSelectedDates(dateArray);
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
                <Menu mode="vertical" className={s.menuPanel}
                    onClick={selectAdventure}
                >
                    <p className="normal-text-bold text-center">
                        Listings
                    </p>
                    {AdventureList.map((experience) => {
                        return (
                            // <Menu.Item className={s.menubuttonList} key={experience.id}>
                            //     <b className="normal-text">{experience.title}</b>
                            // </Menu.Item>
                            <Menu.Item className={s.menubuttonList} key={experience.id}>
                                <p>{experience.title}</p>
                            </Menu.Item>
                        )
                    })
                    }
                </Menu>
            </div>
            <div className="col-sm-12 col-md-8 col-lg-8">
                <Divider>
                    <h5 className="normal-text-bold text-center">
                        When you are going to organize the Trip?
                    </h5>
                </Divider>
                <div className="row hostCalender">
                    <div className="col-sm-12 col-md-12 col-lg-7">
                        <div className="pt-5 pb-5">
                            <Card>
                                <Calendar fullscreen={false}
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

                    <div className="col-sm-12 col-md-12 col-lg-5" >
                        <div className="pt-2 pt-md-5">
                            <p className="normal-text">You can set dates for events from here. Select a listing from listings column. Then set start and end dates. Hit save. Calendar will show dates booked for that event</p>
                            <div className='pl-2 pr-2 pt-4'>
                                <div class="form-row">
                                    <div class="form-group col-sm-12 col-md-6">
                                        <div className="row">
                                            <div className="col-2 col-md-12">
                                                <label className="label pr-1"><b>Start</b></label>
                                            </div>
                                            <div className="col-10 col-md-12">
                                                <DatePicker
                                                    className={s["datePicker"]}
                                                    onChange={setStartDateOnChange}
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
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <div className="row">
                                            <div className="col-2 col-md-12">
                                                <label className="label pr-1"><b>End</b></label>
                                            </div>
                                            <div className="col-10 col-md-12">
                                                <DatePicker
                                                    className={s["datePicker"]}
                                                    onChange={setEndDateOnChange}
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
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className="pl-2 pr-2 pt-4">
                                <Button onClick={updateDate} type="primary" block>Save</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
