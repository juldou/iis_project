import React from 'react';
import Header from "./Header";
import Categories from "./Categories";
import RestaurantDetail from "./RestaurantDetail";
import './Homescreen.css';

const AppContext = React.createContext(null)

// TODO rename,  actually restaurant detail
class Homescreen extends React.Component {
    triggerCategoryChange(idCategory) {
        this.list.categoryChanged(idCategory)
    }
  render() {
    return (
        <div className="Application">
            <section>
                <div className="RestaurantDetail">
                    <RestaurantDetail ref={list => this.list = list} restaurantId={this.props.match.params.restaurantId}/>
              </div>
                <div className="Categories">
                    <Categories onClick={this.triggerCategoryChange.bind(this)}/>
                </div>
            </section>
        </div>
    );
  }
}

export default Homescreen;
