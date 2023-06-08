<template>
  <app-dialog
    :status="status"
    :title="labels.UnverifiedDomains"
    className="unverified-domains-modal"
    icon="mdi-cancel"
    iconClassName="unverified-domains-modal__icon"
    title-id="text--unverified-domains-modal-title"
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body>
      <div class="d-flex flex-column">
        <span v-for="domain in domains" :key="domain">
          {{ domain }}
        </span>
      </div>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn
          id="btn-close--unverified-domains-modal"
          class="users__button"
          text
          color="#2196F3"
          @click="closeOverlay"
          >{{ labels.OK }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
export default {
  name: 'UnverifiedDomainsModal',
  components: {
    AppDialog
  },
  props: {
    domains: {
      type: Array,
      default: () => []
    },
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    closeOverlay(status) {
      this.$emit('closeOverlay', status)
    }
  }
}
</script>
