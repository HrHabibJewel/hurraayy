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
  Icon,
  Input,
  Spin
} from "antd";
const { Option } = Select;

const WellBe = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const experienceId = getExperienceId();

  useEffect(() => {
    getLocation();
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['descriptionWhereWillBe']) {
        setDescription(resp['descriptionWhereWillBe']);
      }
      setLoading(false);
    })
  }, []);

  function getLocation() {
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
      params["description"] = values["description"];
      params["locationIds"] = "";
      $axios.put("experience/"+experienceId+"/about-where-will-be/", JSON.stringify(params)).then(function (resp) {
      if (resp && resp.status == 200) {
        dispatch(
          experienceForm("will-be", experienceId)
        );
        next({ page: 4, step: 3, data: true });
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
          {/* <h2>Describe each place you’ll be</h2> */}
          <h2>Places you will be visiting</h2>
          {/* <p>
            Irure adipisicing voluptate irure culpa velit culpa velit labore
            voluptate eiusmod ullamco ea veniam. Anim enim magna ut cillum
            consequat exercitation ullamco ut officia.
          </p> */}
        </div>

        <div className="exp_con">
          {/* <h6>Describe each place you’ll visit on the experience</h6> */}
          <h6>You may be visiting several places in the experience. Mention each place with name and short description.</h6>
          <Form.Item>
            {getFieldDecorator("description", {
              initialValue:description,
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
                  props.continue({ page: 2, step: 3 });
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
export default Form.create()(WellBe);
