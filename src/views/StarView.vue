<template>
  <div>
    <span v-for="star in 5" :key="star" class="star" @click="setRating(star)">
      {{ star <= rating ? '★' : '☆' }} </span>
  </div>
</template>
  
<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 0
    }
  },
  methods: {
    setRating(newRating) {
      this.$emit('rating-selected', newRating);
    }
  }
};
</script>
  
<style scoped>
.star {
  cursor: pointer;
  font-size: 20px;
}
</style>
  