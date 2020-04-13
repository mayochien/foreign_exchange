const defaultState = {
  errMsg: 'ERROR!!', //錯誤訊息內容
  showErrMsg: false, //是否跳錯誤通知
  showLogoutErrMsg: false, //是否跳錯誤通知(需登出時)
  errCode: 0
};

const ErrorReducer = (state = defaultState , action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        errMsg: payload.errMsg,
      };

    case "POPUP_ERROR_MESSAGE":
      return {
        ...state,
        showErrMsg: payload.showErrMsg,
      };

    case "POPUP_ERROR_MESSAGE_FOR_LOGOUT":
      return {
        ...state,
        showLogoutErrMsg: payload.showLogoutErrMsg,
      };

    case "SAVE_ERROR_CODE":
      return {
        ...state,
        errCode: payload.errCode,
      };

    default:
      return {...state};
  }
};

export default ErrorReducer;
