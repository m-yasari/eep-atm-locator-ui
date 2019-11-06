import React from 'react';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import Constants from '../../constants';

const mapStateToProps = state => ({ main: state.main });

class Step extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
  
    render() {
        return (
        <div />
        )
    }
}

export default Step;
