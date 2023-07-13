export const isEmpty = (subject) => {
  switch (typeof subject) {
    case 'object':
      return Object.keys(subject).length === 0
    case 'string':
      return subject === ''
    default:
      return false
  }
}

export const isDefined = (value) =>
  typeof value !== 'undefined' && value !== null
