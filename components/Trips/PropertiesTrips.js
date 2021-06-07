import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import s from '../host-panel/style.module.css'
import { $axios } from "../../lib/http-service";
import moment from "moment";
import { useRouter } from "next/router";
export default () => {
    const [adventureBookingList, setAdventureBookingList] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        getBookingList();
    }, []);

    const getBookingList = () => {
        $axios.get('bookings/guest-bookings').then((resp) => {
            if (resp && resp.status == 200) {
                setAdventureBookingList(resp.data);
            }
            setLoading(false);
        })
    }

    const columns = [
        {
            title: 'Trips',
            dataIndex: "name",
            render: (text, record) => <a
                onClick={() => goToPage("details", record.property.id)}
            ><p className="normal-text">{record.property.name}</p></a>,
        },
        {
            title: 'Host',
            render: record => <p className="normal-text">{record.host.firstName + ' ' + record.host.lastName}</p>,
        },
        {
            title: 'Dates of Trip',
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
            title: 'Action',
            render: record => <p className="normal-text">Cancel</p>,
        },
    ];
    function goToPage(url, pid) {
        // console.log(pid);
        router.push({ pathname: "/" + url, query: { id: pid } })
    }
    return (
        <div className="row">
            <div className="col-12">
                <Spin spinning={loading} tip="Loading...">
                    <Table columns={columns} dataSource={adventureBookingList} pagination={false} className={s.dataTable} scroll={{ Y: true }} />
                </Spin>
            </div>
        </div>
    );
};
