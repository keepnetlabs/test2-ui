<template>
  <AppDialog
    type="delete"
    :status="status"
    icon="mdi-alert"
    title="Can not save the learning path"
    subtitle="“Make available for” settings do not match"
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body>
      “Make available for” setting of the learning path doesn’t match with the settings of materials
      in it. This would cause permission error in some of the materials.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#F56C6C" @click="closeOverlay">{{
          labels.OK
        }}</v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
export default {
  name: 'TrainingLibraryNewLearningPathCannotSaveModal',
  components: {
    AppDialog
  },
  props: {
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
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  }
}
</script>
