import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import ThemeOptions from './ThemeOptions';
import Layout from './Layout';
import UserReducer from './UserReducer';
import BankerProfile from './BankerProfile';

const rootReducer = combineReducers({
  BankerProfile,
  UserReducer,
  ThemeOptions,
  Layout,
  form: formReducer
})

export default rootReducer