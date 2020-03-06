import dateformat from 'dateformat'

export const formatDate = date => dateformat(date, 'm/dd/yyyy')

export const formatFullDate = date => dateformat(date, 'm/dd/yyyy (ddd) @ h:MM TT')

export const sortDatesForObjects = (field, asc = true) => (obj1, obj2) => sortDates(obj1[field], obj2[field], asc)

export const sortDates = (date1, date2, asc = true) => {
  const parse1 = Date.parse(date1)
  const parse2 = Date.parse(date2)
  if (asc) return parse1 - parse2
  else return parse2 - parse1
}

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