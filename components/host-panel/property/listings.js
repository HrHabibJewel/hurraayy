import React, { Fragment, useEffect, useState } from "react"
import { Row, Col, Button, Menu, Tag, Icon, Divider, Table, Spin, Form } from "antd";
import { EditOutlined, TableOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
const { SubMenu } = Menu;
import { adventrueForm } from "../../../store/adventureForm/actions";
import s from "../style.module.css";
import { $axios } from "../../../lib/http-service";
import { useDispatch, useSelector } from "react-redux";

const PropertyListUser = (props) => {
  const [PropertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    getPropertyList();
  }, []);

  const getPropertyList = () => {
    $axios.get("properties/property_list").then((resp) => {
      if (resp && resp.status == 200) {
        //console.log("property list", resp.data);
        setPropertyList(resp.data);
      }
      setLoading(false);
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    //console.log("clicked me");
    //console.log("propperty", PropertyList);
    dispatch(adventrueForm("listings", 201));
    next({ page: 2, step: 1, PropertyList });
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      render: (text, record) => <a className="normal-text"
        onClick={() => goToPage("details", record.id)}
      >{text}</a>,
    },
    {
      title: "Edit",
      key: "action",
      render: (text, record) => (
        <div>
          <svg

            onClick={
              (e) => {
                const next = props.continue;
                //console.log("corresponding email is :", record)
                dispatch(adventrueForm("listings", record.id));
                //next({ page: 2, step: 1, record });
                router.push({ pathname: "/behost", query: { step: 1, page: 2 } })
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
      title: "Status",
      dataIndex: "approvalFlag",
      render: (text) => <a className="normal-text">{text}</a>
    },
    {
      title: "Bedrooms",
      dataIndex: "bedroomCount",
      render: (text) => <a className="normal-text">{text}</a>,
    },
    {
      title: "Location",
      dataIndex: "locStreet",
      render: (text) => <a className="normal-text">{text}</a>,
    },
  ];
  function goToPage(url, pid) {
    // console.log(pid);
    router.push({ pathname: "/" + url, query: { id: pid } })
  }
  return (
    <Spin spinning={loading} tip="Loading...">
      <Fragment>
        <Table
          columns={columns}
          dataSource={PropertyList}
          pagination={false}
          className={s.dataTable}
        />
      </Fragment>
    </Spin>
  );
};

export default Form.create()(PropertyListUser);
