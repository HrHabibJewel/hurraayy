import React, { useState, useEffect } from "react";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Radio,
  Icon,
  Collapse,
  Spin,
} from "antd";
const { Option } = Select;
const { Panel } = Collapse;

const Language = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [lan, setLan] = useState("");
  const dispatch = useDispatch();
  const [lanList, setLanList] = useState([]);
  const experienceId = getExperienceId();

  useEffect(() => {
    getLanguage();
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['language']) {
        setLan(resp['language']['id']);
      }
      setLoading(false);
    })
  }, []);
  

  function getLanguage() {
    $axios.get("/language").then((resp) => {
      if(resp && resp.status == 200) {
        setLanList(resp.data);
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
      params["languageId"] = values["language"];
      $axios.put("experience/"+experienceId+"/language/", JSON.stringify(params)).then(function (resp) {
      if (resp && resp.status == 200) {
        dispatch(
          experienceForm("language", experienceId)
        );
        next({ page: 2, step: 2, data: true });
      }
    });
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={{ span: 24 }}>
            <Form.Item>
              <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }}>
                Save & Exit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <div className="exp_con">
          {/* <h2>Choose your primary language</h2> */}
          <h2>What is your native language?</h2>
          <p>
          It is assumed that you are efficient in reading, writing and speaking in your native language.
          </p>
        </div>
        {/* <div className="exp_con">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            // expandIcon={({ isActive }) => (
            //   <Icon type="caret-right" rotate={isActive ? 90 : 0} />
            // )}
            className="exp_tips_collapse"
          >
            <Panel header={<b style={{ color: "#ff6204" }}>Tips</b>} key="1">
              <p className="exp_list">
                You should be able to read, write and speak in your primary
                language
              </p>
              <p className="exp_list mb-0">
                If you speak more languages, you can always add them to your
                experience page in the future
              </p>
            </Panel>
          </Collapse>
        </div> */}
        <div className="exp_con">
          <h6>Primary language</h6>
          <Form.Item>
            {getFieldDecorator("language", {
              initialValue: lan,
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Select
                size="large"
                style={{ maxWidth: "50%" }}
                placeholder="Language"
              >
                <Option value="">
                        Select a primary language
                </Option>
                {
                  lanList.length > 0 &&
                  lanList.map((item, key) => {
                    return (
                       <Option key={key} value={item.id}>
                         {item.name}
                       </Option>
                    );
                   })
                }
              </Select>
            )}
          </Form.Item>

          {/* <h6>
            Will people need to speak and understand English to enjoy the
            experince?
          </h6> */}
          {/* <Form.Item>
            {getFieldDecorator("languageExperience", {
              initialValue: lanExperience,
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Radio.Group>
                <Radio style={radioStyle} value={1}>
                  Yes, they will need to speak and understand English
                </Radio>
                <Radio style={radioStyle} value={2}>
                  Yes, they will need to speak and understand a bit of English,
                  but don’t need to be fluent
                </Radio>
                <Radio style={radioStyle} value={3}>
                  No, Yes, they don’t need to speak or understand English to
                  enjoy the experience
                </Radio>
              </Radio.Group>
            )}
          </Form.Item> */}
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
                  props.continue({ page: 2, step: 1 });
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
              >
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};
export default Form.create()(Language);
