import Axios from 'axios'
import Vue from 'vue'
// import {
//   Toast,
//   createAPI
// } from 'cube-ui'
// Vue.use(Toast)
// createAPI(Vue, Toast, ['click'], true)
var xhr = Axios.create({
  baseURL: 'http://127.0.0.1:8080',
  withCredentials: true,
  headers: {'content-type': 'application/x-www-form-urlencoded'}
})

Vue.prototype.$http = xhr

export default {
  get (url, params) {
    return new Promise((resolve, reject) => {
      xhr.get(url, { params: params })
        .then(response => {
          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  post (url, params, options) {
    if (!options) options = {}
    return new Promise((resolve, reject) => {
      xhr.post(url, params)
        .then(({ data }) => {
          if (data.errno) {
            if (data.errno === 401) {
              // todo
            } else {
              if (!options.notHandleError) {
                // const toast = this.$createToast({
                //   txt: data.errmsg,
                //   type: 'correct'
                // })
                // toast.show()
                console.log(data)
              }
            }
            reject(data)
          } else {
            resolve(data)
          }
        }, err => {
          if (!options.notHandleError) {
            // const toast = this.$createToast({
            //   txt: err.errmsg,
            //   type: 'correct'
            // })
            // toast.show()
            console.log(err)
          }
          reject(err)
        })
        .catch(err => {
          if (!options.notHandleError) {
            // const toast = this.$createToast({
            //   txt: err.errmsg,
            //   type: 'correct'
            // })
            // toast.show()
            console.log(err)
          }
          reject(err)
        })
    })
  }
}
