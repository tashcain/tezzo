import React, { Component } from 'react';


export default class Biling extends Component {
    constructor() {
        super();
        this.state = {
            orderId: Math.floor(100000 + Math.random() * 900000),
            txnToken: '',
            checksum: ''
        }
    }

    // runScript = () => {
    //     var fm = document.getElementById('mera-form');


    //     let th = this;
    //     var paytmParams = {};

    //     paytmParams.body = {
    //         "requestType": "Payment",
    //         "mid": "NUXryH73331835756016",
    //         "websiteName": "WEBSTAGING",
    //         "orderId": this.state.orderId,
    //         "callbackUrl": "http://localhost:5000/paytm-response",
    //         "txnAmount": {
    //             "value": "1.00",
    //             "currency": "INR",
    //         },
    //         "userInfo": {
    //             "custId": "CUST_00761",

    //         },
    //     };


    //     PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "ZL&KBStEXG_i2kBJ").then(function (checksum) {

    //         paytmParams.head = {
    //             "signature": checksum
    //         };
    //         th.setState({
    //             checksum: checksum
    //         })

    //         var post_data = JSON.stringify(paytmParams);


    //         // axios.post(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=NUXryH73331835756016&orderId=${th.state.orderId}`, paytmParams, {
    //         axios.post(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=NUXryH73331835756016&orderId=${th.state.orderId}`, paytmParams, {
    //             headers: {
    //                 'Content-Type': 'application/json',


    //             }
    //         })
    //             .then(res => {
    //                 console.log(res.data);
    //                 th.setState({
    //                     txnToken: res.data.body.txnToken
    //                 }, () => {
    //                     fm.submit();
    //                 })
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             })


    //     });
    // }

    render() {
        return (
            <div>
                <h1 className="page-head-sub">Billing</h1>
                <h1 className="page-head-sub">We are not accepting Online Payment Right Now, Contact To Increase Your Plan Validity</h1>
                <p>
                    Email : Tezzo@gmail.com,
                    <br />
                    Phone No : +91 7982961976
                </p>


                {/* <Button type="primary" onClick={this.runScript}>Pay</Button>
                <form method="post" id="mera-form" action={`https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=NUXryH73331835756016&orderId=${this.state.orderId}`} name="paytm">


                    <input type="hidden" name="mid" value="NUXryH73331835756016" />
                    <input type="hidden" name="orderId" value={this.state.orderId} />
                    <input type="hidden" name="txnToken" value={this.state.txnToken} />
                    <input type='hidden' name='TXN_AMOUNT' value='1.00' />
                    <input type='hidden' name='CHECKSUMHASH' value={this.state.checksum} />
                    <input type='hidden' name='WEBSITE' value='WEBSTAGING' />

                </form> */}
            </div>
        )
    }
}
