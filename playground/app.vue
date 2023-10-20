<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';

onMounted(async () => {
  const swapi = useSwapi();

// const value = await swapi.Films.getPage(1);
// const value2 = await swapi.People.getPage(1);
const value3 = await swapi.Films.find((item) => {
  console.log(item.characters)
  if (item.title === 'A New Hope') {
    return true;
  }
  return false;
})
console.log(value3)

})
</script>
