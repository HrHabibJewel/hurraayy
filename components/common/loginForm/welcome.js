import { Button } from "antd";
import { authWelcome } from "../../../store/auth/actions";
import { connect } from "react-redux";

class WelcomeLogin extends React.Component {
  welcomeSubmit = () => {
    this.props.dispatch(authWelcome());
  };
  render() {
    return (
      <div className="login-welcome">
        <div className="login-info">
          <h2>Welcome back!</h2>
          <p>We are happy to see you again Log in and enjoy our services.</p>
        </div>
        <div className="welcome-img">
          <img src="./images/login-img.png" />
        </div>

        <Button
          onClick={() => this.welcomeSubmit()}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Continue as John
        </Button>
        <p>Not john kennedy? Use another account</p>
      </div>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(WelcomeLogin);
