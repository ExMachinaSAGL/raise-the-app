<template>
  <div class="notification-top-bar">
    <div class="icon-container">
      <div class="notification-icon" :style="{ backgroundColor: iconColor }">
        <i class="fa fa-bell"></i>
      </div>
      <div class="unread-badge" v-if="unreadCount > 0">{{ unreadBadge }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Notification from '../lib/Notification'
import { mapState } from 'vuex'
import configUtils from '../lib/configUtils'

export default {
  name: 'notification-top-bar',

  props: [
    'showNotifications'
  ],

  computed: {
    ...mapState('raiseTheApp', {
      notifications: (state: any) => state.notifications
    }),
    unreadBadge (): number|string {
      return this.unreadCount > 99 ? `${99}+` : this.unreadCount;
    },
    unreadCount (): number {
      const count: number = this.notifications.filter((n: Notification) => {
        return n.unread;
      }).length;
      return count;
    },
    iconColor (): string {
      if (this.notifications.length > 0 && configUtils.config.dynamicIconColor) {
        const top: Notification = this.mostImportantNotification();
        return configUtils.getLevel(top.priority).color;
      }
    }
  },

  data () {
    return {
      emptyText: 'There are no unread notifications.'
    }
  },

  methods: {
    /**
     * Returns the notification with the highest priority.
     */
    mostImportantNotification (): Notification {
      return this.notifications.reduce((prev: Notification, current: Notification) => {
        return prev.priority > current.priority ? prev : current;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../theme/notification-top-bar.scss';

.notification-icon {
  @include notification-icon;
}

.notification-top-bar {
  @include container;
}

.unread-badge {
  @include unread-badge;
}

</style>
