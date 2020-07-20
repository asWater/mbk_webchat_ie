import config from 'config'
import qs from 'query-string'
import axios from 'axios'

export default store => next => action => {
  if (!action.type.startsWith('API:')) {
    return next(action)
  }

  const { dispatch } = store
  const prefix = action.type.split(':')[1]
  const { method = 'get', url, data, headers, query } = action.payload

  // >>>>> START Temporary Logging >>>>>>>>>>>>>
  console.log(`API Middleware is called, the action is ${action.type}.`)

  if (prefix === 'POST_MESSAGE') {
    console.log(`Sending data is "${data.message.attachment.content}".`)
    if (data.memoryOptions) {
      console.log(`>>> Memory "ssoUserId" is "${data.memoryOptions.memory.ssoUserId}". <<<`)
    }
  }
  // <<<<< END Temporary Logging <<<<<<<<<<<<<<<

  const options = {
    method,
    data,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    url: `${config.apiUrl}${url}${query ? '?' : ''}${qs.stringify(query || {})}`,
  }

  return axios(options)
    .then(res => {
      dispatch({ type: `${prefix}_SUCCESS`, payload: { ...res.data.results } })
      return res.data.results
    })
    .catch(err => {
      dispatch({ type: `${prefix}_ERROR`, payload: data })
      throw new Error(err)
    })
}
