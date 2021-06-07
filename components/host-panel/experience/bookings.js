import React, { useEffect, useState } from "react";
import { Table } from "antd";
import s from '../style.module.css'
import { $axios } from "../../../lib/http-service";
import moment from "moment";

export default () => {
    const [BookingList, setBookingList] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getBookingList();
    }, []);

    const getBookingList = () => {
        $axios.get('experience_bookings/host-bookings').then((resp) => {
            if (resp && resp.status == 200) {
                setBookingList(resp.data);
            }
            setLoading(false);
        })
    }

    const columns = [
        {
            title: 'Trips',
            render: record => <p className="normal-text">{record.experienceVO.title}</p>,
        },
        {
            title: 'Guests',
            render: record => <p className="normal-text">{record.numberOfGuestsCount}</p>,
        },
        {
            title: 'Dates of Trip',
            render: record => <p className="normal-text">{record.experienceCalenderVO.blockDate}</p>,
        },
        {
            title: 'Booked on',
            render: record => <p className="normal-text">{moment.utc(record.bookingDate).format("YYYY-MM-DD")}</p>,
        },
        {
            title: 'Status',
            render: record => <p className="normal-text">{record.bookingConfirmation}</p>,
        },
        {
            title: 'Amount',
            render: record => <p className="normal-text">{record.feesTotal}</p>,
        },
    ];

    return (
        <div className="row">
            <div className="col-12">
                <Table columns={columns} dataSource={BookingList} pagination={{ position: "bottom" }} className={s.dataTable} scroll={{ Y: 10 }} />
            </div>
        </div>
    );
};
