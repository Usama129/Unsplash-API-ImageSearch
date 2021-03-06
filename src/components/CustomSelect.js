import React, {Component} from 'react'
import '../css/CustomSelect.css'

class CustomSelect extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.change(event.target.value);
    }

    render () {
        let dynamicSelect;

        if (this.props.searchPerformed){
            dynamicSelect = { top: '35px', left: '636px' }
        }

        return (
                <select style={dynamicSelect} className="dropdown" onChange={this.handleChange}>
                    <option defaultValue hidden>Collections</option>
                    {this.props.options}
                </select>
        );
    }
}

export default CustomSelect;

