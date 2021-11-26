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
      :class="[
        'k-treeselect',
        'make-available-for',
        { 'k-treeselect--error': !isAvailableForValid }
      ]"
      :value="value"
      :options="treeSelectOptions"
      :disabled="disabled"
      :load-options="loadOptions"
      @close="validateAvailableFor"
      @open="handleMenuOpen"
      @input="handleInputChange"
      @search-change="handleSearchChange"
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
import Treeselect from '@riophae/vue-treeselect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { searchAvailableFor } from '@/api/smtpSettings'
import labels from '@/model/constants/labels'
import { COMMON_PROPS } from '@/model/constants/commonConstants'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import infiniteScroll from '@/directives/infinite-scroll'
export default {
  name: 'MakeAvailableFor.vue',
  components: {
    Treeselect,
    FormGroup
  },
  props: {
    value: Array,
    disabled: Boolean,
    subTitle: String,
    placeholder: String
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
      menuElement: 'null',
      isAvailableForValidated: false,
      maximumApiCount: 1,
      apiCount: 0,
      searchAvailableForPayload: {
        pageNumber: 1,
        pageSize: 25,
        orderBy: 'CreateTime',
        ascending: false
      },
      treeSelectOptions: null,
      treeSelectionStatus: false
    }
  },
  computed: {
    showMakeAvailableFor() {
      return this.getRole !== labels.CompanyAdmin
    },
    getRole() {
      //this.$store.state?.auth?.userRoleName
      return this.$store.state?.auth?.userRoleName
    }
  },
  methods: {
    loadOptions({ callback }) {
      this.callForSearchAvailableFor().then(() => {
        callback()
      })
    },
    handleSearchChange(val) {},
    handleMenuOpen() {
      this.$nextTick(() => {
        this.menuElement = document
          .getElementById('input--make-available-for')
          .querySelector('.vue-treeselect__menu')
        this.menuElement.addEventListener('scroll', ({ target }) => {
          const { scrollTop, scrollHeight, offsetHeight } = target
          const { isInfiniteLoading, maximumApiCount, apiCount } = this
          if (
            scrollTop - (scrollHeight - offsetHeight) < 10 &&
            scrollTop - (scrollHeight - offsetHeight) > -10 &&
            !isInfiniteLoading &&
            apiCount < maximumApiCount
          ) {
            this.handleInfiniteLoading()
          }
        })
      })
    },
    callForSearchAvailableFor() {
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
          this.$set(this.treeSelectOptions, 3, {
            ...this.treeSelectOptions[3],
            children: companies.results.map((item) => {
              return {
                id: item['companyResourceId'],
                label: item.companyName,
                resourceId: item['companyResourceId'],
                type: 'Company',
                isDisabled: this.treeSelectionStatus
              }
            })
          })
          this.$set(this.treeSelectOptions, 2, {
            ...this.treeSelectOptions[2],
            children: groups.results.map((item) => {
              return {
                id: item.resourceId,
                label: item.name,
                type: 'Group',
                isDisabled: this.treeSelectionStatus
              }
            })
          })
        })
        .finally(() => {
          this.isInfiniteLoading = false
        })
    },
    handleInfiniteLoading() {
      this.searchAvailableForPayload.pageSize += 25
      this.isInfiniteLoading = true
      this.callForSearchAvailableFor()
    },
    handleInputChange(newVal) {
      let oldVal = this.value
      let emittedVal = newVal

      if (newVal) {
        if (newVal.some((item) => item.type === 'MyCompanyOnly')) {
          if (
            oldVal &&
            oldVal.some((item) => item.type === 'MyCompanyOnly') &&
            newVal.some((item) => item.type === 'AllCompanies')
          ) {
            emittedVal = [this.treeSelectOptions[1]]
          } else if (newVal.length > 1) {
            emittedVal = [this.treeSelectOptions[0]]
          }
          this.treeSelectionStatus = true
          this.setTreeSelectOptions(this.treeSelectionStatus)
        } else if (newVal.some((item) => item.type === 'AllCompanies')) {
          if (newVal.length > 1) {
            emittedVal = [this.treeSelectOptions[1]]
          }
          this.treeSelectionStatus = true
          this.setTreeSelectOptions(this.treeSelectionStatus)
        } else {
          this.treeSelectionStatus = false
          this.setTreeSelectOptions(this.treeSelectionStatus)
        }
        this.$emit('input', emittedVal)
        debugger
        if (['MyCompanyOnly', 'AllCompanies'].includes(emittedVal[0].type)) {
          if (this.$refs.refTreeSelect.menu.isOpen) {
            this.$refs.refTreeSelect.menu.isOpen = false
          }
        }
        this.validateAvailableFor(newVal)
      }
    },
    setTreeSelectOptions(isDisabled = false) {
      if (!this.treeSelectOptions) {
        return
      }
      this.$set(this.treeSelectOptions, 2, {
        ...this.treeSelectOptions[2],
        children: this.treeSelectOptions[2].children.map((item) => {
          return {
            ...item,
            isDisabled
          }
        })
      })
      this.$set(this.treeSelectOptions, 3, {
        ...this.treeSelectOptions[3],
        children: this.treeSelectOptions[3].children.map((item) => {
          return { ...item, isDisabled }
        })
      })
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
          { id: 'MyCompanyOnly', label: 'My company only', resourceId: null, type: 'MyCompanyOnly' }
        ]
      return getAvailableForValues(data)
    }
  },
  mounted() {
    if (this.placeholder) this.isAvailableForProps.placeholder = this.placeholder
  }
}
</script>

<style lang="scss">
[data-id='AllCompanies'],
[data-id='MyCompanyOnly'] {
  .vue-treeselect__checkbox-container {
    display: none;
  }
}
.make-available-for.vue-treeselect {
  svg {
    color: #e0e0e0 !important;
    fill: #e0e0e0 !important;
    path {
      color: #e0e0e0 !important;
      fill: #e0e0e0 !important;
    }
  }
  .vue-treeselect__control .vue-treeselect__control-arrow-container {
    margin-right: 12px;
    svg {
      color: rgba(0, 0, 0, 0.54) !important;
      fill: rgba(0, 0, 0, 0.54) !important;
      path {
        color: rgba(0, 0, 0, 0.54) !important;
        fill: rgba(0, 0, 0, 0.54) !important;
      }
    }
  }
}
</style>
