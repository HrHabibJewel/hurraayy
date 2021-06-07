import { Button, Icon, Input } from "antd";
import { useState, Fragment } from "react";
import s from "./style.module.css";

export default ({ line, lineHeight = 16, children, className }) => {
  const [expand, setExpand] = useState(false);
  return (
    <Fragment>
      <div
        className={s[className]}
        style={{
          overflow: "hidden",
          height: !expand ? lineHeight * line : "auto",
        }}
      >
        {children}
      </div>

      <Button
        style={{ padding: 0 }}
        type="link"
        onClick={() => setExpand(!expand)}
      >
        Show {expand ? "Less" : "More"}
      </Button>
    </Fragment>
  );
};
