<template>
  <div class="workshop">
    <v-layout wrap class="workshop__container">
      <v-card class="workshop__container-card">
        <v-select
          v-model="value"
          :items="items"
          multiple
          :return-object="true"
          outlined
          placeholder="Select an option"
          class="tlp-select"
        >
          <template v-slot:selection="{ attrs, item, select }">
            <v-chip
              @click="select"
              :close="true"
              :class="item.cssClass"
              @click:close="removeTLP(item)"
            >
              <span>{{ item.text }}</span>
            </v-chip>
          </template>

          <template v-slot:item="{ item, attrs }">
            <v-list-item-action>
              <v-checkbox :input-value="attrs.inputValue" color="primary"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.desc }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar>
              <div
                :style="{
                  backgroundColor: item.color,
                  width: '16px',
                  height: '16px',
                  border: '1px solid #000'
                }"
              ></div>
            </v-list-item-avatar>
          </template>
        </v-select>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'Workshop',
  props: {},
  components: {},
  data() {
    return {
      value: [
        {
          text: 'TLP: GREEN',
          value: 'TLP: GREEN',
          color: '#2cde00',
          cssClass: 'tlp-select__chip--green',
          desc: 'Limited disclosure, restricted to the community.'
        }
      ],
      items: [
        {
          text: 'TLP: GREEN',
          value: 'TLP: GREEN',
          color: '#2cde00',
          cssClass: 'tlp-select__chip--green',
          desc: 'Limited disclosure, restricted to the community.'
        },
        {
          text: 'TLP: AMBER',
          value: 'TLP: AMBER',
          color: '#ffc000',
          cssClass: 'tlp-select__chip--amber',
          desc: 'Limited disclosure, restricted to participants’ organizations.'
        },
        {
          text: 'TLP: RED',
          value: 'TLP: RED',
          color: '#ff0033',
          cssClass: 'tlp-select__chip--red',
          desc: 'Not for disclosure, restricted to participants only.'
        },
        {
          text: 'TLP: WHITE',
          value: 'TLP: WHITE',
          color: '#ffffff',
          cssClass: 'tlp-select__chip--white',
          desc: 'Disclosure is not limited.'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    test(a, b) {
      this.$nextTick(() => {
        console.log('on', a)
        console.log('attr', b)
      })
    },
    removeTLP(item) {
      this.value.splice(this.value.indexOf(item), 1)
      this.value = [...this.value]
    },
    addTLP(item) {
      const val = this.value
      this.value.push(item)
    }
  }
}
</script>

<style lang="scss">
.tlp-select {
  &__chip {
    &--green {
      background-color: #43a047 !important;
      color: #fff !important;
      .v-icon {
        color: #fff !important;
      }
    }
    &--amber {
      background-color: #e6a23c !important;
      color: #fff !important;
      .v-icon {
        color: #fff !important;
      }
    }
    &--red {
      background-color: #f56c6c !important;
      color: #fff !important;
      .v-icon {
        color: #fff !important;
      }
    }
    &--white {
      color: #000 !important;
      background-color: #fff !important;
      border: 1px solid #000;
      .v-icon {
        color: #6d6d6d !important;
      }
    }
  }
}
.workshop {
  min-height: 80vh !important;
  padding-top: 10px;
  &__container {
    padding: 0 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
