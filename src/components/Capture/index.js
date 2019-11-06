import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import DataFile from '../DataFile';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';

const mapStateToProps = state => {
    return ({ capture: state.capture, trainFile: state.dataFile.train });
}

class Capture extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    render() {
        const { capture, actions, statePath, trainFile} = this.props;

        return (
            <Card>
                <Card.Body> 
                    <Card.Title>Import Source File</Card.Title>
                    <Card.Text>
                        Start AutoML by loading a train data file.<br/>
                        <b>Process:</b><br />
                        <ol>
                            <li>Load CSV file from a URL (e.g. https://mysite.global.hsbc/personal/43314845/Documents/EEP/data/Titanic/train.csv)</li>
                            <li>Structured data only</li>
                            <li>Data size &lt; 1GB</li>
                            <li>Supports Classification and Regression Models</li>
                        </ol>
                        <b>Note: </b>Currently, only CSV format is supported.
                    </Card.Text>
                    <DataFile 
                        statePath={statePath} 
                        fileLabel="Train"
                        category="train" />
                </Card.Body>
            </Card>
        );
    }

}

Capture.propTypes = {
    statePath: PropTypes.string.isRequired,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Capture);


