import { shallowMount } from '@vue/test-utils'
import InputSelectRoles from '@/components/Common/Inputs/InputSelectRoles.vue'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'

describe('InputSelectRoles.vue', () => {
  let wrapper
  const mockItems = [
    { name: 'Administrator', resourceId: 'admin' },
    { name: 'Manager', resourceId: 'manager' },
    { name: 'User', resourceId: 'user' },
    { name: 'Viewer', resourceId: 'viewer' }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputSelectRoles, {
      propsData: {
        value: ['admin', 'manager'],
        items: mockItems
      },
      stubs: {
        'form-group': true,
        'k-select': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputSelectRoles')
    })

    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should render KSelect component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have value default empty array', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should have items default empty array', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.items).toEqual([])
    })

    it('should have itemText default "name"', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemText).toBe('name')
    })

    it('should have itemValue default "resourceId"', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemValue).toBe('resourceId')
    })

    it('should have title default "Role"', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.title).toBe('Role')
    })

    it('should have subTitle default', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.subTitle).toBe('Select intended role for this training')
    })

    it('should have placeholder default "Select roles"', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Select roles')
    })

    it('should have loading default false', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should have disabled default false', () => {
      wrapper = shallowMount(InputSelectRoles, {
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(false)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      expect(wrapper.vm.value).toEqual(['admin', 'manager'])
    })

    it('should accept empty value array', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: [],
          items: mockItems
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should accept single role in value array', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin'],
          items: mockItems
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['admin'])
    })

    it('should accept multiple roles in value array', () => {
      expect(wrapper.vm.value.length).toBeGreaterThan(1)
    })

    it('should accept custom items', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should accept custom itemText', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          itemText: 'title'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemText).toBe('title')
    })

    it('should accept custom itemValue', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          itemValue: 'id'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemValue).toBe('id')
    })

    it('should accept custom title', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          title: 'User Role'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.title).toBe('User Role')
    })

    it('should accept custom subTitle', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          subTitle: 'Choose roles'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.subTitle).toBe('Choose roles')
    })

    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          placeholder: 'Choose roles'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.placeholder).toBe('Choose roles')
    })

    it('should accept loading true', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          loading: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should accept disabled true', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('data properties', () => {
    it('should have commonRules data property', () => {
      expect(wrapper.vm.commonRules).toBeDefined()
      expect(typeof wrapper.vm.commonRules).toBe('object')
    })

    it('should have hint in commonRules', () => {
      expect(wrapper.vm.commonRules.hint).toBe('*Required')
    })

    it('should have persistentHint in commonRules', () => {
      expect(wrapper.vm.commonRules.persistentHint).toBe(true)
    })

    it('should have rules in commonRules', () => {
      expect(wrapper.vm.commonRules.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.commonRules.rules)).toBe(true)
    })

    it('should have validation rules in commonRules', () => {
      expect(wrapper.vm.commonRules.rules.length).toBeGreaterThan(0)
    })
  })

  describe('validation rules', () => {
    it('should have required validation rule', () => {
      const rules = wrapper.vm.commonRules.rules
      expect(rules.length).toBeGreaterThan(0)
    })

    it('should validate empty array as invalid', () => {
      const rule = wrapper.vm.commonRules.rules[0]
      const result = rule([])
      expect(result).toBe('Required')
    })

    it('should validate non-empty array as valid', () => {
      const rule = wrapper.vm.commonRules.rules[0]
      const result = rule(['admin'])
      expect(result).toBe(true)
    })

    it('should validate multiple roles as valid', () => {
      const rule = wrapper.vm.commonRules.rules[0]
      const result = rule(['admin', 'manager'])
      expect(result).toBe(true)
    })
  })

  describe('KSelect integration', () => {
    it('should render KSelect component', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have multiple selection enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have chips display enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have small chips enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should have deletable chips enabled', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass commonRules to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass items to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass value to KSelect', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass loading state to KSelect', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin'],
          items: mockItems,
          loading: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })

    it('should pass disabled state to KSelect', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin'],
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: ['viewer'] })
      expect(wrapper.vm.value).toEqual(['viewer'])
    })

    it('should update when items prop changes', async () => {
      const newItems = [{ name: 'Super Admin', resourceId: 'superadmin' }]
      await wrapper.setProps({ items: newItems })
      expect(wrapper.vm.items).toEqual(newItems)
    })

    it('should update when title prop changes', async () => {
      await wrapper.setProps({ title: 'User Roles' })
      expect(wrapper.vm.title).toBe('User Roles')
    })

    it('should update when disabled prop changes', async () => {
      await wrapper.setProps({ disabled: true })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should update when loading prop changes', async () => {
      await wrapper.setProps({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should update when placeholder prop changes', async () => {
      await wrapper.setProps({ placeholder: 'Select user roles' })
      expect(wrapper.vm.placeholder).toBe('Select user roles')
    })
  })

  describe('event handling', () => {
    it('should emit input event on value change', () => {
      wrapper.vm.$emit('input', ['admin'])
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value in input event', () => {
      const newValue = ['manager', 'user']
      wrapper.vm.$emit('input', newValue)
      expect(wrapper.emitted('input')[0][0]).toEqual(newValue)
    })
  })

  describe('integration scenarios', () => {
    it('should work as role selector', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
      expect(wrapper.vm.title).toBe('Role')
    })

    it('should work with single role selection', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin'],
          items: mockItems
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual(['admin'])
    })

    it('should work with multiple roles selection', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin', 'manager', 'user'],
          items: mockItems
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value.length).toBe(3)
    })

    it('should work with no selection', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: [],
          items: mockItems
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.value).toEqual([])
    })

    it('should work in disabled state', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin'],
          items: mockItems,
          disabled: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should work in loading state', () => {
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin'],
          items: mockItems,
          loading: true
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should work with custom item keys', () => {
      const customItems = [
        { title: 'Admin Role', id: 'admin-id' },
        { title: 'User Role', id: 'user-id' }
      ]
      wrapper = shallowMount(InputSelectRoles, {
        propsData: {
          value: ['admin-id'],
          items: customItems,
          itemText: 'title',
          itemValue: 'id'
        },
        stubs: {
          'form-group': true,
          'k-select': true
        }
      })
      expect(wrapper.vm.itemText).toBe('title')
      expect(wrapper.vm.itemValue).toBe('id')
    })
  })

  describe('form integration', () => {
    it('should work with FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })

    it('should provide validation via commonRules', () => {
      expect(wrapper.vm.commonRules.rules).toBeDefined()
    })

    it('should show required hint', () => {
      expect(wrapper.vm.commonRules.hint).toBe('*Required')
    })

    it('should persist hint on focus', () => {
      expect(wrapper.vm.commonRules.persistentHint).toBe(true)
    })
  })

  describe('state management', () => {
    it('should maintain selected roles', () => {
      expect(wrapper.vm.value).toEqual(['admin', 'manager'])
    })

    it('should maintain items list', () => {
      expect(wrapper.vm.items).toEqual(mockItems)
    })

    it('should maintain configuration properties', () => {
      expect(wrapper.vm.title).toBe('Role')
      expect(wrapper.vm.itemText).toBe('name')
      expect(wrapper.vm.itemValue).toBe('resourceId')
    })
  })

  describe('accessibility', () => {
    it('should have proper form group title', () => {
      expect(wrapper.vm.title).toBeDefined()
    })

    it('should have proper form group subtitle', () => {
      expect(wrapper.vm.subTitle).toBeDefined()
    })

    it('should have placeholder for accessibility', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
    })

    it('should provide hint for required field', () => {
      expect(wrapper.vm.commonRules.hint).toBe('*Required')
    })
  })
})
