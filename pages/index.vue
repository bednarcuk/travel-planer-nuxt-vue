<template>
  <div class="container">
    <div>
      <logo />
      <b-row>
        <b-col lg="12">
          <b-form v-on:submit.prevent="onSubmit" v-on:reset.prevent="onCancel">
            <b-card>
              <div slot="header">
                <strong>Trip Planner</strong>
              </div>
              <b-row class="form-group">
                <b-col sm="12">
                  <b-form-group
                  >
                    <b-input-group>
                      <b-form-select
                        v-model="citySelected"
                        :options="citiesListOptions"
                      >
                        <template v-slot:first>
                          <option :value="null" disabled>-- Please select a City --</option>
                        </template>
                      </b-form-select>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col sm="12" v-if="cityDetails">
                  <b-form-group
                  >
                  <b-jumbotron>
                    <template slot="lead">
                      This article is about {{city}} the Canadian city -- Wikipedia
                    </template>
                    <hr class="my-4">
                    <div v-html="cityDetails"> </div>
                  </b-jumbotron>
                  </b-form-group>
                </b-col>
                <b-col sm="12" v-else>
                  <b-form-group
                  >
                  <b-jumbotron>
                    <template slot="lead">
                      <div v-html="welcomeGreetingText"> </div>
                    </template>
                    <hr class="my-4">
                    <div v-html="welcomeText"> </div>
                  </b-jumbotron>
                  </b-form-group>
                </b-col>
                <b-col sm="12" v-if="cityWeather">
                  <b-form-group
                  >
                    <div>
                      <b-tabs content-class="mt-2">
                          <b-tab v-for="period in cityWeather.periods" :key="period.timestamp" :title="formatDate(period.dateTimeISO)">
                          <b-list-group>
                            <b-list-group-item>Temperature: {{period.avgTempC}} <span>°C</span></b-list-group-item>
                            <b-list-group-item>Feelslike: {{period.feelslikeC}} <span>°C</span></b-list-group-item>
                            <b-list-group-item>Wind: {{period.windSpeedKPH}} <span>{{period.windDir}} km/h</span></b-list-group-item>
                            <b-list-group-item>Pressure: {{period.pressureMB}} <span>kPa</span></b-list-group-item>
                            <b-list-group-item>Description: {{period.weather}}</b-list-group-item>
                            <b-list-group-item disabled>Date: {{period.dateTimeISO}}</b-list-group-item>
                          </b-list-group>
                        </b-tab>
                      </b-tabs>
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import Logo from '~/components/Logo.vue'
import VueGeolocation from 'vue-browser-geolocation'
import Vue from 'vue'
Vue.use(VueGeolocation)
export default {
  name: 'CityInformation',
  head() {
    return {
      titleTemplate: '%s - Home'
    }
  },
  components: {
    Logo
  },
  data() {
    return {
      city: null,
      cityDetails: null,
      cityWeather: null,
      citySelected: null,
      citiesListOptions: [
        {value: 'Calgary', text: 'Calgary'},
        {value: 'Edmonton', text: 'Edmonton'},
        {value: 'Lethbridge', text: 'Lethbridge'},
        {value: 'Medicine Hat', text: 'Medicine Hat'},
        {value: 'Grande Prairie', text: 'Grande Prairie'}
      ],
      welcomeText: 'Please select a city to get valued informations!',
      welcomeGreetingText: 'Welcome to Trip Planner!'
    }
  },
  watch: {
    citySelected(selectedObject) {
      this.fetchCityDetails(selectedObject)
    },
  },
  methods: {
    fetchCityDetails(city){
      // wikipedia
      this.city = city
      const wikiApiEndpoint = 'https://en.wikipedia.org/w/api.php'
      const wikiApiparams = `action=query&list=search&format=json&suggest=true&namespace=0&srlimit=1&origin=*&srsearch=${city}`
      this.$axios.$post(
        `${wikiApiEndpoint}?${wikiApiparams}`
      ).then(response=>{
        if(response.query.search[0].snippet){
          this.cityDetails = response.query.search[0].snippet + ' ...'
        }
      })
      // weather aerisweather
      const weatherApiEndpoint = `https://api.aerisapi.com/forecasts/${city},ca`
      const weatherClientSecret = 'client_secret=9CQ60bC5gIkYUymHD84uCg4M6eepex4CWGT3nXZa'
      const weatherClientId = 'client_id=3XbbZ657qEaCmrWaf7OZ0'
      this.$axios.$post(
        `${weatherApiEndpoint}?${weatherClientSecret}&${weatherClientId}`
      ).then(response=>{
        if(response.success == true){
          this.cityWeather = response.response[0]
        } else {
            alert('An error occurred: ' + response.error.description)
        }
      })
    },
    formatDate(iDate) {
      // ISO Date to date
      var date = new Date(iDate)
      var month = date.getMonth() + 1
      var dayInMonth = date.getDate()
      var day = date.getDay()
      return this.getWeekDay(day) + ' ' + month  + '/' + dayInMonth
    },
    getWeekDay(day) {
      var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      return weekday[day]
    }
  }
}
</script>
<style>
.container {
    padding-right: 15px;
    max-width: 1170px;
    padding-left: 15px;
    position: relative;
}
</style>
