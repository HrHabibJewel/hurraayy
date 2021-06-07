import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Button, Menu, Icon, Divider, Table } from "antd";
import s from '../style.module.css'
import { $axios } from "../../../lib/http-service";
export default () => {
    const [goingWhere, setgoingWhere] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdventureList();
    }, []);

    const getAdventureList = () => {
        $axios.get('adventure/going-where').then((resp) => {
            if (resp && resp.status == 200) {
                setgoingWhere(resp.data);
            }
            setLoading(false);
        });
    }

    const columns = [
        {
            title: 'Trips',
            render: record => <p className="normal-text">{record.adventure.title}</p>,
        },
        {
            title: 'Dates',
            render: record => <p className="normal-text">{record.startDate + ' to ' + record.endDate}</p>,
        },
        {
            title: 'Total Going',
            render: record => <p className="normal-text">{record.guestCount}</p>
        },
        // {
        //     title: 'Who is going?',

        // },
    ];


    return (
        <Fragment>
            <Table columns={columns} dataSource={goingWhere} pagination={false} className={s.dataTable} />
        </Fragment>
    );
};
