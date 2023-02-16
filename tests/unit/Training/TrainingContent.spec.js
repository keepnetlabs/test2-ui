import { createLocalVue, mount } from '@vue/test-utils'
import { customVuetify as vuetify } from '../utils'
import NewTrainingContentByLanguage from '@/components/AwarenessEducator/NewTraining/NewTrainingContentByLanguage.vue'
describe('Training Content', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify
    })
    //checking is rendered
    expect(wrapper.exists()).toBe(true)
    //checking title
    expect(wrapper.text().includes('Language')).toBeTruthy()
    //checking file upload text
    expect(wrapper.text().includes('Upload File')).toBeTruthy()
    //checking file upload component
    expect(wrapper.find('.k-file-uploads__wrapper').exists()).toBe(true)
    //checking is file upload vue component
    expect(wrapper.findComponent({ name: 'KFileUpload' }).exists()).toBe(true)
  })
  it('Checking default value', async () => {
    const wrapper = mount(NewTrainingContentByLanguage, {
      localVue,
      vuetify,
      propsData: {
        filePreviews: [{ name: 'Scorm', size: 1000002 }]
      }
    })
    //checking file name
    expect(wrapper.find('.k-file-uploads__item-details--filename').text().includes('Scorm')).toBe(
      true
    )
    //checking file size
    expect(
      wrapper.find('.k-file-uploads__item-details--filesize').text().includes('976.56 KB')
    ).toBe(true)
  })
})
