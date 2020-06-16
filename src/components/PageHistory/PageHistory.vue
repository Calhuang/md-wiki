<template>
  <div class="page-history">
    <br/>
    <div class="history-headers">
      <div>Changelog</div>
      <div>Last Modified Date</div>
      <div>Diff</div>
    </div>
    <div v-for="(item, index) in history" :key="index">
      <div class="history-items" v-if="item.lastModifiedOn">
        <div>{{item.changelog || 'No log available'}}</div>
        <div>{{new Date(item.lastModifiedOn).toLocaleString()}}</div>
        <div class="diff-link" @click="handleDiff(item)">Diff</div>
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      v-if="oldDiff"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
        {{`${oldDiff.title}: \
        ${oldDiff.changelog} - ${new Date(oldDiff.lastModifiedOn).toLocaleString()}`}}
        </v-card-title>

        <v-card-text>
          <Diff :old="oldDiff" :new="history['0']"/>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style src="./PageHistory.scss" lang="scss" scoped></style>

<script>
import Diff from '@/components/Diff/Diff'

export default {
  name: 'PageHistory',
  components: {
    Diff,
  },
  props: {
    history: {
      default: null,
      type: Object,
    },
  },
  data: () => ({
    md: '',
    title: 'Untitled',
    lastUpdated: null,
    dialog: false,
    oldDiff: null,
  }),
  methods: {
    handleDiff(e) {
      this.oldDiff = e
      this.dialog = true
    },
  },
}
</script>
