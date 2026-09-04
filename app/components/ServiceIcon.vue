<script setup lang="ts">
defineProps<{
  name: 'podbor' | 'proverka' | 'vykup' | 'gibdd' | 'import' | 'kuzov'
  size?: number
}>()
</script>

<template>
  <svg
    :width="size || 22"
    :height="size || 22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Подбор: лупа с галочкой -->
    <template v-if="name === 'podbor'">
      <circle cx="10.5" cy="10.5" r="6.6" />
      <path d="M15.4 15.4 21 21" />
      <path d="M7.6 10.6 9.8 12.8 13.6 8.6" />
    </template>

    <!-- Разовая проверка: щит с галочкой -->
    <template v-else-if="name === 'proverka'">
      <path d="M12 3.2 19 5.8v5.1c0 4.2-2.8 7.6-7 8.9-4.2-1.3-7-4.7-7-8.9V5.8L12 3.2Z" />
      <path d="M8.9 11.7 11.2 14 15.3 9.6" />
    </template>

    <!-- Выкуп: рубль в круге -->
    <template v-else-if="name === 'vykup'">
      <circle cx="12" cy="12" r="8.8" />
      <path d="M10 16.2V7.8h2.7a2.3 2.3 0 0 1 0 4.6H10" />
      <path d="M8.3 13.9h4.6" />
    </template>

    <!-- Регистрация в ГИБДД: госномер -->
    <template v-else-if="name === 'gibdd'">
      <rect x="2.6" y="6.4" width="18.8" height="11.2" rx="2.4" />
      <path d="M16.2 6.4v11.2" />
      <path d="M5.9 11.3h7.3" />
      <path d="M5.9 14.5h4.6" />
      <path d="M18.1 11.3h1.5" />
    </template>

    <!-- Импорт: глобус -->
    <template v-else-if="name === 'import'">
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.2c2.5 2.4 3.9 5.4 3.9 8.8S14.5 18.4 12 20.8c-2.5-2.4-3.9-5.4-3.9-8.8S9.5 5.6 12 3.2Z" />
    </template>

    <!-- Проверка кузова: слои ЛКП с точкой замера -->
    <template v-else-if="name === 'kuzov'">
      <path d="M12 3.4 20.4 7.4 12 11.4 3.6 7.4 12 3.4Z" />
      <path d="M3.6 12 12 16l8.4-4" />
      <path d="M3.6 16.6 12 20.6l8.4-4" />
    </template>
  </svg>
</template>
