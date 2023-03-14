const getClientId = () => {
  return Promise.resolve('ad19edeb-e902-49c6-8bb0-55bdd14b35d2')
}
const getDomains = () => {
  return Promise.resolve([
    { text: 'All', value: 'All', disabled: false },
    { divider: true },
    {
      text: 'Kobe',
      value: 'Kobe',
      disabled: false
    },
    {
      text: 'Lebron',
      value: 'Lebron',
      disabled: false
    },
    {
      text: 'George',
      value: 'George',
      disabled: false
    },
    {
      text: 'Carmelo',
      value: 'Carmelo',
      disabled: false
    }
  ])
}

const searchEmailCreations = (payload = {}) => {
  return Promise.resolve([])
}

const deleteEmailCreation = (resourceId = '') => {
  return Promise.resolve()
}

const getDirectEmailCreation = (resourceId = '') => {
  return Promise.resolve()
}
export default {
  getClientId,
  getDomains,
  searchEmailCreations,
  deleteEmailCreation,
  getDirectEmailCreation
}
