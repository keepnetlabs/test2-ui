import testRequest from '../utils/testRequest'

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

export function exportVishingTemplates(payload = {}) {
  // TODO: Add correct endpoint
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
                tags: ['tag1', 'tag2', 'tag1', 'tag2', 'tag1', 'tag2']
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
                tags: ['tag1', 'tag2']
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
                tags: ['tag1', 'tag2']
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
                tags: ['tag1', 'tag2']
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
                tags: ['tag1', 'tag2']
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
                tags: ['tag1', 'tag2']
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
  // TODO: Add correct endpoint
}

export function deleteVishingTemplate(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
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

export function getVishingTemplate(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

export function getVishingCampaigns(payload = {}) {
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
                name: 'Netflix Password',
                targetUsers: 215,
                status: 'Completed',
                createdBy: 'System',
                templateName: 'Template Name',
                createTime: '14/06/2022 06:49',
                lastLaunch: '14/06/2022 06:49'
              },
              {
                resourceId: '2',
                name: 'Reset Password',
                targetUsers: 215,
                status: 'Running',
                createdBy: 'Reseller name',
                templateName: 'Template Name',
                createTime: '14/06/2022 06:49',
                lastLaunch: '14/06/2022 06:49'
              },
              {
                resourceId: '3',
                name: 'Amazon shopping receipt',
                targetUsers: 215,
                status: 'Idle',
                createdBy: 'Company name',
                templateName: 'Template Name',
                createTime: '14/06/2022 06:49'
              },
              {
                resourceId: '4',
                name: 'Facebook new login',
                targetUsers: 215,
                status: 'Scheduled',
                createdBy: 'Company name',
                templateName: 'Template Name',
                createTime: '14/06/2022 06:49'
              },
              {
                resourceId: '5',
                name: 'Starbucks order',
                targetUsers: 215,
                status: 'Cancelled',
                createdBy: 'System',
                templateName: 'Template Name',
                createTime: '14/06/2022 06:49',
                lastLaunch: '14/06/2022 06:49'
              },
              {
                resourceId: '6',
                name: 'Error Campaign',
                targetUsers: 215,
                status: 'Error',
                createdBy: 'System',
                templateName: 'Template Name',
                createTime: '14/06/2022 06:49',
                lastLaunch: '14/06/2022 06:49'
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

export function getVishingCampaign(id) {
  // TODO: Add correct endpoint
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}
