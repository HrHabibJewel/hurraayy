import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Icon, Input, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAdventureHostEditData, getAdventureId } from "../../lib/utils/utility";

const WellDo = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState("");
  const dispatch = useDispatch();
  const adventureId = getAdventureId();

  useEffect(() => {
    getAdventureHostEditData().then((resp) => {
      if (resp && resp['aboutYouWill']) {
        setAbout(resp['aboutYouWill']);
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
      $axios.put("adventure/" + adventureId + "/about-you-will/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            adventureHost("about-you-will", adventureId)
          );
          next({ page: 3, step: 3, data: true });
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
          <h2>Describe the activities you will be doing</h2>
          {/* <p>
            Irure adipisicing voluptate irure culpa velit culpa velit labore
            voluptate eiusmod ullamco ea veniam. Anim enim magna ut cillum
            consequat exercitation ullamco ut officia.
          </p> */}
        </div>

        <div className="exp_con">
          <h6>
            Guests need to know what they will be doing with you. Please describe the adventure in detail from start to end. Remember this is the main description of your activities.
          </h6>
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
                  props.continue({ page: 1, step: 3 });
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
export default Form.create()(WellDo);
