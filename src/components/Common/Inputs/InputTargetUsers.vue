<template>
  <KSelect
    v-bind="$attrs"
    v-infinite-scroll="{
      target: '#input--target-user-specific-users .k-select__menu',
      callback: callForTargetUsers
    }"
    v-select-search-handler="{
      callback: callForSearchTargetUsers,
      isLoadingKey: 'isTargetUsersLoading'
    }"
    :value="value"
    key="users"
    type="autocomplete"
    id="input--target-user-specific-users"
    outlined
    placeholder="Select target users"
    autocomplete="off"
    :items="items"
    :rules="rules"
    :no-data-text="isTargetUsersLoading ? 'Loading...' : 'No specific user available'"
    @change="handleInputChange"
  />
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import { getDefaultAxiosPayload, getSelectSearchPayload } from '@/utils/functions'
import { getTargetUsers } from '@/api/targetUsers'

export default {
  name: 'InputTargetUsers',
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
      default: 'Select target users'
    }
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  data() {
    return {
      isTargetUsersLoading: true,
      axiosPayload: getDefaultAxiosPayload(),
      totalNumberOfPagesOfTargetUsers: 1,
      items: this.defaultItems || []
    }
  },
  created() {
    this.callForTargetUsers()
  },
  methods: {
    handleInputChange(v) {
      this.$emit('input', v)
    },
    callForTargetUsers(addPage) {
      if (addPage) {
        this.axiosPayload.pageNumber += 1
        if (this.axiosPayload.pageNumber > this.totalNumberOfPagesOfTargetUsers) return
      }
      getTargetUsers(this.axiosPayload).then((response) => {
        this.setTargetUsers(response)
        this.totalNumberOfPagesOfTargetUsers = response.data.data.totalNumberOfPages
      })
    },
    callForSearchTargetUsers(search = '') {
      if (search) {
        getTargetUsers(getSelectSearchPayload(this.axiosPayload, search, 'Email')).then(
          this.setTargetUsers
        )
      } else {
        this.callForTargetUsers()
      }
    },
    setTargetUsers(response) {
      const { data: { data = {} } = [] } = response
      const newItems = data.results
        .map((item) => {
          if (this.value.includes(item.email)) return undefined
          return {
            email: item.email
          }
        })
        .filter(Boolean)
      if (this.manipulateItems) {
        this.items = [...this.items, ...this.manipulateItems(data.results)]
      } else {
        this.items = [...this.items, ...newItems]
      }
      this.isTargetUsersLoading = false
    }
  }
}
</script>
