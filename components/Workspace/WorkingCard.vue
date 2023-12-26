<template>
  <div class="rounded-lg bg-[#ffffff] px-3 py-2 w-full cursor-pointer" @click="showTag">
    <div class="text-sm text-[#485367] font-semibold">{{ title }}</div>
    <div class="flex gap-2 items-center">
      <img draggable="false" src="~/assets/icon/clock.svg" class="w-3 h-3">
      <div class="text-gray-500 text-[10px] font-medium">{{ timestamp }}</div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'DraggableCard',
  props: {
    title: {
      type: String,
      default: () => '',
    },
    timestamp: {
      type: String,
      default: () => '',
    },
    id: {
      type: String,
      default: () => '',
    },
    position: {
      type: Number, // Assuming position is a number
      default: 0,
    },
  },
  mounted(){
    console.log(this.id)
  },
  methods: {
    showTag(){
      this.$emit('showTag', this.id)
    }
  },
};
</script>

<style lang="scss" scoped>
/* Add any additional styles for your card */
</style>
