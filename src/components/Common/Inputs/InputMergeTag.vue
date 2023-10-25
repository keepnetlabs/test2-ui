<template>
  <div :class="['input-merge-tag', isTextToSpeech && 'text-to-speech']">
    <div v-if="mergeTags.length" class="input-merge-tag__tags">
      <v-btn
        v-for="mergeTag in getRowMergeTags"
        :key="mergeTag.value"
        class="input-merge-tag__tag ma-1"
        elevation="0"
        small
        @click="handleMergeTagClick(mergeTag.value)"
      >
        {{ mergeTag.text }}
      </v-btn>
      <v-menu v-if="hasOverflowItems" :offset-x="true" bottom right>
        <template v-slot:activator="{ on: menu }">
          <v-btn v-on="menu" rounded icon class="ml-4" style="background-color: #2196f3;">
            <v-icon color="#ffffff" medium>mdi-tag-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="mergeTag in getOverflowItems"
            :key="mergeTag.value"
            :id="mergeTag.value"
            @click="handleMergeTagClick(mergeTag.value)"
          >
            <v-list-item-title>{{ mergeTag.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-textarea
      v-bind="requiredProps"
      ref="refInput"
      class="rounded-t-0"
      :value="value"
      :row="3"
      outlined
      dense
      no-resize
      autocomplete="disabled"
      :height="height"
      :rows="rows"
      :disabled="disabled"
      :placeholder="placeholder"
      :rules="rules"
      :readonly="readonly"
      :hint="hint"
      @input="$emit('input', $event)"
    >
      <template #prepend-inner>
        <div class="input-merge-tag__inner">
          <div v-if="isTextToSpeech" class="input-merge-tag__badges-and-button">
            <div class="input-merge-tag__badges">
              <div v-if="language" class="input-merge-tag__badge">
                <v-icon class="mr-1" color="#757575" size="large">mdi-web</v-icon>{{ language }}
              </div>
              <div v-if="voice" class="input-merge-tag__badge">
                <v-icon class="mr-1" color="#757575" size="large">mdi-microphone-outline</v-icon
                >{{ voice }}
              </div>
            </div>
            <v-btn
              rounded
              color="#2196f3"
              :id="'input-merge-tag__play-text-to-speech-button'"
              :class="[
                'add-step-button',
                'button-new',
                isPlayTextDisabled ? 'add-step-button--disabled' : ''
              ]"
              :disabled="isPlayTextDisabled"
              @click="handlePlayTextToSpeech"
            >
              <v-icon color="#ffffff" style="font-size: 20px; margin-top: 1px;">mdi-play</v-icon>
              <span class="add-step-button__text" style="text-transform: none;">Play the Text</span>
            </v-btn>
          </div>
          <div v-if="audioSrc && isPlayTextClicked" class="input-merge-tag__audio-container">
            <AudioPlayer class="input-merge-tag__audio-player" :src="audioSrc" />
          </div>
        </div>
      </template>
    </v-textarea>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { playTextToSpeech } from '@/api/vishing'
import AudioPlayer from '@/components/AudioPlayer'
export default {
  name: 'InputMergeTag',
  components: {
    AudioPlayer
  },
  props: {
    value: {
      type: String
    },
    id: {
      type: String
    },
    initialPlaceholder: {
      type: String,
      default: ''
    },
    initialRules: {
      type: Array
    },
    entityName: {
      type: String,
      default: labels.Description
    },
    required: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 2000
    },
    disabled: {
      default: false
    },
    readonly: {
      default: false
    },
    applyRules: {
      default: true
    },
    height: {
      type: String
    },
    rows: {
      type: String
    },
    hint: {
      type: String
    },
    mergeTags: {
      type: Array,
      required: true
    },
    isTextToSpeech: {
      type: Boolean,
      default: false
    },
    language: {
      type: String
    },
    voice: {
      type: String
    }
  },
  data() {
    return {
      isPlayTextClicked: false,
      audioSrc:
        'data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0Ya4LAACAgICAgICAgICAgICAgICAgICAgICAgICAf3hxeH+AfXZ1eHx6dnR5fYGFgoOKi42aloubq6GOjI2Op7ythXJ0eYF5aV1AOFFib32HmZSHhpCalIiYi4SRkZaLfnhxaWptb21qaWBea2BRYmZTVmFgWFNXVVVhaGdbYGhZbXh1gXZ1goeIlot1k6yxtKaOkaWhq7KonKCZoaCjoKWuqqmurK6ztrO7tbTAvru/vb68vbW6vLGqsLOfm5yal5KKhoyBeHt2dXBnbmljVlJWUEBBPDw9Mi4zKRwhIBYaGRQcHBURGB0XFxwhGxocJSstMjg6PTc6PUxVV1lWV2JqaXN0coCHhIyPjpOenqWppK6xu72yxMu9us7Pw83Wy9nY29ve6OPr6uvs6ezu6ejk6erm3uPj3dbT1sjBzdDFuMHAt7m1r7W6qaCupJOTkpWPgHqAd3JrbGlnY1peX1hTUk9PTFRKR0RFQkRBRUVEQkdBPjs9Pzo6NT04Njs+PTxAPzo/Ojk6PEA5PUJAQD04PkRCREZLUk1KT1BRUVdXU1VRV1tZV1xgXltcXF9hXl9eY2VmZmlna3J0b3F3eHyBfX+JgIWJiouTlZCTmpybnqSgnqyrqrO3srK2uL2/u7jAwMLFxsfEv8XLzcrIy83JzcrP0s3M0dTP0drY1dPR1dzc19za19XX2dnU1NjU0dXPzdHQy8rMysfGxMLBvLu3ta+sraeioJ2YlI+MioeFfX55cnJsaWVjXVlbVE5RTktHRUVAPDw3NC8uLyknKSIiJiUdHiEeGx4eHRwZHB8cHiAfHh8eHSEhISMoJyMnKisrLCszNy8yOTg9QEJFRUVITVFOTlJVWltaXmNfX2ZqZ21xb3R3eHqAhoeJkZKTlZmhpJ6kqKeur6yxtLW1trW4t6+us7axrbK2tLa6ury7u7u9u7vCwb+/vr7Ev7y9v8G8vby6vru4uLq+tri8ubi5t7W4uLW5uLKxs7G0tLGwt7Wvs7avr7O0tLW4trS4uLO1trW1trm1tLm0r7Kyr66wramsqaKlp52bmpeWl5KQkImEhIB8fXh3eHJrbW5mYGNcWFhUUE1LRENDQUI9ODcxLy8vMCsqLCgoKCgpKScoKCYoKygpKyssLi0sLi0uMDIwMTIuLzQ0Njg4Njc8ODlBQ0A/RUdGSU5RUVFUV1pdXWFjZGdpbG1vcXJ2eXh6fICAgIWIio2OkJGSlJWanJqbnZ2cn6Kkp6enq62srbCysrO1uLy4uL+/vL7CwMHAvb/Cvbq9vLm5uba2t7Sysq+urqyqqaalpqShoJ+enZuamZqXlZWTkpGSkpCNjpCMioqLioiHhoeGhYSGg4GDhoKDg4GBg4GBgoGBgoOChISChISChIWDg4WEgoSEgYODgYGCgYGAgICAgX99f398fX18e3p6e3t7enp7fHx4e3x6e3x7fHx9fX59fn1+fX19fH19fnx9fn19fX18fHx7fHx6fH18fXx8fHx7fH1+fXx+f319fn19fn1+gH9+f4B/fn+AgICAgH+AgICAgIGAgICAgH9+f4B+f35+fn58e3t8e3p5eXh4d3Z1dHRzcXBvb21sbmxqaWhlZmVjYmFfX2BfXV1cXFxaWVlaWVlYV1hYV1hYWVhZWFlaWllbXFpbXV5fX15fYWJhYmNiYWJhYWJjZGVmZ2hqbG1ub3Fxc3V3dnd6e3t8e3x+f3+AgICAgoGBgoKDhISFh4aHiYqKi4uMjYyOj4+QkZKUlZWXmJmbm52enqCioqSlpqeoqaqrrK2ur7CxsrGys7O0tbW2tba3t7i3uLe4t7a3t7i3tre2tba1tLSzsrKysbCvrq2sq6qop6alo6OioJ+dnJqZmJeWlJKSkI+OjoyLioiIh4WEg4GBgH9+fXt6eXh3d3V0c3JxcG9ubWxsamppaWhnZmVlZGRjYmNiYWBhYGBfYF9fXl5fXl1dXVxdXF1dXF1cXF1cXF1dXV5dXV5fXl9eX19gYGFgYWJhYmFiY2NiY2RjZGNkZWRlZGVmZmVmZmVmZ2dmZ2hnaGhnaGloZ2hpaWhpamlqaWpqa2pra2xtbGxtbm1ubm5vcG9wcXBxcnFycnN0c3N0dXV2d3d4eHh5ent6e3x9fn5/f4CAgIGCg4SEhYaGh4iIiYqLi4uMjY2Oj5CQkZGSk5OUlJWWlpeYl5iZmZqbm5ybnJ2cnZ6en56fn6ChoKChoqGio6KjpKOko6SjpKWkpaSkpKSlpKWkpaSlpKSlpKOkpKOko6KioaKhoaCfoJ+enp2dnJybmpmZmJeXlpWUk5STkZGQj4+OjYyLioqJh4eGhYSEgoKBgIB/fn59fHt7enl5eHd3dnZ1dHRzc3JycXBxcG9vbm5tbWxrbGxraWppaWhpaGdnZ2dmZ2ZlZmVmZWRlZGVkY2RjZGNkZGRkZGRkZGRkZGRjZGRkY2RjZGNkZWRlZGVmZWZmZ2ZnZ2doaWhpaWpra2xsbW5tbm9ub29wcXFycnNzdHV1dXZ2d3d4eXl6enp7fHx9fX5+f4CAgIGAgYGCgoOEhISFhoWGhoeIh4iJiImKiYqLiouLjI2MjI2OjY6Pj46PkI+QkZCRkJGQkZGSkZKRkpGSkZGRkZKRkpKRkpGSkZKRkpGSkZKRkpGSkZCRkZCRkI+Qj5CPkI+Pjo+OjY6Njo2MjYyLjIuMi4qLioqJiomJiImIh4iHh4aHhoaFhoWFhIWEg4SDg4KDgoKBgoGAgYCBgICAgICAf4CAf39+f35/fn1+fX59fHx9fH18e3x7fHt6e3p7ent6e3p5enl6enl6eXp5eXl4eXh5eHl4eXh5eHl4eXh5eHh3eHh4d3h4d3h3d3h4d3l4eHd4d3h3eHd4d3h3eHh4eXh5eHl4eHl4eXh5enl6eXp5enl6eXp5ent6ent6e3x7fHx9fH18fX19fn1+fX5/fn9+f4B/gH+Af4CAgICAgIGAgYCBgoGCgYKCgoKDgoOEg4OEg4SFhIWEhYSFhoWGhYaHhoeHhoeGh4iHiIiHiImIiImKiYqJiYqJiouKi4qLiouKi4qLiouKi4qLiouKi4qLi4qLiouKi4qLiomJiomIiYiJiImIh4iIh4iHhoeGhYWGhYaFhIWEg4OEg4KDgoOCgYKBgIGAgICAgH+Af39+f359fn18fX19fHx8e3t6e3p7enl6eXp5enl6enl5eXh5eHh5eHl4eXh5eHl4eHd5eHd3eHl4d3h3eHd4d3h3eHh4d3h4d3h3d3h5eHl4eXh5eHl5eXp5enl6eXp7ent6e3p7e3t7fHt8e3x8fHx9fH1+fX59fn9+f35/gH+AgICAgICAgYGAgYKBgoGCgoKDgoOEg4SEhIWFhIWFhoWGhYaGhoaHhoeGh4aHhoeIh4iHiIeHiIeIh4iHiIeIiIiHiIeIh4iHiIiHiIeIh4iHiIeIh4eIh4eIh4aHh4aHhoeGh4aHhoWGhYaFhoWFhIWEhYSFhIWEhISDhIOEg4OCg4OCg4KDgYKCgYKCgYCBgIGAgYCBgICAgICAgICAf4B/f4B/gH+Af35/fn9+f35/fn1+fn19fn1+fX59fn19fX19fH18fXx9fH18fXx9fH18fXx8fHt8e3x7fHt8e3x7fHt8e3x7fHt8e3x7fHt8e3x7fHt8e3x8e3x7fHt8e3x7fHx8fXx9fH18fX5+fX59fn9+f35+f35/gH+Af4B/gICAgICAgICAgICAgYCBgIGAgIGAgYGBgoGCgYKBgoGCgYKBgoGCgoKDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KCgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGCgYKBgoGBgYCBgIGAgYCBgIGAgYCBgIGAgYCBgIGAgYCBgIGAgYCAgICBgIGAgYCBgIGAgYCBgIGAgYCBgExJU1RCAAAASU5GT0lDUkQMAAAAMjAwOC0wOS0yMQAASUVORwMAAAAgAAABSVNGVBYAAABTb255IFNvdW5kIEZvcmdlIDguMAAA',
      rules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(
            v,
            this.maxLength,
            labels.getMaxLengthMessage(this.entityName, this.maxLength)
          )
      ],
      mergeTagRules: [
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          if (!matches?.length) return true
          const tags = this.mergeTags.map((tag) => tag.value)
          for (let i = 0; i < matches.length; i++) {
            if (!tags.includes(matches[i].toUpperCase())) {
              return `${matches[i]} is an incorrect merge tag. Please enter an existing merge tag.`
            }
          }
          return true
        },
        (v) => {
          if (!v) return true
          const regexp = new RegExp(
            `(${this.mergeTags.map((mergeTag) => mergeTag.value).join('|')})`,
            'gi'
          )
          const matches = v.match(regexp)
          if (!matches?.length) return true
          const mergeTags = this.mergeTags.map((tag) => tag.value)
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          )
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            'Only use uppercase letters for the merge tag'
          )
        }
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  computed: {
    isPlayTextDisabled() {
      return (
        !this.value ||
        !this.language ||
        !this.voice ||
        !this.$refs?.refInput?.valid ||
        this.isPlayTextClicked
      )
    },
    hasOverflowItems() {
      return this.mergeTags?.length > 5
    },
    getOverflowItems() {
      return this.mergeTags?.slice(5)
    },
    getRowMergeTags() {
      return this.mergeTags?.slice(0, 5)
    }
  },
  watch: {
    value(val) {
      this.isPlayTextClicked = false
    },
    required(val) {
      if (val) {
        this.requiredProps = {
          hint: this.hint || labels.RequiredStar,
          persistentHint: true
        }
        this.rules.unshift((v) => Validations.required(v))
      }
      this.rules = this.applyRules ? this.initialRules || this.rules : []
      this.rules.push(...this.mergeTagRules)
      this.placeholder = this.initialPlaceholder || labels.EnterDescription
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = {
        hint: this.hint || labels.RequiredStar,
        persistentHint: true
      }
      this.rules.unshift((v) => Validations.required(v))
    }
    this.rules = this.applyRules ? this.initialRules || this.rules : []
    this.rules.push(...this.mergeTagRules)
    this.placeholder = this.initialPlaceholder || labels.EnterDescription
  },
  methods: {
    handleMergeTagClick(mergeTag) {
      let textarea = this.$refs?.refInput?.$el?.getElementsByTagName('textarea')?.[0]
      if (!textarea) return
      let start_position = textarea.selectionStart
      let end_position = textarea.selectionEnd
      const newValue = `${textarea.value.substring(
        0,
        start_position
      )}${mergeTag}${textarea.value.substring(end_position, textarea.value.length)}`
      this.$emit('input', newValue)
    },
    handlePlayTextToSpeech() {
      if (!this.value) return
      this.isPlayTextClicked = true
      // const payload = {
      //   text: this.value
      // }
      // playTextToSpeech(payload).then((res) => {
      //   if (res.status === 200) {
      //     const blob = new Blob([res.data], { type: 'audio/wav' })
      //     const blobUrl = URL.createObjectURL(blob)
      //     this.audioSrc = blobUrl
      //     this.isPlayTextClicked = true
      //   }
      // })
    }
  }
}
</script>
