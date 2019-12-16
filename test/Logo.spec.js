import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Logo from '@/components/Logo.vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
