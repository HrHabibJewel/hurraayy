import { Form, Icon, Input, Button, Checkbox } from "antd";
import WelcomeLogin from "./welcome";
import Login from "./login";
import { connect } from "react-redux";

class NormalLoginForm extends React.Component {
  render() {
    let welcome;
    let login;
    // if (this.props.userInfo["step"] == 1) {
    //   welcome = <WelcomeLogin />;
    // } else {
    //   login = <Login />;
    // }
    login = <Login />;
    return (
      <div>
        {/* {welcome} */}
        {login}
      </div>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(Form.create()(NormalLoginForm));
