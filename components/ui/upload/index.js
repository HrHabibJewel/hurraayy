import s from "./style.module.css";
import { Fragment } from "react";

export default ({
  children,
  style,
  className,
  accept,
  multiple,
  onPreview,
  onChange,
  replace,
}) => {
  const handleFileSelect = (e) => {
    if ("preventDefault" in e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const files = e.target.files || e.dataTransfer.files;
    const fileList = Object.keys(files).map((file) => files[file]);
    let imgs = [];
    onChange && onChange(fileList);

    fileList.forEach((file) => {
      imgs.push({ photoPath: URL.createObjectURL(file), file });
    });
    onPreview && onPreview(imgs);
    // console.log(imgs, fileList);
  };
  const handleDragOver = (e) => {
    if ("preventDefault" in e) {
      e.stopPropagation();
      e.preventDefault();
    }
    e.target.classList.add(s.active);
  };

  function handleDragLeave(e) {
    e.target.classList.remove(s.active);
  }

  return (
    <Fragment>
      <label
        className={
          className
            ? `${s.label} ${s[className]} ${replace ? s.rep : ""}`
            : `${s.label} ${replace ? s.rep : ""}`
        }
        style={{ ...style }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileSelect}
      >
        <input
          className={s.file}
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          multiple={multiple || false}
        />
        {children}
      </label>
    </Fragment>
  );
};
