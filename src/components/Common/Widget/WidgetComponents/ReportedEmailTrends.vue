<template>
  <widget-container>
    <widget-header
      title="Reported Email Trends"
      :link="{ href: '/incident-responder', text: 'Incident Responder' }"
      :edit-mode="editMode"
      @deleteWidget="$emit('deleteWidget')"
    />
    <widget-body>
      <line-chart />
    </widget-body>
  </widget-container>
</template>

<script>
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import Line from '@/components/Common/Charts/Line'
export default {
  name: 'ReportedEmailTrends',
  components: {
    WidgetHeader,
    WidgetBody,
    WidgetContainer,
    'line-chart': Line
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false
    }
  }
}
</script>

<style lang="scss"></style>
