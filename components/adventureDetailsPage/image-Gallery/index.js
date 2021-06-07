import { Button, Icon } from "antd";
import { useState, Fragment } from "react";
import Slider from "../details-sections/slider";
import s from "./style.module.css";

const isServer = typeof window === "undefined";

const shareIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7912 5.81779L11.7911 9.59515C11.3694 9.99335 10.6667 9.69812 10.6667 9.11048V7.11151C6.65069 7.13846 4.9565 8.08687 6.08958 11.8713C6.21411 12.2872 5.73275 12.6093 5.39497 12.3527C4.31256 11.5305 3.33333 9.95779 3.33333 8.37032C3.33333 4.37207 6.59997 3.57865 10.6667 3.55609V1.55568C10.6667 0.967511 11.3699 0.673234 11.7911 1.07101L15.7912 4.84846C16.0695 5.11132 16.0697 5.55471 15.7912 5.81779ZM10.6667 11.42V13.3331H1.77778V4.44423H3.19211C3.237 4.44421 3.28142 4.4351 3.3227 4.41747C3.36398 4.39985 3.40127 4.37405 3.43233 4.34165C3.84769 3.90921 4.32781 3.56693 4.84939 3.29509C5.15856 3.13396 5.044 2.66646 4.69536 2.66646H1.33333C0.596944 2.66646 0 3.2634 0 3.99979V13.7776C0 14.514 0.596944 15.1109 1.33333 15.1109H11.1111C11.8475 15.1109 12.4444 14.514 12.4444 13.7776V11.3107C12.4444 11.0805 12.2168 10.92 11.9997 10.9968C11.6954 11.1044 11.3695 11.1366 11.05 11.0906C10.8481 11.0615 10.6667 11.216 10.6667 11.42Z"
      fill="#808080"
    />
  </svg>
);
const closeIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.99985 1.24583L12.9998 10.2458L21.9998 1.2731C22.177 1.0928 22.3897 0.951226 22.6245 0.857338C22.8592 0.76345 23.1108 0.719287 23.3635 0.727644C23.8593 0.759728 24.3264 0.971165 24.6777 1.32247C25.0291 1.67378 25.2405 2.14095 25.2726 2.63673C25.275 2.8805 25.228 3.12223 25.1342 3.34726C25.0404 3.57229 24.902 3.77593 24.7271 3.94583L15.6998 13.0004L24.7271 22.0549C25.0817 22.3986 25.278 22.8731 25.2726 23.364C25.2405 23.8598 25.0291 24.327 24.6777 24.6783C24.3264 25.0296 23.8593 25.241 23.3635 25.2731C23.1108 25.2815 22.8592 25.2373 22.6245 25.1434C22.3897 25.0495 22.177 24.9079 21.9998 24.7276L12.9998 15.7549L4.02712 24.7276C3.84992 24.9079 3.63724 25.0495 3.40252 25.1434C3.1678 25.2373 2.91615 25.2815 2.66348 25.2731C2.15845 25.2468 1.68105 25.0344 1.32346 24.6768C0.965857 24.3192 0.753409 23.8418 0.727121 23.3367C0.724653 23.093 0.771728 22.8512 0.86549 22.6262C0.959252 22.4012 1.09775 22.1975 1.27258 22.0276L10.2998 13.0004L1.2453 3.94583C1.0754 3.77364 0.941943 3.56897 0.852911 3.34404C0.763879 3.11912 0.721097 2.87856 0.727121 2.63673C0.759205 2.14095 0.970642 1.67378 1.32195 1.32247C1.67326 0.971165 2.14042 0.759728 2.63621 0.727644C2.88691 0.715736 3.13737 0.755602 3.37198 0.844754C3.60659 0.933906 3.82032 1.07043 3.99985 1.24583Z"
      fill="#919191"
    />
  </svg>
);

export default ({ imgs, id }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  let count = false;
  return (
    <Fragment>
      <div className="row" >
        {imgs &&
          imgs.map((img, j) => {
            if (j == 0) {
              count = true;
              return (
                <div key={j} className="col-md-8 col-sm-12" >
                  <div
                    onClick={toggleModal}
                    className="img large"
                    style={{ backgroundImage: `url(${img.photoPath})` }}
                  >
                  </div>
                </div>
              );
            }
          })}
        <div className="col-sm-12 col-md-4" >
          <div className="imageRow">
            {imgs &&
              imgs.map((img, i) => {
                if (i != 0 && i < 3) {
                  return (
                    <div className="imageCol">
                      <div
                        onClick={toggleModal}
                        key={i}
                        className="img small-img"
                        style={{ backgroundImage: `url(${img.photoPath})` }}
                      ></div>
                    </div>
                  );
                }
              })}
          </div>
          {/* <div className={`${s["pe-none"]} ${s["tags"]}`}>
            <a className={s["pe-all"]}>
              {shareIcon}
              share
            </a>
            <a className={s["pe-all"]}>
              <Icon type="heart" />
              save
            </a>
          </div> */}
          <div className="pe-none tags btm">
            <a className="pe-all" onClick={toggleModal}>
              View Photos
            </a>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="slider-modal">
          <a className="slider-modal-close" onClick={toggleModal}>
            {closeIcon}
          </a>
          <Slider images={imgs} />
        </div>
      )}
    </Fragment>
  );
};
