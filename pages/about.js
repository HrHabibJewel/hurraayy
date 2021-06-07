import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import s from '../components/host-panel/style.module.css'
class About extends React.Component {
    componentDidMount() { }
    render() {
        return (
            <App>
                <div className="container-fluid" style={{ paddingBottom: "20px" }}>
                    <div className="row">

                    </div>
                    <div>
                        <img className="img-fluid w-100" src="./images/Aboutustoppicture.png"></img>
                        <p className={s.aboutHead}>Hurraayy</p>
                        <p className={s.aboutSlog}>Travel is full of fun!</p>
                    </div>
                    <div className="row mt-md-5 pt-5 mb-md-1">
                        <div className="col-12 text-center">
                            <p className={s.aboutTitle}>Our Story</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className=" mr-md-5 ml-md-5 pl-md-5 pr-md-5">
                                <div className=" mr-md-5 ml-md-5 pl-md-5 pr-md-5">
                                    <div className="text-center mr-md-5 ml-md-5 pl-md-5 pr-md-5 p-2">
                                        <p className={s.aboutDescription}>Hurraayy started its journey in 2021 in order to redefine the way you travel in the post- pandemic world.</p>

                                        <p className={s.aboutDescription}>  Currently we are offering Adventures, Experiences and Accommodations. Adventures are multi day activities hosted by local guides, it may include lodging, meals and transportation whereas necessary. Experiences are  travel activities which conclude on the same day. Accommodation includes private properties, hotels, resorts, villas etc.</p>

                                        <p className={s.aboutDescription}>  Hurraayy is all about you. You host , you travel and you enjoy. Our slogan 'All About You' is also reflected on our logo too.</p>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row mt-sm-1 mt-md-5 pt-md-5 pt-sm-1 mb-1">
                        <div className="col-12 text-center">
                            <p className={s.aboutTitle}>Redefining the way you travel</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6 col-lg-6 p-sm-2 p-md-5 p-lg-5">
                            <img className="p-md-5 p-lg-5 p-sm-1" height="100%" width="100%" src="./images/About us 2 1.png"></img>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <div className="pt-sm-2 pt-md-5 pt-lg-5">
                                <div className="p-5">
                                    <p className={s.aboutDescription}>We are on a mission to transform your trips into awesome experiences. Your trips are not only guided, they are hosted by our expert hosts. That means you will be treated as our guests while our hosts are in charge of the trips. With vast knowledge of local culture and terrain our hosts will help you to get to know the people & heritage.</p>

                                    <p className={s.aboutDescription}>Besides offering leisure trips, we are also offering adventures to different parts of the globe. Some adventures contain mild activities, some others are extreme in nature. While you can have a relaxing trip to Saint Martin island, you can go for a trekking tour to Amiakhum, Bandarban. If you have a few hours to kill in Cox's Bazar you can book a paragliding experience! </p>

                                    <p className={s.aboutDescription}>Life is beautiful when you travel with Hurraayy!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-sm-1 mt-md-5 pt-md-5 pt-sm-1 mb-1">
                        <div className="col-12 text-center">
                            <p className={s.aboutTitle}>Empowering hosts</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="pt-sm-2 pt-md-5 pt-lg-5">
                                <div className="p-5">
                                    <p className={s.aboutDescription}>Hosts are part and parcel of our marketplace. They enrich our inventory by providing quality listings for the travelers. Hosts can manage their travel business easily and effectively using our sophisticated tools and platform. Facilities such as price setting, trouble free booking management, hosting panel give our hosts incredible amount of control and comfort running their travel businesses.</p>

                                    <p className={s.aboutDescription}>We are promoting hosts from many parts of the country, they are local people mostly. New businesses are being created by them. As a result we are contributing by creating new jobs every month!</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 p-sm-2 p-md-5 p-lg-5">
                            <img className="p-md-5 p-lg-5 p-sm-1" height="100%" width="100%" src="./images/About us 3 1.png"></img>
                        </div>
                    </div>
                    {/* <div className="row mt-sm-1 mt-5 pt-5 pt-sm-1 mb-1">
                        <div className="col-12 text-center">
                            <p className={s.aboutTitle}>Empowering hosts</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="pt-sm-2 pt-md-5 pt-lg-5">
                                <div className="pt-5">
                                    <div className="p-5">
                                        <p className={s.aboutDescription}>Hosts are part and parcel of our marketplace. They enrich our inventory by providing quality listings for the travelers. Hosts can manage their travel business easily and effectively using our sophisticated tools and platform. Facilities such as price setting, trouble free booking management, hosting panel give our hosts incredible amount of control and comfort running their travel businesses.</p>

                                        <p className={s.aboutDescription}>We are promoting hosts from many parts of the country, they are local people mostly. New businesses are being created by them. As a result we are contributing by creating new jobs every month!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 p-sm-2 p-md-5 p-lg-5">
                            <img className="p-md-5 p-lg-5 p-sm-1" height="100%" width="100%" src="./images/About us 3 1.png"></img>
                        </div>

                    </div> */}
                    <div className="row mt-5 pt-5 mb-5">
                        <div className="col-12 text-center">
                            <p className={s.aboutTitle}>Our Promise</p>
                        </div>
                    </div>
                    <div className="row mr-4 ml-4">
                        <div className="col-sm-12 col-md-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="">
                                        <img className="rounded mx-auto d-block" src="./images/Vector2.png"></img>
                                    </div>
                                </div>
                            </div>
                            <div className="row pt-4">
                                <div className="col-12 text-center">
                                    <p className={s.aboutSubTitle}>Hosted activities</p>
                                    <p className={s.aboutDescription}>Every adventure and experience on our platform are hosted by expert hosts. We take care of all kind of logistics as a result you can enjoy the trip. We make sure your trips are full of fun and trouble free.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="">
                                        <img className="rounded mx-auto d-block" src="./images/Vector1.png"></img>
                                    </div>
                                </div>
                            </div>
                            <div className="row  pt-4">
                                <div className="col-12 text-center">
                                    <p className={s.aboutSubTitle}>Value for money</p>
                                    <p className={s.aboutDescription}>Hurraayy trips are curated by local travel experts as a result these packages are very cost effective. Our prices are not only cost effective but also significantly better than other platforms. </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="">
                                        <img className="rounded mx-auto d-block" src="./images/Vector3.png"></img>
                                    </div>
                                </div>
                            </div>
                            <div className="row  pt-4">
                                <div className="col-12 text-center">
                                    <p className={s.aboutSubTitle}>Trust & safety</p>
                                    <p className={s.aboutDescription}>Our hosts are approved to host on Hurraayy after a long verification process. We also make sure every traveler's identity is verified before they book a trip through us. We closely work with local communities, tourism organisations to make your trips safer. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App >
        );
    }
}

const mapState = (state) => {
    return { userInfo: state.auth };
};

export default connect(mapState)(About);