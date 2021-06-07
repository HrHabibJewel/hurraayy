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
const { Option } = Select;
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

let vGroupSize = [];
for(let i=2; i<=30; i++) {
  vGroupSize.push(i);
}

const GroupSize = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    minimumGroupSize: 18
  });
  const dispatch = useDispatch();
  const experienceId = getExperienceId();

  useEffect(() => {
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['minimumGroupSize']) {
       setState({ ...state, minimumGroupSize: resp['minimumGroupSize'] });
      }
      setLoading(false);
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      let params = {};
        params["minimumGroupSize"] = values["minimumGroupSize"];
        $axios.put("experience/"+experienceId+"/group_size/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            experienceForm("group-size", experienceId)
          );
          next({ page: 5, step: 4, data: true });
        }
      });
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <div>
        
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }}>
            Save & Exit
          </Button>
        </Form.Item>
        <div className="exp_con">
          {/* <h2>Maximum group size</h2> */}
          <h2>Group size</h2>
          <p>What's the group size of this particular experience? Pick a number.</p>
        </div>
        <div className="exp_con">
            <Row gutter={24}>
                <Col span={18}>
                    <Form.Item>
                    {getFieldDecorator("minimumGroupSize", {
                        initialValue: state['minimumGroupSize'],
                        rules: [
                            {
                            required: false,
                            message: "",
                            },
                        ],
                    })(
                        <Select>
                        {vGroupSize.length > 0 &&
                        vGroupSize.map((item, key) => {
                            return (
                              <Option key={key} value={item}>
                                {item}
                              </Option>
                            );
                          })}
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
                  props.continue({ page: 3, step: 4 });
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
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};
export default Form.create()(GroupSize);
