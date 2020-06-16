<template>
  <div class="sr-root">
    <h1 >Search Results</h1>
    <br/>
    <div v-if="!results" class="body-1">No results found.</div>
    <div v-for="item in results" :key="item.title">
      <a :href="`/entry/${item.title}`">{{item.title}}</a>
      <div>{{item.lastModifiedOn}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .sr-root {
    max-width: 900px;
    margin: 20px auto;
  }
</style>

<script>
import { searchEntry } from '@/api/entries'

export default {
  name: 'SearchResults',
  data: () => ({
    results: null,
  }),
  computed: {
    searchTerm() {
      return decodeURI(this.$route.params.term)
    },
  },
  watch: {
    async searchTerm() {
      try {
        const res = await this.search()
        this.results = res.cb
      } catch (e) {
        this.results = null
      }
    },
  },
  async mounted() {
    try {
      const res = await this.search()
      this.results = res.cb
    } catch (e) {
      this.results = null
    }
  },
  methods: {
    search() {
      return searchEntry(this.searchTerm)
    },
  },
}
</script>
