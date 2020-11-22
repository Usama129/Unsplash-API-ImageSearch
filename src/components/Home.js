import React, {Component} from 'react'
import logorec from "../img/logorec.svg";
import logo from "../img/logo.svg";
import '../css/Home.css'
import Query from "./Query";

class Home extends Component {

    constructor(){
        super();

        this.state = {
            query:{},
            imgs: []
        }
    }

    handleSearch(newquery){
        this.props.request(newquery.searchkey, newquery.collection)
    }

    logoClick = () => {
        this.props.goHome()
    }

    render () {
        let dynamicWorkblock, dynamicTitle, dynamicLogo;

        if (this.props.searchPerformed) {
            dynamicWorkblock = { height: '120px' }
            dynamicTitle = { opacity: '0' }
            dynamicLogo = { top: '25px', left: '0px' }
        }
        else {
            dynamicWorkblock = { height: '100vh' }
            dynamicTitle = { opacity: '1' }
        }

        return(
            <div className="workblock" style={dynamicWorkblock}>
                <div className="Logo" style={dynamicLogo}>
                    <img src={logorec} className="LogoRectangle" alt="My Rec" onClick={this.logoClick} />
                    <img src={logo} className="MyLogo" alt="My Logo" onClick={this.logoClick}/>
                    <h4 className="title" style={dynamicTitle} ><strong>image</strong> search</h4>
                </div>
                <Query className="q" performSearch={this.handleSearch.bind(this)} searchPerformed={this.props.searchPerformed} />
            </div>
        );
    }

}

export default Home;