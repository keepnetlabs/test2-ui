<template>
  <app-dialog
    :status="status"
    size="big"
    title="Filter By MD5 or SHA512 Hash"
    subtitle="Among reported emails with attachment "
    icon="mdi-filter-variant"
    ref="appDialog"
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body>
      <v-list-item class="mt-n8">
        <v-list-item-content>
          <v-radio-group v-model="filterProps.filterBy" id="input--filter-by" hide-details row>
            <v-radio
              value="MD5"
              id="input--filter-by-md5"
              label="Filter by MD5 Hash"
              color="#2196f3"
            ></v-radio>
            <v-radio
              value="SHA512"
              id="input--filter-by-sha512"
              label="Filter by SHA512 Hash"
              color="#2196f3"
            ></v-radio>
          </v-radio-group>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <InputEntityName
            v-model.trim="filterProps.hash"
            :key="componentKey"
            id="input--hash"
            entityName="hash"
            :initialPlaceholder="getPlaceholder"
            :hint="getHint"
          />
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="new-user-group__footer">
        <v-btn class="new-user-group__button" color="#f56c6c" text @click="closeOverlay"
          >CANCEL</v-btn
        >
        <v-btn class="new-user-group__button" @click="handleFilter" color="#2196f3" text
          >FILTER</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { maxLength, required } from '@/utils/validations'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'

export default {
  name: 'FilterByHashModal',
  components: {
    AppDialog,
    InputEntityName
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    filterProps: {
      type: Object,
      default: () => ({ filterBy: 'MD5', hash: '' })
    }
  },
  data() {
    return {
      componentKey: Math.random(),
      validations: {
        required,
        maxLength
      }
    }
  },
  watch: {
    status(val) {
      this.componentKey = Math.random()
    },
    'filterProps.filterBy'(val) {
      this.componentKey = Math.random()
      this.$emit('input', { hash: '', filterBy: val })
    }
  },
  computed: {
    getPlaceholder() {
      if (this.filterProps.filterBy === 'MD5') {
        return `MD5 Hash`
      }
      return `SHA512 Hash`
    },
    getHint() {
      if (this.filterProps.filterBy === 'MD5') {
        return `Must match 32 digits HEX characters`
      }
      return `Must match 128 digits HEX characters`
    }
  },
  methods: {
    handleFilter() {
      if (this.$refs.appDialog.$refs.refDialogForm.validate()) {
        this.$emit('confirm')
      }
    },
    closeOverlay() {
      this.$emit('close')
    }
  }
}
</script>
