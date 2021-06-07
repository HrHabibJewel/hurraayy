import { Button, Input, AutoComplete, Icon } from 'antd';
import { $openAxios } from "../../../lib/http-service";
import Router from "next/router";
import Link from "next/link";
import moment from 'moment';
import * as icon from "../../../components/icons";
import {encryption, decryption} from "../../../lib/utils/utility";
const { Option } = AutoComplete;
let searchField = '';

class Complete extends React.Component {
  
  state = {
    dataSource: [],
  };

  renderOption = (item) => {
    //let _criteria = btoa(JSON.stringify(this.props.criteria));
    let _criteria = encryption(this.props.criteria);
    
    let url = `/details`;
    let hurraayyType = this.props.hurraayyType;
    if(hurraayyType == 2) {
      url = `/adventure-details`;
    } else if(hurraayyType == 3){
      url = `/experience-details`;
    }
    return (
      <Option key={item.id} text={item.name}>
        <Link href={{ pathname: url, query: { id: item.id, criteria:_criteria } }}>
          {item.name+"-"+item.city}
        </Link> 
      </Option>
    );
  }

  handleSearch = async value => {
    let url = '/accommodations';
    let hurraayyType = this.props.hurraayyType;

    let startDate = "";
    let endDate = "";
    const criteria = this.props.criteria;
    if(criteria) {
      startDate = criteria['dateRange'][0] ? criteria['dateRange'][0] : "";
      endDate = criteria['dateRange'][1] ? criteria['dateRange'][1] : "";
    }
  
    // must be current date condition
    if(hurraayyType == 2) {
      url = '/adventure-open';
    } else if(hurraayyType == 3){
      url = '/experience-open'
    }
    let params = {};
    params["pageNo"] = 1;
    params["pageSize"] = 20;
    params["cityName"] = value;
    params["startDate"] = startDate;
    params["endDate"] = endDate;
    if(hurraayyType == 1) {
      params["name"] = value;
      params["sortBy"] = "id:desc,name:desc";
    } else {
      params["sortBy"] = "id:desc,title:desc";
    }
   
    await $openAxios.get(url, { params: params }).then((resp) => {
      if (resp && resp.status == 200) {
        let data = resp.data.content;
        let _dataSource = [];
        if(data && data.length > 0) {
          for(let key in data) {
            _dataSource.push({
              id:data[key]['id'],
              name:(hurraayyType == 1) ? data[key]['name'] : data[key]['title'],
              city:data[key]['city']['name']
            })
          }
        }
        this.setState({
          dataSource: value ? _dataSource : [],
        });
      }
    });
  };

  onSearch = (e) => {
    let searchArr = [];
    searchArr[0]=searchField;
    searchArr[1]=this.props.criteria;
   // const criteria = btoa(JSON.stringify(searchArr));
   const criteria = encryption(searchArr);

    this.setState({dataSource:[]})
    let url = `/accomodation?search=${criteria}`;
    let hurraayyType = this.props.hurraayyType;
    if(hurraayyType == 2) {
      url = `/adventure?search=${criteria}`;
    } else if(hurraayyType == 3){
      url = `/experience?search=${criteria}`;
    }
    Router.push(url, undefined, {
      shallow: true,
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="global-search-wrapper" >
        <AutoComplete
          className="global-search"
          size="large"
          span={24}
          style={{ width: "100%",boxShadow:"none" }}
          dataSource={dataSource.map(this.renderOption)}
          onSearch={this.handleSearch}
          filterOption={
            (inputValue) =>{
              searchField = inputValue;
              return true
            }
          }
          placeholder="input here"
          optionLabelProp="text"
        >
          <Input
            // style={{ marginLeft: -15}}
            style={{marginLeft: -15, height:"40px",width:"108%"}}
            prefix={icon.search}
            placeholder="Type here"
            suffix={
              <Button
                onClick={(e) => this.onSearch(e)}
                className="search-btn"
                style={{ marginRight: -13, height:"41px", borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px",fontFamily:"Heebo", fontSize:"13px", fontWeight:"600"}}
                size="large"
                type="primary"
              >
                Let's Go
              </Button>
            }
          />
        </AutoComplete>
      </div>
    );
  }
}

export default Complete