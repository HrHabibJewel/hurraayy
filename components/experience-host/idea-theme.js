import React, { useState, useEffect, Fragment } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Icon,
  Spin,
  Divider,
  Modal,
  Radio,
} from "antd";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";

const IdeaTheme = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [mainTheme1, setMainTheme1] = useState([]);
  const [themeEventsList, setThemeEventsList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [selectedMainTheme, setSelectedMainTheme] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep2, setModalStep2] = useState(false);
  const experienceId = getExperienceId();
  const dispatch = useDispatch();

  useEffect(() => {
    getTheme();
    setLoading(false);
  }, []);

  const getTheme = () => {
    $axios.get("experience_themes").then(function (resp) {
      if (resp && resp.status == 200) {
        setMainTheme1(resp.data);
      }
    });
  }

  const getEventList = () => {
    if (mainTheme1.length > 0 && selectedMainTheme) {
      $axios.get("experience_theme_groups/theme-groups/" + selectedMainTheme).then(function (resp) {
        if (resp && resp.status == 200) {
          let _groupEvent = [];
          let _groups = resp.data;
          if (_groups && _groups.length > 0) {
            for (let key in _groups) {
              let _id = _groups[key]['id'];
              let _eventList = [];
              let _events = _groups[key]['experienceThemeEventVOs'];
              if (_events && _events.length > 0) {
                for (let key1 in _events) {
                  _eventList[_events[key1]['id']] = {
                    id: _events[key1]['id'],
                    name: _events[key1]['name'],
                  }
                }
              }
              _groupEvent.push({
                id: _id,
                name: _groups[key]['name'],
                eventList: _eventList
              })
            }
          }
          setGroupList(_groupEvent)
          setModalStep2(true)
        }
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      //console.log("Received values of form: ", values);
      next({ page: 2, step: 1, data: true });
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onCloseModal = () => {
    setModalVisible(false)
    setModalStep2(false)
  }

  const openModal = () => {
    getExperienceFormEditData().then((resp) => {
      if (resp && resp['experienceThemeEventVOS'] && resp['experienceThemeEventVOS'].length > 0) {
        let _themeId = 0;
        let _eventId = '';
        for (let key in resp['experienceThemeEventVOS']) {
          if (resp['experienceThemeEventVOS'][key] && resp['experienceThemeEventVOS'][key]['experienceThemeVO']) {
            _themeId = resp['experienceThemeEventVOS'][key]['experienceThemeVO']['id']
          }
          _eventId = resp['experienceThemeEventVOS'][key]['id'];
          onChangeCategory1(_eventId, key)
        }
        setSelectedEventId(_eventId);
        setSelectedMainTheme(_themeId);
      }
    })
    setModalVisible(true);
  };

  const onContinue = () => {
    if (!modalStep2) {
      getEventList();
      return;
    }
    if (themeEventsList.length == 0) {
      return;
    }

    let params = {};

    params["experienceThemeEvents"] = JSON.stringify(themeEventsList);
    params["themeId"] = selectedMainTheme;
    const next = props.continue;
    $axios.put("experience/" + experienceId + "/main-theme/", JSON.stringify(params)).then(function (resp) {
      if (resp && resp.status == 200) {
        dispatch(
          experienceForm("theme", experienceId)
        );
        closeModal();
        next({ page: 1, step: 2, data: true });
      }
    });
  };

  const onChangeCategory = (eventId, groupId, key) => {
    let event = themeEventsList;
    event[key] = {
      groupId: groupId,
      eventId: eventId
    };
    setThemeEventsList(event)
  }

  const onChangeCategory1 = (eventId, key = 0) => {
    let event = themeEventsList;
    event[key] = {
      groupId: 0,
      eventId: eventId
    };
    setThemeEventsList(event)
  }

  const themeActiveClass = (item) => {
    setSelectedMainTheme(item['id'])
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <div>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right", marginTop: "20px" }} onClick={() => {
            props.continue({ page: 1, step: 2 });
          }}>
            Save & Exit
          </Button>
        </Form.Item>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="exp_con">
          {/* <h2>What type of experience will you host?</h2> */}
          <h2>Select the category of the experience</h2>
          <p>
            Pick a category that closely matches your experience.
          </p>
        </div>
        <div className="exp_con">
          <Form.Item>
            <div className="theme-btn" onClick={openModal}>
              <Icon type="plus" />
              {/* &nbsp;&nbsp;<span>Select a primary theme</span> */}
                &nbsp;&nbsp;<span>Pick a category</span>
            </div>
          </Form.Item>
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
                  props.continue({ page: 1, step: 1 });
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
                onClick={() => {
                  props.continue({ page: 1, step: 2 });
                }}
              >
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
              // ? "What specifically in nature and outdoors?"
              // : "Select a main theme"}
              ? "Let's select a sub category"
              : "Select a category"}
          </h2>
          <Divider />

          {!modalStep2 ? (
            <div className="row">
              {
                mainTheme1 && mainTheme1.length > 0 &&
                mainTheme1.map((item, key) => {
                  return (
                    <div className="col-6 p-2" key={key} style={{ cursor: "pointer" }} onClick={() => themeActiveClass(item)}>
                      <div className="exp-theme-card" style={(selectedMainTheme == item['id']) ? { border: '1px solid #ff6204' } : {}}>
                        <div className="icon"><img height="50" width="50" src={item['imagePath']} alt=""></img></div>
                        <div className="">{item['name']}</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          ) : (
            <div>
              <Radio.Group onChange={(e) => onChangeCategory1(e.target.value)} defaultValue={selectedEventId} style={{ width: "100%" }}>
                {
                  groupList && groupList.length > 0 &&
                  groupList.map((item, key) => {
                    return (
                      <div>
                        <div className="row" key={key}>
                          <h3 style={{ color: "#313131" }} className="fs-18 fw-600">
                            {item['name']}
                          </h3>
                        </div>
                        <div className="row">
                          {
                            item['eventList'] && item['eventList'].length > 0 &&
                            item['eventList'].map((item1, key1) => {
                              return (
                                <div className="col-6 mb-1" key={key + "_" + key1}>
                                  <Radio value={item1['id']}>{item1['name']}</Radio>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </Radio.Group>
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
export default Form.create()(IdeaTheme);

const icon_art = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.8594 0.324219C15.555 0.324219 10.468 2.43136 6.71724 6.18208C2.96651 9.93281 0.859375 15.0199 0.859375 20.3242C0.859375 25.6285 2.96651 30.7156 6.71724 34.4664C10.468 38.2171 15.555 40.3242 20.8594 40.3242C22.7038 40.3242 24.1927 38.8353 24.1927 36.9909C24.1927 36.1242 23.8594 35.3464 23.326 34.7464C22.8149 34.1687 22.4816 33.3909 22.4816 32.5464C22.4816 30.702 23.9705 29.2131 25.8149 29.2131H29.7483C35.8816 29.2131 40.8594 24.2353 40.8594 18.102C40.8594 8.27977 31.9038 0.324219 20.8594 0.324219ZM8.63715 20.3242C6.79271 20.3242 5.30382 18.8353 5.30382 16.9909C5.30382 15.1464 6.79271 13.6576 8.63715 13.6576C10.4816 13.6576 11.9705 15.1464 11.9705 16.9909C11.9705 18.8353 10.4816 20.3242 8.63715 20.3242ZM15.3038 11.4353C13.4594 11.4353 11.9705 9.94644 11.9705 8.102C11.9705 6.25755 13.4594 4.76866 15.3038 4.76866C17.1483 4.76866 18.6372 6.25755 18.6372 8.102C18.6372 9.94644 17.1483 11.4353 15.3038 11.4353ZM26.4149 11.4353C24.5705 11.4353 23.0816 9.94644 23.0816 8.102C23.0816 6.25755 24.5705 4.76866 26.4149 4.76866C28.2594 4.76866 29.7483 6.25755 29.7483 8.102C29.7483 9.94644 28.2594 11.4353 26.4149 11.4353ZM33.0816 20.3242C31.2372 20.3242 29.7483 18.8353 29.7483 16.9909C29.7483 15.1464 31.2372 13.6576 33.0816 13.6576C34.926 13.6576 36.4149 15.1464 36.4149 16.9909C36.4149 18.8353 34.926 20.3242 33.0816 20.3242Z"
      fill="#616161"
    />
  </svg>
);
const icon_nature = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.14324 20.0459L14.728 25.304L17.9167 22.2559L9.79595 9.60311L18.4234 21.7699L23.7021 16.7259L18.5087 5.37439L24.2281 16.2232L29.1748 11.4938L29.6242 2.90903L29.8662 10.8338L40.8356 0.349667C40.8356 0.349667 16.1114 -0.554343 7.14326 8.41376C6.98459 8.57109 6.84925 8.72243 6.69792 8.8771C8.01927 9.72311 8.88261 11.1011 8.88261 12.6625C8.88261 15.2378 6.54125 17.3239 3.65455 17.3239C2.83052 17.3252 2.01593 17.1485 1.26652 16.8059C-1.11751 24.2293 7.60726 26.8193 10.8653 28.9953L14.2313 25.778L6.14324 20.0459Z"
      fill="#616161"
    />
    <path
      d="M40.3538 12.1317C41.0245 5.597 40.8345 0.349609 40.8345 0.349609L30.3497 11.3171L38.2745 11.5577L29.687 12.0077L24.959 16.9571L35.8064 22.6732L24.455 17.4805L19.4102 22.7592L31.5797 31.3846L18.9249 23.2659L15.8769 26.4539L21.1363 35.038L15.4042 26.9492L12.1875 30.3139C15.0349 34.5807 18.5916 48.2155 32.7697 34.0387C35.5264 31.2813 37.3478 27.0359 38.5525 22.4772C37.6985 21.7592 37.1945 20.8505 37.2205 19.8725C37.2298 19.5612 37.2958 19.2592 37.4051 18.9712C36.1591 18.2065 35.3844 17.1025 35.4171 15.8958C35.4684 13.9491 37.5958 12.3931 40.3538 12.1317Z"
      fill="#616161"
    />
    <path
      d="M10.8647 28.9961L5.94531 33.6975L7.48333 35.2348L12.1874 30.3154C11.9907 30.0214 11.7974 29.7708 11.6047 29.5781C11.412 29.3854 11.1587 29.1921 10.8647 28.9961Z"
      fill="#616161"
    />
  </svg>
);
const icon_ent = (
  <svg
    width="41"
    height="33"
    viewBox="0 0 41 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.7882 15.812C11.5457 16.4651 10.0413 18.387 10.1926 20.4432C10.9051 19.6482 11.9932 18.962 13.3113 18.5107L13.7882 15.812ZM6.8476 18.9276L4.86449 7.7083C4.84637 7.60706 4.88199 7.54456 4.87949 7.54268C8.48947 5.53895 12.5744 4.47958 16.6925 4.47958C16.7932 4.47958 16.8944 4.4902 16.9957 4.49145C17.8675 3.64959 18.9788 3.06459 20.22 2.86647C21.4006 2.67772 22.5981 2.58209 23.7937 2.53397C23.1694 1.6621 22.2637 1.01961 21.1831 0.846482C19.6888 0.608358 18.1869 0.490234 16.6919 0.490234C11.9007 0.490234 7.17323 1.70398 2.93451 4.05646C1.4239 4.8952 0.614527 6.64519 0.925149 8.40142L2.90826 19.6207C3.79763 24.6532 11.4288 28.5007 15.6863 28.5007C15.9107 28.5007 16.1082 28.4719 16.3119 28.4506C15.4669 27.3832 14.5032 25.9207 13.8432 24.2269C10.8676 23.4157 7.21448 21.0007 6.8476 18.9276ZM12.9444 10.3364C12.8988 10.0789 12.8051 9.84454 12.6901 9.62392C12.1744 10.1808 11.3982 10.6083 10.4826 10.7689C9.56696 10.9302 8.69072 10.7939 8.0151 10.4458C7.9826 10.692 7.9751 10.9445 8.02072 11.202C8.26072 12.5583 9.55696 13.4639 10.9169 13.2251C12.2763 12.9864 13.1844 11.6926 12.9444 10.3364ZM38.7842 8.04643C33.223 4.9602 26.82 3.83333 20.5356 4.83708C18.8288 5.10957 17.4682 6.47831 17.1582 8.23455L15.175 19.4538C14.2132 24.8944 21.13 31.7206 25.0693 32.4131C29.0087 33.1062 37.8486 29.0513 38.8105 23.6107L40.7936 12.3914C41.1042 10.6345 40.2949 8.88455 38.7842 8.04643ZM21.7069 14.0964C21.9469 12.7401 23.2431 11.8345 24.6031 12.0739C25.9631 12.3133 26.8706 13.6064 26.6312 14.9626C26.5856 15.2201 26.4918 15.4545 26.3768 15.6751C25.8612 15.1182 25.085 14.6908 24.1693 14.5301C23.2537 14.3689 22.3775 14.5051 21.7019 14.8533C21.6687 14.6064 21.6612 14.3539 21.7069 14.0964ZM26.1112 26.5188C22.6312 25.9069 20.2663 22.8144 20.5463 19.4626C21.8337 21.0588 24.0594 22.3482 26.7643 22.8238C29.4693 23.2994 32.003 22.8469 33.7599 21.7863C32.8737 25.0325 29.5906 27.1307 26.1112 26.5188ZM34.2549 17.0601C33.7393 16.5032 32.9624 16.0757 32.0468 15.9151C31.1312 15.7539 30.2549 15.8901 29.5793 16.2382C29.5468 15.992 29.5393 15.7395 29.5849 15.482C29.8249 14.1258 31.1212 13.2201 32.4812 13.4589C33.8405 13.6983 34.7486 14.9914 34.5093 16.3476C34.4636 16.6057 34.3699 16.8401 34.2549 17.0601Z"
      fill="#616161"
    />
  </svg>
);
const icon_sports = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.0905 18.4802H40.8594C40.5424 15.3286 39.4814 12.2974 37.7639 9.63596C36.0244 10.4677 34.5102 11.7053 33.3489 13.2444C32.1875 14.7835 31.413 16.5792 31.0905 18.4802ZM10.6282 18.4802C10.3057 16.5792 9.53123 14.7835 8.36988 13.2444C7.20853 11.7053 5.69435 10.4677 3.95485 9.63596C2.2373 12.2974 1.17637 15.3286 0.859375 18.4802H10.6282ZM27.0302 18.4802C27.3448 15.9693 28.2479 13.5683 29.666 11.4725C31.0841 9.37675 32.9772 7.64555 35.191 6.41988C31.9061 3.05974 27.5448 0.960905 22.8694 0.490234V18.4802H27.0302ZM14.6885 18.4802H18.8493V0.490234C14.1727 0.956544 9.80996 3.05606 6.52772 6.41988C8.74154 7.64555 10.6346 9.37675 12.0527 11.4725C13.4709 13.5683 14.374 15.9693 14.6885 18.4802ZM27.0302 22.5003H22.8694V40.4902C27.5461 40.0239 31.9088 37.9244 35.191 34.5606C32.9772 33.3349 31.0841 31.6037 29.666 29.508C28.2479 27.4122 27.3448 25.0111 27.0302 22.5003ZM3.95485 31.3445C5.6902 30.507 7.20084 29.2678 8.36143 27.7297C9.52202 26.1915 10.2991 24.3988 10.6282 22.5003H0.859375C1.18098 25.7365 2.28651 28.7515 3.95485 31.3445ZM31.0905 22.5003C31.413 24.4013 32.1875 26.1969 33.3489 27.7361C34.5102 29.2752 36.0244 30.5127 37.7639 31.3445C39.4814 28.6831 40.5424 25.6519 40.8594 22.5003H31.0905ZM14.6885 22.5003C14.374 25.0111 13.4709 27.4122 12.0527 29.508C10.6346 31.6037 8.74154 33.3349 6.52772 34.5606C9.8126 37.9207 14.1739 40.0196 18.8493 40.4902V22.5003H14.6885Z"
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
      d="M28.7946 17.6633C29.6158 17.6656 30.4294 17.5049 31.1882 17.1905C31.9469 16.8762 32.6358 16.4145 33.2149 15.8321L39.2305 9.82033C39.7063 9.34455 39.75 8.57033 39.2969 8.07111C39.1831 7.94569 39.0451 7.84469 38.8911 7.77423C38.7372 7.70377 38.5705 7.66533 38.4012 7.66124C38.2319 7.65715 38.0636 7.68749 37.9064 7.75043C37.7492 7.81336 37.6064 7.90758 37.4867 8.02736L32.125 13.3852C31.945 13.565 31.701 13.666 31.4465 13.666C31.1921 13.666 30.948 13.565 30.768 13.3852C30.3938 13.0117 30.4141 12.3805 30.7875 12.007L36.1258 6.66877C36.2455 6.5491 36.3396 6.40638 36.4024 6.24926C36.4653 6.09214 36.4956 5.92389 36.4915 5.75471C36.4874 5.58553 36.449 5.41894 36.3786 5.26504C36.3083 5.11114 36.2074 4.97314 36.0821 4.85939C35.8558 4.65421 35.5609 4.54131 35.2555 4.54299C34.9094 4.54323 34.5775 4.68092 34.3328 4.9258L28.9992 10.2586C28.8192 10.4384 28.5752 10.5394 28.3207 10.5394C28.0663 10.5394 27.8222 10.4384 27.6422 10.2586C27.2688 9.88517 27.2883 9.25392 27.6617 8.88049L33 3.54377C33.1197 3.4241 33.2138 3.28138 33.2767 3.12426C33.3395 2.96714 33.3698 2.79889 33.3657 2.62971C33.3616 2.46053 33.3232 2.29394 33.2529 2.14004C33.1825 1.98614 33.0816 1.84814 32.9563 1.73439C32.7301 1.52921 32.4351 1.41631 32.1297 1.41799C31.7836 1.4184 31.4518 1.55607 31.2071 1.8008L25.1953 7.81252C24.6129 8.39171 24.1511 9.0807 23.8368 9.8396C23.5224 10.5985 23.3618 11.4122 23.3641 12.2336V12.8766C23.3642 13.041 23.3319 13.2038 23.269 13.3557C23.2062 13.5075 23.114 13.6455 22.9977 13.7617L20.2157 16.5445C20.1866 16.5736 20.1522 16.5967 20.1142 16.6124C20.0763 16.6281 20.0356 16.6362 19.9946 16.6362C19.9535 16.6362 19.9128 16.6281 19.8749 16.6124C19.837 16.5967 19.8025 16.5736 19.7735 16.5445L6.23596 3.00627C6.00232 2.77236 5.68552 2.64053 5.3549 2.63965C5.02429 2.63878 4.70679 2.76891 4.4719 3.00158C3.28831 4.17424 2.65628 5.82971 2.65628 7.7883C2.64846 11.0227 4.34846 14.7414 7.093 17.482L13.7688 24.1578C14.7176 25.1047 16.0033 25.6366 17.3438 25.6367C17.7711 25.6369 18.1967 25.5823 18.6102 25.4742C18.714 25.447 18.8208 25.4331 18.9282 25.4328C19.242 25.4329 19.5442 25.5515 19.7742 25.7649L20.6641 26.5867C20.8936 26.8212 21.0225 27.136 21.0235 27.4641V27.8969C21.0212 28.8808 21.4079 29.8257 22.0992 30.5258L29.1344 37.6797L29.1414 37.6875C29.9223 38.4683 30.9813 38.9068 32.0855 38.9067C33.1897 38.9067 34.2486 38.468 35.0293 37.6871C35.8101 36.9063 36.2486 35.8473 36.2486 34.7431C36.2485 33.6389 35.8098 32.58 35.0289 31.7992L24.4836 21.2539C24.4546 21.2249 24.4315 21.1904 24.4158 21.1525C24.4001 21.1146 24.392 21.0739 24.392 21.0328C24.392 20.9918 24.4001 20.9511 24.4158 20.9132C24.4315 20.8752 24.4546 20.8408 24.4836 20.8117L27.2657 18.0297C27.3818 17.9135 27.5196 17.8214 27.6714 17.7585C27.8231 17.6956 27.9858 17.6633 28.15 17.6633H28.7946Z"
      fill="#616161"
    />
    <path
      d="M17.3422 28.1364C15.3409 28.1323 13.4219 27.3393 12.0016 25.9294L10.9187 24.8466C10.8016 24.7297 10.6428 24.6641 10.4773 24.6641C10.3118 24.6641 10.1531 24.7297 10.0359 24.8466L3.39531 31.4528C2.21172 32.6364 1.78906 34.3786 2.375 36.0849C2.40779 36.181 2.44667 36.2749 2.49141 36.3661C3.27969 37.9802 4.80937 38.9177 6.48281 38.9177C7.05831 38.9191 7.62836 38.8063 8.15996 38.5858C8.69155 38.3653 9.17411 38.0416 9.57969 37.6333L18.4359 28.7349C18.4732 28.6968 18.5018 28.6511 18.5196 28.6009C18.5374 28.5507 18.544 28.4973 18.5391 28.4442V28.4239C18.5356 28.3752 18.5223 28.3277 18.5 28.2843C18.4776 28.2408 18.4467 28.2024 18.4091 28.1712C18.3715 28.14 18.328 28.1168 18.2812 28.1029C18.2344 28.089 18.1852 28.0847 18.1367 28.0903C17.8729 28.1196 17.6077 28.135 17.3422 28.1364Z"
      fill="#616161"
    />
  </svg>
);
