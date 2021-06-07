import s from "./style.module.css";

export default () => {
  return (
    <div className="container adventure-promotion p-2">
      <div className="row">
        <div className="col">
          <div className="text-center m-1">
            
            <h2 className="ff-heebo fw-600 m-0 title-3x" style={{color:"#333",fontWeight:"600px"}}>
            Hurraayy Accommodations
            </h2>
          </div>
        </div>
      </div>
      <div className="justify-content-around row text-center" >
        
        <div className="col col-12">
          
          <div className={s["single-advanture-promotion"]}>
            <p>
            You can chose from a wide range of  options such as hotels, villas,<br/>
             private properties, resorts etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
