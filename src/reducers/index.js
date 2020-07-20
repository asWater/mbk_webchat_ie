import { combineReducers } from 'redux'

import messages from './messages'
import conversation from './conversation'
import { i18nReducer } from 'react-redux-i18n'

export default combineReducers({
  messages,
  conversation,
  i18n: i18nReducer,
})
