export const getReportDate = (date) => {
  const explodedId = date.split('')
  const reportDate = {
    day: explodedId.splice(6, 2).join(''),
    month: explodedId.splice(4, 2).join(''),
    year: explodedId.splice(0, 4).join(''),
  }
  return `${reportDate.month}/${reportDate.day}/${reportDate.year}`
}