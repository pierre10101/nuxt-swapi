<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';

onMounted(async () => {
  const swapi = useSwapi();

const value = await swapi.Films.getPage(1);
const value2 = await swapi.People.getPage(1);
console.log(value,value2)

})
</script>
