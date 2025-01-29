<template>
  <div class="gamification-report-performance-details-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ textAlign: column.align || 'left', maxWidth: column.maxWidth || 'auto' }"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td
            v-for="column in columns"
            :key="column.key"
            :class="`gamification-report-performance-details-table-column--${column.type}`"
            :style="{ textAlign: column.align || 'left' }"
          >
            <span
              v-if="column.type === 'text' || column.type === 'number'"
              :style="{ textAlign: column.align || 'left', maxWidth: column.maxWidth || 'auto' }"
            >
              {{ row[column.key] }}
            </span>
            <Badge
              v-else-if="column.type === 'badge'"
              :color="getBtnStatusColor(row[column.key])"
              :col="column"
              :text="getDataTableFieldLabel(row[column.key])"
            />
            <a
              v-else-if="column.type === 'link'"
              :href="row[column.key]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ row[column.key] }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Badge from '../../Badge.vue'
import { getBtnStatusColor, getDataTableFieldLabel } from '../../../utils/functions'

export default {
  name: 'GamificationReportPerformanceDetailsTable',
  components: { Badge },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    }
  }
}
</script>
