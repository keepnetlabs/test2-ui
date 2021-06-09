/*
import 'regenerator-runtime/runtime'
import { VBtn } from 'vuetify/lib/components/VBtn'
// Components
import CustomCard from '@/components/CustomCard'
import axios, * as others from 'axios'
jest.mock('axios', () => jest.fn(() => Promise.resolve(['gurkan'])))
// Utilities
import { mount } from '@vue/test-utils'

describe('CustomCard.vue', () => {
  it('should have vbtn', () => {
    const wrapper = mount(CustomCard, {
      propsData: { title: 'Foobar' }
    })
    expect(wrapper.findComponent(VBtn).exists()).toBe(true)
  })

  it('should have foobar', () => {
    const wrapper = mount(CustomCard, {
      propsData: { title: 'Foobar' }
    })
    expect(wrapper.text()).toContain('Foobar')
  })

  it('axios', async () => {
    const response = await axios({
      url: 'https://dev-api.devkeepnet.com/timezone/timezones',
      method: 'GET'
    })
    expect(axios).toHaveBeenCalled()
    expect(response[0]).toEqual('gurkan')
  })
})
*/
import DataTable from '@/components/DataTable'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import ServerSideProps from '@/helper-classes/server-side-table-props'

describe('Datatable Suite', () => {
  const localVue = createLocalVue()
  it('Datatable first test', async () => {
    const data = [
      {
        resourceId: 'RyYLcsc954sZ',
        firstName: 'hilli',
        lastName: 'hilli',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'Root',
        phoneNumber: '+443723826832',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/06/09 09:51 AM',
        email: 'arda.dura+110@gmail.com'
      },
      {
        resourceId: 'G97jjB5krd71',
        firstName: 'abraham@keepnetlabs.com',
        lastName: null,
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'CompanyAdmin',
        phoneNumber: null,
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/06/04 02:50 PM',
        email: 'abraham@keepnetlabs.com'
      },
      {
        resourceId: 'wFVAnlg8U29S',
        firstName: 'İbrahim',
        lastName: 'Uçar',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'Root',
        phoneNumber: '+905555555555',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/06/04 02:43 PM',
        email: 'ibrahim+1@keepnetlabs.com'
      },
      {
        resourceId: 'ZANET1DnSfl4',
        firstName: 'Gurkan',
        lastName: 'Ugurlu',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'Root',
        phoneNumber: '+905382056461',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/04/27 01:23 PM',
        email: 'gurkan.ugurlu@keepnetlabs.com'
      },
      {
        resourceId: 'Ec7zw5dPf0Ut',
        firstName: 'Chastity',
        lastName: 'Jenkins',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'Root',
        phoneNumber: '+905436252422',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/04/19 02:34 PM',
        email: 'fydakim@mailinator.com'
      },
      {
        resourceId: '4aa2YDwdDXrk',
        firstName: 'Sigourney',
        lastName: 'Jefferson',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'Root',
        phoneNumber: '+1719-722-3283',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/04/19 02:28 PM',
        email: 'hibebuf@mailinator.com'
      },
      {
        resourceId: 'KuHhw1jMyDYA',
        firstName: 'Igor1',
        lastName: 'Nichols',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'Root',
        phoneNumber: '+1524-627-7547',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/04/19 01:56 PM',
        email: 'qyvol@mailinator.com'
      },
      {
        resourceId: 's2t4hT55hBHz',
        firstName: 'asaassaas',
        lastName: 'sasaass',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'CompanyAdmin',
        phoneNumber: '+441234567890',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/04/09 01:58 PM',
        email: 'assaas@mail.com'
      },
      {
        resourceId: 'C2R0K4LVnAPA',
        firstName: 'assasa',
        lastName: 'sasa',
        companyName: 'Root Company',
        companyResourceId: 'uB4jcFz9x1My',
        roles: 'CompanyAdmin',
        phoneNumber: '+441234567890',
        statusId: 1,
        statusName: 'Active',
        createTime: '2021/04/09 01:57 PM',
        email: 'sasaas@mail.com'
      }
    ]
    const wrapper = mount(DataTable, {
      localVue,
      propsData: {
        empty: {
          message: 'No Users',
          id: 'btn-empty--phishing-reporter-users'
        },
        columns: [],
        refName: 'asjjas',
        table: data,
        serverSideProps: new ServerSideProps('createTime', false, 10, 1, 1, 9)
      }
    })

    expect(wrapper.vm.table.length).toBe(9)

    wrapper.vm.$emit('server-side-size-changed', 5)

    let emittedObj = wrapper.emitted()

    await wrapper.setData({ table: data.slice(0, emittedObj['server-side-size-changed'][0][0]) })
    expect(wrapper.vm.table.length).toBe(5)
    wrapper.vm.$emit('server-side-page-number-changed', 2)
    emittedObj = wrapper.emitted()
    expect(emittedObj['server-side-page-number-changed'][0][0]).toBe(2)
  })
})
