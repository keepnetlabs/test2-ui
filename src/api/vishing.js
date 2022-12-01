import vishingRequest from '../utils/vishingRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function exportVishingTemplates(payload = {}) {
  return vishingRequest.post(`/vishing-template/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getVishingTemplate(resourceId = '') {
  return vishingRequest.get(`/vishing-template/${resourceId}`)
}

export function getVishingTemplates(payload = {}) {
  return vishingRequest.post('/vishing-template/search', payload)
}

export function deleteVishingTemplate(resourceId = '') {
  return vishingRequest.delete(`/vishing-template/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getVishingTemplatePreview(id) {
  // TODO: Add correct endpoint
  // return testRequest.post(`/vishing-templates/${id}`)
  return new Promise((res) => {
    setTimeout(() => {
      res({
        name: 'Microsoft',
        senderPhoneNumber: '+90 535 061 82 67',
        steps: [
          {
            type: 'Text to Speech',
            textToSpeech:
              'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
            fileUrl:
              'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
          },
          {
            type: 'Upload Audio',
            fileName: 'Randomfilename.mp3',
            fileUrl:
              'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
            requiredDigitCount: 4,
            isFailStep: true
          },
          {
            type: 'Pause',
            pauseSeconds: 5
          }
        ]
      })
    }, 1000)
  })
}

export function getVishingTemplateList(payload = {}) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 3,
            results: [
              {
                resourceId: '1',
                name: 'Long Template Name that Creates Overflow Elipsis',
                language: 'English - Female',
                languageShortCode: 'EN',
                narratorGender: 'Female',
                description:
                  'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
                difficulty: 'Medium',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: true,
                availableFor: 'No',
                tags: [
                  'asdkjasdjasdjlas jd asj djasd jasdjasd jasd jsa',
                  'tag2',
                  'tag1',
                  'tag2',
                  'tag1',
                  'tag2'
                ],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  },
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  }
                ]
              },
              {
                resourceId: '2',
                name: 'Template Name',
                language: 'English - Male',
                languageShortCode: 'EN',
                narratorGender: 'Male',
                description:
                  'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
                difficulty: 'Hard',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: true,
                availableFor: '12',
                tags: ['tag1', 'tag2', 'tag1', 'tag2', 'tag1', 'tag2'],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  }
                ],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  }
                ]
              },
              {
                resourceId: '3',
                name: 'Template Name',
                language: 'German - Male',
                languageShortCode: 'DE',
                narratorGender: 'Male',
                description:
                  'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
                difficulty: 'Easy',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: false,
                availableFor: '12',
                tags: ['tag1'],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  }
                ]
              },
              {
                resourceId: '4',
                name: 'Template Name',
                language: 'English - Female',
                languageShortCode: 'EN',
                narratorGender: 'Female',
                description:
                  'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
                difficulty: 'Medium',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: true,
                availableFor: 'No',
                tags: ['tag1'],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  }
                ]
              },
              {
                resourceId: '5',
                name: 'Template Name',
                language: 'English - Male',
                languageShortCode: 'EN',
                narratorGender: 'Male',
                description:
                  'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
                difficulty: 'Hard',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: true,
                availableFor: '12',
                tags: ['tag1', 'tag2'],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  }
                ]
              },
              {
                resourceId: '6',
                name: 'Template Name',
                language: 'German - Male',
                languageShortCode: 'DE',
                narratorGender: 'Male',
                description:
                  'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
                difficulty: 'Easy',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: false,
                availableFor: '12',
                tags: ['tag1', 'tag2'],
                steps: [
                  {
                    type: 'Text to Speech',
                    textToSpeech:
                      'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
                  },
                  {
                    type: 'Upload Audio',
                    fileName: 'Randomfilename.mp3',
                    fileUrl:
                      'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
                    requiredDigitCount: 4,
                    isFailStep: true
                  },
                  {
                    type: 'Pause',
                    pauseSeconds: 5
                  }
                ]
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function exportVishingCampaigns(payload = {}) {
  return vishingRequest.post('/vishing-campaign/search/export', payload, {
    responseType: 'blob'
  })
}

export function updateVishingTemplate(id, payload = {}) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

export function createVishingTemplate(payload = {}) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

export function getVishingCampaigns(payload = {}) {
  return vishingRequest.post('/vishing-campaign/search', payload)
}

export function deleteVishingCampaign(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

export function updateVishingCampaign(id, payload = {}) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

export function createVishingCampaign(payload = {}) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

export function getVishingCampaign(resourceId) {
  return vishingRequest.get(`/vishing-campaign/${resourceId}`)
}

export function getVishingReportUsers(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                status: 'Not Responded'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33',
                status: 'Answered'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33',
                status: 'In Queue'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                status: 'Vished'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33',
                status: 'Cancelled'
              },
              {
                resourceId: '6',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33',
                status: 'Calling Error'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getVishingReportAnswered(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getVishingReportDialedNumber(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33',
                callDuration: '00:02:00'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getVishingReportNoResponse(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 1,
            totalNumberOfRecords: 6,
            results: [
              {
                resourceId: '1',
                firstName: 'Bruce',
                lastName: 'Wayne',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '2',
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '+90 545 678 95 64',
                department: 'Reporters',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '3',
                firstName: 'Peter',
                lastName: 'Parker',
                phoneNumber: '+90 545 678 95 64',
                department: 'Photography',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '4',
                firstName: 'Tony',
                lastName: 'Stark',
                phoneNumber: '+90 545 678 95 64',
                department: 'Executives',
                callDate: '14/06/2022 06:49:33'
              },
              {
                resourceId: '5',
                firstName: 'Steve',
                lastName: 'Rogers',
                phoneNumber: '+90 545 678 95 64',
                department: 'Security',
                callDate: '14/06/2022 06:49:33'
              }
            ]
          },
          status: 'SUCCESS',
          message: 'Resource retrieved',
          validationMessages: []
        }
      })
    }, 1000)
  })
}

export function getPhoneNumbers() {
  return vishingRequest.get('/voice/phone-numbers')
}
