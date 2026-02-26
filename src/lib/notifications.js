let timers = []

export function scheduleNotifications(reminderTimes, getIncompleteCount) {
  // Clear any existing timers
  clearAllNotifications()

  if (Notification.permission !== 'granted') return
  if (!reminderTimes || reminderTimes.length === 0) return

  const now = new Date()

  for (const time of reminderTimes) {
    const [hours, minutes] = time.split(':').map(Number)

    const target = new Date()
    target.setHours(hours, minutes, 0, 0)

    // If the time already passed today, schedule for tomorrow
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }

    const delay = target.getTime() - now.getTime()

    const timerId = setTimeout(() => {
      fireNotification(getIncompleteCount)
      // Re-schedule for tomorrow after firing
      const tomorrowDelay = 24 * 60 * 60 * 1000
      const recurringId = setInterval(() => {
        fireNotification(getIncompleteCount)
      }, tomorrowDelay)
      timers.push(recurringId)
    }, delay)

    timers.push(timerId)
  }
}

function fireNotification(getIncompleteCount) {
  if (Notification.permission !== 'granted') return

  const count = getIncompleteCount()

  if (count === 0) {
    new Notification('Forge — All Done! 🔥', {
      body: 'Every habit forged today. You are unstoppable.',
      icon: '/vite.svg',
    })
  } else {
    new Notification('Forge — Time to Act', {
      body: `You have ${count} habit${count === 1 ? '' : 's'} left today. The forge awaits.`,
      icon: '/vite.svg',
    })
  }
}

export function clearAllNotifications() {
  for (const id of timers) {
    clearTimeout(id)
    clearInterval(id)
  }
  timers = []
}
