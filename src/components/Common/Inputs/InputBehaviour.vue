<template>
  <FormGroup :title="labels.Behaviour">
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
      placeholder="Select compliance"
      :items="getBehaviours"
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
  name: 'InputBehaviour',
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
      getBehaviours: 'trainingLibraryHelpers/getBehaviours'
    })
  }
}
</script>
