import xhr from '../xhr'

export default {
  storyAdd (params) {
    return xhr.post('/api/server/storyList/add', params)
  }
}
