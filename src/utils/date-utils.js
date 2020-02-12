import dateformat from 'dateformat'

export const formatDate = date => dateformat(date, 'mm/dd/yyyy')

export const formatTime = date => dateformat(date, 'HH:mm')

export const formatDateTime = date => dateformat(date, 'dd/mm/yyyy HH:mm')

export const areSameDate = (date1, date2) => {
  return formatDate(date1) === formatDate(date2)
}

