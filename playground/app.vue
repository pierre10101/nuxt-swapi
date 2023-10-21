<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">

const people = ref();
const films = ref();
const species = ref();
const planets = ref();

onMounted(async () => {
  people.value = await useSwapi().People.getAll()
  films.value = await useSwapi().Films.getAll()
  species.value = await useSwapi().Species.getAll()
  planets.value = await useSwapi().Planets.getAll()
})
</script>
