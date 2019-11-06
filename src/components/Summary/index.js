import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge';
import Collapse from 'react-bootstrap/Collapse';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { roundUp } from '../../constants/utils';

const mapStateToProps = state => {
    return ({ summary: state.summary, trainFile: state.dataFile.train });
}

class Summary extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    onClickNext() {
        const { actions} = this.props;
        actions.changeMainTab(Constants.TRAIN_KEY);
        actions.setDisableTrainFlag(false);
    }

    onReparseClick() {
        const { actions} = this.props;
        actions.reparse(Constants.TRAIN_DATA);
    }

    onTypeChange(idx, type) {
        const { actions } = this.props;
        actions.changeColumnType(Constants.TRAIN_DATA, idx, type);
    };

    onFlagChange(idx, evt, target) {
        const { actions } = this.props;
        if (idx !== target) {
            actions.changeColumnFlag(idx, evt.target.checked);
        }
    };

    onTargetChange(idx) {
        const { actions } = this.props;
        actions.changeColumnFlag(idx, true);
        actions.changeTargetColumn(idx);
    };

    checkAllRecordsSelected() {
        const {summary: {columns, selectedColumns}} = this.props;

        return columns.length === selectedColumns.length;
    }

    handleClickForHeaderCheckbox(e) {

        const {actions, summary: {columns}} = this.props;

        actions.selectAllColumns2Train(!this.checkAllRecordsSelected(), columns.length);
    }

    renderTypeEntries(idx, type) {
        return (
            <Form.Control as="select" value={type}
                onChange={(evt) => this.onTypeChange(idx, evt.target.value)}>
                <option>Numeric</option>
                <option value="Enum">Categorical</option>
                <option value="String">Text</option>
                <option>Time</option>
            </Form.Control>
        );
    };

    renderFlagEntries(idx, flag, target) {
        return (
            <Form.Check type="checkbox" aria-label="Select field to consider it as a factor." 
                checked={flag} 
                onChange={(evt) => this.onFlagChange(idx, evt, target)}
                />
        );
    };

    renderLabelEntries(idx, label, target) {
        return (
            <>
            <Button size="sm" variant="light"
                onClick={() => this.onTargetChange(idx)}>
                {label} 
            </Button>
            <Collapse in={idx===target}>
                <Badge variant="success" pill>Target</Badge>
            </Collapse>
            </>
        );
    };

    renderSummaryData(cols = [], selectedColumns, target) {
        let row = 0;
        const listItems = cols.map((col, idx) => (
            <tr>
                <td>{++row}</td>
                <td>{this.renderLabelEntries(idx, col.label, target)}</td>
                <td>{this.renderTypeEntries(idx, col.type)}</td>
                <td>{this.renderFlagEntries(idx, selectedColumns.indexOf(idx)!==-1, target)}</td>
                <td>{col.type==="Enum" ? col.domain_cardinality : ""}</td>
                <td>{col.missing_count}</td>
                <td>{roundUp(col.mean, 3)}</td>
                <td>{roundUp(col.sigma, 3)}</td>
            </tr>
        ));
        return listItems;
    }

    render() {
        const { summary, statePath, trainFile} = this.props;
        const cols = summary.columns, selectedColumns = summary.selectedColumns;

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Summary of Train File</Card.Title>
                    <Card.Text>
                        <div>
                        The following is summary of analysis of the imported train file. Please review and change column types if needed.<br />
                        <b>Process:</b><br />
                        <ol>
                            <li>Data set is loaded into AutoML memory in previous tab (i.e. Capture).</li>
                            <li>Provided summary of data in below table includes number of records, key details like Missing values, Statistics of numerical values and Number of distint categorical values.</li>
                            <li>Options to change the data type, select the field to be used as input for training as well as target field.<br />
                                Select the target field by click on Field name. Fields can be selected as input by check mark Flag.
                                </li>
                            <li>Based on the type of target field, the tool would create Classification or Regression model. <br />
                                (Categorical target field for Classification model, and Numeric target field for Regression model)
                                </li>
                        </ol>
                        <hr />
                        </div>
                    </Card.Text>
                    <Row>
                        <Col md={{ span: 6}}>{trainFile.name}</Col>
                        <Col md={{ span: 3, offset: 3 }}>
                            <span class='total-records'>
                            Total Records: {summary.recordsCount}</span>
                        </Col>
                    </Row>
                    <Form id="summary-form">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Field <OverlayTrigger overlay={
                                            <Tooltip>
                                            Click on a field name to select as the target field.
                                            </Tooltip>
                                        }>
                                        <Badge pill variant="dark">?</Badge>
                                        </OverlayTrigger>
                                    </th>
                                    <th>Type</th>
                                    <th>
                                        <Form.Check type="checkbox" aria-label="Select field to to select all rows.">
                                            <Form.Check.Input type="checkbox" 
                                                checked={this.checkAllRecordsSelected()}
                                                onClick={(e) => this.handleClickForHeaderCheckbox(e)} />
                                            <Form.Check.Label>Flag</Form.Check.Label>
                                        </Form.Check>
                                    </th>
                                    <th>Unique</th>
                                    <th>Missing</th>
                                    <th>Mean</th>
                                    <th>Sigma</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderSummaryData(cols, selectedColumns, summary.target)}</tbody>
                        </Table>
                    </Form>
                    <Collapse in={trainFile.reparseRequired}>
                        <Button
                            onClick={() => this.onReparseClick()}
                            disabled={trainFile.inProgress}
                            variant="primary"
                            >
                            Re-parse
                        </Button>
                    </Collapse>
                    <Collapse in={trainFile.inProgress}>
                        <ProgressBar animated="true"
                            now={trainFile.progress} 
                            label={`${trainFile.progress}%`}
                            variant={trainFile.apiError ? "danger" : "success"}
                            />
                    </Collapse>
                    <Button
                        onClick={() => this.onClickNext()}
                        disabled={trainFile.inProgress || trainFile.reparseRequired || 
                            summary.target===null || selectedColumns.length<=1 }
                        variant={trainFile.parsed ? "primary" : "secondary"}
                        >
                        Next
                    </Button>
                </Card.Body>
            </Card>
        );
    }

}

Summary.propTypes = {
    statePath: PropTypes.string.isRequired,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Summary);


