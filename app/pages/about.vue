<script setup lang="ts">
const currentPost = ref(1);

const { data } = postEntity.useOne(currentPost);
</script>

<template>
  <div>
    <UButton to="/">дом</UButton>
    <UButton @click="currentPost++">следщ</UButton>
    {{ data }}
  </div>
</template>

<style scoped></style>
