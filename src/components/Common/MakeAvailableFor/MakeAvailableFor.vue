<template>
  <form-group
    v-if="showMakeAvailableFor"
    :title="labels.MakeAvailableFor"
    :sub-title="subTitle || labels.MakeAvailableForSubtitle"
    has-hint
  >
    <Treeselect
      v-bind="isAvailableForProps"
      ref="refTreeSelect"
      id="input--make-available-for"
      :class="getTreeSelectClasses"
      async
      :value="value"
      :options="treeSelectOptions"
      :disabled="disabled"
      :open-direction="openDirection"
      :load-options="loadOptions"
      @close="validateAvailableFor"
      @open="handleMenuOpen"
      @input="handleInputChange"
    >
      <template #after-list>
        <v-progress-circular
          v-if="isInfiniteLoading"
          style="position: absolute; left: 46%; margin-top: -31%;"
          :size="50"
          color="primary"
          indeterminate
        />
      </template>
    </Treeselect>
    <div
      v-if="isAvailableForValidated && !isAvailableForValid"
      class="v-text-field__details checkbox-error"
    >
      <transition appear name="bounce">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message" style="padding-left: 10px;">
              Required
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-else class="v-messages theme--light" role="alert">
      <div class="v-messages__wrapper">
        <div class="v-messages__message" style="padding-left: 10px; font-size: 9px;">
          *Required
        </div>
      </div>
    </div>
  </form-group>
</template>

<script>
import Treeselect, { ASYNC_SEARCH } from '@riophae/vue-treeselect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { searchAvailableFor } from '@/api/smtpSettings'
import labels from '@/model/constants/labels'
import { COMMON_PROPS } from '@/model/constants/commonConstants'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import infiniteScroll from '@/directives/infinite-scroll'
import useDebounce from '@/hooks/useDebounce'
export default {
  name: 'MakeAvailableFor.vue',
  components: {
    Treeselect,
    FormGroup
  },
  mixins: [useDebounce],
  props: {
    value: Array,
    disabled: Boolean,
    subTitle: String,
    placeholder: String,
    openDirection: {
      type: String,
      default: 'auto'
    },
    selectedCompaniesAndGroups: {
      type: Array,
      default: () => []
    }
  },
  directives: {
    'infinite-scroll': infiniteScroll
  },
  data() {
    return {
      labels,
      isAvailableForProps: COMMON_PROPS.AVAILABLEFOR,
      isAvailableForValid: true,
      isInfiniteLoading: false,
      menuElement: '',
      isAvailableForValidated: false,
      maximumApiCount: 1,
      apiCount: 0,
      isScrolling: false,
      disableScroll: false,
      searchAvailableForPayload: {
        pageNumber: 1,
        pageSize: 100,
        orderBy: 'CreateTime',
        ascending: false,
        name: '',
        selectedCompanyGroup: []
      },
      treeSelectOptions: null,
      treeSelectionStatus: false,
      defaultCompanyItems: [],
      defaultCompanyGroupItems: [],
      scrollablePageNumber: 1
    }
  },
  computed: {
    getTreeSelectClasses() {
      return [
        'k-treeselect',
        'make-available-for',
        { 'k-treeselect--error': !this.isAvailableForValid }
      ]
    },
    showMakeAvailableFor() {
      return this.getRole !== labels.CompanyAdmin
    },
    getRole() {
      return this.$store.state?.auth?.userRoleName
    }
  },
  watch: {
    selectedCompaniesAndGroups: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.length) {
          this.searchAvailableForPayload.selectedCompanyGroup = val
          this.callForSearchAvailableFor(undefined, true)
        }
      }
    }
  },
  mounted() {
    if (!this?.value?.length) {
      this.handleInputChange([
        {
          id: 'MyCompanyOnly',
          label: 'My company only',
          type: 'MyCompanyOnly',
          resourceId: null
        }
      ])
    }

    if (this.placeholder) this.isAvailableForProps.placeholder = this.placeholder
  },
  methods: {
    loadOptions({ action, searchQuery, callback }) {
      if (action !== ASYNC_SEARCH) return
      this.debounce(() => {
        this.disableScroll = true
        this.searchAvailableForPayload.name = searchQuery
        this.searchAvailableForPayload.pageNumber = searchQuery ? 1 : this.scrollablePageNumber
        this.callForSearchAvailableFor(searchQuery).then(() => {
          setTimeout(() => {
            callback(null, this.treeSelectOptions)
          }, 100)
          if (this.isScrolling) {
            const element = document
              .getElementById('input--make-available-for')
              .querySelector('.vue-treeselect__menu')
            if (element) {
              this.$nextTick(() => {
                element.scroll({ top: element.scrollHeight - 500 })
              })
            }
          }
          this.$nextTick(() => {
            this.disableScroll = false
            this.isScrolling = false
          })
          if (this?.$refs?.refTreeSelect?.remoteSearch) {
            const keys = Object.keys(this.$refs.refTreeSelect.remoteSearch)
            keys.forEach((key) => {
              this.$refs.refTreeSelect.remoteSearch[key].isLoading = false
            })
          }
        })
      }, 500)
    },
    handleMenuOpen() {
      //this element is removing from DOM after closing. Because of that event is removing by garbage collector
      this.$nextTick(() => {
        this.menuElement = document
          .getElementById('input--make-available-for')
          .querySelector('.vue-treeselect__menu')
        if (this.menuElement) {
          this.menuElement.addEventListener('scroll', this.checkScrollAndActivateInfiniteLoading)
        }
      })
    },
    checkScrollAndActivateInfiniteLoading({ target }) {
      if (this.$refs.refTreeSelect.rootOptionsStates.isLoading) return
      const { scrollTop, scrollHeight, offsetHeight } = target
      const { isInfiniteLoading, maximumApiCount, apiCount, disableScroll } = this
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10 &&
        !isInfiniteLoading &&
        apiCount < maximumApiCount &&
        !disableScroll &&
        !this.$refs.refTreeSelect.trigger.searchQuery
      ) {
        this.isScrolling = true
        this.handleInfiniteLoading()
      }
    },
    callForSearchAvailableFor(search, isReplace = false) {
      return searchAvailableFor(this.searchAvailableForPayload)
        .then((response) => {
          this.treeSelectOptions = [
            {
              id: 'MyCompanyOnly',
              label: 'My company only',
              type: 'MyCompanyOnly',
              resourceId: null
            },
            {
              id: 'AllCompanies',
              label: 'All companies',
              type: 'AllCompanies',
              resourceId: null
            },
            {
              id: 'Group',
              label: 'Company Groups',
              children: []
            },
            {
              id: 'Company',
              label: 'Companies',
              children: []
            }
          ]
          const { data: { data = {} } = {} } = response
          const { companies = {}, groups = {} } = data
          if (this.apiCount === 0) {
            this.maximumApiCount = Math.max(companies.totalNumberOfPages, groups.totalNumberOfPages)
          }
          this.apiCount++
          const defaultCompanyItems = companies?.results
            ? companies.results.map((item) => {
                return {
                  id: item['companyResourceId'],
                  label: item.companyName,
                  resourceId: item['companyResourceId'],
                  type: 'Company',
                  isDisabled: this.treeSelectionStatus
                }
              })
            : []
          if (!search)
            this.defaultCompanyItems = [...this.defaultCompanyItems, ...defaultCompanyItems]
          if (isReplace) {
            this.defaultCompanyItems = [...defaultCompanyItems]
          }
          const defaultCompanyGroupItems = groups?.results
            ? groups.results.map((item) => {
                return {
                  id: item.resourceId,
                  resourceId: item.resourceId,
                  label: item.name,
                  type: 'Group',
                  isDisabled: this.treeSelectionStatus
                }
              })
            : []
          if (!search)
            this.defaultCompanyGroupItems = [
              ...this.defaultCompanyGroupItems,
              ...defaultCompanyGroupItems
            ]
          if (isReplace) {
            this.defaultCompanyGroupItems = [...defaultCompanyGroupItems]
          }
          this.$set(this.treeSelectOptions, 3, {
            ...this.treeSelectOptions[3],
            children: search ? defaultCompanyItems : this.defaultCompanyItems
          })
          this.$set(this.treeSelectOptions, 2, {
            ...this.treeSelectOptions[2],
            children: search ? defaultCompanyGroupItems : this.defaultCompanyGroupItems
          })
        })
        .finally(() => {
          this.$nextTick(() => {
            this.isInfiniteLoading = false
          })
        })
    },
    handleInfiniteLoading() {
      this.scrollablePageNumber++
      this.isInfiniteLoading = true
      this.$refs.refTreeSelect.remoteSearch = {}
      this.$refs.refTreeSelect.handleRemoteSearch()
    },
    handleInputChange(newVal) {
      if (!newVal) return
      let oldVal = this.value
      let emittedVal = newVal
      if (newVal.some((item) => item.type === 'MyCompanyOnly')) {
        if (
          oldVal &&
          oldVal.some((item) => item.type === 'MyCompanyOnly') &&
          newVal.some((item) => item.type === 'AllCompanies')
        ) {
          const selectedOption = this.treeSelectOptions?.[1]
          emittedVal = selectedOption ? [selectedOption] : []
        } else if (newVal.length > 1) {
          const selectedOption = this.treeSelectOptions?.[0]
          emittedVal = selectedOption ? [selectedOption] : []
        }
        this.treeSelectionStatus = true
        this.setTreeSelectOptions(this.treeSelectionStatus)
      } else if (newVal.some((item) => item.type === 'AllCompanies')) {
        if (newVal.length > 1) {
          const selectedOption = this.treeSelectOptions?.[1]
          emittedVal = selectedOption ? [selectedOption] : []
        }
        this.treeSelectionStatus = true
        this.setTreeSelectOptions(this.treeSelectionStatus)
      } else {
        //that means it is deleted
        this.$emit('input', emittedVal)
        this.treeSelectionStatus = false
        this.setTreeSelectOptions(this.treeSelectionStatus)
      }
      if (emittedVal && emittedVal[0]) {
        this.$emit('input', emittedVal)
        if (['MyCompanyOnly', 'AllCompanies'].includes(emittedVal[0].type)) {
          this.closeMenuAndResetStatus()
        }
      }
      this.validateAvailableFor(newVal)
    },
    closeMenuAndResetStatus() {
      if (this?.$refs?.refTreeSelect?.menu?.isOpen) {
        this?.menuElement?.scroll({ top: 0 })
        this.$refs.refTreeSelect['menu'].isOpen = false
        this.$refs.refTreeSelect.trigger.searchQuery = ''
      }
    },
    setTreeSelectOptions(isDisabled = false) {
      if (!this.treeSelectOptions) {
        return
      }
      this.treeSelectOptions[2].children.map((item) => {
        item.isDisabled = isDisabled
      })
      this.treeSelectOptions[3].children.map((item) => {
        item.isDisabled = isDisabled
      })
      if (this?.$refs?.refTreeSelect?.remoteSearch) {
        const keys = Object.keys(this.$refs.refTreeSelect.remoteSearch)
        keys.forEach((key) => {
          const object = this.$refs.refTreeSelect.remoteSearch[key]
          if (object) {
            object?.options[2]?.children?.map((item) => (item.isDisabled = isDisabled))
            object?.options[3]?.children?.map((item) => (item.isDisabled = isDisabled))
          }
        })
      }
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid =
        this.getRole === labels.CompanyAdmin ? true : value && !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    getAvailableForListFromBackend(list = []) {
      return getAvailableForListFromBackend(list)
    },
    getAvailableForValues(data) {
      //If role is company admin return just company admin
      if (this.getRole === labels.CompanyAdmin)
        return [
          {
            id: 'MyCompanyOnly',
            label: 'My company only',
            resourceId: null,
            type: 'MyCompanyOnly'
          }
        ]
      return getAvailableForValues(data)
    }
  }
}
</script>
