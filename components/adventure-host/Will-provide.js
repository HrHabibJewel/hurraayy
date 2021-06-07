import React, { useState, useEffect, Fragment } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Icon,
  Collapse,
  Spin,
  Checkbox,
  Modal,
  Divider,
} from "antd";
import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAdventureHostEditData, getAdventureId } from "../../lib/utils/utility";

const { Panel } = Collapse;

const WillProvide = (props) => {
  let provideArrList = null;
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep2, setModalStep2] = useState(false);
  const [groupProvide, setGroupProvide] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [provideList, setProvideList] = useState([]);
  const [selectedProvide1, setSelectedProvide1] = useState([]);
  const [updateEvents, setUpdateEvents] = useState([]);
  const [providingAnythingForGuest, setProvidingAnythingForGuest] = useState(false)
  const [selectedDataList, setSelectedDataList] = useState([])

  const adventureId = getAdventureId();
  const dispatch = useDispatch();

  const closeModal = () => {
    setModalVisible(false);
  };

  const onCloseModal = () => {
    setModalVisible(false)
    setModalStep2(false)
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const getProvideList = () => {
    if (groupProvide.length > 0 && selectedGroup) {
      $axios.get(`adventure_provide_group/${selectedGroup}/event-list-by-provide`).then(function (resp) {
        if (resp && resp.status == 200) {
          let _eventList = resp.data;
          setProvideList(_eventList)
          setModalStep2(true)
        }
      });
    }
  }

  const onContinue = () => {
    if (!modalStep2) {
      getProvideList()
      return;
    }
    if (selectedProvide1.length == 0) {
      return;
    }
    getSelectedDataList();
    setModalStep2(false)
    closeModal()

  };

  useEffect(() => {
    getGroupProvides()
    getAdventureHostEditData().then((resp) => {
      if (resp && resp['providingAnythingForGuest']) {
        setProvidingAnythingForGuest(resp['providingAnythingForGuest']);
      }
      if (resp && resp['adventureProvideGroups']) {
        let _data = [];
        let kArr = [];
        for (let key in resp['adventureProvideGroups']) {
          if (resp['adventureProvideGroups'][key]['adventureProvideVO']) {
            let groupId = resp['adventureProvideGroups'][key]['adventureProvideVO']['id'];
            if (!_data[groupId]) {
              kArr[groupId] = 0
              _data[groupId] = [];
              _data[groupId][kArr[groupId]] = resp['adventureProvideGroups'][key]['id']
            } else {
              kArr[groupId]++;
              _data[groupId][kArr[groupId]] = resp['adventureProvideGroups'][key]['id']
            }
          }
        }
        setSelectedProvide1(_data)
        getSelectedDataList(_data);

      }
      setLoading(false);
    })
  }, []);

  function getGroupProvides() {
    $axios.get("/adventure_provide").then((resp) => {
      if (resp && resp.status == 200) {
        setGroupProvide(resp.data);
        provideArrList = resp.data;
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let jsonData = getExperienceProvideJson();
    let params = {};
    params["experienceProvideJson"] = jsonData;
    params["providingAnythingForGuest"] = providingAnythingForGuest;
    const next = props.continue;
    $axios.put("adventure/" + adventureId + "/provide/", JSON.stringify(params)).then(function (resp) {
      if (resp && resp.status == 200) {
        dispatch(
          adventureHost("will-provide", adventureId)
        );
        closeModal();
        next({ page: 5, step: 3, data: true });
      }
    });
  };

  const getExperienceProvideJson = () => {
    let str = "";
    let i = 0;
    if (Object.keys(selectedProvide1).length > 0) {
      for (let key in selectedProvide1) {
        if (i > 0) {
          str += ",";
        }
        str += selectedProvide1[key].join(",");
        i++;
      }
    }
    return str;
  }

  const themeActiveClass = (item) => {
    setSelectedGroup(item['id'])
  }
  const onChange = (e) => {
    let _data = selectedProvide1;
    _data[selectedGroup] = e;
    setSelectedProvide1(_data);
  }

  function getSelectedDataList(_loadData = null) {
    let _data = [];
    let selectedData = [];
    let _groupProvide = [];
    let updateList = [];
    if (_loadData != null) {
      selectedData = _loadData
      _groupProvide = provideArrList;
    } else {
      selectedData = selectedProvide1
      _groupProvide = groupProvide;
    }
    if (_groupProvide && _groupProvide.length > 0) {
      for (let key in _groupProvide) {
        let _id = _groupProvide[key]['id']
        _data.push({
          id: _groupProvide[key]['id'],
          name: _groupProvide[key]['name'],
          provideGroupList: {}
        })
        if (_groupProvide[key]['provideGroupList'] && _groupProvide[key]['provideGroupList'].length > 0 &&
          selectedData[_id] && selectedData[_id] != undefined) {
          let provideGroupList = _groupProvide[key]['provideGroupList'];
          let selectedProvideList = selectedData[_id];
          let k1 = 0;
          for (let key1 in provideGroupList) {
            if (selectedProvideList.find(val => val == provideGroupList[key1]['id']) != undefined) {
              _data[key]['provideGroupList'][k1] = {
                id: provideGroupList[key1]['id'],
                name: provideGroupList[key1]['name']
              }
              updateList.push(provideGroupList[key1]['id']);
              k1++;
            }
          }
        }
      }
    }
    setUpdateEvents(updateList)
    setSelectedDataList(_data);
  }

  const onCheckChange = (e) => {
    setProvidingAnythingForGuest(e.target.checked)
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={{ span: 24 }}>
            <Form.Item>
              <Button htmlType="submit" style={{ float: "right" }} >
                Save & Exit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <div className="exp_con">
          <h2>Items included in the adventure package</h2>
          <p>
            Your adventure may include food, drinks, equipment, transportation etc. Mention what is included in the package.
          </p>
        </div>
        <div className="exp_con">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            // expandIcon={({ isActive }) => (
            //   <Icon type="caret-right" rotate={isActive ? 90 : 0} />
            // )}
            className="exp_tips_collapse"
          >
            {/* <Panel header={<b style={{ color: "#ff6204" }}>Tips</b>} key="1">
              <p className="exp_list">
                Try to provide guest with specific details about the food and
                drink
              </p>
              <p className="exp_list mb-0">
                Tell guests which allergies and dietary preferences you can
                accommodate when you add food as an item
              </p>
            </Panel> */}
          </Collapse>
          {
            selectedDataList && selectedDataList.length > 0 &&
            selectedDataList.map((item, key) => {
              let _len = Object.keys(item['provideGroupList']).length;
              return (
                <div key={key}>
                  <h6 className="textUnderline">{item['name']}</h6>
                  <ul className="nav-list">
                    {
                      item['provideGroupList'] && Object.keys(item['provideGroupList']).length > 0 &&
                      Object.keys(item['provideGroupList']).map((item1, key1) => {
                        if (item['provideGroupList'][key1] && item['provideGroupList'][key1]['name'] != undefined) {
                          return (
                            <Fragment key={key1}>
                              <li>{item['provideGroupList'][key1]['name']}</li>
                            </Fragment>
                          )
                        }
                      })
                    }
                  </ul>
                  <hr />
                </div>
              );
            })
          }
          <a href={void 0} onClick={openModal}>
            + Select what is included
          </a>
        </div>
        <div className="exp_con">
          {/* <h6>Not providing anything for your guests?</h6> */}
          <Form.Item>
            <Checkbox value={providingAnythingForGuest} onChange={onCheckChange}>Nothing is being provided. </Checkbox>
          </Form.Item>

          {/* <h6>Keep in Mind</h6>
          <p>
            Do do esse est adipisicing nisi Lorem ullamco mollit cillum. Fugiat
            ad amet laboris incididunt adipisicing aute et. Do irure amet dolore
            enim culpa ut. Adipisicing mollit fugiat eu ad cupidatat consequat.
            Fugiat dolore enim irure reprehenderit reprehenderit aliquip
            occaecat nisi est non ut. Aliqua sit veniam excepteur proident
            mollit magna et officia non sunt consectetur.
          </p> */}
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
                  props.continue({ page: 3, step: 3 });
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
                type="primary" htmlType="submit" >
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>

      <Modal
        title={null}
        visible={modalVisible}
        // onOk={this.handleOk}
        onCancel={closeModal}
        closeIcon={null}
        footer={null}
        wrapClassName="border-modal exp-border-modal"
      >
        <div className="">
          <h2 className="fc-primary ff-heebo fw-600 lh-6x m-0 title-2x">
            {modalStep2
              ? "Select item(s)"
              : "Select what is included"}
          </h2>
          <Divider />

          {!modalStep2 ? (
            <div className="row">
              {
                groupProvide && groupProvide.length > 0 &&
                groupProvide.map((item, key) => {
                  return (
                    <div className="col-6 p-2" key={key} style={{ cursor: "pointer" }} onClick={() => themeActiveClass(item)}>
                      <div className="exp-theme-card" style={(selectedGroup == item['id']) ? { border: '1px solid red' } : {}}>
                        <div className="icon">{icon_tickets}</div>
                        <div className="">{item['name']}</div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div>
              <Checkbox.Group
                defaultValue={updateEvents}
                // defaultValue ={[1218,1219]}
                style={{ width: "100%" }}
                onChange={onChange} >
                {
                  provideList && provideList.length > 0 &&
                  provideList.map((item, key) => {
                    return (
                      <div key={key}>
                        <Checkbox value={item['id']}>{item['name']}</Checkbox>
                      </div>
                    );
                  })
                }
              </Checkbox.Group>
            </div>
          )}
          <Divider />
          <div className="d-flex justify-content-between">
            <Button type="link" onClick={onCloseModal}>Cancel</Button>
            <Button type="primary" size="large" onClick={onContinue}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </Spin>
  );
};
export default Form.create()(WillProvide);

const icon_tickets = (
  <svg
    width="41"
    height="39"
    viewBox="0 0 41 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40.8594 11.0842L38.8394 16.7242V16.7042C37.7994 16.3242 36.7794 16.3842 35.7794 16.8642C34.7794 17.3442 34.0794 18.1042 33.6994 19.1442C33.3194 20.1842 33.3794 21.2042 33.8394 22.2042C34.3194 23.2042 35.0794 23.8842 36.1394 24.2642V24.2842L34.1194 29.9242L3.99938 19.1642L5.97937 13.5842C7.01937 13.9642 8.03938 13.9042 9.03938 13.4242C10.0394 12.9642 10.7194 12.2042 11.0994 11.1642C11.4794 10.1242 11.4194 9.10422 10.9394 8.10422C10.7207 7.62873 10.4075 7.20268 10.019 6.85199C9.63048 6.50129 9.17471 6.23327 8.67938 6.06422L10.7194 0.324219L40.8594 11.0842ZM30.9194 22.4642L33.6594 14.9442C33.8994 14.3242 33.8594 13.6442 33.5794 13.0442C33.2994 12.4442 32.7994 11.9842 32.1794 11.7442L17.1394 6.28422C15.8594 5.82422 14.3994 6.52422 13.9394 7.76422L11.1994 15.2842C10.7194 16.5842 11.3994 18.0242 12.6794 18.4842L27.7194 23.9642C27.9994 24.0642 28.2794 24.1242 28.5794 24.1242C29.6194 24.1242 30.5794 23.4642 30.9194 22.4642ZM16.7994 7.22422L31.8194 12.6842C32.1994 12.8242 32.4994 13.1042 32.6794 13.4642C32.8394 13.8242 32.8594 14.2242 32.7194 14.6042L29.9794 22.1242C29.7194 22.8842 28.8194 23.3042 28.0594 23.0242L13.0394 17.5442C12.6655 17.4088 12.3607 17.1305 12.192 16.7705C12.0232 16.4105 12.0043 15.9982 12.1394 15.6242L14.8794 8.10422C15.0794 7.52422 15.6594 7.12422 16.2794 7.12422C16.4594 7.12422 16.6194 7.16422 16.7994 7.22422ZM30.4394 31.5042C31.1394 32.0442 31.9394 32.3242 32.8394 32.3242H32.8594V38.3242H0.859375V32.4042C1.95938 32.4042 2.91937 32.0042 3.67937 31.2242C4.45937 30.4642 4.85938 29.5042 4.85938 28.4042C4.85938 27.3042 4.45937 26.3642 3.67937 25.5842C2.89937 24.8042 1.95938 24.4042 0.859375 24.4042V18.3242H2.95937L2.39937 19.9242L8.13938 21.9642C7.11938 22.2842 6.35938 23.2042 6.35938 24.3242V32.3242C6.35938 33.7042 7.47937 34.8242 8.85938 34.8242H24.8594C26.2394 34.8242 27.3594 33.7042 27.3594 32.3242V28.8242L29.0194 29.4242C29.2594 30.2842 29.7394 30.9842 30.4394 31.5042ZM7.35938 32.3242V24.3242C7.35938 23.5042 8.03937 22.8242 8.85938 22.8242H10.5194L26.3594 28.4842V32.3242C26.3594 33.1442 25.6794 33.8242 24.8594 33.8242H8.85938C8.03937 33.8242 7.35938 33.1442 7.35938 32.3242Z"
      fill="#616161"
    />
  </svg>
);
const icon_drinks = (
  <svg
    width="38"
    height="41"
    viewBox="0 0 38 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.0971 10.2727L6.4539 6.96875L6.26361 7.16424C5.02743 8.43298 4.12556 10.0515 3.65575 11.8501C2.46758 16.4006 4.35701 20.9321 7.92326 22.5524L4.98801 33.7862C2.72652 33.2924 0.969059 33.1964 0.86452 33.6028C0.739345 34.0777 2.91341 35.0567 5.71669 35.7888C8.52343 36.5226 10.8964 36.7318 11.0216 36.2552C11.1279 35.8505 9.55221 35.0738 7.33699 34.3983L10.2774 23.1508C14.1524 23.4337 17.9724 20.4177 19.152 15.8982C19.6218 14.0997 19.6287 12.2445 19.1692 10.5351L19.0971 10.2727ZM12.6281 20.0098C12.6281 20.0098 16.8253 18.2078 16.5853 16.4898L17.7478 16.7933C17.7478 16.7932 17.2797 19.8468 12.6281 20.0098ZM10.2963 11.5072C8.07766 9.18743 6.50364 9.17717 5.6824 9.44291C5.99614 8.93195 6.35283 8.45188 6.74886 8.0181L18.3256 11.0426C18.5262 11.8913 18.5965 12.7743 18.5485 13.6659C18.4679 13.6882 13.6414 15.0084 10.2963 11.5072Z"
      fill="#616161"
    />
    <path
      d="M33.5041 37.7437L30.8928 26.4156C34.4591 24.8673 36.4428 20.4249 35.3935 15.8745C34.9752 14.0623 34.1213 12.4163 32.9212 11.1166L32.736 10.916L20.0019 13.8513L19.9247 14.1119C19.4155 15.8093 19.3675 17.6628 19.7858 19.4733C20.842 24.0564 24.6174 27.194 28.5301 26.9762L31.1397 38.2906C28.9056 38.8992 27.3059 39.6297 27.4019 40.0395C27.5099 40.5178 29.8915 40.3772 32.7153 39.7274C35.5426 39.0759 37.7407 38.1586 37.6309 37.6802C37.5384 37.2705 35.7827 37.315 33.5041 37.7437ZM31.522 22.5407C31.522 22.5407 34.4042 18.9984 33.3943 17.5873L34.5654 17.3181C34.5654 17.3164 35.5649 20.238 31.522 22.5407ZM25.5125 16.0888C22.4709 15.0618 21.0718 15.7836 20.4682 16.3992C20.5077 15.8008 20.602 15.2127 20.7529 14.6435L32.4119 11.955C32.9828 12.6134 33.4561 13.3627 33.8264 14.1771C33.7647 14.2302 30.0989 17.6388 25.5125 16.0888Z"
      fill="#616161"
    />
    <path
      d="M26.7105 12.0206C27.4178 12.0206 27.9913 11.4471 27.9913 10.7398C27.9913 10.0324 27.4178 9.45898 26.7105 9.45898C26.0031 9.45898 25.4297 10.0324 25.4297 10.7398C25.4297 11.4471 26.0031 12.0206 26.7105 12.0206Z"
      fill="#616161"
    />
    <path
      d="M29.683 6.20789C30.2976 6.20789 30.7958 5.70971 30.7958 5.09516C30.7958 4.48061 30.2976 3.98242 29.683 3.98242C29.0685 3.98242 28.5703 4.48061 28.5703 5.09516C28.5703 5.70971 29.0685 6.20789 29.683 6.20789Z"
      fill="#616161"
    />
    <path
      d="M27.3591 1.62045C27.717 1.62045 28.0072 1.33028 28.0072 0.972337C28.0072 0.614391 27.717 0.324219 27.3591 0.324219C27.0011 0.324219 26.7109 0.614391 26.7109 0.972337C26.7109 1.33028 27.0011 1.62045 27.3591 1.62045Z"
      fill="#616161"
    />
    <path
      d="M24.6496 1.17808C24.8854 1.17808 25.0765 0.986936 25.0765 0.751149C25.0765 0.515362 24.8854 0.324219 24.6496 0.324219C24.4138 0.324219 24.2227 0.515362 24.2227 0.751149C24.2227 0.986936 24.4138 1.17808 24.6496 1.17808Z"
      fill="#616161"
    />
    <path
      d="M16.7633 2.77261C17.4394 2.77261 17.9875 2.22452 17.9875 1.54841C17.9875 0.87231 17.4394 0.324219 16.7633 0.324219C16.0872 0.324219 15.5391 0.87231 15.5391 1.54841C15.5391 2.22452 16.0872 2.77261 16.7633 2.77261Z"
      fill="#616161"
    />
    <path
      d="M6.48165 3.07919C6.6754 3.17867 6.84512 3.26436 7.03542 3.35352C7.22572 3.44094 7.4212 3.57297 7.57548 3.75641C7.73148 3.93645 7.86864 4.15245 7.98696 4.38568C8.11041 4.61713 8.21501 4.87088 8.29904 5.13321C8.48593 5.65615 8.59393 6.22197 8.66764 6.79459L8.80307 6.80491C8.94709 6.2237 8.98651 5.62532 8.96767 5.00977C8.93165 4.39767 8.80993 3.76154 8.48247 3.15803C8.31961 2.85967 8.12239 2.55106 7.85666 2.28873C7.58746 2.02639 7.23424 1.84295 6.87076 1.78123C6.14208 1.65432 5.44422 1.85667 4.94531 2.33333L4.97101 2.4671C5.60375 2.72603 6.09926 2.87345 6.48165 3.07919Z"
      fill="#616161"
    />
    <path
      d="M9.70509 2.58407C9.77713 2.64925 9.84226 2.73495 9.8834 2.83609C9.92628 2.93896 9.95544 3.05215 9.97083 3.1704C9.9914 3.28872 9.99999 3.41556 9.99999 3.54074C10.0034 3.79622 9.9691 4.05855 9.91942 4.31916L9.97602 4.34319C10.1235 4.11002 10.2264 3.85627 10.3069 3.58362C10.3824 3.31269 10.4184 3.01613 10.3618 2.70745C10.3344 2.55312 10.2949 2.39198 10.2161 2.23764C10.1372 2.08504 10.0086 1.953 9.85943 1.87417C9.55941 1.7147 9.22676 1.70099 8.93872 1.83815L8.93359 1.89814C9.1719 2.10215 9.36565 2.23764 9.50454 2.38333C9.57306 2.4555 9.63478 2.51722 9.70509 2.58407Z"
      fill="#616161"
    />
  </svg>
);
const icon_food = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28.7946 17.9856C29.6158 17.9878 30.4294 17.8271 31.1882 17.5128C31.9469 17.1985 32.6358 16.7367 33.2149 16.1543L39.2305 10.1426C39.7063 9.66682 39.75 8.8926 39.2969 8.39338C39.1831 8.26796 39.0451 8.16695 38.8911 8.09649C38.7372 8.02604 38.5705 7.9876 38.4012 7.98351C38.2319 7.97942 38.0636 8.00976 37.9064 8.07269C37.7492 8.13563 37.6064 8.22985 37.4867 8.34963L32.125 13.7074C31.945 13.8872 31.701 13.9882 31.4465 13.9882C31.1921 13.9882 30.948 13.8872 30.768 13.7074C30.3938 13.334 30.4141 12.7028 30.7875 12.3293L36.1258 6.99103C36.2455 6.87137 36.3396 6.72865 36.4024 6.57152C36.4653 6.4144 36.4956 6.24615 36.4915 6.07697C36.4874 5.90779 36.449 5.74121 36.3786 5.58731C36.3083 5.43341 36.2074 5.2954 36.0821 5.18166C35.8558 4.97647 35.5609 4.86357 35.2555 4.86525C34.9094 4.86549 34.5775 5.00319 34.3328 5.24807L28.9992 10.5809C28.8192 10.7607 28.5752 10.8617 28.3207 10.8617C28.0663 10.8617 27.8222 10.7607 27.6422 10.5809C27.2688 10.2074 27.2883 9.57619 27.6617 9.20275L33 3.86603C33.1197 3.74637 33.2138 3.60365 33.2767 3.44652C33.3395 3.2894 33.3698 3.12116 33.3657 2.95197C33.3616 2.78279 33.3232 2.61621 33.2529 2.46231C33.1825 2.30841 33.0816 2.1704 32.9563 2.05666C32.7301 1.85147 32.4351 1.73857 32.1297 1.74025C31.7836 1.74066 31.4518 1.87833 31.2071 2.12307L25.1953 8.13478C24.6129 8.71398 24.1511 9.40297 23.8368 10.1619C23.5224 10.9208 23.3618 11.7345 23.3641 12.5559V13.1988C23.3642 13.3632 23.3319 13.526 23.269 13.6779C23.2062 13.8298 23.114 13.9678 22.9977 14.084L20.2157 16.8668C20.1866 16.8959 20.1522 16.9189 20.1142 16.9346C20.0763 16.9504 20.0356 16.9585 19.9946 16.9585C19.9535 16.9585 19.9128 16.9504 19.8749 16.9346C19.837 16.9189 19.8025 16.8959 19.7735 16.8668L6.23596 3.32853C6.00232 3.09462 5.68552 2.9628 5.3549 2.96192C5.02429 2.96104 4.70679 3.09118 4.4719 3.32385C3.28831 4.4965 2.65628 6.15197 2.65628 8.11057C2.64846 11.3449 4.34846 15.0637 7.093 17.8043L13.7688 24.4801C14.7176 25.427 16.0033 25.9589 17.3438 25.959C17.7711 25.9592 18.1967 25.9046 18.6102 25.7965C18.714 25.7693 18.8208 25.7554 18.9282 25.7551C19.242 25.7551 19.5442 25.8737 19.7742 26.0871L20.6641 26.909C20.8936 27.1435 21.0225 27.4583 21.0235 27.7863V28.2192C21.0212 29.2031 21.4079 30.148 22.0992 30.8481L29.1344 38.002L29.1414 38.0098C29.9223 38.7905 30.9813 39.2291 32.0855 39.229C33.1897 39.2289 34.2486 38.7902 35.0293 38.0094C35.8101 37.2286 36.2486 36.1696 36.2486 35.0654C36.2485 33.9612 35.8098 32.9022 35.0289 32.1215L24.4836 21.5762C24.4546 21.5472 24.4315 21.5127 24.4158 21.4748C24.4001 21.4368 24.392 21.3962 24.392 21.3551C24.392 21.314 24.4001 21.2734 24.4158 21.2354C24.4315 21.1975 24.4546 21.163 24.4836 21.134L27.2657 18.352C27.3818 18.2358 27.5196 18.1436 27.6714 18.0808C27.8231 18.0179 27.9858 17.9855 28.15 17.9856H28.7946Z"
      fill="#616161"
    />
    <path
      d="M17.3441 28.4587C15.3428 28.4546 13.4239 27.6615 12.0035 26.2517L10.9207 25.1689C10.8035 25.052 10.6448 24.9863 10.4793 24.9863C10.3138 24.9863 10.1551 25.052 10.0379 25.1689L3.39726 31.7751C2.21367 32.9587 1.79101 34.7009 2.37695 36.4071C2.40975 36.5032 2.44863 36.5972 2.49336 36.6884C3.28164 38.3024 4.81133 39.2399 6.48476 39.2399C7.06026 39.2413 7.63032 39.1286 8.16191 38.9081C8.6935 38.6876 9.17606 38.3639 9.58164 37.9556L18.4379 29.0571C18.4752 29.0191 18.5037 28.9734 18.5215 28.9232C18.5393 28.873 18.546 28.8195 18.541 28.7665V28.7462C18.5375 28.6975 18.5242 28.65 18.5019 28.6065C18.4796 28.5631 18.4487 28.5246 18.4111 28.4935C18.3735 28.4623 18.33 28.4391 18.2832 28.4252C18.2363 28.4113 18.1872 28.407 18.1387 28.4126C17.8748 28.4419 17.6096 28.4572 17.3441 28.4587Z"
      fill="#616161"
    />
  </svg>
);
const icon_equip = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40.0095 31.4026L30.8616 22.2546C29.057 20.4501 26.3619 20.0985 24.1901 21.1688L15.8624 12.8411V7.98982L5.863 0.490234L0.863281 5.48996L8.36286 15.4894H13.2142L21.5418 23.8171C20.4794 25.9888 20.8231 28.684 22.6277 30.4886L31.7756 39.6365C32.9162 40.7771 34.7598 40.7771 35.8926 39.6365L40.0095 35.5195C41.1423 34.379 41.1423 32.5353 40.0095 31.4026ZM26.7759 18.0674C28.9867 18.0674 31.0647 18.9267 32.6271 20.4891L34.1427 22.0047C35.377 21.4656 36.5488 20.7157 37.5644 19.7001C40.4626 16.8018 41.447 12.7239 40.5251 9.02101C40.3533 8.31792 39.4705 8.07575 38.9549 8.59135L33.1427 14.4035L27.8383 13.5208L26.9556 8.21637L32.7678 2.40419C33.2833 1.88859 33.0334 1.00583 32.3225 0.826153C28.6195 -0.0878584 24.5416 0.896462 21.6512 3.78693C19.4247 6.01336 18.3779 8.9507 18.4326 11.8802L24.8463 18.2939C25.4791 18.1455 26.1353 18.0674 26.7759 18.0674ZM18.6592 24.4733L14.2297 20.0438L2.32414 31.9572C0.371121 33.9102 0.371121 37.0741 2.32414 39.0271C4.27715 40.9802 7.44104 40.9802 9.39406 39.0271L19.0498 29.3714C18.4561 27.8168 18.2764 26.1216 18.6592 24.4733ZM5.863 37.3632C4.83181 37.3632 3.98811 36.5195 3.98811 35.4883C3.98811 34.4493 4.824 33.6134 5.863 33.6134C6.90201 33.6134 7.7379 34.4493 7.7379 35.4883C7.7379 36.5195 6.90201 37.3632 5.863 37.3632Z"
      fill="#616161"
    />
  </svg>
);
