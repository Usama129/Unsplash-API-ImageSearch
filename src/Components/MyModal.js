import React, {Component} from 'react'
import Modal from 'react-responsive-modal';
import dl from "../dl.svg";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import ExifTooltipData from "./ExifTooltipData";
import axios from "axios";

class MyModal extends Component {

    constructor(props){
        super(props)
        this.download = this.download.bind(this)
        if (this.props.appstate.opendata.exif.model !== null)
            this.state = {hasExif: true}
        else
            this.state = {hasExif: false}

    }

    download(){
        console.log("Requesting download link")
        axios.get(this.props.appstate.opendata.links.download_location+'/?client_id=ee0cfec3935724767faea6ea67dbc7e8879dd4884d6f9b32393b95fd57372ac1', {
            params: {
            }
        }).then(res => {
            console.log(res.data.url)
            let link = document.createElement('a');
            link.href = res.data.url;
            link.setAttribute('download', 'img.jpg'); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch(err => {
            console.log('Error while fetching download link', err);
        });
    }

    render(){
        console.log(this.props.appstate.opendata.exif)
        return(
            <Modal open={this.props.appstate.open} onClose={this.props.close} center>
                {
                    this.props.appstate.open && (
                        <div>
                            <img src={this.props.appstate.opendata.urls.small} alt="none" />
                            <div className="midModal">
                                <div className="userdeets">
                                    <img src={this.props.appstate.userthumburls['small']} alt="u" style={{
                                        float: 'left', left: '7px', position: 'relative', top: '7px', borderRadius: '50%'
                                    }}/>
                                    <div style={{ float: 'left', marginLeft: '16px'}}>
                                        <h4 style={{position: 'relative', bottom: '20px'}}>{this.props.appstate.opendata.user.name}</h4>
                                        <p  style={{position: 'relative', bottom: '43px'}}>@{this.props.appstate.opendata.user.username}</p>
                                    </div>
                                </div>
                                <a className="download" onClick={this.download}>
                                    <img src={dl} style={{float: 'left', marginLeft: '15px', position: 'relative', top: '15px'}} alt="dl"/>
                                    <p style={{float: 'right', marginRight: '15px'}}>Download</p>
                                </a>
                            </div>
                            <Tooltip overlay={(
                                this.state.hasExif && (
                                    <ExifTooltipData data={this.props.appstate.opendata.exif}/>
                                )
                            )
                            } placement="left">
                                <p className="camsettingstext">
                                    Camera settings
                                </p>
                            </Tooltip>
                        </div>
                    )
                }
            </Modal>
        )
    }
}

export default MyModal;