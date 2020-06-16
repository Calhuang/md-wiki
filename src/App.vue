<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      elevate-on-scroll
    >
      <v-toolbar-title><div class="site-title" @click="navToHome">Wiki</div></v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-text-field
        clearable
        solo
        hide-details
        dense
        label="Search..."
        prepend-inner-icon="mdi-magnify"
        append-icon="mdi-arrow-right"
        @input="updateSearchTerm"
        @click:append="search"
        v-on:keyup.enter="search"
        ></v-text-field>
      </div>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<style src="./App.scss" lang="scss" scoped></style>

<script>

export default {
  name: 'App',
  data: () => ({
    searchTerm: null,
  }),
  methods: {
    navToHome() {
      this.$router.push('/entry/Main%20Page')
    },
    updateSearchTerm(e) {
      this.searchTerm = e
    },
    async search() {
      this.$router.push({ name: 'Search', params: { term: this.searchTerm } })
    },
  },
}
</script>
