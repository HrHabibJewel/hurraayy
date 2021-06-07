import { Table } from "antd";
import { useState, Fragment, useEffect } from "react";
import { $axios } from "../../lib/http-service";
const columns = [
    {
        title:"#",
        dataIndex:"sl",
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'BedRooms',
      dataIndex: 'bedRooms',
    },
    {
      title: 'Beds',
      dataIndex: 'beds',
    },
    {
      title: 'Baths',
      dataIndex: 'baths',
    },
    {
        title: 'Location',
        dataIndex: 'locations',
    }
  ];
export default () => {
    const [listingData, setListingData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let _url = "properties/property_list";
        $axios.get(_url).then(function (resp) {
            if(resp && resp.status == 200 && resp.data && resp.data.length > 0){
                let listing = [];
                resp.data.map((item, key) => {
                    //console.log("key", key, item)
                    let city = "";
                    let country = "";
                    if (item["city"] && item["city"]["name"]) {
                        city = item["city"]["name"];
                        if (item["city"]["state"] && item["city"]["state"]["country"]) {
                        country = item["city"]["state"]["country"]["name"]
                            ? item["city"]["state"]["country"]["name"]
                            : "";
                        }
                    }
                    listing.push({
                        key:key,
                        sl:key+1,
                        name:item['name'],
                        bedRooms:item['bedroomCount'],
                        beds:item['bedCount'],
                        baths:item['bathroomCount'],
                        locations:city + (country ? ", " + country : "")
                    });
                })
                setListingData(listing)
            }
            setLoading(false);
        })
    }, [])
    return (
    <Fragment>
        <Table 
            loading={loading} 
            // pagination={{total:200}}
            columns={columns}
             dataSource={listingData}/>
    </Fragment>
    );
};
