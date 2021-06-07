import s from "./style.module.css";
import { Row, Col } from "antd";

export default () => {
  return (
    <div className="container adventure-new-way pt-5">
      <div className="row">
        <div className={`${s["new-way"]}`} style={{alignSelf:"center"}}>
          <div className="fc-primary">
            <h3 className="ff-heebo fs-22 title-2x text-center" style={{color:"#333", fontWeight:"600px", fontSize:"22px"}}>
              {/* Redefining global adventures */}
              {/* A new way to travel in Hurraayy */}
              Redefining the way you travel
            </h3>
            <p className="text-center"  style={{color:"#333", fontWeight:"400", fontSize:"16px"}}>
            {/* Hurraayy partners with local travel experts so that you can get the best out of the adventures. Local people drive our activities as a result you can experience the beauty of their world.. */}
            {/* There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.  */}
            Our adventures are curated by local travel experts. You get to see local communities, their culture and beauty of rural life. Some adventures contain mild activities, some others are extreme in nature.
            </p>
          </div>
        </div>
        <div className={`${s["new-way2"]}`}>
          <div className="adventure-new-way-right">
            <div className="row">
              <div className="col-4 d-flex flex-column justify-content-between">
                <div
                  className={`${s["small-img"]} bdr-sm`}
                  style={{ paddingBottom: 15 }}
                >
                  <img className="w-100" src="./images/adventure_new_way_1.jpg" style={{borderRadius:"18px"}} />
                </div>
                <div
                  className={`${s["small-img"]} bdr-md`}
                  style={{ paddingTop: 15 }}
                >
                  <img className="w-100" src="./images/adventure_new_way_2.jpg" style={{borderRadius:"18px"}}/>
                </div>
              </div>
              <div className="col-8">
                <div className={`${s["big-img"]} bdr-md`}>
                  <img className="w-100" src="./images/adventure_new_way_3.jpg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
