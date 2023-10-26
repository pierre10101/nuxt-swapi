<script setup lang="ts">
import { onMounted } from 'vue';
import { useSwapi } from '../../src/runtime/composables/useSwapi';
import {ref} from 'vue';
import {useAsyncData} from '#imports';

const { Films } = useSwapi();
const test = ref();
test.value = useAsyncData('test', async () =>await Films.getPage());
onMounted(async () => {
    
//   await People.getAll()
//   await Films.findBySearch(['tattoine'])
//   await Films.findByUrl(['https://swapi.dev/api/films/1/'])
//   await Films.find((value)=> value.title === 'test')
})
</script>

<template>
  <h1>This is Nuxt playground!</h1>
</template>