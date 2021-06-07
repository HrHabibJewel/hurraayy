import React, { useState, useEffect } from "react";
import { Icon, Col, Form, Button, Input, Spin, Row } from "antd";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

const GuestBring = (props) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([{name:''}]);
  const { getFieldDecorator, validateFields } = props.form;
  const experienceId = getExperienceId();
  const dispatch = useDispatch();

  useEffect(() => {
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['guestBring']) {
        let items = resp['guestBring'].split("_");
        let itemsPush = [];
        items && items.length > 0 && items.map((row) => {
          itemsPush.push({
            name:row
          })
        })
        setItems(itemsPush)
      }
      setLoading(false);
    })
  }, []);

  //const handleSubmit = (e) => {
    function handleSubmit(e) {
    const next = props.continue;
    e.preventDefault();
    validateFields((err, values) => {
    let params = {};
    let itemStr = "";
    for(let key in values) {
      if(values[key]){
        itemStr += values[key]+"_";
      }
    }
    let _itemStr = itemStr.slice(0, -1)
    params["guestBringItems"] = _itemStr;
   
    $axios.put("experience/"+experienceId+"/guest-bring/", JSON.stringify(params)).then(function (resp) {
      if (resp && resp.status == 200) {
        dispatch(
          experienceForm("guest-bring", experienceId)
        );
        next({ page: 6, step: 3, data: true });
      }
    });
  })
  };
  const addItem = () => {
    setItems([...items, { name: ''}]);
  }
  const handleChange = (e, key) => {
    let _newItems = items;
    _newItems[key].name = e.target.value
    setItems([...items], _newItems);
  }
  return (
    
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Item>
              <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }}>
                Save & Exit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <div className="exp_con">
          {/* <h2>What should guest bring with them?</h2> */}
          <h2>Would you request your guests to bring anything with them?</h2>
          <p>
          i.e walking shoes, bottle of water, umbrella, rain coat etc.
          </p>
        </div>
        <div className="exp_con">
          {
            items && items.length > 0 &&
            items.map((item, key) => {
              return(
                <Form.Item>
                    {getFieldDecorator(`${"item_name_"+key}`, {
                       initialValue: item['name'],
                        rules: [
                            {
                            required: true,
                            message: `${"Plz enter item"+key+1}`,
                            },
                        ],
                    })(
                      <Input placeholder="Walking sticks..." onKeyDown={(e)=> e.keyCode == 13 ? e.preventDefault(): ''} onChange={(e) => handleChange(e, key)}/>
                    )}
                    </Form.Item>
              )
            })
          }
          {/* <a onClick = {addItem}>+ Add another item</a> */}
          <a onClick = {addItem}>+ Add items</a>
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
                  props.continue({ page: 4, step: 3 });
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
export default Form.create()(GuestBring);
