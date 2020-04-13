// 取得使用者資訊
export const loadBankerProfileSuccess = bankerProfileData => ({
  type: "LOAD_BANKER_PROFILE_SUCCESS",
  payload: { bankerProfileData }
});

// 取得失敗
export const loadBankerProfileFailure = () => ({
  type: "LOAD_BANKER_PROFILE_FAILURE",
});

// 存錯誤代碼
export const saveErrorCode = (errCode) => ({
  type: "SAVE_ERROR_CODE",
  payload: { errCode }
});