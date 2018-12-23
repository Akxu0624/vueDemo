import xhr from '../xhr'

export default {
  dataMgmt (params) {
    return xhr.get('/api/json/data', params)
  }
}
