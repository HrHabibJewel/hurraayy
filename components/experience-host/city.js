import React, { useState, useEffect } from "react";
import { Col, Form, Button, Select, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

const { Option } = Select;

const City = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState("");
  const experienceId = getExperienceId();
  const dispatch = useDispatch();

  useEffect(() => {
    getCity();
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['city']) {
       setCity(resp['city']['id']);
      }
      setLoading(false);
    })
  }, []);

  function getCity() {
    $axios.get("/cities").then((resp) => {
      if(resp && resp.status == 200) {
        setCityList(resp.data);
      }
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      if (!err) {
        let params = {};
        params["cityId"] = values["city"];
        if(experienceId) {
          $axios.put("experience/"+experienceId, JSON.stringify(params)).then(function (resp) {
            if (resp && resp.status == 200) {
              dispatch(
                experienceForm("city", experienceId)
              );
              next({ page: 2, step: 1, data: true });
            }
          });
        } else {
          $axios.post("experience", JSON.stringify(params)).then(function (resp) {
            if (resp && resp.status == 201) {
              dispatch(
                experienceForm("city", resp.data["id"])
              );
              next({ page: 2, step: 1, data: true });
            }
          });
        }
      }
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
      <div>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }} >
            Save & Exit
          </Button>
        </Form.Item>
      </div>
        <div className="exp_con">
          <h2>Location</h2>
          <p>Select the city where your activity will take place</p>
        </div>
        <div className="exp_con">
          <Form.Item>
             {getFieldDecorator("city", {
                  initialValue: city,
                  rules: [
                    {
                      required: true,
                      message: "Please select your city!",
                    },
                  ],
                })(
                  <Select size="large" placeholder="Apartment" >
                    <Option value="">Please select your city</Option>
                    {cityList.length > 0 &&
                      cityList.map((item, key) => {
                       return (
                          <Option key={key} value={item.id}>
                            {item.name+", "+item.state.country.name}
                          </Option>
                       );
                      })}
                  </Select>
                )}
          </Form.Item>
        </div>
        <div className="exp_con">
          <Col span={12}></Col>
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
export default Form.create()(City);
