import { Fragment, useEffect, useState  } from "react";
import { withRouter } from "next/router";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, Button, Menu, Icon, Steps, Collapse, Avatar } from "antd";

const { SubMenu } = Menu;
const { Step } = Steps;
const { Panel } = Collapse;

const Component = ({ children, page, step }) => {
  const router = useRouter();
  const queryParams = router.query;
  const [activeMenu, setActiveMenu] = useState(false);
  // useEffect(() => {
   
  //  console.log("router", router.query);
  // }, []);
  
  let menuList = [
    {
      name: "The Experience",
      page: 1,
      children: [
        {
          name: "Location",
          url: "/experience-host?step=1&page=1",
          stepAndPageTogetherNo: 11
        },
        {
          name: "Category",
          url: "/experience-host?step=1&page=2",
          stepAndPageTogetherNo: 12
        },
      ],
    },
    {
      name: "General Information",
      page: 2,
      children: [
        {
          name: "Language",
          url: "/experience-host?step=2&page=1",
          stepAndPageTogetherNo: 21
        },
        {
          name: "Your Background",
          url: "/experience-host?step=2&page=2",
          stepAndPageTogetherNo: 22
        },
      ],
    },
    {
      name: "Experience Details",
      page: 3,
      children: [
        {
          name: "About Yourself",
          url: "/experience-host?step=3&page=1",
          stepAndPageTogetherNo: 31
        },
        {
          name: "Activity Descriptions",
          url: "/experience-host?step=3&page=2",
          stepAndPageTogetherNo: 32
        },
        {
          name: "Places We'll See",
          url: "/experience-host?step=3&page=3",
          stepAndPageTogetherNo: 33
        },
        {
          name: "Inclusive of",
          url: "/experience-host?step=3&page=4",
          stepAndPageTogetherNo: 34
        },
        {
          name: "Packing List For Guests",
          url: "/experience-host?step=3&page=5",
          stepAndPageTogetherNo: 35
        },
        {
          name: "Experience Title",
          url: "/experience-host?step=3&page=6",
          stepAndPageTogetherNo: 36
        },
        {
          name: "Upload Photos",
          url: "/experience-host?step=3&page=7",
          stepAndPageTogetherNo: 37
        },
      ],
    },
    {
      name: "Settings",
      page: 4,
      children: [
        {
          name: "Where To Meet",
          url: "",
          stepAndPageTogetherNo: 41
        },
        {
          name: "Notes For Your Guests",
          url: "",
          stepAndPageTogetherNo: 42
        },
        {
          name: "Guest Requirements",
          url: "",
          stepAndPageTogetherNo: 43
        },
        {
          name: "Group size",
          url: "",
          stepAndPageTogetherNo: 44
        },
        // {
        //   name: "Contribution",
        //   url: "",
        //   stepAndPageTogetherNo: 45
        // },
        {
          name: "Activity Duration",
          url: "",
          stepAndPageTogetherNo: 46
        },
        {
          name: "Price",
          url: "",
          stepAndPageTogetherNo: 47
        },
        {
          name: "Preparation Time",
          url: "",
          stepAndPageTogetherNo: 48
        },
      ],
    },
    {
      name: "Submit",
      page: 5,
      children: [
        {
          name: "Review & Finish",
          url: "",
          stepAndPageTogetherNo: 51
        },
      ],
    },
  ];
  function callback(key) {
    // console.log(key);
    setActiveMenu(Number(key[1]))
  }
  return (
    <Fragment>
      <div className="container-fluid experience-form">
        <div className="row">
          <div className="w-20" style={{ background: "#FCFCFC" }}>
            <div className="pl-3" style={{marginTop:20}}> 
              <Link href="/">
                <a>
                  <img src="../images/logo.png" style={{ width: 40 }} />
                </a>
              </Link>
              <h2 className="ff-heebo fs-20 fw-500 mt-3">
                {/* Submit your experience */}
                Experience Listing
              </h2>
            </div>
            {/* collapsed */}
            
            <Collapse
              className="exp-left"
              defaultActiveKey={[Number(queryParams["step"])]}
              onChange={callback}
              expandIconPosition={"right"}
              bordered={false}
              // activeKey={[Number(queryParams["step"])]}
              activeKey = {
                activeMenu? activeMenu : [Number(queryParams["step"])]
              }
            >
              {menuList.map((item) => (
                <Panel
                  className={
                        item.page < step 
                        ? "eh-100"
                        :item.page == step && page < item.children.length
                        ? `eh-50`//+ Math.round(100/item.children.length) 
                        :item.page == step && page == item.children.length
                        ? "eh-100"
                        :""
                  }
                  header={
                    <div>
                      {item.page > step ? ( //Used for sidebar number coloring
                        <Avatar
                          shape="square"
                          style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                          }}
                        >
                          {item.page}
                        </Avatar>
                      ) : ( //Used for sidebar check mark though it is active
                        <Avatar
                          shape="square"
                          style={{
                            color: "#f56a00",
                            backgroundColor: "#fff",
                            border: "1px solid #f56a00",
                          }}
                          
                          icon="check"
                        />
                      )}
                      {/* Sidebar header name */}
                      <span className="ff-heebo fs-18 pl-4">{item.name}</span> 
                    </div>
                  }
                  key={item.page}
                >
                  {item.children.map((child, i) => (
                    <div className="pb-3 pl-5" style={{ cursor: "pointer" }}>
                      {
                        <Icon
                          type="check-circle"
                          style={{
                            color:
                            Number(child.stepAndPageTogetherNo) === Number(step+""+page) 
                            ? "#15D59B" 
                            : Number(child.stepAndPageTogetherNo) < Number(step+""+page) 
                            ? "#15D59B"
                            : "lightgray",
                          }}
                          theme="filled"
                        />
                      }{" "}
                      {child.name}
                    </div>
                  ))}
                </Panel>
              ))}
            </Collapse>
            
          </div>
          <div className="flex-fill">
            <main style={{ minHeight: "100vh" }} className="exp-listing-form">
              {children}
            </main>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(Component);
