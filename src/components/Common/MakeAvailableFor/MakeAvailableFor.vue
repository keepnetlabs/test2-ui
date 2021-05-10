<template>
  <form-group
    :title="labels.MakeAvailableFor"
    :sub-title="labels.MakeAvailableForSubtitle"
    has-hint
  >
    <Treeselect
      v-bind="isAvailableForProps"
      id="input--make-available-for"
      :class="[
        'k-treeselect',
        'make-available-for',
        { 'k-treeselect--error': !isAvailableForValid }
      ]"
      :value="value"
      :loading="true"
      :options="treeSelectOptions"
      :disabled="disabled"
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
    disabled: Boolean
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
      treeSelectOptions: [
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
      ],
      treeSelectionStatus: false
    }
  },
  created() {
    this.callForSearchAvailableFor()
  },
  methods: {
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
      searchAvailableFor(this.searchAvailableForPayload)
        .then((response) => {
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
        this.validateAvailableFor(newVal)
      }
    },
    setTreeSelectOptions(isDisabled = false) {
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
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    getAvailableForListFromBackend(list = []) {
      return getAvailableForListFromBackend(list)
    },
    getAvailableForValues(data) {
      return getAvailableForValues(data)
    }
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
}
</style>
