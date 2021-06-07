import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Icon, Input, Spin, Card } from "antd";
import TextChange from "../../components/ui/form/textChange";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  getExperienceFormEditData,
  getExperienceId,
} from "../../lib/utils/utility";

const Price = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    pricePerGuest: 0,
    numberOfGuest: 4,
  });
  const dispatch = useDispatch();
  const experienceId = getExperienceId();

  useEffect(() => {
    getExperienceFormEditData().then((resp) => {
      if (resp && resp["pricePerGuest"]) {
        setState({ ...state, pricePerGuest: resp["pricePerGuest"] });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      // console.log("Received values of form: ", values);
      let params = {};
      params["pricePerGuest"] = values["pricePerGuest"];

      $axios
        .put(
          "experience/" + experienceId + "/price_per_guest/",
          JSON.stringify(params)
        )
        .then(function (resp) {
          if (resp && resp.status == 200) {
            dispatch(experienceForm("price", experienceId));
            next({ page: 7, step: 4, data: true });
          }
        });
    });
  };
  const setStateFunc = (val) => {
    setState({ ...state, numberOfGuest: val });
  };
  const handlePrice = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) {
      val = 0;
    }
    setState({ ...state, pricePerGuest: val });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }}>
                Save & Exit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <div className="exp_con">
              {/* <h2>Set a price per guest</h2> */}
              <h2>Price per person</h2>
              <p>
                You have the freedom of setting price per person. This is the
                price each person will pay.
              </p>
            </div>
            <div className="exp_con">
              <Row gutter={24}>
                <Col span={18}>
                  <Form.Item>
                    {getFieldDecorator("pricePerGuest", {
                      initialValue: state["pricePerGuest"],
                      rules: [
                        {
                          required: false,
                          message: "",
                        },
                      ],
                    })(<Input placeholder="USD $" onChange={handlePrice} />)}
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
                      props.continue({ page: 5, step: 4 });
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
          </Col>
          {/* <Col span={8}>
            <div className="experince-price-table">
              <b className="d-block fs-18 mb-2">Pricing calculator</b>
              <table width="100%" className="lh-7x">
                <tbody>
                  <tr className="border-bottom">
                    <td>Price per guest</td>
                    <td className="float-right">{state["pricePerGuest"]}</td>
                  </tr>
                  <tr className="border-bottom">
                    <td>Number of guest</td>
                    <td className="float-right">
                      <TextChange
                        labelName=""
                        textName="numberOfGuest"
                        val={state["numberOfGuest"]}
                        valType={1}
                        textChange={setStateFunc}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>You’d make</th>
                    <th className="float-right">
                      ${state["numberOfGuest"] + state["pricePerGuest"]}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col> */}
        </Row>
      </Form>
    </Spin>
  );
};
export default Form.create()(Price);
