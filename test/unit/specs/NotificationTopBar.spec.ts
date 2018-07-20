import NotificationTopBar from '@/components/NotificationTopBar.vue'
import { expect } from 'chai';
import Notification from '../../../src/lib/Notification'
import utils from '../lib/testUtils'

describe('NotificationTopBar.vue', () => {
  let vm: any;

  const pushNotificationBatch = (amount: number): void => {
    for (let i = 0; i < amount; i++) {
      const notification: Notification = utils.generateNotification('Example Title', 'Example text', 0, 'broadcast');
      // console.log('new notification', notification);
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
    // expect(vm.unreadCount).to.equal(0);
    // expect(utils.getElement(vm, '.unread-badge')).to.not.exist;
    
    // const stub: SinonStub = sinon.stub(vm, 'showNotifications').value(true);
    // console.log('before push');
    // pushNotificationBatch(10);
    // console.log('vm store', vm.$store.state.raiseTheApp.notifications);
    // console.log('count', vm.unreadCount);
    // expect(utils.getElement(vm, '.unread-badge')).to.exist;
    // expect(utils.getElement(vm, '.unread-badge').textContent).to.contain('10');
    // console.log('after push');
    
    // await Vue.nextTick();
    // console.log('current store', vm.$store.state.raiseTheApp.notifications, vm.unreadCount);
    // expect(vm.unreadCount).to.equal(10);
    // expect(utils.getElement(vm, '.unread-badge')).to.exist;
    // expect(utils.getElement(vm, '.unread-badge').textContent).to.contain('10');
    // pushNotificationBatch(90);

    // await Vue.nextTick();
    // expect(vm.unreadCount).to.equal(100);
    // expect(utils.getElement(vm, '.unread-badge')).to.exist;
    // expect(utils.getElement(vm, '.unread-badge').textContent).to.contain('99+');

    // stub.restore();
  });
})
