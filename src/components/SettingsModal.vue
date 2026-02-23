<template>
  <app-dialog
    :status="showSettingsModalStatus"
    v-if="showSettingsModalStatus"
    icon="mdi-cog"
    :title="getTitle"
    size="big"
    @changeStatus="$emit('changeSettings')"
    :max-height-size="'500'"
    custom-size="650"
    :max-height="true"
  >
    <template v-slot:app-dialog-body>
      <div v-if="loadingSettingsModal">
        <PostCardLoading :loading="loadingSettingsModal" />
      </div>
      <div v-else>
        <v-card-text class="setting-modal">
          <div class="settings-modal-wrapper">
            <v-row align="center" justify="center">
              <v-col sm="12" class="p-0">
                <v-form ref="settingsRef">
                  <div class="mb-8">
                    <label
                      for="input--settings-modal-timezone"
                      class="settings-modal-wrapper__label d-block"
                      >Timezone</label
                    >
                    <label
                      class="settings-modal-wrapper__label--sub d-block mb-2"
                      for="input--settings-modal-timezone"
                      >Select your timezone</label
                    >
                    <k-select
                      type="autocomplete"
                      v-model.trim="formValues.timeZoneId"
                      :search-input.sync="timeZoneSearchVal"
                      id="input--settings-modal-timezone"
                      :items="timeZoneList"
                      persistent-hint
                      dense
                      item-text="displayName"
                      item-value="id"
                      outlined
                      placeholder="Select your timezone"
                    ></k-select>
                  </div>
                  <div class="mb-8">
                    <label
                      for="input--settings-modal-date-format"
                      class="settings-modal-wrapper__label d-block mb-2"
                      >Date Format</label
                    >
                    <v-radio-group
                      v-model="formValues.dateFormat"
                      id="input--settings-modal-date-format"
                      :mandatory="true"
                      hide-details
                    >
                      <v-radio
                        v-for="item in dateFormatList"
                        :key="item"
                        :id="`input--settings-modal-date-format-${item}`"
                        :value="item"
                        :label="`${item} ${moment(new Date()).format(item)}`"
                        color="#2196f3"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                  <div>
                    <label
                      for="input--settings-modal-time-format"
                      class="settings-modal-wrapper__label d-block mb-2"
                      >Time Format</label
                    >
                    <v-radio-group
                      v-model="formValues.timeFormat"
                      id="input--settings-modal-time-format"
                      :mandatory="true"
                      hide-details
                    >
                      <v-radio
                        v-for="item in timeFormatList"
                        :key="item"
                        :id="`input--settings-modal-time-format-${item}`"
                        :value="item"
                        :label="`${item} ${item === '12h' ? '06:25 PM' : '18:25'}`"
                        color="#2196f3"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </div>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" class="k-dialog__button" @click="$emit('changeSettings')">{{
            labels.Cancel
          }}</v-btn>
          <v-btn text color="#2196f3" class="k-dialog__button" @click="setSystemUserSettings()">{{
            labels.Confirm
          }}</v-btn>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
import PostCardLoading from '@/components/SkeletonLoading/PostCardLoading'
import { getSystemUserSettings, getTimezone, setSystemUserSettings } from '@/api/settings'
import KSelect from '@/components/Common/Inputs/KSelect'
import { deepCopyArray } from '@/utils/functions'
import moment from 'moment'

export default {
  name: 'SettingsModal',
  props: {
    showSettingsModalStatus: { required: true }
  },
  components: {
    PostCardLoading,
    KSelect,
    AppDialog
  },
  data() {
    return {
      moment,
      labels,
      loadingSettingsModal: false,
      formValues: {
        timeZoneId: null,
        dateFormat: null,
        timeFormat: null
      },
      dateFormatList: [],
      timeFormatList: [],
      timeZoneList: [],
      defaultTimeZoneList: [],
      timeZoneSearchVal: null
    }
  },
  created() {
    this.getTimezone()
  },
  computed: {
    getTitle() {
      return labels.Settings
    }
  },
  methods: {
    setSystemUserSettings() {
      setSystemUserSettings(this.formValues).then((response) => {
        localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
        localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
        setTimeout(() => {
          globalThis.location.reload()
        }, 250)
        this.$emit('changeSettings')
      })
    },
    getTimezone() {
      this.loadingSettingsModal = true
      getTimezone()
        .then((response) => {
          let data = response.data.data
          this.timeZoneList = data.timeZoneList
          this.defaultTimeZoneList = deepCopyArray(data.timeZoneList)
          this.dateFormatList = data.dateFormatList
          this.timeFormatList = data.timeFormatList
          this.getSystemUserSettings()
        })
        .catch(() => {
          this.loadingSettingsModal = false
        })
    },
    getSystemUserSettings() {
      getSystemUserSettings()
        .then((response) => {
          this.formValues = response.data.data
        })
        .finally(() => {
          this.loadingSettingsModal = false
        })
    }
  },
  watch: {
    timeZoneSearchVal(newVal, oldVal) {
      if (newVal && newVal.length && oldVal !== null) {
        this.timeZoneList = this.defaultTimeZoneList.reduce((acc, item) => {
          if (item.displayName.toLocaleLowerCase().includes(newVal.toLocaleLowerCase())) {
            acc.push(item)
          }
          return acc
        }, [])
      } else {
        this.timeZoneList = this.defaultTimeZoneList
      }
    }
  }
}
</script>
