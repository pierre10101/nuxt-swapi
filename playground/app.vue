<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
import { useSwapi } from '../src/runtime/composables/useSwapi';
import { onMounted } from 'vue';

const { Films, People } = useSwapi();

onMounted(async () => {
  console.log(await Films.getPage());
  console.log(await People.getAll());
  console.log(await Films.findBySearch(['tattoine']));
  console.log(await Films.findByUrl(['https://swapi.dev/api/films/1/']));
  console.log(await Films.find((value)=> value.title === 'test'));
})
</script>
