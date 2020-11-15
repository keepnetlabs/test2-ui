<template>
  <div class="company-list-extend" :style="{ top: setPosition() + 'px' }">
    <div class="company-list-extend__header">
      <div class="company-list-extend__header-title">
        {{ selectedRow.companyName }}
      </div>
      <div class="company-list-extend__header-icon">
        <v-btn icon small text @click="$emit('editAction', selectedRow)">
          <v-icon size="24">mdi-pencil</v-icon>
        </v-btn>
      </div>
      <div class="company-list-extend__header-icon">
        <v-btn icon small text @click="$emit('close')">
          <v-icon size="24">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="company-list-extend__body">
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Company Name</div>
        <div class="company-list-extend__body-value">{{ selectedRow.companyName }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Industry</div>
        <div class="company-list-extend__body-value">{{ selectedRow.industryName }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Total Users</div>
        <div class="company-list-extend__body-value">{{ selectedRow.numberOfUsers }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Address</div>
        <div class="company-list-extend__body-value">{{ selectedExtend.address }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Website</div>
        <div class="company-list-extend__body-value">
          <a :href="selectedExtend.websiteUrl" target="_blank">{{ selectedExtend.websiteUrl }}</a>
        </div>
      </div>
      <div class="company-list-extend__body-item d-flex align-center">
        <div class="company-list-extend__body-key">Company Groups</div>
        <div class="company-list-extend__body-value">
          <template v-if="!!selectedExtend && !!selectedExtend.companyGroups && groupCount > 0">
            <span
              v-for="(group, index) of selectedExtend.companyGroups.slice(0, limiter)"
              :key="group.name"
            >
              {{ group.name
              }}<span v-if="index + 1 < selectedExtend.companyGroups.slice(0, limiter).length"
                >,
              </span>
            </span>
            <a
              v-if="groupCount > 3 && groupCount > limiter"
              @click="
                () => {
                  this.limiter = this.groupCount
                }
              "
            >
              +{{ groupCount - limiter }} See more &#62;</a
            >
            <a
              v-if="groupCount > 3 && groupCount === limiter"
              @click="
                () => {
                  this.limiter = 3
                }
              "
              >&nbsp; &#60; See less</a
            >
          </template>
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Country</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.countryName }}
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Courses</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.trainingContentTypeName }}
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Notif. Templates</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.notificationTemplateTypeName }}
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Smtp Settings</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.smtpConfigurationTypeName }}
        </div>
      </div>
      <!-- <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key d-flex align-center">Phishing</div>
        <div class="company-list-extend__body-value" style="width: 44px; margin-top: -4px;">
          <pie :data="series" :chart-options="chartOptions" />
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key d-flex align-center">Training</div>
        <div class="company-list-extend__body-value" style="width: 44px; margin-top: -4px;">
          <pie :data="series" :chart-options="chartOptions" />
        </div>
      </div> -->
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key d-flex align-center">Status</div>
        <div class="company-list-extend__body-value">
          <v-btn
            v-if="selectedExtend.statusId == '0' || selectedExtend.statusId == '1'"
            :dark="selectedExtend.statusId == 0 ? false : true"
            :disabled="selectedExtend.statusId == 0 ? true : false"
            color="#2196f3"
            height="24"
            depressed
            small
            :ripple="false"
          >
            {{ selectedExtend.statusName }}
          </v-btn>
        </div>
      </div>
    </div>
    <div class="company-list-extend__footer">
      <div class="company-list-extend__footer-item">
        <div class="company-list-extend__footer-key">Licence Type</div>
        <div class="company-list-extend__footer-value">{{ selectedRow.licenseTypeName }}</div>
      </div>
      <div class="company-list-extend__footer-item">
        <div class="company-list-extend__footer-key">Licence Expires on</div>
        <div class="company-list-extend__footer-value">{{ selectedRow.licenseEndDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'CompanyListExtend',
  components: {
    //Pie
  },
  props: {
    selectedRow: {
      type: Object
    },
    selectedExtend: {
      type: Object
    },
    cssStyle: {
      type: Object
    },
    top: {
      type: Number,
      default: 0
    },
    tableHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      limiter: 3,
      groupCount: 0,
      series: [2, 2, 2, 8],
      chartOptions: {
        backgroundColor: ['#ffcc33', '#409eff', '#f56c6c', '#67c23a']
      }
    }
  },
  methods: {
    setPosition() {
      let p = this.top
      let e = 0
      let t = this.tableHeight

      if (this.$el !== undefined) {
        e = this.$el.clientHeight
        p = t > e ? (p = t > e + p ? p : t - e) : 0
      }
      return p
    }
  },

  updated() {
    this.setPosition()
  },
  watch: {
    selectedExtend() {
      if (!!this.selectedExtend && !!this.selectedExtend.companyGroups) {
        this.groupCount = this.selectedExtend.companyGroups.length
      }
    }
  }
}
</script>

<style lang="scss">
.company-list-extend {
  top: 0;
  position: absolute;
  right: 0;
  overflow: hidden;
  z-index: 5;
  width: 360px;
  min-height: 300px;
  border-radius: 12px;
  box-shadow: 0 1px 1px -1px rgba(204, 204, 204, 0.12), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
    0 1px 3px 0 rgba(142, 142, 142, 0.2);
  border: solid 1px #2196f3;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);

  &__header {
    padding: 16px;
    display: flex;
    align-items: center;
    &-title {
      line-height: 24px;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: normal;
      flex-grow: 1;
    }
    &-icon {
      width: auto;
      padding: 0 10px;
      &:nth-child(2) {
        padding-left: 0;
      }
      &:nth-child(3) {
        padding-right: 0;
      }
    }
  }
  &__body {
    padding: 8px 16px 16px 16px;
    &-item {
      display: flex;
      margin-bottom: 4px;
    }
    &-key {
      min-width: 105px;
      line-height: 17px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 4px;
    }
    &-value {
      line-height: 19px;
      font-size: 12px;
      width: 100%;
    }
  }
  &__footer {
    padding: 16px;
    background-color: #f1f8fe;
    display: flex;
    &-item {
      margin-right: 48px;
    }
    &-key {
      line-height: 17px;
      font-size: 12px;
      font-weight: 600;
    }
    &-value {
      line-height: 19px;
      font-size: 12px;
    }
  }
}
</style>
