import React, { useState, useEffect } from "react";
import { Icon, Col, Form, Button, Input, Spin } from "antd";
import Upload from "../ui/upload";
import { $axios } from "../../lib/http-service";
import { adventureHost } from "../../store/adventureHost/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdventureHostEditData,
  getAdventureId,
  getAdventurePhotoId,
} from "../../lib/utils/utility";

const Photos = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [coverImg, setCover] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [photoId, setPhotoId] = useState(0);
  const dispatch = useDispatch();
  const adventureId = getAdventureId();
  const expPhotoId = getAdventurePhotoId();

  useEffect(() => {
    setLoading(false);
    expPhotoId && getPhotos();
  }, []);

  const getPhotos = () => {
    $axios.get("adventure_photo/adventure/" + adventureId).then(
      function (res) {
        res &&
          res.data &&
          res.data.forEach((img) => {
            img.coverPhoto && setCover(img);
          });
        setImgs(res.data);
      },
      (err) => {
        console.error("err adventure imgs");
      }
    );
  };

  const coverImgUpload = (img) => {
    setCover(img[0]);
    if (!expPhotoId) {
      postUpload(true, img[0]);
    } else {
      putUpload(true, img[0]);
    }
  };

  function postUpload(coverPhoto = false, file) {
    let formData = new FormData();
    formData.append("isCover", coverPhoto);
    // formData.append("adventureId", adventureId);
    formData.append("id", adventureId);
    formData.append("files", file["file"]);
    formData.append("captions", "Cover Photo");

    $axios
      .post("adventure_photo/adventure/" + adventureId, formData)
      .then(function (resp) {
        if (resp && resp.status == 200) {
          setPhotoId(resp.data["id"]);
          localStorage.setItem("adventurePhoto", JSON.stringify(resp));
          dispatch(adventureHost("photo", adventureId, resp.data["id"]));
        }
      });
  }

  function putUpload(coverPhoto = false, file) {
    let formData = new FormData();
    formData.append("isCover", coverPhoto);
    formData.append("adventureId", adventureId);
    formData.append("id", expPhotoId);
    formData.append("captions", "Cover Photo");
    formData.append("files", file["file"]);

    $axios
      .put(
        "adventure_phot/" + expPhotoId + "/adventure/" + adventureId,
        formData
      )
      .then(function (resp) {
        if (resp && resp.status == 201) {
          dispatch(adventureHost("photo", adventureId, expPhotoId));
        }
      });
  }
  // const imgsUpload = (img) => {
  //   setImgs([...imgs, ...img]);
  //   if (expPhotoId != 0) {
  //     postUpload(false, img[0]);
  //   } else {
  //     putUpload(false, img[0]);
  //   }
  // };

  const imgsUpload = (img) => {
    console.log("image", img);
    setImgs([...imgs, ...img]);
    for(let i = 0; i < img.length; i++)
    {
      postUpload(false, img[i]);
      // if (expPhotoId != 0) {
      //   console.log("post e dhukse");
      //   postUpload(false, img[i]);
      // } else {
      //   console.log("put e dhukse");
      //   putUpload(false, img[i]);
      // }
    }
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log();

    const next = props.continue;
    validateFields((err, values) => {
      //console.log("Received values of form: ", values);
      // next({ page: 2, step: 1, data: true });
    });
  };
  return (
    <Spin spinning={loading} tip="Loading...">
      <div>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{ float: "right" }}
            onClick={() => {
              props.continue({ page: 1, step: 4 });
            }}
          >
            Save & Exit
          </Button>
        </Form.Item>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="exp_con">
          <h2>Good quality photos will attract customers</h2>
          {/* <p>
            Irure adipisicing voluptate irure culpa velit culpa velit labore
            voluptate eiusmod ullamco ea veniam. Anim enim magna ut cillum
            consequat exercitation ullamco ut officia.
          </p> */}
        </div>
        <div className="exp_con">
          <h6>Cover Photo</h6>
          <p>
            Cover photo will appear in the listing page and in the search results. So pick a nice photo.
          </p>
          {coverImg ? (
            <img style={{ height: 300 }} src={coverImg.photoPath} />
          ) : (
              <Upload onPreview={coverImgUpload}>{up_icon}</Upload>
            )}
        </div>
        <div className="exp_con">
          <h6>Gallery Photos</h6>
          <p>
            These photos will appear in the listing details page. Photos should contain details of the activities, may contain you or your guests performing the activities.
          </p>
          <div>
            {imgs &&
              imgs.map((imgsrc, key) => {
                if (imgsrc && !imgsrc.coverPhoto)
                  return (
                    <img
                    key={key}
                      style={{ width: 250, margin: 5, display: "inline" }}
                      src={imgsrc.photoPath}
                    />
                  );
              })}
          </div>
          <Upload multiple={true} onPreview={imgsUpload}>
            {up_icon}
          </Upload>
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
                  props.continue({ page: 6, step: 3 });
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
                  props.continue({ page: 1, step: 4 });
                }}
              >
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};
export default Form.create()(Photos);

const up_icon = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.683594"
      y="0.238281"
      width="40"
      height="40"
      rx="6"
      fill="#FF6304"
    />
    <path
      d="M20.9441 19.1205C20.9274 19.0988 20.9061 19.0812 20.8817 19.0691C20.8574 19.0571 20.8306 19.0508 20.8035 19.0508C20.7764 19.0508 20.7497 19.0571 20.7253 19.0691C20.7009 19.0812 20.6796 19.0988 20.6629 19.1205L18.1629 22.341C18.1423 22.3678 18.1295 22.4 18.126 22.4338C18.1225 22.4677 18.1284 22.5018 18.1431 22.5324C18.1577 22.563 18.1806 22.5888 18.2089 22.6067C18.2373 22.6247 18.2701 22.6343 18.3035 22.6342H19.9531V28.1433C19.9531 28.2433 20.0334 28.3251 20.1316 28.3251H21.4709C21.5691 28.3251 21.6495 28.2433 21.6495 28.1433V22.6365H23.3035C23.4531 22.6365 23.5357 22.4615 23.4441 22.3433L20.9441 19.1205Z"
      fill="white"
    />
    <path
      d="M27.4838 17.0219C26.4615 14.2765 23.8566 12.3242 20.8052 12.3242C17.7539 12.3242 15.149 14.2742 14.1267 17.0197C12.2137 17.531 10.8008 19.306 10.8008 21.4151C10.8008 23.9265 12.7985 25.9606 15.2628 25.9606H16.1579C16.2561 25.9606 16.3365 25.8788 16.3365 25.7788V24.4151C16.3365 24.3151 16.2561 24.2333 16.1579 24.2333H15.2628C14.5106 24.2333 13.803 23.9288 13.2762 23.3765C12.7517 22.8265 12.4727 22.0856 12.4972 21.3174C12.5173 20.7174 12.7182 20.1538 13.082 19.6788C13.4548 19.1947 13.9771 18.8424 14.5575 18.6856L15.4035 18.4606L15.7137 17.6288C15.9057 17.1106 16.1735 16.6265 16.5106 16.1879C16.8434 15.7531 17.2375 15.3709 17.6802 15.0538C18.5977 14.3969 19.678 14.0492 20.8052 14.0492C21.9325 14.0492 23.0128 14.3969 23.9302 15.0538C24.3744 15.3719 24.7673 15.7538 25.0999 16.1879C25.4369 16.6265 25.7048 17.1129 25.8968 17.6288L26.2048 18.4583L27.0485 18.6856C28.2584 19.0174 29.1044 20.1379 29.1044 21.4151C29.1044 22.1674 28.8164 22.8765 28.2941 23.4083C28.0379 23.6706 27.7332 23.8786 27.3976 24.0202C27.0619 24.1619 26.702 24.2343 26.3387 24.2333H25.4436C25.3454 24.2333 25.2651 24.3151 25.2651 24.4151V25.7788C25.2651 25.8788 25.3454 25.9606 25.4436 25.9606H26.3387C28.803 25.9606 30.8008 23.9265 30.8008 21.4151C30.8008 19.3083 29.3923 17.5356 27.4838 17.0219Z"
      fill="white"
    />
  </svg>
);
