import ApiResponseError from 'models/api-response-error'
import axios from 'axios'
import store from 'redux/store'

const api = axios.create()

api.interceptors.request.use(async(defaultConfig) => {
  const { user } = store.getState().CurrentUser
  const headers = {
    Authorization: `Bearer ${await user.getIdToken()}`,
  }

  return {
    ...defaultConfig,
    mode: 'cors',
    baseURL: getEnvironment(),
    headers,
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error

    if (response == null) {
      return Promise.reject(new ApiResponseError({
        message: 'Something went wrong.',
      }))
    } else {
      return Promise.reject(new ApiResponseError({
        ...response.data,
        ...response,
      }))
    }
  }
)

export const getEnvironment = () => process.env.API_URL

export const del = (url, params) => api({ url, method: 'DELETE', params })
export const get = (url, params) => api({ url, method: 'GET', params })
export const patch = (url, data) => api({ url, method: 'PATCH', data })
export const post = (url, data) => api({ url, method: 'POST', data })
export const put = (url, data) => api({ url, method: 'PUT', data })
