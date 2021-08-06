
export const getReportDate = (date: string): string => {
  const explodedId = date.split('')
  const reportDate = {
    day: explodedId.splice(6, 2).join(''),
    month: explodedId.splice(4, 2).join(''),
    year: explodedId.splice(0, 4).join(''),
  }
  return `${reportDate.month}/${reportDate.day}/${reportDate.year}`
}

type PluralContentT = {
  verb: 'are' | 'is'
  makePlural: 's' | null
}

export const getPluralContent = (numberToCheck: number): PluralContentT => {
  return {
    verb: numberToCheck > 1 ? 'are' : 'is',
    makePlural: numberToCheck > 1 ? 's' : null,
  }
}
