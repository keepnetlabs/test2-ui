<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New SMS Configuration'"
    icon-name="mdi-domain"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <v-list-item class="pl-0 pr-0 mt-8">
        <v-list-item-content>
          <v-list-item-title class="new-smtp-setting__title">
            SMS Configuration
          </v-list-item-title>
          <v-list-item-subtitle class="new-smtp-setting__sub-title mb-6">
            Set new SMS Provider
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-form ref="refForm" lazy-validation>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Provider</label>
            <v-select
              placeholder="Enter Provider"
              outlined
              dense
              :items="providerItems"
              v-model="formValues.provider"
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Account SID</label>
            <v-text-field
              placeholder="Enter Account SID"
              outlined
              dense
              v-model="formValues.accountSid"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Authorization Token</label>
            <v-text-field
              placeholder="Enter authorization token"
              outlined
              dense
              v-model="formValues.authorizationToken"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Phone Number</label>
            <v-text-field
              placeholder="Enter number"
              outlined
              dense
              type="number"
              :rules="[
                (v) => validations.maxLength(v, 11, '10 characters'),
                (v) => validations.minLength(v, 9, '10 characters')
              ]"
              :value="phoneNumber"
            >
              <template v-slot:prepend-inner>
                <v-menu bottom offset-y min-width="133" max-height="250">
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="phishing-reporter__header-container-panel-right-col pl-0">
                      <div class="phone-number__text">
                        {{ selectedPhoneItem }}
                      </div>
                      <v-icon style="padding-left: 6px;">mdi-chevron-down</v-icon>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="handleListItemClick(item)"
                      :key="item"
                      v-for="item in listItems"
                    >
                      <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Status</label>
            <v-switch
              class="playbook-rule-form__switch mt-2"
              v-model="formValues.isActive"
              :label="formValues.isActive ? 'Active' : 'Inactive'"
              color="#2196f3"
            />
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="new-integration__footer-btn-cancel" @click="closeOverlay" rounded>
        CANCEL
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
        >
          SAVE
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import { maxLength, minLength } from '@/utils/validations'
export default {
  name: 'NewSmsSettings',
  components: {
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      providerItems: [],
      formValues: {
        provider: '',
        accountSid: '',
        authorizationToken: '',
        isActive: true,
        selectedPhoneItem: ''
      },
      listItems: [],
      validations: {
        maxLength,
        minLength
      },
      phoneNumber: ''
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {},
    handleListItemClick(item) {
      this.selectedPhoneItem = item
    }
  },
  created() {
    for (let i = 0; i < 100; i++) {
      this.listItems.push(`+${i}`)
    }
    this.selectedPhoneItem = '+90'
  },
  watch: {
    phoneNumber(newVal, oldVal) {
      this.phoneNumber = /"^[0-9]+$"/.test(newVal) ? newVal : oldVal
    }
  }
}
</script>

<style lang="scss">
.phone-number {
  &__text {
    font-size: 13px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72) !important;
  }
}
</style>
