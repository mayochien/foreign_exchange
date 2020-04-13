// 傳遞錯誤訊息
export const setupErrorMsg  = (errMsg) => ({
  type: "SET_ERROR_MESSAGE",
  payload: { errMsg }
});

// 控制Error Modal 開關
export const popupErrorMsg  = showErrMsg => ({
  type: "POPUP_ERROR_MESSAGE",
  payload: { showErrMsg }
});

// 控制Error Modal 開關 (需登出時)
export const popupErrorMsgForLogout  = showLogoutErrMsg => ({
  type: "POPUP_ERROR_MESSAGE_FOR_LOGOUT",
  payload: { showLogoutErrMsg }
});