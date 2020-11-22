import React, { Component } from 'react';
import Home from './Components/Home'
import Pagination from "react-js-pagination";
import Modal from 'react-responsive-modal';
import './App.css';
import axios from "axios";
import MyModal from "./Components/MyModal";

class App extends Component {

    mysearch;
    mycollection;
    mypage;

    constructor(props){
        super(props);
        this.onOpenModal = this.onOpenModal.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
        this.getModalPhoto = this.getModalPhoto.bind(this)
        this.state = {
            access: '/?client_id='+process.env.REACT_APP_CLIENT_ID,
            key: '',
            collection: 0,
            total: 0,
            imgs: [],
            searchPerformed: false,
            noResults: false,
            noResultsMessage: '',
            open: false,
            opendata: {urls: {small:''}, links: {download:''}, user:{name:'', username:''}, exif: {}},
            downloadurl : '',
            userthumburls: {small:''},
            ratelimit: false
        }
    }

    onOpenModal() {
        console.log("Opening modal")
        this.setState({ open: true });

    };

    onCloseModal() {
        this.setState({ open: false, openID: 0, opendata: {urls: {small:''}, links: {download:''}, user:{name:'', username:''}},
        userthumburls:{small:''}});
    };

    getModalPhoto(id) {
        console.log("Requesting photo", id)
        axios.get('https://api.unsplash.com/photos/'+id+'/?client_id='+process.env.REACT_APP_CLIENT_ID, {
            params: {
            }
        }).then(res => {
            console.log(res.data)
            this.setState({ opendata: res.data})
            this.getUserThumb(res.data.user.username)
            this.onOpenModal()
        }).catch(err => {
            if (err.toString().includes("403"))
                this.setState({ratelimit: true})
            console.log('Error while fetching photo', err);
        });
    }

    downloadPhoto(){

    }

    getUserThumb(username){
        console.log("Requesting user thumb for @"+username)
        console.log(username)
        axios.get('https://api.unsplash.com/users/'+username+'/?client_id='+process.env.REACT_APP_CLIENT_ID, {
            params: {
            }
        }).then(res => {
            console.log(res.data)
            this.setState({userthumburls: res.data.profile_image})
        }).catch(err => {
            console.log('Error while fetching user thumb', err);
        });
    }

    processRequest(key, collection, page){
        console.log("Requesting page", page, "for", key, "in", collection)
        axios.get('https://api.unsplash.com/search/photos/?client_id='+process.env.REACT_APP_CLIENT_ID, {
            params: {
                query : key,
                collections: collection,
                per_page: 30,
                page: page
            }
        }).then(res => {
            console.log(res.data)
            this.setState({total: res.data.total})
            this.postSearch(key, res.data, collection)
        }).catch(err => {
            if (err.toString().includes("403"))
                this.setState({ratelimit: true})
            console.log('Error while fetching photos', err);
        });
    }

    setRequest(key, collection){
        this.mysearch = key;
        this.mycollection = collection;
        this.mypage = 1;
        this.processRequest(key, collection, 1)
    }

    postSearch(key, d, col){
        let m, myImages = []

        myImages = d.results
        this.setState({imgs : myImages, searchPerformed: true});
        console.log(myImages)
        if(myImages.length === 0) {
            m = 'No results for '+key;
            if (col !== null)
                m += ' in this collection - broaden your search maybe?'
            this.setState({noResults: true, noResultsMessage: m})
        }
        else
            this.setState({noResults: false})
    }

    handlePageChange(pageNumber) {
        this.mypage = pageNumber;
        console.log('clicked', pageNumber)
        this.processRequest(this.mysearch, this.mycollection, pageNumber)
    }

    render() {

        let s = this
        let dynamicPagination, noResults, dynamicMasonry;

        if (this.state.searchPerformed) {
            console.log(this.state.noResults)
            noResults = {
                display: 'none'
            }
            dynamicMasonry = { display: 'block' }
            dynamicPagination = {
                display: 'block'
            }
            if (this.state.noResults) {
                dynamicPagination = {
                    display: 'none'
                }
                noResults = {
                    textAlign: 'center',
                    display: 'block'
                }
            }
        }
        else {
            dynamicMasonry = { display: 'none' }
            dynamicPagination = { display: 'none'}
        }

    return (
        <div>
            <Home request={this.setRequest.bind(this)} searchPerformed={this.state.searchPerformed} />

            <div className="masonry" style={dynamicMasonry}>
                {this.state.imgs.map(function(element){
                    return (
                       <a key={element.id} className="item" onClick={() => (
                           s.getModalPhoto(element.id)
                       )}>
                           <img src={element.urls.thumb} alt=""/>
                       </a>
                    );
                })}
            </div>

            <div style={dynamicPagination} >
                <Pagination
                    className="pagination"
                    activePage={this.mypage}
                    itemsCountPerPage={30}
                    totalItemsCount={this.state.total}
                    pageRangeDisplayed={8}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>

            <h1 style={noResults}>{this.state.noResultsMessage}</h1>

            <MyModal
                appstate={this.state}
                close={this.onCloseModal}
            />

            <Modal open={this.state.ratelimit} onClose={()=>(s.setState({ratelimit:false}))}>
                <p>Woah, slow down there, turbo! That's more requests than you're allowed
                    by the API. Enhance your calm. </p>
            </Modal>
        </div>
      );
  }
}

export default App;
