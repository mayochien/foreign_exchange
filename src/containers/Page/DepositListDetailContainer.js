import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import  * as actionCreates  from '../../actions/userActions'
import DepositListDetail from "../../pages/Deposit/DepositListDetail";


const mapStateToProps = (state, props) => {
	return {
		user: state.UserReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
			actions: bindActionCreators(actionCreates, dispatch),
			dispatch,
	}
}

export default connect(mapStateToProps ,mapDispatchToProps)(DepositListDetail)
