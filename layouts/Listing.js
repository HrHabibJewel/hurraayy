import { Fragment } from "react";
import Header from "./header-listing";
import { Row, Col, Divider } from "antd";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess } from "../store/auth/actions";
import { adventrueForm } from "../store/adventureForm/actions";
import StorageService from "../lib/storage.service";
import Head from "next/head";

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};

const sessionUser = (dispatch, userInfo) => {
  var token, localUser, step, adventureForm;
  if (localStorage) {
    token = StorageService.getToken();
    localUser = localStorage.getItem("user");
    step = localStorage.getItem("step");
    adventureForm = JSON.parse(StorageService.getAdventureForm());
    if (adventureForm && Object.keys(adventureForm).length > 0) {
      dispatch(
        adventrueForm(
          adventureForm["currentPageName"],
          adventureForm["propertyId"]
        )
      );
    }
    if (userInfo && Object.keys(userInfo) < 1 && localUser) {
      dispatch(authSuccess(step, token, localUser));
    }
  }
};

export default ({ children, step, page, style }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted.current) {
      sessionUser(dispatch, userInfo);
    }
  }, [isMounted]);
  return (
    <Fragment>
      <Header step={step} page={page} />
      <div className="listing-container" style={style || null}>
        <Row>
          <Col md={{ span: 24 }}>
            <main className="listing-form">{children}</main>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};
