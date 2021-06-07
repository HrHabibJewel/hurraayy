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
            <h2 className="ff-heebo fw-600 m-0 title-3x" style={{color:"#333"}}>
              Hurraayy Experiences
            </h2>
          </div>
        </div>
      </div>
      <div className="justify-content-around row text-center" style={{color:"#333"}}>
        {/* <div className="col col-3">
          <div className="single-adventure-promotion">
            <img className={s.img} src="./images/promotion-1.png" />
            <h4 className="fc-primary ff-heebo fs-18 fw-500 lh-5x mt-2">
            Trip itineraries are prepared by local experts
            </h4>
            <p>
              There are many variations of passages of Lorem Ipsum available,
              but the majority
            </p>
          </div>
        </div> */}
        <div className="col col-12">
          {/* <div className="single-adventure-promotion">
            <img src="./images/promotion-2.png" />
            <h4 className="fc-primary ff-heebo fs-18 fw-500 lh-5x mt-2">
            Hurraayy experience include lodging and meals
            </h4>
            <p>
              If you are going to use a passage of Lorem Ipsum, you need to be
              sure there isn't anything
            </p>
          </div> */}
          <div className={s["single-advanture-promotion"]}>
            <p>
            Experiences are travel based activities which may include meal and<br/>
             transportation whereas necessary and conclude on the same day.
            </p>
          </div>
        </div>
        {/* <div className="col col-3">
          <div className="single-adventure-promotion">
            <img src="./images/promotion-3.png" />
            <h4 className="fc-primary ff-heebo fs-18 fw-500 lh-5x mt-2">
            We take care of the transportation whereas necessary
            </h4>
            <p>
              All the Lorem Ipsum generators on the Internet tend to repeat
              predefined chunks
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};
