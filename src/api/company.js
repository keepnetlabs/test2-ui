import testRequest from '../utils/testRequest'

export function searchCompanies(payload) {
  return testRequest.post('/companies/search', payload)
}
export function exportCompanies(payload) {
  return testRequest.post('/companies/search/export', payload, {
    responseType: 'blob'
  })
}
export function deleteCompany(id) {
  return testRequest.delete(`companies/${id}`)
}
export function getCompanyByID(id) {
  return testRequest.get(`/companies/${id}`)
}
export function getCompanyGroups() {
  return testRequest.get(`/company-groups`)
}
export function createCompany(payload) {
  const formData = new FormData()

  for (const key in payload) {
    if (Array.isArray(payload[key])) {
      payload[key].forEach((x) => formData.append(key, x))
    } else {
      payload[key] && formData.append(key, payload[key])
    }
  }
  /*for (let a of formData.entries()) {
    console.log(a[0] + ':' + a[1])
  }*/

  return testRequest.post(`/companies`, formData)
}

export function updateCompany(id, payload) {
  const formData = new FormData()

  for (const key in payload) {
    if (Array.isArray(payload[key])) {
      payload[key].forEach((x) => formData.append(key, x))
    } else {
      payload[key] && formData.append(key, payload[key])
    }
  }
  for (let a of formData.entries()) {
    console.log(a[0] + ':' + a[1])
  }

  return testRequest.put(`/companies/${id}`, formData)
}

export function deleteCompanyGroup(id) {
  return testRequest.delete(`/company-groups/${id}`)
}
