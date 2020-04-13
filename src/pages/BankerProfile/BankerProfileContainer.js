import { connect } from 'react-redux';
import BankerProfile from './BankerProfile';
import { loadBankerProfileSuccess, loadBankerProfileFailure } from './actions/index';

const mapStateToProps = (state) => ({
  bankerProfileData: state.BankerProfile.bankerProfileData,
});

const mapDispatchToProps = (dispatch) => ({
  saveBankerProfile: (bankerProfileData) => {dispatch(loadBankerProfileSuccess(bankerProfileData));},
  clearBankerProfile: () => {dispatch(loadBankerProfileFailure());}
});

export default connect(mapStateToProps, mapDispatchToProps)(BankerProfile);
