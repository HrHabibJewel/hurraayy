import React, { Fragment, useEffect, useState } from "react";
import { Table, Button, Spin, Form } from "antd";
import { $axios } from "../../../lib/http-service";
import { useDispatch, useSelector } from "react-redux";
import { experienceForm } from "../../../store/experienceForm/actions";
import s from '../style.module.css'
import { Router, useRouter } from "next/router";
const ExperienceListUser = (props) => {
    const [ExperienceList, setExperienceList] = useState();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        getExperienceList();
    }, []);

    const getExperienceList = () => {
        $axios.get('experience/experience_list').then((resp) => {
            if (resp && resp.status == 200) {
                setExperienceList(resp.data);
            }
            setLoading(false);
        })
    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            render: (text, record) => <a
                className="normal-text"
                onClick={() => goToPage("experience-details", record.id)}
            >{text}</a>
        },
        {
            title: <b>Edit</b>,
            key: "action",
            render: (text, record) => (
                <div>
                    <svg

                        onClick={
                            (e) => {
                                const next = props.continue;
                                dispatch(experienceForm("listings", record.id, 0));
                                router.push({ pathname: "/experience-host", query: { step: 1, page: 2 } })
                            }
                        }
                        width="19" height="18" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4376 4H4.15952C3.60802 4 3.07911 4.21071 2.68913 4.58579C2.29916 4.96086 2.08008 5.46957 2.08008 6V20C2.08008 20.5304 2.29916 21.0391 2.68913 21.4142C3.07911 21.7893 3.60802 22 4.15952 22H18.7156C19.2671 22 19.7961 21.7893 20.186 21.4142C20.576 21.0391 20.7951 20.5304 20.7951 20V13" stroke="#343434" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19.2354 2.50023C19.6491 2.1024 20.2101 1.87891 20.795 1.87891C21.38 1.87891 21.941 2.1024 22.3546 2.50023C22.7682 2.89805 23.0006 3.43762 23.0006 4.00023C23.0006 4.56284 22.7682 5.1024 22.3546 5.50023L12.4772 15.0002L8.31836 16.0002L9.35808 12.0002L19.2354 2.50023Z" stroke="#343434" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            ),
        },
        {
            title: 'Location',
            render: record => <a className="normal-text">{record.city.name + ',' + record.country.name}</a>,
        },
        {
            title: 'Status',
            render: record => <a className="normal-text">{record.approvalFlag}</a>,
        },

    ];
    function goToPage(url, pid) {
        // console.log(pid);
        router.push({ pathname: "/" + url, query: { id: pid } })
    }

    return (
        <Fragment>
            <Table columns={columns} dataSource={ExperienceList} pagination={false} className={s.dataTable} />
        </Fragment>
    );
};
export default Form.create()(ExperienceListUser);