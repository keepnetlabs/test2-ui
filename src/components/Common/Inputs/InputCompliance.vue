<template>
  <FormGroup :title="labels.Compliance">
    <KSelect
      :value="value"
      dense
      outlined
      multiple
      persistent-hint
      small-chips
      deletable-chips
      autocomplete="off"
      item-text="text"
      item-value="value"
      class="training-library__badge-select"
      placeholder="Select compliance"
      :items="getCompliances"
      @input="$emit('input', $event)"
    ></KSelect>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { mapGetters } from 'vuex'
import labels from '@/model/constants/labels'

export default {
  name: 'InputCompliance',
  components: { KSelect, FormGroup },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    ...mapGetters({
      getCompliances: 'trainingLibraryHelpers/getCompliances'
    })
  }
}
</script>
