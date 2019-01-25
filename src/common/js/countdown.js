import dayjs from 'dayjs'

/**
 * 计算当前时间到指定时间的间隔
 * unix: seconds
 * @param {*} endTime
 * @param {*} startTime
 */
export const calcDate = (endTime, startTime = dayjs().unix()) => {
  let [days, hours, mins, seconds] = [0, 0, 0, 0]
  let diff = endTime - startTime
  const isFeature = diff >= 0

  diff = Math.abs(diff)
  const [secondsOfADay, secondsOfAnHour, secondsOfAMinute] = [60 * 60 * 24, 60 * 60, 60]

  days = parseInt(diff / secondsOfADay)
  diff = (diff - days * secondsOfADay) % secondsOfADay

  hours = parseInt(diff / secondsOfAnHour)
  diff = (diff - hours * secondsOfAnHour) % secondsOfAnHour

  mins = parseInt(diff / secondsOfAMinute)
  diff = (diff - mins * secondsOfAMinute) % secondsOfAMinute

  seconds = diff
  return {
    days,
    hours,
    mins,
    seconds,
    isFeature
  }
}