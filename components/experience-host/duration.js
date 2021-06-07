import React, { useState, useEffect } from "react";
//conflicted on this js
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Icon,
  Spin,
} from "antd";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

let vDuration = [];
for (let i = 1; i <= 16; i = i + 0.5) {
  vDuration.push(i);
}

let vStartTime = [];
for(let i=6; i<=23; i=i+0.50) {
  if(i % 1 != 0){
    vStartTime.push(Math.floor(i)+".30");
  }
  else{
    vStartTime.push(i+".00");
  }
}


const { Option } = Select;
const Duration = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const experienceId = getExperienceId();

  const [state, setState] = useState({
    duration: 4,
    startTime: "11:30"
  });

  useEffect(() => {
    getExperienceFormEditData().then((resp) => {
      if (resp && resp['duration']) {
        setState({ ...state, duration: resp['duration'] });
      }
      if (resp && resp['startTime']) {
        setState({ ...state, startTime: resp['startTime'] });
      }
      setLoading(false);
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
      params["duration"] = values["duration"];
      params["startTime"] = values["startTime"];
      // console.log(params);
      $axios.put("experience/" + experienceId + "/duration/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          //console.log(resp);
          dispatch(
            experienceForm("duration", experienceId)
          );
          next({ page: 6, step: 4, data: true });
        }
      });
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right", marginTop: "20px" }}>
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          {/* <h2>What’s the duration of your experience?</h2> */}
          <h2>Experience duration</h2>
          <p>Hurraayy experiences are travel activities that concludes on the same day. It can last from 1 hour to 16 hours. </p>
        </div>
        <div className="exp_con">
          <Row gutter={24}>
            <Col span={18}>
              <h5>Duration</h5>
              <Form.Item>
                {getFieldDecorator("duration", {
                  initialValue: state['duration'],
                  rules: [
                    {
                      required: false,
                      message: "",
                    },
                  ],
                })(
                  <Select>
                    {/* {vDuration.length > 0 &&
                      vDuration.map((item, key) => {
                        return (
                          <Option key={key} value={item}>
                            {item + " hours"}
                          </Option>
                        );
                      })} */}
                    <Option value={0.10}>10 minutes</Option>
                    <Option value={0.15}>15 minutes</Option>
                    <Option value={0.20}>20 minutes</Option>
                    <Option value={0.30}>30 minutes</Option>
                    <Option value={1}>1 hours</Option>
                    <Option value={1.50}>1.5 hours</Option>
                    <Option value={2}>2 hours</Option>
                    <Option value={2.50}>2.5 hours</Option>
                    <Option value={3}>3 hours</Option>
                    <Option value={3.50}>3.5 hours</Option>
                    <Option value={4}>4 hours</Option>
                    <Option value={4.50}>4.5 hours</Option>
                    <Option value={5}>5 hours</Option>
                    <Option value={5.50}>5.5 hours</Option>
                    <Option value={6}>6 hours</Option>
                    <Option value={6.50}>6.5 hours</Option>
                    <Option value={7}>7 hours</Option>
                    <Option value={7.50}>7.5 hours</Option>
                    <Option value={8}>8 hours</Option>
                    <Option value={8.50}>8.5 hours</Option>
                    <Option value={9}>9 hours</Option>
                    <Option value={9.50}>9.5 hours</Option>
                    <Option value={10}>10 hours</Option>
                    <Option value={10.50}>10.5 hours</Option>
                    <Option value={11}>11 hours</Option>
                    <Option value={11.50}>11.5 hours</Option>
                    <Option value={12}>12 hours</Option>
                    <Option value={12.50}>12.5 hours</Option>
                    <Option value={13}>13 hours</Option>
                    <Option value={13.50}>13.5 hours</Option>
                    <Option value={14}>14 hours</Option>
                    <Option value={14.50}>14.5 hours</Option>
                    <Option value={15}>15 hours</Option>
                    <Option value={15.50}>15.5 hours</Option>
                    <Option value={16}>16 hours</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          {/* <h4>What time would you typically start your experience?</h4>
            <p>Irure adipisicing voluptate irure culpa velit culpa velit labore.</p> */}
          <Row gutter={24}>
            <Col span={18}>
              {/* <h5>Experience start time</h5> */}
              <h5>What time your experience normally starts?</h5>
              <p>Later on from your host panel you will be able to select the dates on which you wish to organize the event.</p>
              <Form.Item>
                {getFieldDecorator("startTime", {
                  initialValue: state['startTime'],
                  rules: [
                    {
                      required: false,
                      message: "",
                    },
                  ],
                })(
                  <Select>
                    {vStartTime.length > 0 &&
                      vStartTime.map((item, key) => {
                        return (
                          <Option key={key} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    {/* <Option value="11:30">11:30 AM</Option> */}
                  </Select>
                )}
              </Form.Item>
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
export default Form.create()(Duration);
