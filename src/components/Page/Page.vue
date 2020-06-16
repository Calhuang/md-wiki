<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">{{title}}</div>
      <div class="page-actions">
        <v-btn text @click="goToAdd">Create New Page</v-btn>
        <v-btn text @click="goToEdit">Edit Page</v-btn>
        <v-btn text v-if="!isHistoryMode" @click="isHistoryMode = true">View History</v-btn>
        <v-btn text v-if="isHistoryMode" @click="isHistoryMode = false">Back</v-btn>
      </div>
    </div>
    <div v-if="!isHistoryMode">
      <div>Last Edit: {{lastUpdatedFormatted}}</div>
      <br/>
      <div v-html="formattedMd"></div>
    </div>
    <div v-if="isHistoryMode">
      <History :history="historyArray"/>
    </div>
  </div>
</template>

<style src="./Page.scss" lang="scss" scoped></style>

<script>
import { getEntryHistory, getEntry } from '@/api/entries'
import History from '@/components/PageHistory/PageHistory'

const wikilinks = require('markdown-it-wikilinks')({
  baseURL: '/entry/',
  uriSuffix: '',
})
const markdownItAttrs = require('markdown-it-attrs')
const mde = require('markdown-it')().use(wikilinks).use(markdownItAttrs, {
  allowedAttributes: ['id', 'class', 'style'],
})

export default {
  name: 'Home',
  components: {
    History,
  },
  data: () => ({
    mde,
    md: '',
    title: 'Untitled',
    lastUpdated: null,
    isHistoryMode: false,
    historyArray: null,
    formattedMd: null,
  }),
  computed: {
    lastUpdatedFormatted() {
      const time = new Date(this.lastUpdated).toLocaleString()
      return this.lastUpdated ? time : 'None'
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    '$route.params.id': function () {
      this.init()
    },
  },
  async mounted() {
    await this.init()
  },
  methods: {
    goToEdit() {
      const entryName = this.$route.params.id
      if (entryName) {
        this.$router.push({ name: 'Edit', params: { id: entryName } })
      } else {
        this.$router.push({ name: 'NotFound' })
      }
    },
    goToAdd() {
      this.$router.push({ name: 'Add' })
    },
    async init() {
      const entryName = this.$route.params.id
      if (entryName) {
        // -- name of page exists
        const allEntry = await getEntryHistory(decodeURI(entryName))
        this.historyArray = allEntry
        const entry = allEntry['0']
        if (!entry) {
          this.$router.replace({ name: 'NotFound' })
        }
        this.md = entry.md
        const parsed = await this.renderMd()
        this.formattedMd = mde.render(parsed)
        this.title = entry.title || 'Untitled'
        this.lastUpdated = entry.lastModifiedOn
      } else {
        // -- render main page if name of page does not exist
        const allEntry = await getEntryHistory('Main Page')
        if (!allEntry['0']) {
          this.$router.replace({ name: 'NotFound' })
        }
        this.historyArray = allEntry
        const entry = allEntry['0']
        this.md = entry.md
        const parsed = await this.renderMd()
        this.formattedMd = mde.render(parsed)
        this.title = entry.title || 'Untitled'
        this.lastUpdated = entry.lastModifiedOn
        this.$router.replace({ name: 'Entry', params: { id: 'Main Page' } })
      }
    },
    async renderMd() {
      const parsed = await this.parseForLinks(this.md)
      return parsed
    },
    async parseForLinks(text) {
      const replacer = (matched) => {
        const term = matched.substring(2, matched.length - 2)
        return getEntry(term).then((res) => {
          if (res.title) {
            // exists
            return `[[${term}]]`
          }
          // does not exist
          return `${term} {style="color: #BA4A00;"}`
        })
      }
      return this.asyncStringReplace(text, /\[\[.*?\]\]/mg, replacer)
    },
    async asyncStringReplace(str, regex, aReplacer) {
      const substrs = []
      let match
      let i = 0
      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(str)) !== null) {
        // put non matching string
        substrs.push(str.slice(i, match.index))
        // call the async replacer function with the matched array spreaded
        substrs.push(aReplacer(...match))
        i = regex.lastIndex
      }
      // put the rest of str
      substrs.push(str.slice(i))
      // wait for aReplacer calls to finish and join them back into string
      return (await Promise.all(substrs)).join('')
    },
  },
}
</script>
