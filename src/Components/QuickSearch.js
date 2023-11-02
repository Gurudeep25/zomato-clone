import React from "react";
import { ReactDOM } from "react";

import QuickSearchItem from "./QuickSearchItem";

class QuickSearch extends React.Component {
    render() {
        const { quicksearchData } = this.props;
        return (
            <div>
                 <div className="quicksearch">
                        <p className="quicksearchHeading">
                            Quick Searches
                        </p>
                        <p className="quicksearchSubHading">
                            Discover Restaurants by type of meal
                        </p>
                    
                        <div className="container-fluid">
                            <div className="row">

                                {
                                    quicksearchData.map((item) => {
                                        return <QuickSearchItem quicksearchitemData={item}/>
                                    })
                                }
                                
                                
                                </div>

                            </div>
                        </div>

            </div>
        )
    }
}
export default QuickSearch;