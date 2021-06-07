import App from "next/app";
import React from "react";
import withRedux from "next-redux-wrapper";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import NextNprogress from "nextjs-progressbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "../public/css/antd.css";
import "../assets/slick.css";
import "../public/css/listing.css";

import "../public/css/style.css";
import "../public/css/experience-form.css";
import "react-google-flight-datepicker/dist/main.css";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Provider store={reduxStore}>
        <NextNprogress
          color={"#ff6204"}
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
        />
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withReduxStore(MyApp);
