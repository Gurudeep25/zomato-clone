import React from "react";
import queryString from "query-string";
import axios from "axios";
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: '1px solid brown'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            resId: undefined,
            menuItems: [],
            galleryModalIsOpen: false,
            menuItemsModalIsOpen: false,
            formModalIsOpen: false,
            subTotal: 0,
            userName: undefined,
            userEmail: undefined,
            userAddress: undefined,
            userContact: undefined
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            method: 'GET',
            url: `http://localhost:6503/api/getResById/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
           .then(response => {
               this.setState({ restaurant: response.data.restaurant, resId: restaurant })
           })
           .catch(err => console.log(err));
    }

    handleModal = (state, value) => {
        const { resId } = this.state;
        if(state == "menuItemsModalIsOpen" && value == true) {
            axios({
                url: `http://localhost:6503/api/getItemsbyrestaurant/${resId}`,
                method: "GET",
                headers: { 'Content-Type' : 'application/json' }
            })
            .then(res => {
                this.setState({ menuItems: res.data.itemsList })
            })
            .catch(err => console.log(err));
        }
        this.setState({ [state]: value });
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if(operationType == 'add') {
            item.qty += 1;
        } else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handleFormDataChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if(this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:6503/api/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)     
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = () => {
        const { subTotal, userEmail } = this.state;
        if(!userEmail) {
            alert('Please fill this field and then proceed..');

        } else {
            // Payment API Call
            const paymentObj = {
                amount: subTotal,
                email: userEmail
            };
            
            this.getData(paymentObj)
            .then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
    }

    render() {
        const { restaurant, menuItems, galleryModalIsOpen, menuItemsModalIsOpen, subTotal } = this.state;
        return (
            <div>
                <div>
                    <img src={`./${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="50%" />

                    <button className="button" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                </div>
                <div className="heading">{restaurant.name}</div>
                <button className="btn-order" onClick={() => this.handleModal('menuItemsModalIsOpen', true)}>Place Online Order</button>

                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                           <label for="tab-1">Overview</label>

                           <div className="content">
                              <div className="about">About this place</div>
                              <div className="head">Cuisine</div>
                              <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map((item) => { return `${item.name},`})}</div>
                              <div className="head">Average Cost</div>
                              <div className="value">&#8377 {restaurant.min_price} for two people(approx)</div>
                          </div>
                    </div>
                    
                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                            <label for="tab-2">Contact</label>
                            <div className="content">
                                <div className="head">Phone Number</div>
                                <div className="value">{restaurant.phone_number}</div>
                                <div className="head">{restaurant.name}</div>
                                <div className="value">{restaurant.address}</div>
                            </div>
                    </div>
                </div>
                <Modal
                  isOpen={galleryModalIsOpen}
                  style={customStyles}
                >
                    <div>
                    <div class="glyphicon glyphicon-remove" style={{ float: "right", marginBottom: '10px' }} onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>
                    <Carousel
                      showThumbs={false} showIndicators={false}>
                        {restaurant && restaurant.thumb && restaurant.thumb.map((item) => {
                            return <div>
                                  <img src={`../${item}`} style={{ width: '70%', height: '70%' }} />
                                </div>
                        })}
                    </Carousel>
                    </div>
                </Modal>
                <Modal 
                  isOpen={menuItemsModalIsOpen}
                  style={customStyles}
                >
                    <div>
                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }} onClick={() => this.handleModal('menuItemsModalIsOpen', false )}></div>
                        <div>
                          <h3 className="restaurant-name">{restaurant.name}</h3>
                          <h3 className="item-total">SubTotal : {subTotal}</h3>
                          <button className="btn btn-danger order-button">
                            Pay Now</button> 
                        <div class="glyphicon glyphicon-remove" style={{ float: "right", marginBottom: '10px' }} onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>
                        <div>
                        {menuItems.map((item, index) => {
                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8'}}>
                            <div className="card" style={{ width: '43rem', margin: 'auto'}}>
                                <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px'}}>
                                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9" style={{ paddingLeft: '10px'}}>
                                        <span className="card-body">
                                            <h5 className="item-name">{item.name}</h5>
                                            <h5 className="item-price">&#8377;{item.price}</h5>
                                            <p className="item-descp">{item.description}</p>
                                        </span>
                                    </div>
                                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                        <img className="card-img-center title-img" src={`../${item.image}`} style={{ 
                                        height: '75px',
                                        width: '75px',
                                        borderRadius: '20px',
                                        marginTop: '12px',
                                        marginLeft: '3px'
                                    }} />
                                    {item.qty == 0 ? <div>
                                        <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                        </div> : 
                                           <div className="add-number">
                                            <button onClick={() => this.addItems(index, 'subtract')}>-</button>
                                            <span style={{ backgroundColor: 'white'}}>{item.qty}</span>
                                             <button onClick={() => this.addItems(index, 'add')}>+</button>
                                             </div>}
                                        }
                                    </div>

                            </div>
                        })}
                        <div className="card" style={{ width: '44rem', marginTop: '10px'}}></div>
                    
                        </div>
                    </div>

                </Modal>
            </div>

        )
    }
}
export default Details;