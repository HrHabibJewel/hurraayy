import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Icon,
  Spin,
  Checkbox
} from "antd";
import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAdventureHostEditData, getAdventureId } from "../../lib/utils/utility";

const Notes = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    additional: "",
    shine: false
  });
  const dispatch = useDispatch();
  const adventureId = getAdventureId();

  useEffect(() => {
    getAdventureHostEditData().then((resp) => {
      if (resp) {
        setState({ ...state, shine: resp['anythingShouldKnow'], additional: resp['additionalNote'] });
      }
      setLoading(false);
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
      params["additionalNote"] = values["additional"];
      params["anythingShouldKnow"] = values["shine"];
      params["guestKnowBeforebook"] = "";
      $axios.put("adventure/" + adventureId + "/notes/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            adventureHost("note", adventureId)
          );
          next({ page: 3, step: 4, data: true });
        }
      });
    });
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
          <h2>You can add additional notes for your guests</h2>
          <p>Add notes such as about weather, difficulty level of the adventure etc.</p>
        </div>

        <div className="exp_con">
          <Row gutter={24}>
            <Col span={18}>
              <Form.Item>
                {getFieldDecorator("additional", {
                  initialValue: state['additional']
                })(<Input.TextArea rows={4} placeholder="This is your time to shine. Don’t be afraid to brag." />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={18}>
              {/* <h5>Is there anything else guests should know?</h5> */}
              <Form.Item>
                {getFieldDecorator("shine", {
                  initialValue: state["shine"]
                })(
                  <Checkbox>
                    No additional notes needed
                        </Checkbox>
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
                  props.continue({ page: 1, step: 4 });
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
export default Form.create()(Notes);
