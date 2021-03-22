<template>
<md-dialog-confirm
  :md-active="active"
  md-title="Control"
  md-content="<b>Pan:</b> PC - left mouse drag / Mobile - touch drag<br />
<b>Zoom:</b> PC - middle mouse, or mousewheel / Mobile - two-finger spread or squish<br />
<b>Change reference image:</b> left mouse doubleclick<br />
<b>Adjust Brightness:</b> right mouse drag along a vertical axis<br />
<b>Adjust Contrast:</b> right mouse drag along a horizontal axis"
  md-confirm-text="OK"
  md-cancel-text=""
  @md-cancel=listen__btn_close__onclick
  @md-confirm=listen__btn_close__onclick />
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  methods: {
    listen__btn_close__onclick: function () {
      this.$store.state.usageDialog = !this.$store.state.usageDialog;
    }
  },
  computed: {
    active: function () {
      return this.$store.state.usageDialog;
    }
  }
}
</script>