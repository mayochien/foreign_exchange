
import { connect } from 'react-redux'
import  * as actionCreates  from '../../actions/userActions'
import { bindActionCreators } from 'redux'
import LoginForm from "../../pages/Login/LoginForm";


const mapStateToProps = (state, props) => {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actionCreates, dispatch),
        dispatch,
    }
}



export default connect(mapStateToProps ,mapDispatchToProps)(LoginForm)
