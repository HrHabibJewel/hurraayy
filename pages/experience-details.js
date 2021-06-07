import React, { Fragment } from "react";
import { connect } from "react-redux";
import ImageGellary from "../components/experienceDetailsPage/image-Gallery";
import DetailsSections from "../components/experienceDetailsPage/details-sections";
import { $openAxios } from "../lib/http-service";
import Router from "next/router";
import App from "../layouts/App";

class experienceDetailsPage extends React.Component {
    state = {
        data: {},
    };
    getFiles = async (id) => {
        let imagesTemp = [];
        for (let img of this.state.data["propertyPhotoVOS"]) {
            let url = `accommodations/${img.id}/property/${id}/image`;
            let x = await $openAxios.get(url);

            if (x) {
                let obj = { id: img.id, cover: img._cover_photo, path: x["data"] };
                imagesTemp.push(obj);
            }
        }
        // localStorage.setItem("test", true);
        this.setState({ images: imagesTemp });
    };
    static getInitialProps({ query }) {
        return { query };
    }

    componentDidMount() {
        const { id } = Router.query;

        $openAxios.get(`/experience-open/${id}`).then((res) => {
            this.setState({ data: res.data });
            if (res.data["experiencePhotoVOList"]) {
                this.setState({ images: res.data["experiencePhotoVOList"] });
            }
        });
    }

    render() {
        return (
            <App>
                <div className="container">
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

export default connect(mapState)(experienceDetailsPage);
