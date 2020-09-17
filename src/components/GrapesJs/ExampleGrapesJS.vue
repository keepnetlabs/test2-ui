<template>
  <div class="grapes-example" style="min-height: 80vh;">
    <app-modal
      :status="showModalGrapes"
      v-if="showModalGrapes"
      icon-name="mdi-check"
      title="Grapes JS On Modal"
    >
      <template v-slot:overlay-body>
        <GrapesNewsletterModal></GrapesNewsletterModal>
      </template>
      <template v-slot:overlay-footer>
        <v-btn class="new-integration__footer-btn-cancel" rounded @click="showModalGrapes = false">
          CANCEL
        </v-btn>
        <div class="new-integration__footer__right-col">
          <v-btn class="new-integration__footer-btn-save white--text" color="#2196f3" rounded>
            SAVE
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-modal
      :status="showWebPageGrapes"
      v-if="showWebPageGrapes"
      icon-name="mdi-check"
      title="Grapes JS On Modal"
    >
      <template v-slot:overlay-body>
        <GrapesWebPageModal></GrapesWebPageModal>
      </template>
      <template v-slot:overlay-footer>
        <v-btn
          type="button"
          class="new-integration__footer-btn-cancel"
          rounded
          @click="showWebPageGrapes = false"
        >
          CANCEL
        </v-btn>
        <div class="new-integration__footer__right-col">
          <v-btn
            class="new-integration__footer-btn-save white--text"
            color="#2196f3"
            rounded
            type="button"
          >
            SAVE
          </v-btn>
        </div>
      </template>
    </app-modal>
    <v-btn @click="showGrapesOnModal" class="mb-5 demo-button mr-2"
      >Show Newsletter Grapes On Modal</v-btn
    >
    <v-btn @click="showWebPageGrapesOnModal" class="mb-5 demo-button"
      >Show webPage Grapes On Modal</v-btn
    >
    <!--<Grapes></Grapes>-->
  </div>
</template>

<script>
import GrapesWebPageModal from './WebPage/GrapesWebPageModal'
import GrapesNewsletterModal from './Newsletter/GrapesNewsletterModal'
import AppModal from '../AppModal'

export default {
  name: 'ExampleGrapesJS',
  data() {
    return {
      showModalGrapes: false,
      showWebPageGrapes: false
    }
  },
  methods: {
    showGrapesOnModal() {
      this.showModalGrapes = true
    },
    showWebPageGrapesOnModal() {
      this.showWebPageGrapes = true
    }
  },
  components: { AppModal, GrapesNewsletterModal, GrapesWebPageModal }
}
</script>

<style lang="scss">
.grapes-example {
  padding: 20px;
}
.demo-button {
  background: white !important;
}
</style>
