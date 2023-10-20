<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
const starWarsApi = useSwapi();
console.log(starWarsApi)
</script>
