<template>
  <AppDialog
    :icon="dialogIcon"
    :title="dialogTitle"
    size="big"
    :status="status"
    @changeStatus="$emit('close')"
  >
    <template #app-dialog-body>
      <div class="text-primary-color">
        <div v-if="!isAuthorized" class="mb-4">
          If you're a Microsoft 365 admin, click
          <span class="fw-600">Authorize Now</span>
          to grant delegated access immediately.
        </div>
        <div v-if="!isAuthorized">
          If you're not an admin, click
          <span class="fw-600">Copy Link</span>
          to share the authorization request with someone who has the necessary permissions.
        </div>
        <div v-if="isAuthorized">
          This will remove user-level access granted to the application. Outlook reporting from
          Ribbon and Page View will be disabled until re-authorized.
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex justify-space-between">
        <VBtn
          text
          :color="isAuthorized ? '#383B41' : 'error'"
          class="mr-2 fw-600"
          @click="$emit('cancel')"
        >
          CANCEL
        </VBtn>
        <div>
          <VBtn
            v-if="!isAuthorized"
            text
            color="#00BCD4"
            class="mr-2 fw-600"
            :disabled="isAuthorizing"
            @click="$emit('copy-link')"
          >
            COPY LINK
          </VBtn>
          <VBtn
            :color="isAuthorized ? '#FF5722' : '#2196F3'"
            text
            class="fw-600"
            :disabled="isAuthorizing"
            @click="$emit(isAuthorized ? 'revoke-authorization' : 'authorize-now')"
          >
            {{ isAuthorized ? 'REVOKE AUTHORIZATION' : 'AUTHORIZE NOW' }}
          </VBtn>
        </div>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'

export default {
  name: 'DelegatedLevelAuthorizationDialog',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isAuthorizing: {
      type: Boolean,
      default: false
    },
    isAuthorized: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogIcon() {
      return this.isAuthorized ? 'mdi-close-circle' : 'mdi-shield-check'
    },
    dialogTitle() {
      return this.isAuthorized
        ? 'Revoke Delegated Access Authorization?'
        : 'Authorize Delegated Access'
    }
  }
}
</script>
