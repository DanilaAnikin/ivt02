<template>
    <button class="w-36 h-10 dark:bg-blue-800 focus:bg-slate-700 dark:text-slate-200 bg-slate-600 text-white dark:focus:bg-blue-900 dark:focus:text-slate-100 rounded-xl flex items-center justify-center gap-3">
        <PlusIcon class="w-5 h-5" />
        <span class="font-serif text-xl">New Post</span>
    </button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
</script>

