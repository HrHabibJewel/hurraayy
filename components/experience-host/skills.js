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

const Skills = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [questionAnswerList, setQuestionAnswerList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const dispatch = useDispatch();
  const experienceId = getExperienceId();
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  const customPanelStyle = {
    background: "#f7f7f7",
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: "hidden",
  };

  useEffect(() => {
    getQuestionAnswer();
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['experienceSkillAnswerVOS']) {
        let _qans = [];
        for(let key in resp['experienceSkillAnswerVOS']) {
          if(resp['experienceSkillAnswerVOS'][key]['experienceSkillQuestionVO']){
            _qans[resp['experienceSkillAnswerVOS'][key]['experienceSkillQuestionVO']['id']] =resp['experienceSkillAnswerVOS'][key]['id'] 
          }
        }
        setQuestions(_qans);
      }
      setLoading(false);
    })
  }, []);

  function getQuestionAnswer() {
    $axios.get("/experience_skill_question").then((resp) => {
      if(resp && resp.status == 200) {
        setQuestionAnswerList(resp.data);
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
     // console.log("Received values of form: ", values);
      let params = {};
      params['expertise'] = "Tour guide"
      if(Object.keys(values).length > 0) {
        let ans = "";
        for(let key in values) {
          ans += values[key]+","
          params['answerIds'] = ans.slice(0,-1)
        }
      }
     $axios.put("experience/"+experienceId+"/skill-set/", JSON.stringify(params)).then(function (resp) {
      if (resp && resp.status == 200) {
        dispatch(
          experienceForm("skills", experienceId)
        );
        next({ page: 1, step: 3, data: true });
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
          {/* <h2>Your Skillsets</h2> */}
          <h2>We would like to know about you</h2>
          {/* <b>Tell us a bit about your background</b>
          <p>
            Minim cupidatat id culpa ullamco. Labore sint in tempor cupidatat
            nostrud.
          </p> */}
        </div>

        <div className="exp_con">
          {
            questionAnswerList.length > 0 &&
            questionAnswerList.map((item, key) => {
              return (
                <div className="row" key={key}>
                    <Col span={24}>
                    <h6>{item['name']}</h6>
                    <Form.Item>
                      {getFieldDecorator("qa_"+item['id'], {
                      initialValue: questions[item['id']],
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })( 
                        <Radio.Group>
                        {
                          item['experienceSkillAnswerVOS'].length > 0 &&
                          item['experienceSkillAnswerVOS'].map((item1, key1) => {
                            return(
                                <Radio style={radioStyle} value={item1['id']} key={key1}>
                                  {item1['name']}
                                </Radio>
                            )
                          })
                        }
                      </Radio.Group>
                      )}
                    </Form.Item>
                    </Col>
                </div>
              );
              })
          }
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
                  props.continue({ page: 1, step: 2 });
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
                htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};
export default Form.create()(Skills);
