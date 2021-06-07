//conflicted on this js
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Modal,
  Radio,
  Icon,
  Checkbox,
  Spin,
} from "antd";
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
  FacebookIcon,
  EmailIcon,
  WhatsappIcon,
} from "react-share";
import { useRouter, Router } from "next/router";
import { $axios } from "../../lib/http-service";
import { getUserInfo } from "../../lib/storage.service";
import {
  experienceForm,
  experienceFormDestroy,
} from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  getExperienceFormEditData,
  getExperienceId,
} from "../../lib/utils/utility";

const Review = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const router = useRouter();
  let userInfo = useSelector(getUserInfo);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const experienceId = getExperienceId();
  const [agree, setAgree] = useState(null);

  const [state, setState] = useState({
    licenseType: "2",
    peopleExpecet: "",
    skillLevel: "",
    AdditionalRecquirements: "",
    verifyId: "",
  });
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  useEffect(() => {
    // console.log(userInfo);
    getExperienceFormEditData().then((resp) => {
      if (resp && resp["licenseType"]) {
        setState({ ...state, licenseType: resp["licenseType"] });
      }
      setLoading(false);
    });
  }, []);

  const closeModal = () => {
    setVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      if (!err) {
        let params = {};
        params["licenseType"] = values["licenseType"];

        $axios
          .put(
            "experience/" + experienceId + "/review/",
            JSON.stringify(params)
          )
          .then(function (resp) {
            if (resp && resp.status == 200) {
              dispatch(experienceForm("review", experienceId));
              setVisible(true);
              // next({ page: 1, step: 5, data: true });
            }
          });
      }
    });
  };

  const goToHostPanel = () => {
    dispatch(experienceFormDestroy());
    router.push("/host-panel");
  };
  const onCheckChange = (e) => {
    if (e.target.checked) {
      setAgree(true);
    } else {
      setAgree(false);
    }

    // console.log("agree",agree);
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{ float: "right", marginTop: "20px" }}
          >
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          {/* <h1>Last step to review</h1> */}
          <h1>Last step and then we are done!</h1>
          {/* <h2>Just a few more questions before you submit</h2> */}
          <p>
            Different cities have different laws in order to regulate travel
            based activities and tours. You may require licence and permission
            from local authorities to conduct tours or travel activities.
          </p>
        </div>
        <div className="exp_con">
          {/* <Row gutter={24}>
            <Col span={18}>
              <h5>
                Are you complying with local tourism laws and location
                requirements?
              </h5>
              <p>
                Dolore adipisicing id adipisicing commodo duis dolore
                exercitation mollit cillum non cillum veniam excepteur. Anim
                adipisicing minim aute sunt ipsum fugiat excepteur in et
                cupidatat elit. Consectetur amet commodo anim qui deserunt
                nostrud labore consectetur laboris amet officia fugiat et. Elit
                ea reprehenderit occaecat excepteur nisi id dolor. Irure elit
                sit laboris laboris nulla ullamco.In ipsum commodo adipisicing
                culpa irure .
              </p>
              <p>
                Ullamco anim proident aliquip ullamco nulla. Elit cillum amet
                irure commodo. Ea occaecat dolor aliquip aute culpa officia
                nostrud anim dolore adipisicing non ullamco esse. Ullamco
                proident enim sit culpa nostrud adipisicing anim magna quis.
                Cillum pariatur aute do ipsum labore labore aute ipsum
                consectetur eiusmod. Reprehenderit dolore excepteur ad magna.
              </p>
            </Col>
          </Row> */}
          <Row gutter={24}>
            <Col span={18}>
              {/* <h5>Which of the following applies to you and the experience?</h5> */}
              <h5>Which of the following is true in your case?</h5>
              <Form.Item>
                {getFieldDecorator("licenseType", {
                  initialValue: state["licenseType"],
                  rules: [
                    {
                      required: false,
                      message: "",
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio style={radioStyle} value={"1"}>
                      I have the required licences to conduct tours, services
                      related to travel & travel based activities.
                    </Radio>
                    <Radio style={radioStyle} value={"2"}>
                      I do not have the required licences to conduct tours,
                      services related to travel & travel based activities.
                    </Radio>
                    <Radio style={radioStyle} value={"3"}>
                      No licences are required for me to conduct tours, services
                      related to travel & travel based activities.
                    </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          {/* <h4>Review our policies before you submit to Hurraayy</h4> */}
          {/* <Row gutter={24}>
            <Col span={18}>
              <h5>Minimum guests</h5>
              <p>
                Irure adipisicing voluptate irure culpa velit culpa velit labore
                voluptate eiusmod ullamco ea veniam. Anim enim magna ut cillum
                consequat exercitation ullamco ut officia.
              </p>

              <h5>Exclusivity</h5>
              <p>
                Irure adipisicing voluptate irure culpa velit culpa velit labore
                voluptate eiusmod ullamco ea veniam. Anim enim magna ut cillum
                consequat exercitation ullamco ut officia.
              </p>
            </Col>
          </Row> */}
          <Row gutter={24}>
            <Col span={18}>
              {/* <h5>By submitting, I confirm the following is true:</h5> */}
              <h5>I also confirm that:</h5>
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
                  <Checkbox.Group style={{ width: "100%" }}>
                    {/* <Checkbox value="1">
                      I agree to comply with all applicable local food safety
                      recquirements. I understand that if Hurraayy is made aware
                      that my experience does not comply with these guidelines
                      and/or local food safety recquirements, it may be removed
                      from Hurraayy.
                    </Checkbox> */}
                    <Checkbox value="1">
                      My travel activities comply with local laws and culture.
                    </Checkbox>
                    {/* <Checkbox value="2">
                      I have read and understand{" "}
                      <a href="#">Hurraay Food Safety Guidelines</a>, and I
                      confirm that my experience complies with them. When
                      hosting, I agree to:
                      <ul>
                        <li>
                          - Keep myself, my work area, and equipment clean
                        </li>
                        <li>- Separate raw and cook foods</li>
                        <li>
                          - Cook meat and poultry to the appropriate temperature
                        </li>
                        <li>- Keep food at safe temperatures</li>
                        <li>- Use safe water and raw materials</li>
                      </ul>
                    </Checkbox>
                    <Checkbox value="3">
                      My experience complies with local news.{" "}
                      <a href="#">Learn more</a> about other laws (like business
                      licensing) that may apply.
                    </Checkbox>
                    <Checkbox value="4">
                      I confirm that my descriptions and photos are my own and
                      accurately reflect my experience.
                    </Checkbox> */}
                    <Checkbox
                      value="2"
                      onChange={onCheckChange}
                      style={{ marginLeft: -0 }}
                    >
                      I agree to the{" "}
                      <a href="https://hurraayy.com/terms">Hurraayy terms</a> &{" "}
                      <a href="https://hurraayy.com/terms">
                        conditions and refund policies.
                      </a>
                      .
                    </Checkbox>
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
                type="primary"
                htmlType="submit"
                disabled={agree ? false : true}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
      {/* <Modal
        title={null}
        closable={true}
        onCancel={closeModal}
        visible={visible}
        footer={null}
      >
        <b>
          Hi {userInfo["name"]}, your booking has been successful. Thank you for
          using Hurraayy.{" "}
        </b>
        <br />
        <br />
        <p>
          Please check your email, we have sent booking details along with host
          contacts, location, access details etc. You can check your upcoming
          trips from Trips section.{" "}
        </p>
        <Button
          type="primary"
          style={{ margin: "0 auto", display: "block", marginBottom: "20px" }}
          onClick={() => goToHostPanel()}
        >
          Go to Host Panel
        </Button>
        <h5  style={{textAlign:"center"}}>or share to</h5>
        <div className="row">
          <div className="col-sm-12"  style={{textAlign:"center"}}
          onClick={() => goToHostPanel()}>
          <FacebookShareButton
          url={"https://hurraayy.com/experience-details?id="+experienceId+"&criteria="}
          quote={"Hurraayy"}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <EmailShareButton
          url={"https://hurraayy.com/experience-details?id="+experienceId+"&criteria="}
          subject={"Experience share"}
          body="This is my Experience which is posted in ::Hurraayy::"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
        <WhatsappShareButton
          url={"https://hurraayy.com/experience-details?id="+experienceId+"&criteria="}
          title={"Experience share"}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
          </div>
        
        </div>
        
        <p>
          If you have further question or if you need our assistance then please
          do not hesitate to contact us through our chat support.{" "}
        </p>
        <p>Thank you once again. </p>
      </Modal> */}
      <Modal
        title={null}
        closable={true}
        onCancel={closeModal}
        visible={visible}
        footer={null}
        style={{ borderRadius: "100px" }}

      // onOk={Router.push({pathname:"/hosting/listings"})}
      >
        <div className="px-4 pt-4 pb-2 text-center">


          <b>Hi {userInfo["name"]}, thank you for listing the experience on Hurraayy.</b>
          <br />
          <br />
          <p>As part of our policy the listing will go through the approval process and you will be able to check the status of your listing(s) from your host panel.  Approval normally takes no more than 72 hours.</p>
          <Button
            type="primary"
            style={{ margin: '0 auto', display: 'block', marginBottom: '20px' }}
            onClick={() => goToHostPanel()}
          >
            Go to Host Panel
            </Button>
          <p>
            If you have further question or if you need our assistance then
              please do not hesitate to contact us through our chat support.{" "}
          </p>
          <p>Thank you once again. </p>
        </div>
      </Modal>
    </Spin>
  );
};
export default Form.create()(Review);
