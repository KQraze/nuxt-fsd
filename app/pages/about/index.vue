<script setup lang="ts">
const { data } = blankEntity.getAll();
</script>

<template>
  <div>
    <UButton to="/">Главная</UButton>
    <section class="grid grid-cols-3 gap-8">
      <UCard v-for="(card, i) in data" :key="i" class="bg-gray-600">
        <template #header>
          <ULink :to="`/about/${card.id}`">{{ i + 1 + ' ' + card.title }}</ULink>
        </template>
        {{ card.body }}
      </UCard>
    </section>
  </div>
</template>

<style scoped></style>
