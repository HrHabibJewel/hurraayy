import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Layout from "../layouts/Listing";
import { $openAxios } from "../lib/http-service";
import Link from "next/link";
import { Button, Spin } from "antd";

const isServer = typeof window === "undefined";

// components

class Page extends React.Component {
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      const { q } = isServer ? {} : Router.query;

      $openAxios.get(`confirm/confirm-account/?q=${q}`).then((resp) => {
        //console.log(resp);
        if (resp && resp["data"] && resp.data.statusCode === 200) {
          this.setState({ loading: false });
        } else {
          this.setState({
            loading: false,
            error: true,
            errorMsg: resp["data"]["message"],
          });
        }
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  constructor(props) {
    super(props);
    this.state = {
      q: "",
      loading: true,
      error: false,
      errorMsg: "",
    };
  }

  render() {
    const { q, loading, error, errorMsg } = this.state;
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Spin spinning={loading} tip="Loading...">
          {!loading && (
            <div
              style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              {error && (
                <p>
                  Oops!{" "}
                  {errorMsg ? errorMsg : "Your confirmation url is expired."}
                </p>
              )}
              {!error && <p>Welcome to Hurraayy!</p>}
              {!error && <h4>Email confirmation completed.</h4>}
              <Link href={{ pathname: "/" }}>
                <Button type="primary" htmlType="submit">
                  {" "}
                  Go to Home Page{" "}
                </Button>
              </Link>
            </div>
          )}
        </Spin>
      </div>
    );
  }
}

export default Page;
