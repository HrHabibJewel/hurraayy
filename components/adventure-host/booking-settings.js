import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Icon, Spin } from "antd";

import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAdventureHostEditData, getAdventureId } from "../../lib/utils/utility";

const { Option } = Select;

let vPreparation = [];
for (let i = 1; i <= 12; i++) {
  vPreparation.push(i);
}

const BookingSettings = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    howMuchAdvanceNoticeForAlreadyBook: "4",
    howMuchAdvanceNoticeForNoBook: "4",
  });
  const dispatch = useDispatch();
  const adventureId = getAdventureId();

  useEffect(() => {
    getAdventureHostEditData().then((resp) => {
      if (resp && resp['howMuchAdvanceNoticeForAlreadyBook']) {
        setState({ ...state, howMuchAdvanceNoticeForAlreadyBook: resp['howMuchAdvanceNoticeForAlreadyBook'] });
      }
      if (resp && resp['howMuchAdvanceNoticeForNoBook']) {
        setState({ ...state, howMuchAdvanceNoticeForNoBook: resp['howMuchAdvanceNoticeForNoBook'] });
      }
      setLoading(false);
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      // console.log("Received values of form: ", values);
      let params = {};
      params["howMuchAdvanceNoticeForAlreadyBook"] = values["howMuchAdvanceNoticeForAlreadyBook"];
      params["howMuchAdvanceNoticeForNoBook"] = values["howMuchAdvanceNoticeForNoBook"];

      $axios.put("adventure/" + adventureId + "/booking_setting/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            adventureHost("booking-setting", adventureId)
          );
          next({ page: 1, step: 5, data: true });
        }
      });
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{ float: "right" }}>
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          <h2>Your preparation time</h2>
          <p>
            After a booking made by guests you will need enough time to prepare the logistics such as tickets, transport, accommodation etc. In order to have more bookings we recommend to accept booking close to the start time of the adventure.
          </p>
        </div>
        <div className="exp_con">
          <Row gutter={24}>
            <Col span={18}>
              <h5>
                You will be accepting booking until:
              </h5>
              {/* <p>
                Irure adipisicing voluptate irure culpa velit culpa velit
                labore.
              </p> */}
              <Form.Item>
                {getFieldDecorator("howMuchAdvanceNoticeForAlreadyBook", {
                  initialValue: state["howMuchAdvanceNoticeForAlreadyBook"] + " days before start time",
                  rules: [
                    {
                      required: false,
                      message: "",
                    },
                  ],
                })(
                  <Select>
                    {/* <Option value="4">4 hour before start time </Option> */}
                    {vPreparation.length > 0 &&
                      vPreparation.map((item, key) => {
                        return (
                          <option key={key} value={item}>
                            {item} {" "} days before start time
                          </option>
                        );
                      })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={24}>
            <Col span={18}>
              <h5>
                How much advance notice do you need for a new booking when no
                one has booked it yet?
              </h5>
              <p>
                Irure adipisicing voluptate irure culpa velit culpa velit
                labore.
              </p>
              <Form.Item>
                {getFieldDecorator("howMuchAdvanceNoticeForNoBook", {
                  initialValue: state["howMuchAdvanceNoticeForNoBook"],
                  rules: [
                    {
                      required: false,
                      message: "",
                    },
                  ],
                })(
                  <Select>
                    <Option value="4">4 hour before start time </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row> */}
        </div>
        <div className="exp_con">
          <Col span={12}>
            <Form.Item
              wrapperCol={{ span: 6, offset: 0 }}
              style={{ marginTop: "10px" }}
            >
              <Button
                type="link"
                onClick={() => {
                  props.continue({ page: 6, step: 4 });
                }}
              >
                <a>
                  <Icon type="left" />
                  &nbsp;Back
                </a>
              </Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              wrapperCol={{ span: 2, offset: 0 }}
              style={{ marginTop: "10px", float: "right" }}
            >
              <Button
                type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};
export default Form.create()(BookingSettings);
