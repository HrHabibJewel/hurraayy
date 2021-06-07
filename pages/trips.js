import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import TripsHome from "../components/Trips"
import s from '../components/host-panel/style.module.css'
class Trips extends React.Component {
    componentDidMount() { }
    render() {
        return (
            <App>
                <div style={{ backgroundColor: "rgb(243, 243, 243)", paddingBottom: "40px", paddingLeft: "20px", paddingRight: "40px" }} className={s.hostPanel}>
                    <TripsHome />
                </div>

            </App>
        );
    }
}

const mapState = (state) => {
    return { userInfo: state.auth };
};

export default connect(mapState)(Trips);