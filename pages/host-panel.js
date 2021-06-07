import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import HostPanelLayout from "../components/host-panel/index"
import s from '../components/host-panel/style.module.css'
class HostPanel extends React.Component {
    componentDidMount() { }
    render() {
        return (
            <App>
                <div style={{ backgroundColor: "rgb(243, 243, 243)", paddingBottom: "40px" }} className={s.hostPanel}>
                    <HostPanelLayout />
                </div>

            </App>
        );
    }
}

const mapState = (state) => {
    return { userInfo: state.auth };
};

export default connect(mapState)(HostPanel);
