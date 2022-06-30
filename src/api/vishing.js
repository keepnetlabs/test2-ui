import testRequest from '../utils/testRequest'

export function getVishingTemplate(id) {
  // TODO: Add correct endpoint
  // return testRequest.post(`/vishing-templates/${id}`)
  return new Promise((res) => {
    setTimeout(() => {
      res({
        name: 'Template Name',
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
            type: 'Pause'
          }
        ]
      })
    }, 1000)
  })
}

export function exportVishingTemplates(payload = {}) {}

export function getVishingTemplateList(payload = {}) {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: {
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalNumberOfPages: 3,
            totalNumberOfRecords: 24,
            results: [
              {
                resourceId: '1',
                name: 'Template Name',
                language: 'English - Female',
                difficulty: 'Medium',
                createdBy: 'System',
                createTime: '14/06/2022 06:49',
                isOwner: true,
                availableFor: 'No',
                tags: ['tag1', 'tag2']
              },
              {
                resourceId: '2',
                name: 'Template Name',
                language: 'English - Male',
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
