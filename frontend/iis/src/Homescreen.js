import React from 'react';
import Header from "./Header";
import Categories from "./Categories";
import RestaurantDetail from "./RestaurantDetail";
import './Homescreen.css';
import {withRouter} from "react-router";

const AppContext = React.createContext(null)

// TODO rename,  actually restaurant detail
class Homescreen extends React.Component {


  render() {
    return (
        <div className="Application">
            <section>
                <div className="RestaurantDetail">
                    <RestaurantDetail ref={list => this.list = list} restaurantId={this.props.match.params.restaurantId}/>
              </div>
                <div className="Categories">
                </div>
            </section>
        </div>
    );
  }
}

export default (Homescreen);
