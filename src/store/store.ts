import Vue from 'vue'
import Vuex, { StoreOptions, GetterTree, MutationTree, ActionTree, ModuleTree } from 'vuex'
import Notification from '../lib/Notification'

Vue.use(Vuex);

interface State {
  notifications: Notification[];
}

interface RootState {} // GetterTree requires two type arguments for some reason

const state: State = {
  notifications: []
}

const getters: GetterTree<State, RootState> = {
  getNotifications: (state: State) => state.notifications
}

export const mutations: MutationTree<State> = {
  addNotification (state: State, notification: Notification): void {
    const exists = state.notifications.find((n: Notification) => {
      if (n.type) {
        return n.id === notification.id && n.type === notification.type;
      } else {
        return n.id === notification.id;
      }
    });
    if (!exists) { 
      state.notifications.push(notification);
    }
  },
  deleteNotification (state: State, notification: Notification): void {
    state.notifications = state.notifications.filter((n: Notification) => {
      if (n.type) {
        return `${n.id}|${n.type}` !== `${notification.id}|${notification.type}`; 
      } else {
        return n.id !== notification.id;
      }
    });
  },
  markRead (state: State, notification: Notification): void {
    state.notifications.forEach((n: Notification) => {
      // match type only if exists
      if (n.id === notification.id && (!n.type || n.type === notification.type)) {
        n.unread = false;
      }
    });
  },
  markAllRead (state: State): void {
    state.notifications.forEach((notification: Notification) => {
      notification.unread = false;
    });
  },
  deleteAll (state: State): void {
    state.notifications = [];
  }
}

export const actions: ActionTree<State, RootState> = {
  addNotification ({ commit }: any, notification: Notification): void {
    commit('addNotification', notification);
  },

  deleteNotification ({ commit }: any, notification: Notification): void {
    commit('deleteNotification', notification);
  },

  markRead ({ commit }: any, notification: Notification): void {
    commit('markRead', notification);
  },

  markAllRead ({ commit }: any): void {
    commit('markAllRead');
  },

  deleteAll ({ commit }: any): void {
    commit('deleteAll');
  }
}

/**
 * Defined as a module so that it can be imported into other Vuex stores.
 */
export const raiseTheAppModule = {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}

const modules: ModuleTree<State> = {
  raiseTheApp: raiseTheAppModule
}

export const options: StoreOptions<State> = {
  modules
}

export default new Vuex.Store(options)
