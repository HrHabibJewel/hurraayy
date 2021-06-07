import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import ProfileHome from "../components/Profile/index"
import s from '../components/Profile/style.module.css'
import { getAuthentication } from "../lib/utils/utility";
import Router from "next/router";
class Profile extends React.Component {
    _isMounted = false;
    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            if (!getAuthentication()) {
                Router.push('/')
            }
        }
    }
    render() {
        return (
            <App>
                <div style={{ paddingBottom: "40px" }} className={s.hostPanel}>
                    <ProfileHome></ProfileHome>
                </div>

            </App>
        );
    }
}

const mapState = (state) => {
    return { userInfo: state.auth };
};

export default connect(mapState)(Profile);