import React, {Component} from 'react'

class ExifTooltipData extends Component {

    render(){

        return(
            <div>
                <p><span className="property">Make: </span>{this.props.data.make}</p>
                <p><span className="property">Model: </span>{this.props.data.model}</p>
                <p><span className="property">Exposure: </span>{this.props.data.exposure_time}</p>
                <p><span className="property">Aperture: </span>{this.props.data.aperture}</p>
                <p><span className="property">Focal Length: </span>{this.props.data.focal_length}</p>
                <p><span className="property">ISO: </span>{this.props.data.iso}</p>
            </div>
        )
    }
}

export default ExifTooltipData;