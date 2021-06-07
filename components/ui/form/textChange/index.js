import React from "react";
import s from "./style.module.css";
import { Icon, Button } from "antd";
class textChange extends React.Component {
  state = {
    aActive: "active",
    mActive: "",
  };
  textChange = (type) => {
    let v = this.props.val;
    let valType = this.props.valType ? this.props.valType : 1;
    let key = this.props.index ? this.props.index : 0;
    if (type == 1) {
      this.state.aActive = "active";
      this.state.mActive = "";
      v = v + valType;
    }
    if (type == 0) {
      this.state.aActive = "";
      this.state.mActive = "active";
      v = v - valType;
    }
    v = v > 0 ? v : 0;
    //this.props.textChange(v, this.props.val.name);
    this.props.textChange(v, this.props.textName, type, key);
  };
  render() {
    let decreaseDisabled = true;
    if (this.props.decreaseDisabled) {
      decreaseDisabled = this.props.decreaseDisabled;
    } else {
      decreaseDisabled = this.props.val == 0 ? true : false;
    }
    let increaseDisabled = this.props.increaseDisabled
      ? this.props.increaseDisabled
      : false;
    return (
      <div className={s["text-change"]}>
        <span className="align-items-baseline d-flex justify-content-between">
          {this.props.labelName && <label >{this.props.labelName}</label>}
          {this.props.spanLabelName && <p className={s["sub-text"]}>{this.props.spanLabelName}</p>}
          <span className={s.change}>
            <Button
              disabled={decreaseDisabled}
              size={"small"}
              onClick={() => this.textChange(0)}
              className={this.state.mActive}
            >
              <Icon type="minus" />
            </Button>
            <span>
              <b className={s["text"]}>{this.props.val}</b>
              <b className={s["text"]}>{this.props.valText ? this.props.valText : ""}</b>
            </span>
            <Button
              size={"small"}
              disabled={increaseDisabled}
              onClick={() => this.textChange(1)}
              className={this.props.isActive == false ? "" : this.state.aActive}
            >
              <Icon type="plus" />
            </Button>
          </span>
        </span>
      </div>
    );
  }
}

export default textChange;
