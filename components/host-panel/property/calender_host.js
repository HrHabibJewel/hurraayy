import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Col, Form, Button, Icon, Calendar, Spin } from "antd";
import { adventrueForm } from "../../../store/adventureForm/actions";
import { $axios } from "../../../lib/http-service";

class Calendar_Host extends React.Component{
    state = {
        selectedMonth: moment().month(),
        isPevBtnDisable: true,
        selectedDates: [],
        loading: true,
      };
}

export default Calendar_Host; 