import { bindActionCreators } from 'redux';
import * as actions from './index';

const mapDispatchToProps = dispatch => ( { actions: bindActionCreators(actions, dispatch)} );
export default mapDispatchToProps;
