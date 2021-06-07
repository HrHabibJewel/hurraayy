import s from "./style.module.css";

export default () => {
  return (
    <div className="container adventure-promotion p-2">
      <div className="row">
        <div className="col">
          <div className="text-center m-1">
            {/* <h2 className="fc-primary ff-heebo fw-600 m-0 title-3x">
            We handle all your logistics and let you enjoy you the trip
            </h2> */}
            <h2 className="ff-heebo fw-600 fs-22 m-0" style={{color:"#333",fontSize:"22px"}}>
              {/* Planing a trip should be easy */}
              We handle all logistics and you enjoy your trip
            </h2>
          </div>
        </div>
      </div>
      <div className="fc-primary justify-content-around row text-center" style={{marginTop:"30px"}}>
        {/* <div className="col col-12">
          <div className="single-advanture-promotion">
            <p>
              With Hurraayy
            </p>
          </div>
        </div> */}
        <div className="col col-3">
          <div className="single-adventure-promotion">
            <img className={s.img} src="./images/promotion_1.png" width="80px" height="60px"/>
            <h4 className="ff-heebo fs-16 fw-600 lh-5x mt-2" style={{color:"#333", fontWeight:"600px"}}>
            Trip itineraries are prepared by local experts
            </h4>
          </div>
        </div>
        <div className="col col-3">
          <div className="single-adventure-promotion">
            <img src="./images/promotion_2.png"  width="80px" height="60px"/>
            <h4 className="ff-heebo fs-16 fw-600 lh-5x mt-2" style={{color:"#333", fontWeight:"600px"}}>
            Hurraayy adventures include lodging and meals
            </h4>
          </div>
        </div>
        <div className="col col-3">
          <div className="single-adventure-promotion">
            <img src="./images/promotion_3.png"  width="80px" height="60px" />
            <h4 className="ff-heebo fs-16 fw-600 lh-5x mt-2" style={{color:"#333", fontWeight:"600px"}}>
            We take care of the transportation whereas necessary
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
