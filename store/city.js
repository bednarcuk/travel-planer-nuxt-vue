export const state = () => ({
  name: false,
  info: false,
  forecasts: false
})

export const mutations = {
  SET_NAME: function(state, name) {
    state.name = name
  },
  SET_INFO: function(state, info) {
    state.info = info
  },
  SET_FORECASTS: function(state, forecasts) {
    state.forecasts = forecasts
  }
}

export const actions = {
  async getDetails({ commit }, city) {
    try {
      commit('SET_NAME', city)
      // wikipedia https://www.mediawiki.org/wiki/MediaWiki
      const wikiApiEndpoint = 'https://en.wikipedia.org/w/api.php'
      const wikiApiparams = `action=query&list=search&format=json&suggest=true&namespace=0&srlimit=1&origin=*&srsearch=${city}`
      this.$axios.$post(
        `${wikiApiEndpoint}?${wikiApiparams}`
      ).then(response=>{
        if(response.query.search[0].snippet){
          commit('SET_INFO', response.query.search[0].snippet + ' ...')
        } else {
          throw new Error('LOADING CITY INFO', response.error.description)
        }
      })

      // weather api https://www.aerisweather.com/
      const weatherApiEndpoint = `https://api.aerisapi.com/forecasts/${city},ca`
      const weatherClientSecret = `client_secret=${process.env.API_AERISAPI_CLIENT_SECRET}`
      const weatherClientId = `client_id=${process.env.API_AERISAPI_CLIENT_ID}`
      this.$axios.$post(
        `${weatherApiEndpoint}?${weatherClientSecret}&${weatherClientId}`
      ).then(response=>{
        if(response.success == true){
          commit('SET_FORECASTS', response.response[0])
        } else {
            throw new Error('LOADING CITY FORECASTS', response.error.description)
        }
      })
    } catch (error) {
      throw new Error('LOADING CITY DETAILS', error)
    }
  }
}
