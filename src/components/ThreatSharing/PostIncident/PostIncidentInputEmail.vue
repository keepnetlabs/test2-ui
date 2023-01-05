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
    :search-input.sync="searchIncident"
    :items="listData"
    :loading="isFindIncidentLoading"
    :hide-no-data="isFindIncidentLoading"
    :slots="{ selection: true, item: true, progress: true }"
    @focus="handleFocus"
    @change="handleChange"
  >
    <template v-slot:selection="{ attrs, item }">
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
      searchIncident: '',
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
  watch: {
    searchIncident(val) {
      val !== this.select && this.querySelections(val)
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
          if (this.searchIncident) {
            this.backupListData = JSON.parse(JSON.stringify(data.data.results))
            this.$nextTick(() => {
              this.listData = this.backupListData.reduce((acc, item) => {
                Object.values(item).find((i) => {
                  if (
                    typeof i === 'string' &&
                    i.toLocaleLowerCase().includes(this.searchIncident.toLocaleLowerCase())
                  )
                    return acc.push(item)
                })
                return acc
              }, [])
            })
          } else {
            this.listData = data.data.results
            this.backupListData = JSON.parse(JSON.stringify(data.data.results))
          }
        })
        .finally(() => {
          this.isFindIncidentLoading = false
          this.showLoader = false
        })
    },
    querySelections(val) {
      if (!val) {
        this.listData = this.backupListData
      } else {
        if (this.listData && this.backupListData) {
          this.listData = this.backupListData.reduce((acc, item) => {
            Object.values(item).find((i) => {
              if (typeof i === 'string' && i.toLocaleLowerCase().includes(val.toLocaleLowerCase()))
                return acc.push(item)
            })
            return acc
          }, [])
        }
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
