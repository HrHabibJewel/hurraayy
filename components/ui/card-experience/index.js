import s from "./style.module.css";
import { Col, Icon, Tooltip } from "antd";
import Link from "next/link";

export default ({
  info,
  type = 1,
  pathname = "/experience-details",
  criteria = "",
}) => {
  const img = info["img"];
  const title = info["title"];
  const countryCity = info["countryCity"];
  const duration = info["duration"];
  const pricePerGuest = info["pricePerGuest"] ? info["pricePerGuest"] : 0;
  const id = info["id"];
  function Card(props) {
    //console.log("prop type", type);
    if (props.type == 1) {
      return (
        <Col xs={24} sm={12} md={6}>
          <Link
            href={{ pathname: pathname, query: { id: id, criteria: criteria } }}
          >
            <div
              className={s["experience-single-card"]}
              style={{ cursor: "pointer" }}
            >
              <div
                className={s["experience-image"]}
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: "100%",
                }}
              >
                {/* <img src={`./images/${img}`} /> */}
              </div>
              <div className={s["experience-info"]}>
                {/* <span className={s.text}>{title ? title : "''"}</span> */}

                <span className={s.text}>
                  {title && title.length < 70 ? (
                    title
                  ) : title && title.length >= 70 ? (
                    <Tooltip placement="topRight" title={title}>
                      {title.substring(0, 70) + "..."}
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </span>
                {/* <span className={s["number"]}>
                <Icon type="star" theme="filled" />
                4.73 (135)
              </span> */}
                <div className={s["price-city"]}>
                  <span
                    style={{
                      color: "#616161",
                      fontSize: "1rem",
                      fontFamily: "Heebo",
                    }}
                  >
                    {countryCity}
                  </span>
                  <br />
                  <label
                    style={{
                      color: "#333",
                      fontSize: "1rem",
                      fontWeight: "400px",
                      fontFamily: "Heebo",
                    }}
                  >
                    From ৳<b> {pricePerGuest}</b> / person - {duration} hours
                  </label>
                </div>
              </div>
            </div>
          </Link>
        </Col>
      );
    } else {
      return (
        <Col xs={24} sm={12} md={6}>
          <Link href={{ pathname: pathname, query: { id: id, criteria } }}>
            <div
              className={s["experience-single-card"]}
              style={{ cursor: "pointer" }}
            >
              <div
                className={s["experience-image"]}
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: "100%",
                }}
              >
                {/* <img style={{ height: "230px" }} src={`./images/${img}`} /> */}
              </div>
              {/* <div className={`${s["experience-info"]} ${s["adv-info"]}`}> */}
              <div className={`${s["experience-info"]}`}>
                <span
                  style={{
                    color: "#616161",
                    fontSize: "1rem",
                    fontFamily: "Heebo",
                  }}
                >
                  {countryCity}
                </span>
                <br />
                {/* <span className={s.text}>
                    {title}
                  </span> */}
                <span className={s.text}>
                  {title && title.length < 70 ? (
                    title
                  ) : title && title.length >= 70 ? (
                    <Tooltip placement="topRight" color={'orange'} title={title}>
                      {title.substring(0, 70) + "..."}
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </span>
                <div className={s["price-city"]}>
                  {/* <span>
                    <br />
                    From ৳ <b>{pricePerGuest}</b> / person . {duration} hours
                  </span> */}
                  <label
                    style={{
                      color: "#333",
                      fontSize: "1rem",
                      fontWeight: "400px",
                      fontFamily: "Heebo",
                    }}
                  >
                    From ৳<b> {pricePerGuest}</b> / person - {duration} days
                  </label>
                </div>
              </div>
            </div>
          </Link>
        </Col>
      );
    }
  }
  return <Card type={type} />;
};
