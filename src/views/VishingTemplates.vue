<template>
  <KContainer id="vishing-templates">
    <AudioPlayer src="http://localhost:80/sample-9s.mp3" type="server" />
  </KContainer>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'VishingTemplates',
  components: {
    AudioPlayer,
    KContainer
  }
}
</script>
