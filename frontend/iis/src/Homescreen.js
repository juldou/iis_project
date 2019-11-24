import React from 'react';
import RestaurantList from "./RestaurantList";
import Header from "./Header";
import Categories from "./Categories";

const AppContext = React.createContext(null)

class Homescreen extends React.Component {
    triggerCategoryChange(idCategory) {
        this.list.categoryChanged(idCategory)
    }
  render() {
    return (
        <div className="Application">
            <section>
              <RestaurantList ref={list => this.list = list}/>
              <Categories onClick={this.triggerCategoryChange.bind(this)}/>
            </section>
        </div>
    );
  }
}

export default Homescreen;
