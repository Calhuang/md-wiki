<template>
  <div class="diff">
    <br/>
    <div>
      <div v-html="prettyDiffs"></div>
    </div>
  </div>
</template>

<style src="./Diff.scss" lang="scss" scoped></style>

<script>
import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

const Diff = require('diff')

export default {
  name: 'Diff',
  props: {
    old: {
      default: null,
      type: Object,
    },
    new: {
      default: null,
      type: Object,
    },
  },
  data: () => ({
    md: '',
    title: 'Untitled',
    lastUpdated: null,
    diffs: null,
  }),
  mounted() {
    this.init()
  },
  computed: {
    prettyDiffs() {
      return Diff2Html
        .html(Diff.createTwoFilesPatch(this.old.title, this.new.title, this.old.md, this.new.md), {
          inputFormat: 'diff',
          drawFileList: false,
          matching: 'lines',
          outputFormat: 'side-by-side',
        })
    },
  },
  methods: {
    init() {
    },
  },
}
</script>
