import ls from 'local-storage';
import { saveErrorCode } from '../pages/BankerProfile/actions';

const defaultState = {
  bankerProfileData: null,
  isLoading: false,
  errMsg: 'ERROR!!', //錯誤訊息內容
  showErrMsg: false, //是否跳錯誤通知
  errCode: ''
};

const BankerProfile = (state = defaultState , action) => {
  const { type, payload } = action;
  let result;
  switch (type) {
    case "LOAD_BANKER_PROFILE_SUCCESS":
      return {
        ...state,
        bankerProfileData: payload.bankerProfileData,
      };

    case "LOAD_BANKER_PROFILE_FAILURE":
      return {
        ...state,
        bankerProfileData: null,
    };

    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        errMsg: payload.errMsg,
      };

    case "POPUP_ERROR_MESSAGE":
      // ls.remove()
      // window.location.assign('/#/login')
      return {
        ...state,
        showErrMsg: payload.showErrMsg,
      };
         
    case "SAVE_ERROR_CODE":
      result = Object.assign({}, state,
      {
        errCode: payload.errCode,
      })
      ls.set('errCode', result)
      saveErrorCode( payload.errCode)
      return result;

    default:
      return {...state};
  }
};

export default BankerProfile
