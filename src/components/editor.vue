<script setup>
defineProps({
  modelValue: { String, default: '' }
})
</script>

<template lang="pug">
.richer
  .richer__menu b i u
  .richer__content(contenteditable)
</template>

<style lang="scss">
.richer {
  border: 1px solid rgba(#000, 0.05);
  border-radius: 4px;
  background: rgba(#fff, 0.85);
  color: #333;

  &__menu {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    border-bottom: 1px solid rgba(#fff, 0.05);
    padding: 4px 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__content {
    padding: 12px;
    outline: none;
  }
}

@media (prefers-color-scheme: dark) {
  .richer {
    color: #ccc;
    border-color: rgba(#fff, 0.05);
    background-color: rgba(#000, 0.05);

    &__menu {
      border-color: rgba(#fff, 0.05);
    }
  }
}
</style>
