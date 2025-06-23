<script setup lang="ts">
const route = useRoute();

const { data } = blankEntity.getOne(`${route.params.id!}`);
</script>

<template>
  <section>
    <h1>{{ data }}</h1>
  </section>
</template>

<style scoped></style>
