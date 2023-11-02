import React from "react";
import { ReactDOM } from "react";

class QuickSearchItem extends React.Component {
    handleNavigate = (mealtypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if(locationId) {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        }else {
            this.props.history.push(`/filter?mealtype=${mealtypeId}`);
        }
       
    }

    render() {
        const { name, content, image, id } = this.props.quicksearchitemData;
        return (
            <div>
                                  <div className="col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleNavigate(id)}>
                                    <div className="tileContainer">
                                        <div className="tileComponent1">
                                            <img src={`./${image}`} height="150" width="140" />

                                        </div>
                                        <div className="tileComponent2">
                                            <div className="componentHeading">
                                                {name}
                                            </div>
                                            <div className="componentSubHeading">
                                                {content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
            </div>
        )
    }
}
export default QuickSearchItem;