import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Card, Button} from 'react-bootstrap';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const mapStateToProps = state => {
    return ({ capture: state.capture, features: state.features });
}

const mapStyle = {
    width: '450px',
    height: '450px'
  };

class Capture extends Step {
    constructor(props, context) {
        super(props, context);
    }

    onAddressSearch() {
        const { capture, features, actions, statePath} = this.props;
        actions.callATMLocator({});
    }
  
    onAddressChange(evt) {

    }

    renderIcon(status) {
        if (status === "on") {
            return "";
        }
        // {this.renderIcon(marker.status)}
    }

    renderMarkers(locations) {
        return locations.map(marker => (
            <Marker
                title={marker.name}
                name={marker.locationId}
                position={{lat: marker.lat, lng: marker.lng}}
               
                />
        ));
    }

    renderMap() {
        const { capture, features } = this.props;
        if (capture.locations && capture.locations.length) {
            
        }
        return (
        <Map google={this.props.google} zoom={12}
            initialCenter={{
                lat: features.defaultLat || 49.243976,
                lng: features.defaultLng || -123.108091,
                }} 
            style={mapStyle}>
            {capture.locations && capture.locations.length ? 
                this.renderMarkers(capture.locations) : ""}
        </Map>
        );
    }
  
    render() {
        const { capture} = this.props;

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
                                    onChange={(evt) => this.onAddressChange(evt)}
                                    value={capture.address}
                                    /><Button size="sm" onClick={() => this.onAddressSearch()}
                                        >Search</Button>
                            </Row>
                        </Col>
                        <Col sm="8">
                            {this.renderMap()}
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



