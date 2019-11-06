import React from 'react';
import Step from '../Step';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
    return ({train: state.train})
}

class CustomButton extends Step {

    constructor(props, context){
        super(props, context);
    }

    render() {
        const {onClick, children} = this.props;

        /* TODO: Revise
        return (
            <button type="button" style={{float: 'right', border: 'none', backgroundColor: 'transparent'}} onClick = {onClick}>
                {children}
            </button>
        );*/
        return (
            <Button onClick={() => onClick()}>
                {children}
            </Button>
        );
    }
}

CustomButton.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomButton);