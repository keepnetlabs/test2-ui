import testRequest from '@/utils/testRequest'

export function getAllFiles() {
  return testRequest.get('/file/all')
}
export function getUploadedFiles() {
  return testRequest.get('/file/uploaded')
}

export function uploadFiles(payload) {
  return testRequest.post('/file/upload', payload)
}

export function deleteFiles(ResourceIdList) {
  return testRequest.delete('/file/delete', {
    data: {
      ResourceIdList
    }
  })
}
