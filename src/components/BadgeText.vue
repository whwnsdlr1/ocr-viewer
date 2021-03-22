<template>
<div class="badge" :class="{highlight: data.highlight}" @click="listen__div__onclick">
  {{ data.text }}
  <md-tooltip md-direction="top">id: {{data.id}}, prob: {{data.prob.toFixed(3)}}</md-tooltip>
</div>
</template>

<script>
export default {
  props: ['data'],
  data: function () {
    return {
    }
  },
  methods: {
    listen__div__onclick: function () {
      this.$emit('ontoggle', {id: this.data.id});
    }
  }
}
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0px 6px;
  margin: 3px 5px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  cursor: pointer;
  overflow-wrap:anywhere;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
.badge:hover {
  background: #EEEEEE;
}
.badge.highlight {
  color:white;
  background: red;
}
.md-tooltip-top {
  font-size: 12px !important;
}
</style>