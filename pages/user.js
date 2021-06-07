import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import PublicProfile from "../components/public-user";

class User extends React.Component {

    render() {
        return (
            <App>
                <div className="container">
                    {/* {this.state.images && this.state.images.length ? (
                        <ImageGellary
                            imgs={this.state.images}
                            id={this.state.data["id"]}
                        ></ImageGellary>
                    ) : null}
                    <DetailsSections data={this.state.data}></DetailsSections> */}

                    <PublicProfile></PublicProfile>
                </div>
            </App>
        );
    }
}

const mapState = (state) => {
    return { userInfo: state.auth };
};

export default connect(mapState)(User);
