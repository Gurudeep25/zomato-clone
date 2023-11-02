import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            inputText: '',
            suggestions: []
        }
    }

    handleLocation = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:9099/restaurants/${locationId}`,
            headers: { 'Content-Type' : 'application/json' }
        })
          .then(response => {
            this.setState({ restaurants: response.data.restaurants })
          })
          .catch(err => console.log(err));
    }

    handleSearch = (event) => {
        let inputText = event.target.value;
        const { restaurants } = this.state;
        const suggestions = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));
        this.setState({ suggestions, inputText });
    }

    showSuggestion = () => {
        const { suggestions, inputText } = this.state;

        if(suggestions.length == 0 && inputText == undefined) {
            return null;
        }
        if(suggestions.length > 0 && inputText == '') {
            return null;
        }
        if(suggestions.length == 0 && inputText) {
            return <ul>
                <li>No Search Results Found</li>
            </ul>
        }
        return (
            <ul>
                suggestions.map((item, index) => (<li key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name}  ${item.locality},${item.city}`}</li>))
            </ul>
        );
    }

    selectingRestaurant = () => {
        this.props.history.push(`/details?restaurant=${resObj_id}`);
    }

    render() {
        const { locationsData } = this.props;
        return (
            <div>
                <img src="./Assets/food.jpg" width='100%' height='450' />
                    <div>
                    {/* Adding Logo */}
                    <div className="logo">
                        <p>e!</p>
                    </div>
                    <div className="headings">
                        Find the best restaurants, cafes, bars
                    </div>
                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={this.handleLocation}>
                            <option value="0">Select</option>
                            {locationsData.map((item) => {
                                return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                    </div>
                    <span className="glyphicon glyphicon-search search"></span>
                    <div id="notebooks">
                        <input id="query" className="restaurantsinput" type="text" placeholder="Please Enter Restaurant Name" 
                        onChange={this.handleSearch} />
                        {this.showSuggestion()}
                    </div>
                    </div>
            </div>
        )
    }
}
export default withRouter(Wallpaper);