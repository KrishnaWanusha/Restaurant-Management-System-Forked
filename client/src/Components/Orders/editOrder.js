import React, { Component } from 'react';
import axios from 'axios';

const formValid = formErrors => {
    let valid = true;
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });
    return valid;
};

export default class editOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderId: "",
            total: Number,
            deliveryMethod: "",
            paymentMethod: "",

            formErrors: {
                orderId: "",
                total: Number,
            }
        }
    }
    handleInputChange = (e) => {
        const { name, value } = e.target;

        let formErrors = this.state.formErrors;
        switch (name) {
            case "orderId":
                formErrors.orderId =
                    value.length < 3
                        ? "Minimum charactors must be  more than 3"
                        : "";
                break;

            case "total":
                formErrors.total =
                    value.length > 0
                        ? "Must be more than 0"
                        : "";
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));

        this.setState({
            ...this.state,
            [name]: value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();

        if (!formValid(this.state.formErrors)) {
            console.error("FORM INVALID-DISPLAY ERROR");
        }

        const id = this.props.match.params.id;
        const { orderId, total, deliveryMethod, paymentMethod } = this.state;
        const data = {
            orderId: orderId,
            total: total,
            deliveryMethod: deliveryMethod,
            paymentMethod: paymentMethod,
        }
        //console.log(data)
        axios.put(`http://localhost:8000/order/update/${id}`, data).then((res) => {
            if (res.data.success) {
                alert("Successfully update Order")
                this.setState(
                    {
                        orderId: "",
                        total: Number,
                        deliveryMethod: "",
                        paymentMethod: "",
                    }
                )
            };
        });
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`http://localhost:8000/order/${id}`).then((res) => {
            if (res.data.success) {
                this.setState({
                    orderId: res.data.order.orderId,
                    total: res.data.order.total,
                    deliveryMethod: res.data.order.deliveryMethod,
                    paymentMethod: res.data.order.paymentMethod,

                });
                console.log(this.state.order);
            }
        })
    }
    render() {
        const { formErrors } = this.state;
        return (
            <div className="container">
                <div className="row ">
                    <div className="col-6">
                        <img className="order_img" alt ="order image"  src="../images/order.png" />
                    </div>

                    <div className="col-6 shadowBox_order" >
                        <center>
                            <h1 className="h3 mb-3 font-weight-normal">Update Order</h1>
                        </center>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ marginBottom: '5px' }}>Order Id</label>
                                <input type="text"
                                    className="form-control"
                                    name="orderId"
                                    placeholder="Enter Order Id"
                                    value={this.state.orderId}
                                    onChange={this.handleInputChange} />
                                {formErrors.orderId.length > 5 && (
                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.orderId}</span>
                                )}
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ marginBottom: '5px' }}>Total</label>
                                <input type="number"
                                    className="form-control"
                                    name="total"
                                    placeholder="Enter the Total"
                                    value={this.state.total}
                                    onChange={this.handleInputChange} />
                                {formErrors.total.length > 0 && (
                                    <span style={{ color: 'red' }} className="errorMessage">{formErrors.total}</span>
                                )}
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ marginBottom: '5px' }}>Delivery Method</label>
                                <input type="text"
                                    className="form-control"
                                    name="deliveryMethod"
                                    placeholder="Enter Delivery Method"
                                    value={this.state.deliveryMethod}
                                    onChange={this.handleInputChange} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ marginBottom: '5px' }}>Payment Method</label>
                                <input type="text"
                                    className="form-control"
                                    name="paymentMethod"
                                    placeholder="Enter Amount"
                                    value={this.state.paymentMethod}
                                    onChange={this.handleInputChange} />
                            </div>

                            <div class="form-group btnupdate col-12">
                                <button type="submit" className="btn btn-primary ordersub_btn" >Update</button>&nbsp;&nbsp;
                    <a href="/order/" className="btn btn-danger"><i className="fas fa-times"></i>&nbsp;Cancel</a>&nbsp;&nbsp;
                    </div>


                        </form>
                    </div>
                </div>
            </div>
        )
    }
}