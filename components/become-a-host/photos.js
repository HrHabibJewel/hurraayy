import React from "react";
import { connect } from "react-redux";
import { Button, Col, Form, Icon, Modal, Row, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Upload from "../../components/ui/upload";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

class ConfirmPhotos extends React.Component {
  state = {
    previewImage: "",
    previewImageList: [],
    editImage: {},
    fileList: [],
    id: 0,
    showModal: false,
    showModalEdit: false,
    loading: false,
    pageLoading: true,
    replaceImage: {},
  };

  componentDidMount() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["propertyPhotoVOS"] && resp["propertyPhotoVOS"].length > 0) {
          resp["propertyPhotoVOS"].map((item, key) => {
            let fileList = this.state.fileList;
            this.setState({
              fileList: [
                ...fileList,
                {
                  id: item["id"],
                  captions: item["captions"],
                  photoPath: item["photoPath"],
                  coverPhoto: item["_cover_photo"],
                },
              ],
            });
          });
        }
        this.setState({ pageLoading: false });
      }
    });
  }

  imgDelte = async (id) => {
    let url = "properties_photo/" + id;
    return await $axios.delete(url);
  };

  handleDeleteImg = async (image) => {
    const { fileList } = this.state;
    let resp = this.imgDelte(image["id"]);

    if (resp) {
      let files = fileList.filter((img) => img.id != image["id"]);

      this.setState({
        fileList: files,
      });
    }
  };

  imgUpdate = async (image) => {};
  handleEditImg = (image) => {
    //console.log("...", image);

    this.setState({
      editImage: image,
      showModalEdit: true,
    });

    //console.log("pppp", this.state.editImage);

    //let resp = this.imgUpdate(image);
  };

  handlePreview = async (files) => {
    //console.log("handle preview");

    this.setState({
      previewImageList: files,
      showModal: true,
    });
  };
  handleChange = async (files) => {
    //console.log("handle change");

    // this.setState({
    //   previewImageList: files,
    //   showModal: true,
    // });
  };
  imageUpload = async (data, i) => {
    let property_id = this.props.formInfo["propertyId"];
    let formData = new FormData();
    formData.append("files", data.file);
    formData.append("captions", data["captions"]);
    formData.append("isCover", i == 0 ? true : false);
    formData.append("id", this.state.id);
    let url = "properties_photo/property/" + property_id;
    return await $axios.post(url, formData);
  };
  updateImage = async () => {
    const { id, captions, coverPhoto } = this.state.editImage;
    const { replaceImage, fileList, editImage } = this.state;

    let property_id = this.props.formInfo["propertyId"];
    let formData = new FormData();
    formData.append("files", replaceImage[0]);
    formData.append("captions", captions);
    formData.append("isCover", coverPhoto);
    formData.append("id", id);
    let url = `properties_photo/${id}/property/${property_id}`;
    const res = await $axios.put(url, formData);

    if (res) {
      let files = fileList.filter((img) => img.id != id);
      //console.log(files, [...files, res.data]);

      this.setState({
        fileList: [...files, res.data],
        showModalEdit: false,
        replaceImage: {},
      });
    }

    // console.log(res, fileList);
  };

  getimageInfo = async (id) => {
    let property_id = this.props.formInfo["propertyId"];
    let url = `properties_photo/${id}/property/${property_id}/image`;
    return await $axios.get(url);
  };

  typedArrayToURL(str, mimeType) {
    return URL.createObjectURL(new Blob([str], { type: mimeType }));
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ showModal: false, loading: true });
    let i = 0;
    for (let file of this.state.previewImageList) {
      try {
        let uploaded = await this.imageUpload(file, i);
        if (uploaded && uploaded.status == 200) {
          //console.log("uploaded", uploaded);
          this.setState({ id: uploaded["data"]["id"] });
          // let image = await this.getimageInfo(uploaded['data']['id']);
          let image = uploaded.data.photoPath;
          let fileList = this.state.fileList;
          this.setState({
            fileList: [
              ...fileList,
              { captions: uploaded["data"]["captions"], photoPath: image },
            ],
          });
          i++;
        }
      } catch (err) {
        //console.log("error", err);
      }
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      showModal,
      showModalEdit,
      editImage,
      fileList,
      previewImageList,
      loading,
      pageLoading,
    } = this.state;
    //console.log({ editImage });
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Add another</div>
      </div>
    );
    return (
      <Spin spinning={pageLoading} tip="Loading...">
        <div className="photo-confirm">
          <div>
            <h2>Please upload photos</h2>
            <p>
              Good quality photos help to get more reservations. You can upload
              more photos later.
            </p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Spin
                  spinning={loading}
                  indicator={
                    <Icon type="loading" style={{ fontSize: 24 }} spin />
                  }
                  tip="Loading..."
                >
                  {fileList.map((image, i) => (
                    <div
                      key={i}
                      className={i == 0 ? "_img_con cover" : "_img_con"}
                    >
                      <div className="action">
                        <div className="btn-group">
                          <div
                            className="delete"
                            onClick={() => this.handleDeleteImg(image)}
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.8941 13.3737C7.12985 13.3737 7.35594 13.2894 7.52264 13.1394C7.68934 12.9894 7.78299 12.7859 7.78299 12.5737V7.77373C7.78299 7.56156 7.68934 7.35807 7.52264 7.20805C7.35594 7.05802 7.12985 6.97373 6.8941 6.97373C6.65835 6.97373 6.43226 7.05802 6.26556 7.20805C6.09886 7.35807 6.00521 7.56156 6.00521 7.77373V12.5737C6.00521 12.7859 6.09886 12.9894 6.26556 13.1394C6.43226 13.2894 6.65835 13.3737 6.8941 13.3737ZM15.783 3.77373H12.2274V2.97373C12.2274 2.33721 11.9465 1.72676 11.4464 1.27667C10.9463 0.826587 10.268 0.57373 9.56076 0.57373H7.78299C7.07574 0.57373 6.39746 0.826587 5.89737 1.27667C5.39727 1.72676 5.11632 2.33721 5.11632 2.97373V3.77373H1.56076C1.32502 3.77373 1.09892 3.85802 0.932224 4.00805C0.765525 4.15807 0.671875 4.36156 0.671875 4.57373C0.671875 4.7859 0.765525 4.98939 0.932224 5.13942C1.09892 5.28944 1.32502 5.37373 1.56076 5.37373H2.44965V14.1737C2.44965 14.8103 2.7306 15.4207 3.2307 15.8708C3.7308 16.3209 4.40908 16.5737 5.11632 16.5737H12.2274C12.9347 16.5737 13.613 16.3209 14.113 15.8708C14.6131 15.4207 14.8941 14.8103 14.8941 14.1737V5.37373H15.783C16.0187 5.37373 16.2448 5.28944 16.4115 5.13942C16.5782 4.98939 16.6719 4.7859 16.6719 4.57373C16.6719 4.36156 16.5782 4.15807 16.4115 4.00805C16.2448 3.85802 16.0187 3.77373 15.783 3.77373ZM6.8941 2.97373C6.8941 2.76156 6.98775 2.55807 7.15445 2.40805C7.32115 2.25802 7.54724 2.17373 7.78299 2.17373H9.56076C9.79651 2.17373 10.0226 2.25802 10.1893 2.40805C10.356 2.55807 10.4497 2.76156 10.4497 2.97373V3.77373H6.8941V2.97373ZM13.1163 14.1737C13.1163 14.3859 13.0227 14.5894 12.856 14.7394C12.6893 14.8894 12.4632 14.9737 12.2274 14.9737H5.11632C4.88057 14.9737 4.65448 14.8894 4.48778 14.7394C4.32108 14.5894 4.22743 14.3859 4.22743 14.1737V5.37373H13.1163V14.1737ZM10.4497 13.3737C10.6854 13.3737 10.9115 13.2894 11.0782 13.1394C11.2449 12.9894 11.3385 12.7859 11.3385 12.5737V7.77373C11.3385 7.56156 11.2449 7.35807 11.0782 7.20805C10.9115 7.05802 10.6854 6.97373 10.4497 6.97373C10.2139 6.97373 9.98781 7.05802 9.82111 7.20805C9.65442 7.35807 9.56076 7.56156 9.56076 7.77373V12.5737C9.56076 12.7859 9.65442 12.9894 9.82111 13.1394C9.98781 13.2894 10.2139 13.3737 10.4497 13.3737Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                          <div
                            className="edit"
                            onClick={() => this.handleEditImg(image)}
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.6719 4.76543C16.6725 4.66015 16.6523 4.55579 16.6125 4.45833C16.5727 4.36087 16.514 4.27222 16.4399 4.19747L13.0479 0.805726C12.9731 0.731587 12.8845 0.672931 12.787 0.633122C12.6895 0.593314 12.5852 0.573135 12.4799 0.573744C12.3746 0.573135 12.2702 0.593314 12.1727 0.633122C12.0753 0.672931 11.9866 0.731587 11.9119 0.805726L9.64787 3.06956L0.903888 11.8129C0.829743 11.8877 0.771083 11.9763 0.731271 12.0738C0.69146 12.1712 0.67128 12.2756 0.671888 12.3809V15.7726C0.671888 15.9848 0.756174 16.1882 0.906203 16.3383C1.05623 16.4883 1.25971 16.5725 1.47189 16.5725H4.86388C4.97582 16.5786 5.0878 16.5611 5.19254 16.5212C5.29728 16.4812 5.39245 16.4197 5.47188 16.3406L14.1679 7.59722L16.4399 5.37339C16.5129 5.29586 16.5724 5.20662 16.6159 5.10941C16.6236 5.04564 16.6236 4.98118 16.6159 4.91742C16.6196 4.88018 16.6196 4.84266 16.6159 4.80543L16.6719 4.76543ZM4.53588 14.9727H2.27189V12.7088L10.2159 4.76543L12.4799 7.02926L4.53588 14.9727ZM13.6079 5.90135L11.3439 3.63752L12.4799 2.5096L14.7359 4.76543L13.6079 5.90135Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <img src={image.photoPath} alt="image" />
                      <p className="caption">{image.captions || "caption"}</p>
                    </div>
                  ))}
                  <div className="clearfix">
                    <Upload
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      multiple
                      className={fileList.length < 1 ? "full" : null}
                    >
                      {uploadButton}
                    </Upload>
                  </div>
                </Spin>
              </Col>
            </Row>
            <Modal
              title="Add Image"
              visible={showModal}
              onOk={this.handleSubmit}
              onCancel={() => this.setState({ showModal: false })}
              okText="Confirm"
              cancelText="Cancel"
            >
              {previewImageList &&
                previewImageList.map((image, i) => (
                  <div
                    key={i}
                    className="_img_con cover"
                    style={{ display: "flex", marginBottom: 5, float: "none" }}
                  >
                    <img
                      style={{ height: 100 }}
                      src={image.photoPath}
                      alt="image"
                    />
                    <input
                      type="text"
                      placeholder="Write caption here..."
                      className="caption"
                      onChange={(e) => {
                        let fileList = this.state.fileList;
                        image.captions = e.target.value;
                        //this.setState({ fileList });
                      }}
                    />
                  </div>
                ))}
            </Modal>
            {/* edit modal */}
            <Modal
              title="Update Image"
              visible={showModalEdit}
              onOk={this.updateImage}
              onCancel={() => this.setState({ showModalEdit: false })}
              okText="Confirm"
              cancelText="Cancel"
            >
              <div
                className="_img_con cover"
                style={{ display: "flex", marginBottom: 5, float: "none" }}
              >
                <img
                  style={{ height: 100 }}
                  src={editImage.photoPath}
                  alt="image"
                />
                <input
                  type="text"
                  placeholder="Write caption here..."
                  className="caption"
                  //value={editImage.captions}
                  onChange={(e) => {
                    //console.log("img", editImage);

                    editImage.captions = e.target.value;
                    this.setState({ editImage });

                    //  this.setState({ fileList });
                  }}
                />
              </div>
              <div className="clearfix">
                <Upload
                  onPreview={(file) => {
                    editImage.photoPath = file[0].photoPath;
                    this.setState({ editImage });
                  }}
                  onChange={(file) => {
                    this.setState({ replaceImage: file });
                  }}
                  replace
                >
                  Replace Photo
                </Upload>
              </div>
            </Modal>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() => {
                      this.props.continue({ page: 0, step: 1 });
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
                    onClick={() => this.props.continue({ page: 2, step: 2 })}
                  >
                    {fileList.length ? "Next" : "Add photos later"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(ConfirmPhotos);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
