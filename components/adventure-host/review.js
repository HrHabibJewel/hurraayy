import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Modal,
  Input,
  Radio,
  Icon,
  Checkbox,
  Spin,
} from "antd";
import { useRouter, Router } from "next/router";
import { $axios } from "../../lib/http-service";
import { adventureHost, adventureHostDestroy } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAdventureHostEditData, getAdventureId } from "../../lib/utils/utility";
import { getUserInfo } from "../../lib/storage.service";
const Review = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const adventureId = getAdventureId();
  let userInfo = useSelector(getUserInfo);
  const [agree, setAgree] = useState(null)

  const [state, setState] = useState({
    licenseType: "2",
    peopleExpecet: "",
    skillLevel: "",
    AdditionalRecquirements: "",
    verifyId: ""
  });
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  useEffect(() => {
    getAdventureHostEditData().then((resp) => {
      if (resp && resp['licenseType']) {
        setState({ ...state, licenseType: resp['licenseType'] });
      }
      setLoading(false);
    })
  }, []);

  const closeModal = () => {
    setVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      if (!err) {
        //console.log("Received values of form: ", values);
        // next({ page: 2, step: 2, data: true });
        let params = {};
        params["licenseType"] = values["licenseType"];

        $axios.put("adventure/" + adventureId + "/review/", JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            dispatch(
              adventureHost("review", adventureId)
            );
            setVisible(true)
            // next({ page: 1, step: 5, data: true });
          }
        });
      }
    });
  };
  const goToHostPanel = () => {
    dispatch(adventureHostDestroy());
    router.push('/host-panel');
  }
  const onCheckChange = (e) => {
    if (e.target.checked) {
      setAgree(true)
    }
    else {
      setAgree(false)
    }

    // console.log("agree",agree);
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right" }}>
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          <h1>Last step and then we are done!</h1>
          <p>
            Different cities have different laws in order to regulate travel based activities and tours. You may require licence and permission from local authorities to conduct tours or travel activities.
          </p>
        </div>
        <div className="exp_con">
          <Row gutter={24}>
            <Col span={18}>
              <h5>Which of the following applies to you and the adventure?</h5>
              <Form.Item>
                {getFieldDecorator("licenseType", {
                  initialValue: state['licenseType'],
                  rules: [
                    {
                      required: true,
                      message: "",
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio style={radioStyle} value={"1"}>
                      I have the required licences to conduct tours, services related to travel & travel based activities.
                        </Radio>
                    <Radio style={radioStyle} value={"2"}>
                      I do not have the required licences to conduct tours, services related to travel & travel based activities.
                        </Radio>
                    <Radio style={radioStyle} value={"3"}>
                      No licences are required for me to conduct tours, services related to travel & travel based activities.
                        </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          {/* <h4>Review our policies before you submit to Hurraayy</h4> */}
          <Row gutter={24}>
            <Col span={18}>
              <h5>By submitting, I confirm the following is true:</h5>
              <Form.Item>
                {getFieldDecorator("verifyId", {
                  initialValue: state["verifyId"],
                  rules: [
                    {
                      required: true,
                      message: "Please select all options.....",
                    },
                  ],
                })(
                  <Checkbox.Group
                    style={{ width: "100%" }}
                  >
                    {/* <Checkbox value="1">I agree to comply with all applicable local food safety recquirements. I understand
                    that if Hurraayy is made aware that my adventure does not comply with these
guidelines and/or local food safety recquirements, it may be removed from Hurraayy.</Checkbox>
                    <Checkbox value="2">I have read and understand <a href="#">Hurraay Food Safety Guidelines</a>, and I confirm that my
adventure complies with them. When hosting, I agree to:
                        <ul>
                        <li>- Keep myself, my work area, and equipment clean</li>
                        <li>- Separate raw and cook foods</li>
                        <li>- Cook meat and poultry to the appropriate temperature</li>
                        <li>- Keep food at safe temperatures</li>
                        <li>- Use safe water and raw materials</li>
                      </ul>
                    </Checkbox>
                    <Checkbox value="3">My adventure complies with local news. <a href="#">Learn more</a> about other laws (like business
licensing) that may apply.</Checkbox> */}
                    <Checkbox value="4">My travel activities comply with local laws and culture.</Checkbox>
                    <Checkbox style={{ marginLeft: "0" }} value="5" onChange={onCheckChange}>I agree to the<a href="#" onClick={() => router.push("/terms")}>Hurraayy terms & conditions</a> and <a href="#" onClick={() => router.push("/terms")} >refund policies.</a>.</Checkbox>
                  </Checkbox.Group>
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
                  props.continue({ page: 7, step: 4 });
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
                type="primary" htmlType="submit"
                disabled={agree ? false : true}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
      <Modal
        title={null}
        closable={true}
        onCancel={closeModal}
        visible={visible}
        footer={null}
      // onOk={Router.push({pathname:"/hosting/listings"})}
      >
        <div className="text-center px-4 pt-4 pl-2">
          <b>Hi {userInfo['name']}, thank you for listing the adventure on Hurraayy.</b>
          <br />
          <br />
          <p>As part of our policy the listing will go through the approval process and you will be able to check the status of your listing(s) from your host panel.  Approval normally takes no more than 72 hours.</p>
          <Button
            type="primary"
            style={{ margin: '0 auto', display: 'block', marginBottom: '20px' }}
            onClick={() => goToHostPanel()}>
            Go to Host Panel
                        </Button>
          <p>If you have further question or if you need our assistance then please do not hesitate to contact us through our chat support. </p>
          <p>Thank you once again. </p>
        </div>
      </Modal>
    </Spin>
  );
};
export default Form.create()(Review);
