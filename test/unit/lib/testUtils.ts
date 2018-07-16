import * as uuidv4 from 'uuid/v4'
import Notification from '../../../src/lib/Notification'
import { options } from '../../../src/store/store'
import Vue from 'vue'
import Vuex from 'vuex'

export default {
  generateNotification (title: string, text: string, priority: number, type: string): Notification {
    let notification: Notification = {
      id: uuidv4(),
      unread: true,
      title: title,
      text: text,
      creationTime: new Date(),
      priority: priority,
      type: type
    };
    return notification;
  },

  getElement(vm: any, selector: string): Element {
    return vm.$el.querySelector(selector);
  },

  setupVue (module: any): any {
    const testActions = {
      resetStore ({ commit }) {
        commit('reset');
      }
    }
    Object.assign(options.modules.raiseTheApp.actions, testActions);

    const testMutations = {
      reset (state) {
        state.notifications = [];
      }
    }
    Object.assign(options.modules.raiseTheApp.mutations, testMutations);

    const mockStore = new Vuex.Store(options);
    const Constructor = Vue.extend({...module, store: mockStore});
    return new Constructor().$mount();
  },

  tearDownVue (vm: any): void {
    vm.$store.dispatch('raiseTheApp/resetStore');
  }
}