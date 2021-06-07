import React, { Fragment, useEffect, useState } from "react";
import { Table } from "antd";
import { $axios } from "../../../lib/http-service";
import s from '../style.module.css'
import moment from "moment";
export default () => {
    const [AdventureBookingList, setAdventureBookingList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdventureList();
    }, []);

    const getAdventureList = () => {
        $axios.get('adventure_bookings/host-bookings').then((resp) => {
            if (resp && resp.status == 200) {
                setAdventureBookingList(resp.data);
            }
            setLoading(false);
        });
    }
    const columns = [
        {
            title: 'Activity',
            render: record => <p className="normal-text">{record.adventure.title}</p>,
        },
        {
            title: 'Guests',
            render: record => <p className="normal-text">{record.guest.firstName + ' ' + record.guest.lastName}</p>,
        },
        {
            title: 'Dates of Activity',
            render: record => <p className="normal-text">{record.adventureCalender.startDate + ' to ' + record.adventureCalender.endDate}</p>,
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
        <Fragment>
            <Table columns={columns} dataSource={AdventureBookingList} pagination={false} className={s.dataTable} />
        </Fragment>
    );
};
