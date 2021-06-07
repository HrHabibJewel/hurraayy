import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Icon, Spin, Typography } from "antd";
import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdventureHostEditData,
  getAdventureId,
} from "../../lib/utils/utility";
import TextArea from "antd/lib/input/TextArea";
import useForceUpdate from "use-force-update";

const { Option } = Select;
const { Title } = Typography;

let days = [];
for (let i = 2; i <= 20; i++) {
  days.push(i);
}

const Duration = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const adventureId = getAdventureId();
  const forceUpdate = useForceUpdate();

  const [state, setState] = useState({
    duration: 0,
    descriptionJson: [],
  });
  const [duration, setDuration] = useState(0);
  const [descriptionJson, setDescriptionJson] = useState([]);

  useEffect(() => {
    getAdventureHostEditData().then((resp) => {
      //getDayItinerary(state['duration']);
      if (resp && resp["duration"]) {
        // setState({ ...state, duration: parseInt(resp['duration']) });
        setDuration(parseInt(resp["duration"]));
        onChangeDuration();
      }
      if (resp && resp["durationDescriptions"]) {
        let _data = JSON.parse(resp["durationDescriptions"]);
        setDescriptionJson(_data);
        // setState({ ...state, descriptionJson: _data, duration: parseInt(resp['duration']) });
      }
      setLoading(false);
    });
  }, []);

  function getDayItinerary(len) {
    let dayItinerary = [];
    for (let i = 0; i < len; i++) {
      dayItinerary.push({
        key: i + 1,
        text: "",
      });
    }
    setDescriptionJson(dayItinerary);
    // setState({ ...state, duration: len });
    //setState({ ...state, descriptionJson: dayItinerary, duration:len });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      //console.log("state===", state);return;
      let params = {};
      params["duration"] = duration;
      params["descriptionJson"] = JSON.stringify(descriptionJson);

      $axios
        .put("adventure/" + adventureId + "/duration/", JSON.stringify(params))
        .then(function (resp) {
          if (resp && resp.status == 200) {
            dispatch(adventureHost("duration", adventureId));
            next({ page: 6, step: 4, data: true });
          }
        });
    });
  };

  const onChangeDuration = (e) => {
    setDuration(e);
    getDayItinerary(e);
  };
  const onChangeItinerary = (e, key) => {
    descriptionJson[key]["text"] = e;
    forceUpdate();
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right" }}>
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          <h2>Adventure duration</h2>
          <p>
            Hurraayy adventures are multi day travel activities which may include food, accommodation, transport etc. where necessary. Adventure lasts minimum of 1 night and 2 days.

          </p>
        </div>
        <div className="exp_con">
          <Row gutter={24}>
            <Col span={18}>
              <h5>Set duration </h5>
              <Form.Item>
                <Select onChange={onChangeDuration} value={duration}>
                  <Option value={0}>{"Select Days"}</Option>
                  {days.length > 0 &&
                    days.map((item, key) => {
                      return (
                        <Option key={key} value={item}>
                          {item + " Days"}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={18}>
              <h5>Itinerary</h5>
              <p>Describe day wise itinerary. Mention in detail what you will do in each day. Describe activities from morning to night so that your guests know what is coming.</p>
              {descriptionJson &&
                descriptionJson.map((item, key) => {
                  return (
                    <div key={key}>
                      <h6>Day {key + 1}</h6>
                      <Form.Item>
                        <TextArea
                          onChange={(e) =>
                            onChangeItinerary(e.target.value, key)
                          }
                          autoSize={{ minRows: 2 }}
                          value={item["text"]}
                        ></TextArea>
                      </Form.Item>
                    </div>
                  );
                })}
            </Col>
          </Row>
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
                  props.continue({ page: 4, step: 4 });
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
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};
export default Form.create()(Duration);
