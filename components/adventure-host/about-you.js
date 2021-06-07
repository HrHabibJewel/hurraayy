import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Icon, Input, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAdventureHostEditData, getAdventureId } from "../../lib/utils/utility";

const AboutYou = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState("");
  const dispatch = useDispatch();
  const adventureId = getAdventureId();

  useEffect(() => {
    getAdventureHostEditData().then((resp) => {
      if (resp && resp['aboutYourSelf']) {
        setAbout(resp['aboutYourSelf']);
      }
      setLoading(false);
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
      params["about"] = values["about"];
      $axios.put("adventure/" + adventureId + "/about-yourself/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            adventureHost("about-yourself", adventureId)
          );
          next({ page: 2, step: 3, data: true });
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
              <Button htmlType="submit" style={{ float: "right" }}>
                Save & Exit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <div className="exp_con">
          <h2>Your short story</h2>
          {/* <p>
            Irure adipisicing voluptate irure culpa velit culpa velit labore
            voluptate eiusmod ullamco ea veniam. Anim enim magna ut cillum
            consequat exercitation ullamco ut officia.
          </p> */}
        </div>

        <div className="exp_con">
          <h6>Since you will be hosting activities the travellers need to know you well. Describe yourself, tell us what you do and why you love travel and hosting.</h6>
          <Form.Item>
            {getFieldDecorator("about", {
              initialValue: about,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input.TextArea autoSize={{ minRows: 6 }}></Input.TextArea>)}
          </Form.Item>

          {/* <h6>
            <b>Keep in mind:</b>{" "}
            <small>
              Guests are looking for expert in their field.{" "}
              <a href="#">Learn more</a>
            </small>
          </h6> */}
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
                  props.continue({ page: 2, step: 2 });
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
export default Form.create()(AboutYou);
