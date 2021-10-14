import { writable } from 'svelte/store'

const store = writable({notifications:[]})

const notifications:Array<NotificationArgsT> = []
let currentNotification = ""
let notificationInQueue = false
let timeoutHandler = null

function send(args:NotificationArgsT):void {
  if (args?.interrupt ?? true) {
    clearTimeout(timeoutHandler)
    notificationInQueue = false
    notifications.splice(0,100)
  }
  store.update(()=> {
    notifications.push(args)
    // console.log(notifications)
    return {notifications:notifications}
  })
}

store.subscribe((update:NotificationsStoreT) => {
  const duration = update?.notifications?.at(0)?.duration ?? 500
  if (update.notifications.length > 0 && notificationInQueue == false) {
    notificationInQueue = true
    timeoutHandler = setTimeout(() => {
      currentNotification = update.notifications?.at(0).notification
      update.notifications.shift()
      // const newNotifications = 
      notificationInQueue = false
      store.update(() => {
        return {
          notifications: update.notifications
        }
      })
    },duration)
    console.log(timeoutHandler)
  }
})

export {
  send
  , store
  , currentNotification
}