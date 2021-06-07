import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Input,
  Icon,
  Collapse,
  Spin,
} from "antd";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

const { Panel } = Collapse;

const Title = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const experienceId = getExperienceId();

  useEffect(() => {
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['title']) {
        setTitle(resp['title']);
      }
      setLoading(false);
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
        params["title"] = values["title"];
        $axios.put("experience/"+experienceId+"/title/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            experienceForm("title", experienceId)
          );
          next({ page: 7, step: 3, data: true });
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
          <h2>Give your experience a title</h2>
          <p>Keep the title short, definitive and exciting so that your customers can understand the purpose of your experience easily.</p>
        </div>
        {/* <div className="exp_con">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            className="exp_tips_collapse"
          >
            <Panel header={<b style={{ color: "#ff6204" }}>Tips</b>} key="1">
              <p className="exp_list">
                Think about writing a title that describes your main activity so
                guests get a sense of what they’ll be doing. Consider using
                action verbs and making it unique to set your experience apart.
              </p>
              <p className="exp_list mb-0">
                Heighlight the culture, heritage, or region of the dish you’re
                cooking together.
              </p>
            </Panel>
          </Collapse>
        </div> */}
        <div className="exp_con">
          {/* <h6>What’s the title of your experience?</h6> */}
          <h6>Title of the experience</h6>
          <Form.Item>
            {getFieldDecorator("title", {
              initialValue: title,//Walking sticks
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Input
                size="large"
                style={{ maxWidth: "50%" }}
                placeholder="Title here..."
              ></Input>
            )}
          </Form.Item>
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
                  props.continue({ page: 5, step: 3 });
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
export default Form.create()(Title);
