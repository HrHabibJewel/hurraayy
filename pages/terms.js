import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
class Terms extends React.Component {
    componentDidMount() { }
    render() {
        return (
            <App>
                <div className="container pt-5" style={{ paddingBottom: "20px" }}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="header-text">Terms, Conditions and Policies</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="text-justify normal-text">Welcome to Hurraayy!</p><br />
                            <p className="text-justify normal-text">
                                Related software applications (sometimes referred to as “apps”),
                                data, SMS, APIs, email, chat and telephone correspondence, buttons (collectively, all of these
                                items shall be referred to herein as the “Services”.
                            </p>
                            <p className="text-justify normal-text">
                                The Services are offered to you conditioned upon your acceptance of the terms,
                                conditions, and notices set forth below (collectively, this “Agreement”). By
                                accessing or using the Services, you agree to be bound by this Agreement and
                                states that you have read and understood its terms. If you do not accept all of
                                these terms and conditions, you are not authorized to use the Services. If you have a Hurraayy account
                                and wish to terminate this Agreement, you can do so by closing your account and no longer accessing or using the Services.
                            </p>
                            <p className="text-justify normal-text">
                                Any information, text, links, graphics, photos, audio, videos, data or other materials that you can view on, access or otherwise
                                interact with through the Services shall be referred to as “Content”. The terms “we”, “us”, “our” and “Hurraayy” refer to Hurraayy
                                Limited, a private limited company based in Dhaka, Bangladesh. “Services” as defined above refers to those provided by Hurraayy.
                                The term “you” refers to the individual, company, business organization, or other legal entity using the Services and/or contributing
                                Content to them. The Content that you contribute, submit, transmit and/or post to or through the Services shall be referred to
                                variously as “your Content”, “Content of yours”, and/or “Content you submit.”
                            </p>
                            <p className="text-justify normal-text">
                                Hurraayy holds the right to change or modify these terms and conditions, and you understand and agree that your continued access or
                                use of the services after such change signifies your acceptance of the updated or modified terms.
                            </p>

                            <p className="title-text pt-4">
                                Disclaimer
                            </p>
                            <p className="text-justify normal-text">
                                Hurraayy is a travel marketplace, we are not a travel agent and we do not provide or own any transportation services, accommodations,
                                tours, activities or experiences. In fact, we are a digital service provider for travel agencies, tour operators and individual hosts
                                such as adventures or travel activity event organizers, property hosts. The travel providers are responsible for their packages
                                and/or products, and you must understand and agree to the terms and policies of the third-party travel providers before you book
                                or purchase their products through Hurraayy.
                            </p>
                            <p className="title-text pt-4">
                                Booking & Payment Terms
                            </p>
                            <p className="text-justify normal-text">
                                Hurraayy offers you the facility to search, select, and book travel products. By booking travel products via our website, you will
                                become an Account Holder if you are not one already. You further agree that you will use our booking facilitation services only to
                                make legitimate reservations for you or others for whom you are legally authorized to act. Any false or fraudulent reservation is
                                prohibited, and any user who attempts such a reservation may have his or her account terminated. When you book a Listing, you are
                                agreeing to pay all fees for your booking including the Listing price, applicable fees like Hurraayy service fees (service fees
                                are charged by Hurraayy in order to give you 24 hours support) & any other fees.
                            </p>
                            <p className="text-justify normal-text">
                                When you book a reservation your payment information will be collected by the payment service provider or payment gateway to complete
                                the transaction.  Please note that the payment service provider is responsible for processing your payment. You must acknowledge that
                                the information you provide us maybe shared with the third-party payment gateway agencies for verification purposes.
                            </p>
                            <p className="text-justify normal-text">
                                We will not interfere with reservations arbitrarily, but reserve the right to withdraw booking facilitation services because of
                                certain extenuating circumstances, such as when a reservation is no longer available or when we have reasonable cause to suspect that a
                                reservation request may be fraudulent. We also reserve the right to take steps to verify your identity to process your reservation
                                request.
                            </p>
                            <p className="text-justify normal-text">
                                In the unlikely event of a reservation is available when you place an order but becomes unavailable prior to check-in, either
                                (i) we will make sincere efforts to help you find another accommodation which is reasonably comparable with your original booking.
                                In case of it is an adventure/experience booking we will try to give you a slot with another suitable hosts so that you can continue
                                your travel activities. Or (ii) We will reimburse you the total fee.
                            </p>
                            <p className="title-text pt-4">
                                Cancellations & Refund Policies
                            </p>
                            <p className="text-justify normal-text">
                                Hurraayy follows host's policies for cancellation. Host's cancellation policies are defined in their respective listing's
                                details page.
                            </p>
                            <p className="text-justify normal-text">
                                For accommodations booking cancellation deadline may vary from host to host, in general the guest must cancel at least 24 hours
                                before the local check-in time.
                            </p>
                            <p className="text-justify normal-text">
                                For adventures or experiences booking the deadline is a bit strict as hosts have to arrange logistics, accommodations and these
                                things take time. The guest has to cancel the trip minimum 14 days from the event start date in order to avoid a partial refund.
                            </p>
                            <p className="text-justify normal-text">
                                For all kind of cancellation Hurraayy deduct the service fee from the total amount.
                            </p>

                            <p className="title-text pt-4">
                                Privacy Policies
                            </p>
                            <p className="text-justify normal-text">
                                We operate an online platform that provides booking facilities for hotels, holiday homes , other accommodations, adventures and
                                experiences. This Statement provides a general overview of our privacy practices.
                            </p>
                            <p className="text-justify normal-text">
                                Your privacy is our top priority and we would like to assure you that we protect your information with appropriate standards.
                            </p>
                            <p className="text-justify normal-text">
                                When you access or use our Services, we collect information from and about you to provide a more personalized and relevant
                                experience. Information collected may include: Contact information, including name, phone number and postal and email addresses,
                                date of birth, and profile photo.
                            </p>
                            <p className="text-justify normal-text">
                                We use personal information to:
                            </p>
                            <ul>
                                <li>Enable you to access the Hurraayy Platform</li>
                                <li>Enable you to communicate with other Members</li>
                                <li>Send you messages, updates, account notifications and security alerts</li>
                                <li>Provide you services</li>
                            </ul>

                            <p className="text-justify normal-text">
                                Information such as Credit Card Details and Internet Banking details are usually collected directly by the payment gateways and
                                banks and not by Hurraayy. We take proper steps to protect the information you share with us. We have implemented technology,
                                security frameworks and strict policy guidelines to safeguard the privacy of your personal information from unauthorized access.
                                Your continued use of the services now, or following the posting of any such notice of any such changes, will indicate acceptance
                                by you of such modifications.
                            </p>
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

export default connect(mapState)(Terms);