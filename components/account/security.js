import React, { useEffect, useState } from "react";
import { Table, Spin, Calendar } from "antd";
import s from "../../components/host-panel/style.module.css";
// import { $axios } from "../../lib/http-service";
import { $managementAxios } from "../../lib/http-service";
import { Card, Form, Input, Button,Icon,Modal,Divider, Select } from "antd";

const card_style = {
  marginTop: 10,
  backgroundColor: "#f3f3f3",
  marginBottom: 10,
};

const UserSecurity = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(false);
  const [oldPass, setOldPass] = useState(null);
  const [newPass, setNewPass] = useState(null);
  const [confirmNewPass, setConfirmNewPass] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        var obj = {
          oldPwd: oldPass,
          pwd: newPass,
        };
        obj = JSON.stringify(obj);
        $managementAxios.put("/users/update-password", obj).then((resp) => {
          if (resp && resp.status == 200) {
            setModalVisible(true);
          }
        });
      }
    });
  };
  const validatePassword = (rule, value, callback) => {
    if (value && value !== newPass) {
      callback("Password not match!");
    } else {
      callback();
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };
  const openModal = () => {
    setModalVisible(true);
  };
  return (
    <div className="row">
      <div className="col-sm-12">
        <Spin spinning={loading} tip="Loading...">
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              <Card hoverable style={card_style} size="small">
                <div className="row">
                  <div className="col-sm-3">
                    <label>
                      <b className={`${s["account-title"]}`}>Password</b>
                    </label>
                  </div>
                  <div className="col-sm-7">
                    <div className="row">
                      <div className="col-sm-12">
                      <span className={`${s["account-value"]}`}>Current Password</span>
                        <Form.Item>
                          <Input
                            type="password"
                            onChange={(e) => setOldPass(e.target.value)}
                            value={oldPass}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-sm-12">
                      <span className={`${s["account-value"]}`}>New Password</span>
                        <Form.Item>
                          <Input
                            type="password"
                            onChange={(e) => setNewPass(e.target.value)}
                            value={newPass}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-sm-12">
                      <span className={`${s["account-value"]}`}>Confirm Password</span>
                        {/* <Form.Item>
                          <Input
                            type="password"
                            onChange={(e) => setConfirmNewPass(e.target.value)}
                            value={confirmNewPass}
                          />
                        </Form.Item> */}
                        <Form.Item>
                          {getFieldDecorator("xyz", {
                            initialValue: confirmNewPass,
                            rules: [
                              {
                                required: true,
                                message: "Please enter confirm password!",
                              },
                              { validator: validatePassword },
                            ],
                          })(
                            <Input
                              type="password"
                              onChange={(e) =>
                                setConfirmNewPass(e.target.value)
                              }
                              // value={confirmNewPass}
                            />
                          )}
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                      <div className="d-flex">
                        {/* <a>
                          <Button
                            //   onClick={disableEditName}
                            className={s.cancleButton}
                            type="link"
                            style={{ color: "#000000" }}
                          >
                            <b>Cancel</b>
                          </Button>
                        </a> */}
                        <a style={{ marginLeft: 10 }}>
                          <Button
                            onClick={handleSubmit}
                            type="link"
                            className={s.EditButton}
                          >
                            <b>Save</b>{" "}
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <Modal
            title={null}
            visible={modalVisible}
            // onOk={this.handleOk}
            onCancel={closeModal}
            closeIcon={null}
            footer={null}
            wrapClassName="border-modal exp-border-modal-sm"
          >
            <div className="col-12">
              <h2 className="fc-primary ff-heebo fw-600 lh-6x m-0 title-2x">
                Confirmation Alert
              </h2>
              <Divider />

              <div
                className="col-12"
                style={{ cursor: "pointer" }}
              >
                
                <p>Password Change Successful</p>
              </div>
              <Divider />
              <div className="d-flex justify-content-between" >
                <Button type="link" onClick={onCloseModal}>
                  OK
                </Button>
              </div>
            </div>
          </Modal>
        </Spin>
      </div>
    </div>
  );
};
export default Form.create()(UserSecurity);
