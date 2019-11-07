import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Card, Button} from 'react-bootstrap';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import * as _ from 'lodash';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

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
  
    onMarkerClick(place, marker, e) {
        const { actions }  = this.props;
        
        actions.showInfoWindow(place, marker);
    };

    onMapClick(evt) {
        const { capture, actions }  = this.props;
        
        if (capture.showingInfoWindow) {
            actions.hideInfoWindow();
        }
    };

    renderIcon(status) {
        return {
            url: `/img/${status ? 'red' : 'grey'}-pin.svg`,
            anchor: new google.maps.Point(32,32),
            scaledSize: new google.maps.Size(32,32)
        };
    }

    renderMarkers(locations) {
        const locationsTag = Object.keys(locations).map(loc => {
            const marker = locations[loc];
            const title = _.get(marker, "location.name");
            const lat = _.get(marker, "location.address.lat");
            const lng = _.get(marker, "location.address.lng");
            const status = _.get(marker, "status.ATM");
            if (title && lat && lng) {
                let stat = true;
                if (status && status.length) {
                    stat = false;
                    status.map(st => {
                        if (st.Status) {
                            stat = true;
                        }
                    });
                }
                return (
                <Marker
                    title={title}
                    name={loc}
                    position={{lat: lat, lng: lng}}
                    icon={this.renderIcon(stat)}
                    onClick={(place, marker, e) => this.onMarkerClick(place, marker, e)}
                    />
                )
            }
        });
        return locationsTag || "";
    }

    renderInfoWindowContent() {
        const { capture } = this.props;
        if (!capture.showingInfoWindow) {
            return "";
        }

        const loc = capture.locations[capture.selectedPlace.name];
        const status = _.get(loc, "status.ATM");
        let ATMs=0, activeATMs=0;
        let aboutATMs = "";
        if (status && status.length) {
            status.map(st => {
                ATMs++;
                if (st.Status) {
                    activeATMs++;
                }
            });
            aboutATMs = `Active ATM(s): ${activeATMs} out of ${ATMs}`;
        }

        return (
            <div>
                <h4>{capture.selectedPlace && capture.selectedPlace.title}</h4>
                <div>{aboutATMs}</div>
            </div>
        );
    }

    renderMap() {
        const { capture, features } = this.props;
        return (
        <Map google={this.props.google} zoom={12}
            initialCenter={{
                lat: features.defaultLat || 49.243976,
                lng: features.defaultLng || -123.108091,
                }}
            streetViewControl={false}
            onClick={(evt) => this.onMapClick(evt)}
            style={mapStyle}>
            {capture.locations && capture.locations ? 
                this.renderMarkers(capture.locations) : ""}
            <InfoWindow
                marker={capture.activeMarker}
                visible={capture.showingInfoWindow}>
                {this.renderInfoWindowContent()}
            </InfoWindow>
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
                        <Col>
                            Discover your nearest working ATM. The grey icons shows the ATM is out of service now.<br />
                            Enter your address to find available ATMs
                        </Col>
                    </Card.Text>
                    <Row>
                        <Col sm="2">
                            <Form.Label id="address-input-label">
                                Address
                            </Form.Label>
                        </Col>
                        <Col>
                        <Form.Control
                            type="input"
                            disabled={false}
                            ref={this.addressInput}
                            name="address-input"
                            aria-describedby="address-input-label"
                            onChange={(evt) => this.onAddressChange(evt)}
                            value={capture.address}
                            />
                        </Col>
                        <Col>
                        <Button size="sm" onClick={() => this.onAddressSearch()}
                                >Search</Button>
                        </Col>
                    </Row>
                    <Row>&nbsp;</Row>
                    <Row>
                        <Col>
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



