import React, { Fragment } from "react";
import { connect } from "react-redux";
import ImageGellary from "../components/detailsPage/image-Gallery";
import DetailsSections from "../components/detailsPage/details-sections";
import { $openAxios } from "../lib/http-service";
import Router from "next/router";
import App from "../layouts/App";

class detailsPage extends React.Component {
  state = {
    data: {}
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
    $openAxios.get(`/accommodations/${id}`).then((res) => {
      this.setState({ data: res.data });
      if (res.data["propertyPhotoVOS"]) {
        this.setState({ images: res.data["propertyPhotoVOS"] });
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

export default connect(mapState)(detailsPage);
