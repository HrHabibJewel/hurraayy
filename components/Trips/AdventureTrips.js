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
        $axios.get('adventure_bookings/guest-bookings').then((resp) => {
            if (resp && resp.status == 200) {
                setAdventureBookingList(resp.data);
            }
            setLoading(false);
        })
    }

    const columns = [
        {
            title: 'Trips',
            render: (text, record) => <a
                onClick={() => goToPage("experience-details", record.adventure.id)}
            ><p className="normal-text">{record.adventure.name}</p></a>,
        },
        {
            title: 'Host',
            render: record => <p className="normal-text">{record.host.firstName + ' ' + record.host.lastName}</p>,
        },
        {
            title: 'Dates of Trip',
            render: record => <p className="normal-text">{record.adventureCalender.startDate + ' to ' + record.adventureCalender.endDate}</p>,
        },
        {
            title: 'Booked on',
            render: record => <p className="normal-text">{moment.utc(record.bookingDate).format("YYYY-MM-DD")}</p>,
        },
        {
            title: 'Status',
            dataIndex: 'bookingConfirmation',
            render: record => <p className="normal-text">{record.bookingConfirmation}</p>,
        },
        {
            title: 'Action',
            render: record => <a className="normal-text">Cancel</a>,
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
                    <Table columns={columns}
                        dataSource={adventureBookingList}
                        pagination={false}
                        className={s.dataTable}
                    />
                </Spin>
            </div>
        </div>
    );
};
