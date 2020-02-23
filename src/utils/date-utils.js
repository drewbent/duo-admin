import dateformat from 'dateformat'

export const formatDate = date => dateformat(date, 'mm/dd/yyyy')

export const formatDateBackend = date => dateformat(date, 'yyyy-mm-dd')

export const formatTime = date => {
  if (date)
    return dateformat(date, 'HH:MM')
  else
    return 'N/A'
}

export const formatDateTime = date => dateformat(date, 'mm/dd/yyyy HH:MM')

export const areSameDate = (date1, date2) => {
  return formatDate(date1) === formatDate(date2)
}

export const isToday = date => areSameDate(new Date(), date)