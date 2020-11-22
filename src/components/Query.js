import React, { Component } from 'react';
import axios from 'axios';
import '../css/Query.css'
import CustomSelect from "./CustomSelect";

class Query extends Component {

    rawdata = null;
    col = null;

    constructor(){
        super();

        this.state = {
            query:{},
            collections: []
        }
    }

    componentDidMount() {
        //console.log("componentDidMount executing in Query.js");
        axios.get('https://api.unsplash.com/collections/featured/?client_id=' + process.env.REACT_APP_CLIENT_ID)
            .then(res => {
                this.rawdata = res.data;
                //console.log(res.data);
                let collections = [];
                for (var k = 0; k < 10; k++) {
                    collections.push(<option id={res.data[k].id} key={res.data[k].title}>{res.data[k].title}</option>)
                }
                //console.log(collections);
                this.setState({ collections: collections });
            }).catch(err => {
            //console.log('Error happened while fetching collections', err);
        });
    }

    getCollectionID(col) {
        let ID;
        this.rawdata.forEach(function(element) {
            if (element.title === col)
                ID = element.id;
        });
        this.col = ID;
    }

    handleSubmit(e){
        if (this.refs.searchbox.value !== '') {
            this.setState({query:{
                searchkey: this.refs.searchbox.value,
                collection:   this.col
                }}, function () {
                //console.log(this.state);
                this.props.performSearch(this.state.query);
            });
        }
        e.preventDefault();
    }

    render() {
        let dynamicSearchbox, dynamicButton;

        if (this.props.searchPerformed){
            dynamicSearchbox = { top: '35px', left: '206px' }
            dynamicButton = { top: '36px', left: '1065px' }
        }
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input className="searchbox" type="text" ref="searchbox" placeholder="Query" style={dynamicSearchbox}/>
                <CustomSelect options={this.state.collections} change={this.getCollectionID.bind(this)}
                    searchPerformed={this.props.searchPerformed} />
                <button style={dynamicButton} className="sBtn" onClick={this.handleSubmit.bind(this)}>SEARCH</button>
            </form>
        );
    }
}

export default Query;
