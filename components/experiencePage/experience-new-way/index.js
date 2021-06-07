import s from "./style.module.css";
import { Row, Col } from "antd";

export default () => {
  return (
    <div className="container adventure-new-way pt-5">
      <div className="row">
        <div className="col-5">
          <div className="fc-primary">
            <h3 className="fc-primary ff-heebo fs-28 title-2x">
              Redefining global experiences
            </h3>
            <p className="sub-2x">
            Hurraayy partners with local travel experts so that you can get the best out of the adventures. Local people drive our activities as a result you can experience the beauty of their world..
            </p>
          </div>
        </div>
        <div className="col-7">
          <div className="adventure-new-way-right">
            <div className="row">
              <div className="col-4 d-flex flex-column justify-content-between">
                <div
                  className={`${s["small-img"]} bdr-md`}
                  style={{ paddingBottom: 15 }}
                >
                  <img className="w-100" src="./images/n2.png" />
                </div>
                <div
                  className={`${s["small-img"]} bdr-md`}
                  style={{ paddingTop: 15 }}
                >
                  <img className="w-100" src="./images/n3.png" />
                </div>
              </div>
              <div className="col-8">
                <div className={`${s["big-img"]} bdr-md`}>
                  <img className="w-100" src="./images/n1.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
