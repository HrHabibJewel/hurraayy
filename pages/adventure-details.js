import React, { Fragment } from "react";
import { connect } from "react-redux";
import ImageGellary from "../components/adventureDetailsPage/image-Gallery";
import DetailsSections from "../components/adventureDetailsPage/details-sections";
import { $openAxios } from "../lib/http-service";
import Router from "next/router";
import App from "../layouts/App";

class adventureDetailsPage extends React.Component {
    state = {
        data: {},
    };
    static getInitialProps({ query }) {
        return { query };
    }

    componentDidMount() {
        const { id } = Router.query;

        $openAxios.get(`/adventure-open/${id}`).then((res) => {
            this.setState({ data: res.data });
            if (res.data["adventurePhotoVOList"]) {
                this.setState({ images: res.data["adventurePhotoVOList"] });
            }
        });
    }

    render() {
        return (
            <App>
                <div className="container" >
                    {this.state.images && this.state.images.length ? (
                        <ImageGellary
                            imgs={this.state.images}
                            id={this.state.data["id"]}
                        ></ImageGellary>
                    ) : null}
                    <DetailsSections data={this.state.data}></DetailsSections>
                </div>
            </App>
        );
    }
}

const mapState = (state) => {
    return { userInfo: state.auth };
};

export default connect(mapState)(adventureDetailsPage);
