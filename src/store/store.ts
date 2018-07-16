import Vue from 'vue'
import Vuex from 'vuex'
import Notification from '../lib/Notification'

Vue.use(Vuex);

const state = {
  notifications: []
}

export const mutations = {
  addNotification (state: any, notification: Notification) {
    const exists = state.notifications.find(n => {
      return n.id === notification.id && n.type === notification.type;
    });
    if (!exists) { state.notifications.push(notification); }
  },
  deleteNotification (state: any, notification: Notification) {
    state.notifications = state.notifications.filter(n => {
      return `${n.id}|${n.type}` !== `${notification.id}|${notification.type}`; 
    });
  },
  markRead (state: any, notification: Notification) {
    state.notifications.forEach((n: Notification) => {
      if (n.id === notification.id && n.type === notification.type) {
        n.unread = false;
      }
    });
  },
  markAllRead (state: any) {
    state.notifications.forEach((notification: Notification) => {
      notification.unread = false;
    });
  },
  deleteAll (state: any) {
    state.notifications = [];
  }
}

export const actions = {
  addNotification ({ commit }, notification: Notification) {
    commit('addNotification', notification);
  },

  deleteNotification ({ commit }, notification: Notification) {
    commit('deleteNotification', notification);
  },

  markRead ({ commit }, notification: Notification) {
    commit('markRead', notification);
  },

  markAllRead ({ commit }) {
    commit('markAllRead');
  },

  deleteAll ({ commit }) {
    commit('deleteAll');
  }
}

/**
 * Defined as a module so that it can be imported into other Vuex stores.
 */
export const raiseTheAppModule = {
  namespaced: true,
  state,
  mutations,
  actions
}

export const options = {
  modules: {
    raiseTheApp: raiseTheAppModule
  }
}

export default new Vuex.Store(options)
