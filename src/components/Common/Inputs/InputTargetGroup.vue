<template>
  <KSelect
    v-bind="$attrs"
    v-infinite-scroll="{
      target: '#input--target-user-groups .k-select__menu',
      callback: callForTargetGroups
    }"
    v-select-search-handler="{
      callback: callForSearchTargetGroups,
      isLoadingKey: 'isUserGroupsLoading'
    }"
    :value="value"
    key="groups"
    type="autocomplete"
    id="input--target-user-groups"
    outlined
    :items="items"
    :rules="rules"
    autocomplete="off"
    :placeholder="placeholder"
    :no-data-text="isUserGroupsLoading ? 'Loading...' : 'No user group available'"
    @change="handleInputChange"
  />
</template>

<script>
import { searchTargetGroups } from '@/api/targetUsers'
import { getDefaultAxiosPayload, getSelectSearchPayload } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'

export default {
  name: 'InputTargetGroup',
  components: { KSelect },
  props: {
    rules: {
      type: Array
    },
    value: {
      validate(value) {
        return Array.isArray(value) || typeof value === 'string'
      }
    },
    manipulateItems: {
      type: Function
    },
    defaultItems: {
      type: Array
    },
    placeholder: {
      type: String,
      default: 'Select user groups'
    },
    payload: {
      type: Object
    }
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  data() {
    return {
      isUserGroupsLoading: false,
      axiosPayload: getDefaultAxiosPayload(),
      totalNumberOfPagesOfTargetGroups: 1,
      items: this.defaultItems || []
    }
  },
  created() {
    this.callForTargetGroups()
  },
  watch: {
    payload: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!!val && !!Object.keys(val).length) {
          this.axiosPayload = { ...val }
        }
      }
    }
  },
  methods: {
    handleInputChange(v) {
      this.$emit('input', v)
    },
    callForTargetGroups(addPage) {
      if (addPage) {
        this.axiosPayload.pageNumber += 1
        if (this.axiosPayload.pageNumber > this.totalNumberOfPagesOfTargetGroups) return
      }
      searchTargetGroups(this.axiosPayload)
        .then((response) => {
          this.setTargetGroups(response)
          this.totalNumberOfPagesOfTargetGroups = response?.data?.data?.totalNumberOfPages
        })
        .finally(() => (this.isUserGroupsLoading = false))
    },
    setTargetGroups(response) {
      const { data: { data = {} } = [] } = response
      if (this.manipulateItems) {
        this.items = [...this.items, ...this.manipulateItems(data.results)]
      } else {
        this.items = [...this.items, ...data.results]
      }
      this.isUserGroupsLoading = false
    },
    callForSearchTargetGroups(search = '') {
      if (search) {
        searchTargetGroups(getSelectSearchPayload(this.axiosPayload, search))
          .then(this.setTargetGroups)
          .finally(() => {
            this.isUserGroupsLoading = false
          })
      } else {
        this.callForTargetGroups()
      }
    }
  }
}
</script>
