import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Collapse from 'react-bootstrap/Collapse';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import mapDispatchToProps from '../../actions/creator';
import Constants from '../../constants';
import { Certificate } from 'crypto';

const mapStateToProps = (state, ownProps) => {
    return ({ importFile: _.get(state, ['dataFile', ownProps.category]),
            uploadFeature: state.features.uploadFeature });
}

class ImportFile extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.filenameInput = React.createRef();
        this.uploadFilenameInput = React.createRef();
        this.uploadForm = React.createRef();
    }
  
    filenameChange(evt) {
        const { actions, category } = this.props;
        actions.importFilename(category, evt.target.value);
    }

    uploadFilenameChange(evt) {
        const { actions, category } = this.props;
        actions.uploadFilename(category, evt.target.value);
    }

    render() {
        const { importFile, fileLabel, uploadFeature } = this.props;

        return (
            <Form ref={this.uploadForm}>
                <Form.Group controlId={`validationFormSource-${fileLabel}`}>
                    <Row>
                        <Col>
                            <Form.Label id={`sourceFileLabel-${fileLabel}`}>
                                {fileLabel + " File URL:"}
                            </Form.Label>
                        </Col>
                        <Col sm="10">
                            <Form.Control
                                type="input"
                                disabled={importFile.parsed || importFile.inProgress || importFile.uploadFilename.length !== 0}
                                ref={this.filenameInput}
                                aria-describedby={`sourceFileLabel-${fileLabel}`}
                                name={`sourceFile-${fileLabel}`}
                                onChange={(evt) => this.filenameChange(evt)}
                                value={importFile.name}
                            />
                        </Col>
                    </Row>
                    <Collapse in={uploadFeature}>
                        <Row as="div">
                            <Col>
                                <Form.Label id={`sourceUploadFileLabel-${fileLabel}`}>
                                    {fileLabel + " File upload:"}
                                </Form.Label>
                        </Col>
                        <Col sm="10">
                                <Form.Control
                                    type="file"
                                    disabled={importFile.parsed || importFile.inProgress || importFile.name.length !== 0}
                                    ref={this.uploadFilenameInput}
                                    aria-describedby={`sourceUploadFileLabel-${fileLabel}`}
                                    name={`sourceUploadFile-${fileLabel}`}
                                    onChange={(evt) => this.uploadFilenameChange(evt)}
                                />
                            </Col>
                        </Row>
                    </Collapse>
                    <Row>
                        <Form.Control.Feedback type="invalid">
                            {importFile.formErrors}
                        </Form.Control.Feedback>
                    </Row>
                </Form.Group>
                <Row>
                    <Col>
                        <Button onClick={() => this.onClickImport()}
                            disabled={importFile.parsed || importFile.inProgress || 
                                (importFile.name.length === 0 && importFile.uploadFilename.length === 0)}
                            variant={(!importFile.parsed && !importFile.inProgress && 
                                (importFile.name.length > 0 || importFile.uploadFilename.length > 0)) ? 
                                "primary" : "secondary"} >
                            <Collapse in={importFile.inProgress}>
                                <Spinner as="span" 
                                    animation="border" size="sm"
                                    role="status" aria-hidden="true"
                                    />
                            </Collapse>
                            Import
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Collapse in={importFile.inProgress || importFile.parsed}>
                            <ProgressBar animated={importFile.progress < 100}
                                now={importFile.progress} 
                                label={`${importFile.progress}% ${importFile.progress===100 ? "Imported" : ""}`}
                                variant={importFile.apiError ? "danger" : "success"}
                                />
                        </Collapse>
                    </Col>
                </Row>
                <Collapse in={importFile.apiError}>
                    <Row>
                        <Alert varient="warning">{importFile.apiError}</Alert>
                    </Row>
                </Collapse>
                <Collapse in={importFile.inProgress}>
                    <Row>
                        <Alert 
                            varient="success">
                            {importFile.progress<100 ? importFile.progressMsg : "Imported"}
                        </Alert>
                    </Row>
                </Collapse>
            </Form>
        );
    }

    onClickImport() {
        const { statePath, actions, category } = this.props;
        const currentStatePath = `${statePath}.${category}`;

        const filename = this.filenameInput.current.value;
        const files = _.get(this.uploadFilenameInput, "current.files");

        if (filename && filename.length>0) {
            actions.importDataFileStart(category);
            actions.callImportFile(category, filename);
        } else if (files && files.length>0) {
            var file = files[0];
            if (!file.type.match('application/vnd.ms-excel')) {
                actions.changeState(currentStatePath, 'You can upload only CSV files.', 'formErrors.sourceFile');
                return;
            }
            if (file.size >= 20000000 ) {
                statusDiv.innerHTML = 'You cannot upload this file because its size exceeds the maximum limit of 20 MB.';
                return;
            }
            actions.importDataFileStart(category);
            actions.callUploadFile(category, file);
        } else {
            actions.changeState(currentStatePath, 'To import, filename is mandatory!', 'formErrors.sourceFile');
        }
    }
}

ImportFile.propTypes = {
    statePath: PropTypes.string.isRequired,
    category: PropTypes.oneOf(['train', 'test']).isRequired,
    fileLabel: PropTypes.string.isRequired,
    onImport: PropTypes.func,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ImportFile);
