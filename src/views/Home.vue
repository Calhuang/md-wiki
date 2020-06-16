<template>
  <div class="home">
    <Page/>
  </div>
</template>

<style lang="scss" scoped>
  .home {
    max-width: 900px;
    margin: 20px auto;
  }
</style>

<script>
import Page from '@/components/Page/Page'

export default {
  name: 'Home',
  components: {
    Page,
  },
}
</script>
