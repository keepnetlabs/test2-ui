<template>
  <FormGroup :title="labels.Behaviour">
    <KSelect
      :value="value"
      class="training-library-input-behaviour"
      dense
      outlined
      multiple
      persistent-hint
      small-chips
      deletable-chips
      autocomplete="off"
      item-text="text"
      item-value="value"
      placeholder="Select behaviour"
      :items="getBehaviours"
      :slots="{ item: true, selection: true }"
      @input="$emit('input', $event)"
    >
      <template #item="{ item,parent,attrs,on }">
        <VListItem>
          <VListItemAction>
            <VSimpleCheckbox v-on="{ click: on.click }" :value="attrs.inputValue" color="#2196f3" />
          </VListItemAction>
          <VTooltip right content-class="training-library-input-behaviour__tooltip">
            <template #activator="{ on: tooltip }">
              <VListItemTitle
                v-on="{ ...tooltip, click: on.click }"
                class="training-library-input-behaviour__activator cursor-pointer"
                >{{ item.text }}</VListItemTitle
              >
            </template>
            <span>{{ item.text }}</span>
          </VTooltip>
        </VListItem>
      </template>
      <template #selection="data">
        <VTooltip
          :key="JSON.stringify(data.item)"
          bottom
          content-class="training-library-input-behaviour__tooltip"
        >
          <template #activator="{ on: tooltip }">
            <v-chip
              v-on="tooltip"
              v-bind="data.attrs"
              close
              small
              :key="JSON.stringify(data.item)"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item)"
            >
              <span>{{ data.item.text }}</span>
            </v-chip>
          </template>
          <span>{{ data.item.text }}</span>
        </VTooltip>
      </template>
    </KSelect>
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
