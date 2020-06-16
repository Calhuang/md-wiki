<template>
  <div class="edit-root">
    <EditPage/>
  </div>
</template>

<style lang="scss" scoped>
  .edit-root {
    max-width: 900px;
    margin: 20px auto;
  }
</style>

<script>
import EditPage from '@/components/EditPage/EditPage'

export default {
  name: 'Edit',
  components: {
    EditPage,
  },
}
</script>
