import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import s from '../host-panel/style.module.css'
import { $axios } from "../../lib/http-service";
import moment from "moment";
import { useRouter } from "next/router";
export default () => {
    const [experienceBookingList, setExperienceBookingList] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        getBookingList();
    }, []);

    const getBookingList = () => {
        $axios.get('experience_bookings/guest-bookings').then((resp) => {
            if (resp && resp.status == 200) {
                setExperienceBookingList(resp.data);
            }
            setLoading(false);
        })
    }

    const columns = [
        {
            title: 'Trips',
            render: (text, record) => <a
                onClick={() => goToPage("experience-details", record.experienceVO.id)}
            ><p className="normal-text">{record.experienceVO.name}</p></a>,
        },
        {
            title: 'Host',
            render: record => <p className="normal-text">{record.host.firstName + ' ' + record.host.lastName}</p>,
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
            title: 'Action',
            render: record => <a>Cancel</a>,
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
                    <Table columns={columns} dataSource={experienceBookingList} pagination={false} className={s.dataTable} scroll={{ Y: 10 }} />
                </Spin>
            </div>
        </div>
    );
};
