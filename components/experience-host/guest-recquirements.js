import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Input,
  Radio,
  Icon,
  Checkbox,
  Spin,
} from "antd";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

const { Option } = Select;
let vAge = [];
for(let i=2; i<=18; i++) {
  vAge.push(i);
}

const GuestRecquirements = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    minimumAge: 18,
    parents:"",
    accessibilityFeatures: true,
    peopleExpecet: "",
    skillLevel: "",
    AdditionalRecquirements:"",
    verifyId:""
  });
  const dispatch = useDispatch();
  const experienceId = getExperienceId();
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  useEffect(() => {
    getExperienceFormEditData().then((resp) => {
      if(resp) {
        setState({ ...state, 
            minimumAge: resp['minAge'],  
            accessibilityFeatures: true, //resp['haveAccessibilityFeature'], 
            peopleExpecet: resp['activityLevelExpectation'],
            skillLevel: resp['skillRequired'],
            AdditionalRecquirements: resp['additionalRequirement']
        });
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
        params["activityLevelExpectation"] = values["peopleExpecet"];
        params["additionalRequirement"] = values["AdditionalRecquirements"];
        params["haveAccessibilityFeature"] = true; //values["accessibilityFeatures"];
        params["minAge"] = values["minimumAge"];
        params["skillRequired"] = values["skillLevel"];
        $axios.put("experience/"+experienceId+"/guest-requirements/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            experienceForm("guest-requirements", experienceId)
          );
          next({ page: 4, step: 4, data: true });
        }
      });
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
      <Form.Item>
          <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }} >
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          {/* <h2>Who can attend your experience?</h2> */}
          <h2>Guest requirements & activity level </h2>
          <p>You may mention if there is any minimum age level required to take part in the experience and what activity level is involved.</p>
        </div>
        <div className="exp_con">
          {
            //console.log("==", state)
          }
            <Row gutter={24}>
                <Col span={18}>
                <h5>Minimum age</h5>
                  {/* <p>Irure adipisicing voluptate irure culpa velit culpa velit labore.</p> */}
                    <Form.Item>
                    {getFieldDecorator("minimumAge", {
                        initialValue: state['minimumAge'],
                        rules: [
                            {
                            required: false,
                            message: "",
                            },
                        ],
                    })(
                        <Select>
                        {vAge.length > 0 &&
                        vAge.map((item, key) => {
                            return (
                              <Option key={key} value={item}>
                                {item}
                              </Option>
                            );
                          })}
                        </Select>
                    )}
                    </Form.Item>
                    {/* <Form.Item>
                    {getFieldDecorator("parents", {
                        initialValue: state["parents"]
                      })(
                        <Checkbox>
                          Children under 2 years of age can be brought along with parents without additional fees.
                        </Checkbox>
                      )}
                    </Form.Item> */}
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={18}>
                  <h5>Does your experience have any accessibility features?</h5>
                <Form.Item>
                  {getFieldDecorator("accessibilityFeatures", {
                    initialValue: state['accessibilityFeatures'],
                    rules: [
                      {
                        required: false,
                        message: "",
                      },
                    ],
                  })(
                    <Radio.Group>
                        <Radio style={radioStyle} value={false}>
                            Not right now
                        </Radio>
                        <Radio style={radioStyle} value={true}>
                            Yes, it does
                        </Radio>
                  </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={24}>
            <Col span={18}>
                {/* <h5>What activity level should people expecet?</h5> */}
                <h5>Your experience requires what activity level?</h5>
                {/* <p>Irure adipisicing voluptate irure culpa velit culpa velit labore.</p> */}
                <Form.Item>
                  {getFieldDecorator("peopleExpecet", {
                    initialValue: state['peopleExpecet'],
                    rules: [
                      {
                        required: false,
                        message: "",
                      },
                    ],
                  })(
                    <Radio.Group>
                        <Radio style={radioStyle} value={'Light'}>
                            Light
                        </Radio>
                        <Radio style={radioStyle} value={'Moderate'}>
                            Moderate
                        </Radio>
                        <Radio style={radioStyle} value={'Strenuous'}>
                            Strenuous
                        </Radio>
                        <Radio style={radioStyle} value={'Extreme'}>
                            Extreme
                        </Radio>
                  </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={18}>
                {/* <h5>What skill level is recquired?</h5> */}
                <h5>Does you experience require a certain level of skills? </h5>
                <p>Some activities such as trekking, mountain climbing requires special training.</p>
                <Form.Item>
                    {getFieldDecorator("skillLevel", {
                        initialValue: state['skillLevel'],
                        rules: [
                        {
                            required: false,
                            message: "",
                        },
                        ],
                    })(
                        <Radio.Group>
                            <Radio style={radioStyle} value={'Beginner'}>
                                Beginner
                            </Radio>
                            <Radio style={radioStyle} value={'Intermediate'}>
                                Intermediate
                            </Radio>
                            <Radio style={radioStyle} value={'Advanced'}>
                                Advanced
                            </Radio>
                    </Radio.Group>
                    )}
                    </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col span={18}>
                  <h5>Additional requirements (optional)</h5>
                    <Form.Item>
                    {getFieldDecorator("AdditionalRecquirements", {
                        initialValue:state['AdditionalRecquirements']
                    })(<Input.TextArea rows={4}/>)}
                    </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={24}>
                <Col span={18}>
                  <h5>Recqire verified ID</h5>
                  <p>Irure adipisicing voluptate irure culpa velit culpa velit labore.</p>
                  <Form.Item>
                    {getFieldDecorator("verifyId", {
                        initialValue: state["verifyId"]
                      })(
                        <Checkbox>
                          Recquire the booker to <a>verify their ID</a>
                        </Checkbox>
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
                  props.continue({ page: 2, step: 4 });
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
export default Form.create()(GuestRecquirements);
