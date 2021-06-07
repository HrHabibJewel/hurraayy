import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import { Row, Col, Form, Button, Input } from "antd";
import Layout from "../../layouts/hosting";
import Listing from "../../components/hosting/listings";

class Listings extends React.Component {

  render() {
    return (
        <Layout>
            <Listing />
        </Layout>
        );
    }
}

const WrappedApp = Form.create({ name: "coordinated" })(Listings);

export default connect()(WrappedApp);