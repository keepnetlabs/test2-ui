<template>
  <div class="grapes-example">
    <app-modal
      :status="showModalGrapes"
      v-if="showModalGrapes"
      icon-name="mdi-check"
      title="Grapes JS On Modal"
    >
      <template v-slot:overlay-body>
        <GrapesModal></GrapesModal>
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
    <v-btn @click="showGrapesOnModal" class="mb-5 demo-button">Show Grapes On Modal</v-btn>
    <Grapes></Grapes>
  </div>
</template>

<script>
import Grapes from '../../components/GrapesJs/Grapes'
import GrapesModal from '../../components/GrapesJs/GrapesModal'
import AppModal from '../AppModal'

export default {
  name: 'ExampleGrapesJS',
  data() {
    return {
      showModalGrapes: false
    }
  },
  methods: {
    showGrapesOnModal() {
      this.showModalGrapes = true
    }
  },
  components: { Grapes, AppModal, GrapesModal }
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
