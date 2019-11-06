import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import { Row, Collapse, Alert, Spinner, Button, Modal } from 'react-bootstrap';
import Capture from '../Capture';
import * as Constants from '../../constants';
import * as _ from 'lodash';

const mapStateToProps = state => ({ main: state.main, features: state.features });

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.mainTab = React.createRef();
    }

    onWhitePaperClick() {
        window.open("https://alm-confluence.systems.uk.hsbc/confluence/display/EEP18AIML/Whitepaper+for+Project+Scout",
            "_whitepaper");
    }

    onResetClick() {
        const { main, actions } = this.props;
        if (!main.resetInProgress) {
            actions.resetStart();
            actions.callRemoveAllData();
        }
        actions.openResetPopup(false);
    }
  
    componentDidMount() {
        const { actions } = this.props;
        actions.callGetEnvironment();
    }
    renderReset(main) {
        const { actions } = this.props;
        return (
            <div>
                To reset all frames and models in the ML engine click on -&gt; 
                <a href="#" onClick={() => actions.openResetPopup(true)}>Reset</a>.
                <Collapse in={main.resetInProgress}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">...Resetting</span>
                    </Spinner>
                </Collapse>
                <Collapse in={main.resetError}>
                <div>
                    <Alert varient="warning">Reset failed: {_.get(main, "resetError", "")}</Alert>
                </div>
                </Collapse>
                <Modal show={main.resetPopup} onHide={() => actions.openResetPopup(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Reset All</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to reset all frames, models, and data from ML Engine?<br />
                        All processed/trained models will be lost, even models created by other users.</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => actions.openResetPopup(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=> this.onResetClick()}>
                        Reset
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    render() {
        const { main, features } = this.props;

        return (
            <>
                <Row>
                <Collapse in={main.activeKey === Constants.CAPTURE_KEY}>
                    <div>
                    Project Scout provides AutoML capabilities for users with minimal knowledge of AI/ML.<br />
                    Find more information on this <a href="#" 
                        onClick={()=> this.onWhitePaperClick()}
                        >whitepaper</a>.
                    {features.resetFeature ? this.renderReset(main) : ""}
                    </div>         
                </Collapse>
                </Row>
                <Capture statePath='capture' />
            </>
        );
    }

    onSelectTab(key, event) {
        console.log("key:", key, " event:", event);
    }

}

Main.propTypes = {

};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main);