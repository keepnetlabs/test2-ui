<template>
  <KSelect
    v-model="model"
    type="autocomplete"
    id="threat-sharing-select-incident-autocomplete"
    clearable
    dense
    outlined
    autocomplete="off"
    placeholder="Search for incident"
    style="max-width: 554px;"
    :items="listData"
    :loading="isFindIncidentLoading"
    :hide-no-data="isFindIncidentLoading"
    :slots="{ selection: true, item: true, progress: true }"
    :filter="querySelections"
    @focus="handleFocus"
    @change="handleChange"
  >
    <template #selection="{ attrs, item }">
      <v-chip
        id="select-inc-chip"
        v-bind="attrs"
        color="#2196f3"
        :input-value="item.subject"
        label
        small
      >
        <span class="pr-2">{{ item.subject }}</span>
      </v-chip>
    </template>
    <template #item="{ item }">
      <div class="select-row-wrap">
        <div class="email-name">{{ item.subject }}</div>
        <div class="select-row-inline">
          <div class="file-type-wrap">
            <v-icon
              :style="{
                visibility: item.attachmentCount !== 0 ? 'visible' : 'hidden'
              }"
              class="email-icon"
              >mdi-paperclip
            </v-icon>
            <div
              class="email-type"
              :class="{
                'btn-pending': item.result === 'BeingAnalyzed',
                'btn-malicious': item.result === 'Malicious',
                'btn-active': item.result === 'non-malicious',
                'btn-phishing': item.result === 'Phishing',
                'btn-undetected': item.result === 'Undetected',
                'btn-simulation': item.result === 'Simulation',
                'btn-error': item.result === 'Error'
              }"
            >
              <span>{{ item.result }}</span>
            </div>
          </div>
          <div id="email-time" class="email-time">
            {{ item.createTime }}
          </div>
        </div>
      </div>
    </template>
    <template #progress>
      <KSelectLoading v-show="showLoader" />
    </template>
  </KSelect>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import KSelectLoading from '@/components/KSelectLoading'
import { searchNotifiedMail } from '@/api/threatSharing'
export default {
  name: 'PostIncidentInputEmail',
  components: { KSelectLoading, KSelect },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      listData: [],
      backupListData: [],
      isFindIncidentLoading: true,
      showLoader: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      const payload = {
        pageNumber: 1,
        pageSize: 500000,
        orderBy: 'createTime',
        ascending: false,
        clusteredBy: ''
      }
      searchNotifiedMail(payload)
        .then((response) => {
          const { data } = response
          this.listData = data.data.results
          this.backupListData = structuredClone(data.data.results)
        })
        .finally(() => {
          this.isFindIncidentLoading = false
          this.showLoader = false
        })
    },
    querySelections(item, queryText) {
      if (!queryText) {
        return true
      } else {
        for (const keyValue of Object.values(item)) {
          if (
            typeof keyValue === 'string' &&
            keyValue.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          ) {
            return true
          }
        }
        return false
      }
    },
    handleFocus() {
      this.showLoader = this.isFindIncidentLoading
    },
    handleChange(value) {
      this.$emit('on-change', value)
    }
  }
}
</script>
