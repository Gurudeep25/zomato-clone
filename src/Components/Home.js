import React from 'react';
import axios from 'axios';

import '../Styles/home.css';

import Wallpaper from './Wallpaper';

import QuickSearch from './QuickSearch';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }

    }

    componentDidMount() {
      sessionStorage.clear();
        axios({
            method: 'GET',
            url: "http://localhost:9099/locations",
            headers: { 'Content-Type' : 'application/json' }
        })
          .then(response => {
            this.setState({ locations: response.data.locations })
          })
          .catch(err => console.log(err));

          axios({
            method: 'GET',
            url: "http://localhost:9099/mealtypes",
            headers: { 'Content-Type' : 'application/json' }
        })
          .then(response => {
            this.setState({ mealtypes: response.data.mealtypes })
          })
          .catch(err => console.log(err));
    }

    render() {
        const { locations,mealtypes } = this.state;
        return (
            <div>
                   <Wallpaper locationsData={locations} />
                   <QuickSearch quicksearchData={mealtypes}/>
                   
            </div>
        )
    }
}
export default Home;