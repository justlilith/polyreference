import { writable } from 'svelte/store'

const store = writable({notifications: []})

const notifications:Array<string> = []
let currentNotification = ""
let notificationInQueue = false

type NotificationArgsT = {
  notification:string
}
function send (args:NotificationArgsT):void {
  store.update(()=> {
    notifications.push(args.notification)
    // console.log(notifications)
    return {notifications:notifications}
  })
}

store.subscribe((update) => {
  console.log(update)
  if (update.notifications.length > 0 && notificationInQueue == false) {
    notificationInQueue = true
    setTimeout(() => {
      currentNotification = update.notifications[0]
      update.notifications.shift()
      // const newNotifications = 
      notificationInQueue = false
      store.update(() => {
        return {
          notifications: update.notifications
        }
      })
    },1000)
  }
})

export {
  send
  , store
  , currentNotification
}