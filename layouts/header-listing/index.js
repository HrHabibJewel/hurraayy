import { withRouter } from "next/router";
import { Row, Col, Divider } from "antd";
import Link from "next/link";
import s from "./style.module.css";

const Header = ({ step, page }) => {
  let title = "Start with the basic";
  let fpage = 0;
  let lpage = 0;
  if (page) {
    if (step == 1) {
      fpage = 12.5 * page;
      lpage = 100 - 12.5 * page;
    } else if (step == 2) {
      fpage = 25 * page;
      lpage = 100 - 25 * page;
    } else if (step == 3) {
      fpage = 9.1 * page;
      lpage = 100 - 9.1 * page;
    }
    fpage = fpage > 100 ? 100 : fpage;
    lpage = lpage < 0 ? 0 : lpage;
  }
  return (
    <header>
      <div className="container">
        <Row>
          <Col md={{ span: 24 }}>
            <div className={s["listing-header"]}>
              <Link href="/">
                <a>
                  <img style={{ width: 48 }} src="../images/logo.png" />
                </a>
              </Link>
              <span>
                Step {step}: {title}
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <div className={s["listing-divider"]}>
        <span style={{ width: fpage + "%" }}>&nbsp;</span>
        <span style={{ width: lpage + "%" }}>&nbsp;</span>
      </div>
      {/* <Divider className="listing-divider" /> */}
    </header>
  );
};

export default withRouter(Header);
