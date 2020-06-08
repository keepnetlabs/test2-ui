<template>
  <div>
    <v-btn
      :class="[
        'btn-status',
        scope.row.detected === 'Pending' ? 'btn-pending' : '',
        scope.row.detected === 'Clean' ? 'btn-pending' : '',
        scope.row.detected === 'Active' ? 'btn-active' : '',
        scope.row.detected === 'Inactive' ? 'btn-inactive' : '',
        scope.row.detected === 'Warning' ? 'btn-warning' : '',
        scope.row.detected === 'Malicious' ? 'btn-warning' : '',
        scope.row.detected === 'Cancelled' ? 'btn-cancelled' : '',
        scope.row.detected === 'Phishing' ? 'btn-cancelled' : '',
        scope.row.detected === 'Idle' ? 'btn-cancelled' : '',
        scope.row.detected === 'None' ? 'btn-none' : '',
        scope.row.detected === 'Quedued' ? 'btn-none' : '',
        scope.row.detected === 'Running' ? 'btn-primary' : '',
        scope.row.detected === 'Expired' ? 'btn-warning' : '',
        scope.row.detected === 'Completed' ? 'btn-success' : '',
        scope.row.detected === 'Cancelled' ? 'btn-cancelled' : '',
        scope.row.detected === 'No Match' ? 'btn-no_match' : '',
        scope.row.detected === 'Finished' ? 'btn-success' : '',
        scope.row.detected === 'N/A' ? 'btn-none' : '',
        scope.row.detected === 'Offline' ? 'btn-warning' : '',
        scope.row.detected === 'Online' ? 'btn-success' : '',
        scope.row.detected === 'Disabled' ? 'btn-cancelled' : '',
        scope.row.detected === 'Network Error' ? 'btn-cancelled' : '',
        scope.row.detected === 'Deactivated' ? 'btn-no_match ' : '',
        scope.row.detected === 'User Unavailable' ? 'btn-no_match ' : '',
        scope.row.detected === 'Not Installed' ? 'btn-no_match ' : ''
      ]"
      block
      rounded
      v-if="scope.row && scope.row[col.property]"
      >{{ scope.row.detected }}
    </v-btn>
    <span v-else>-</span>
  </div>
</template>

<script>
export default {
  name: 'DataTableDetected',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  }
}
</script>

<style>
.btn-pending {
  background-color: #00bcd4 !important;
}

.btn-active {
  background-color: #2196f3 !important;
}

.btn-low {
  background-color: #00bcd4 !important;
}

.btn-very_low {
  background-color: #757575 !important;
}

.btn-high {
  background-color: #e6a23c !important;
}

.btn-very_high {
  background-color: #f56c6c !important;
}

.btn-add {
  width: 36px !important;
  height: 36px !important;
  border-radius: 18px !important;
  box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
  background-color: #2196f3;
  color: white !important;

  .v-icon {
    font-size: 18px !important;
  }
}

.btn-inactive {
  background-color: #f56c6c !important;
}

.btn-warning {
  background-color: #e6a23c !important;
}

.btn-cancelled,
.btn-offline {
  background-color: #f56c6c !important;
}

.btn-primary {
  background-color: #2196f3 !important;
}

.btn-none,
.btn-quedued,
.btn-online {
  background-color: #00bcd4 !important;
}

.btn-success {
  background-color: #43a047 !important;
}

.btn-no_match {
  background-color: #757575 !important;
}
</style>
