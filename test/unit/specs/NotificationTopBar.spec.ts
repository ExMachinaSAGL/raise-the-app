import Vue from 'vue'
import NotificationTopBar from '@/components/NotificationTopBar'
import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon'
import Notification from '../../../src/lib/Notification'
import utils from '../lib/testUtils'

describe('NotificationTopBar.vue', () => {
  let vm: any;

  const pushNotificationBatch = (store: any, amount: number): void => {
    for (let i = 0; i < amount; i++) {
      const notification: Notification = utils.generateNotification('Example Title', 'Example text', 0, 'broadcast');
      vm.$store.dispatch('raiseTheApp/addNotification', notification);
    }
  }

  beforeEach(() => {
    vm = utils.setupVue(NotificationTopBar);
  });

  afterEach(() => {
    utils.tearDownVue(vm);
  });

  it('should show the correct unread count on the badge', async () => {
    expect(vm.unreadCount).to.equal(0);
    expect(utils.getElement(vm, '.unread-badge')).to.not.exist;
    
    const stub: SinonStub = sinon.stub(vm, 'showNotifications').value(true);
    pushNotificationBatch(vm.$store, 10);
    
    await Vue.nextTick();
    expect(vm.unreadCount).to.equal(10);
    expect(utils.getElement(vm, '.unread-badge')).to.exist;
    expect(utils.getElement(vm, '.unread-badge').textContent).to.contain('10');
    pushNotificationBatch(vm.$store, 90);

    await Vue.nextTick();
    expect(vm.unreadCount).to.equal(100);
    expect(utils.getElement(vm, '.unread-badge')).to.exist;
    expect(utils.getElement(vm, '.unread-badge').textContent).to.contain('99+');

    stub.restore();
  });
})
