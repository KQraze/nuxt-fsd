<script setup lang="ts">
const props = defineProps<{ name: string }>();

const Icon = props.name
  ? defineAsyncComponent(() => import(`~/assets/icons/${props.name}.svg`))
  : "";
</script>

<template>
  <Icon v-if="name" nuxt-client :class="$attrs.class" />
</template>

<style scoped></style>
