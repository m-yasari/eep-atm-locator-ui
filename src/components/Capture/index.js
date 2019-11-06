import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Card} from 'react-bootstrap';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const mapStateToProps = state => {
    return ({ capture: state.capture, features: state.features });
}

class Capture extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    render() {
        const { capture, features, actions, statePath} = this.props;

        return (
            <Card>
                <Card.Body> 
                    <Card.Title>ATM Search</Card.Title>
                    <Card.Text>
                        Enter your address to find available ATMs
                    </Card.Text>
                    <Row>
                        <Col sm="4">
                            <Row>
                                <Form.Label id="address-input-label">
                                    Address
                                </Form.Label>
                            </Row>
                            <Row>
                                <Form.Control
                                    type="input"
                                    disabled={false}
                                    ref={this.addressInput}
                                    name="address-input"
                                    aria-describedby="address-input-label"
                                    onChange={(evt) => this.addressChange(evt)}
                                    value={capture.address}
                                    />
                            </Row>
                        </Col>
                        <Col sm="8">
                            <Map google={this.props.google} zoom={12}
                                initialCenter={{
                                    /*lat: features.defaultLat,
                                    lng: features.defaultLng*/
                                    lat: 49.243976,
                                    lng: -123.108091
                                    }} />
                        </Col>
                    </Row>
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
  )( GoogleApiWrapper(() => {
    console.log("Consumer API KEY:", window.myEnv.apiKey);
    return {
        apiKey: (window.myEnv.apiKey)
    }
  })(Capture));



