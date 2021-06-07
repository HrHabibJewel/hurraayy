import React, { Fragment, useEffect, useState } from "react";
import { Table } from "antd";
import s from '../style.module.css'
import { $axios } from "../../../lib/http-service";
import moment from "moment";
export default () => {
    const [propertiesBookingList, setPropertiesBookingList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdventureList();
    }, []);

    const getAdventureList = () => {
        $axios.get('bookings/host-bookings').then((resp) => {
            if (resp && resp.status == 200) {
                setPropertiesBookingList(resp.data);
            }
            setLoading(false);
        });
    }
    const columns = [
        {
            title: 'Listings',
            render: record => <p className="normal-text">{record.property.name}</p>,
        },
        {
            title: 'Guests',
            render: record => <p className="normal-text">{record.guest.firstName + ' ' + record.guest.lastName}</p>,
        },
        {
            title: 'Trip Dates',
            render: record => <p className="normal-text">{record.checkInDate + ' to ' + record.checkOutDate}</p>,
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
            <Table columns={columns} dataSource={propertiesBookingList} pagination={false} className={s.dataTable} />
        </Fragment>
    );
};
