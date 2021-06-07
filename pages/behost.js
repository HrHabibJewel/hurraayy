import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Layout from "../layouts/Listing";

const isServer = typeof window === "undefined";

// components

import PlaceSetting from "../components/become-a-host/place-setting";
import PlaceType from "../components/become-a-host/place-type";
import BedRooms from "../components/become-a-host/bed-rooms";
import Bathrooms from "../components/become-a-host/bath-rooms";
import LocationSetup from "../components/become-a-host/location-setup";
import LocationConfirmation from "../components/become-a-host/location-confirmation";
import Amenities from "../components/become-a-host/amenities";
import GuestSpaceSetting from "../components/become-a-host/guest-space-setting";
import Process from "../components/become-a-host/process";

import Photos from "../components/become-a-host/photos";
import DescribePlace from "../components/become-a-host/describe-place";
import NamePlace from "../components/become-a-host/name-place";
import VerifyPhone from "../components/become-a-host/verify-phone";
import Process2 from "../components/become-a-host/process-2";

import GuestRequirements from "../components/become-a-host/guest-requirements";
import HouseRules from "../components/become-a-host/house-rules";
import CheckRequirements from "../components/become-a-host/check-requirements";
import KeepCalendarUpdate from "../components/become-a-host/keep-calendar-update";
import AvailabilityGuestions from "../components/become-a-host/availability-questions";
import GuestNotifications from "../components/become-a-host/guest-notifications";
import GuestBooks from "../components/become-a-host/guest-books";
import GuestStay from "../components/become-a-host/guest-stay";
import Calendar from "../components/become-a-host/calendar";
import PriceSpace from "../components/become-a-host/price-space";
import LengthOfStay from "../components/become-a-host/length-of-stay";
import { getAuthentication } from "../lib/utils/utility";
// components

class PageAccommodation extends React.Component {
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      if (!getAuthentication()) {
        Router.push('/')
      }
      const { step, page } = isServer ? {} : Router.query;
      if(step == undefined || page == undefined) {
        Router.push('/')
      }
      this.setState({ step, page });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      page: 1,
    };

    this.continue = this.continue.bind(this);
  }

  continue(obj) {
    const { page, step, data } = obj;

    this.setState({ page, step, data, loading: true });
    Router.push(`/behost?step=${step}&page=${page}`, undefined, {
      shallow: true,
    });
  }
  render() {
    const { step, page, loading } = this.state;
    return (
      <Layout
        step={step || 1}
        page={page || 1}
        style={page == 9 && step == 3 ? { maxWidth: 950 } : null}
      >
        {page == 1 && step == 1 && <PlaceSetting continue={this.continue} />}
        {page == 2 && step == 1 && <PlaceType continue={this.continue} />}
        {page == 3 && step == 1 && <BedRooms continue={this.continue} />}
        {page == 4 && step == 1 && <Bathrooms continue={this.continue} />}
        {page == 5 && step == 1 && <LocationSetup continue={this.continue} />}
        {page == 6 && step == 1 && (
          <LocationConfirmation continue={this.continue} />
        )}
        {page == 7 && step == 1 && <Amenities continue={this.continue} />}
        {page == 8 && step == 1 && (
          <GuestSpaceSetting continue={this.continue} />
        )}
        {page == 0 && step == 1 && <Process continue={this.continue} />}
        {page == 1 && step == 2 && <Photos continue={this.continue} />}
        {page == 2 && step == 2 && <DescribePlace continue={this.continue} />}
        {page == 3 && step == 2 && <NamePlace continue={this.continue} />}
        {page == 4 && step == 2 && <VerifyPhone continue={this.continue} />}
        {page == 0 && step == 2 && <Process2 continue={this.continue} />}
        {page == 1 && step == 3 && (
          <GuestRequirements continue={this.continue} />
        )}
        {page == 2 && step == 3 && <HouseRules continue={this.continue} />}
        {/* {page == 3 && step == 3 && (
          <CheckRequirements continue={this.continue} />
        )} */}
        {page == 4 && step == 3 && (
          <KeepCalendarUpdate continue={this.continue} />
        )}
        {page == 5 && step == 3 && (
          <AvailabilityGuestions continue={this.continue} />
        )}
        {page == 6 && step == 3 && (
          <GuestNotifications continue={this.continue} />
        )}
        {page == 7 && step == 3 && <GuestBooks continue={this.continue} />}
        {page == 8 && step == 3 && <GuestStay continue={this.continue} />}
        {page == 9 && step == 3 && <Calendar continue={this.continue} />}
        {page == 10 && step == 3 && <PriceSpace continue={this.continue} />}
        {/* {page == 11 && step == 3 && <LengthOfStay continue={this.continue} />} */}
      </Layout>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(PageAccommodation);
