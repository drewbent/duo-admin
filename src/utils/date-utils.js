import dateformat from 'dateformat'

export const formatDate = date => dateformat(date, 'mm/dd/yyyy')

export const formatDateBackend = date => dateformat(date, 'yyyy-mm-dd')

export const formatTime = date => dateformat(date, 'HH:MM')

export const formatDateTime = date => dateformat(date, 'dd/mm/yyyy HH:MM')

export const areSameDate = (date1, date2) => {
  return formatDate(date1) === formatDate(date2)
}

export const isToday = date => areSameDate(new Date(), date)