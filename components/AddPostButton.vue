<template>
    <button class="w-40 h-12 bg-blue-700 text-slate-200 rounded-xl flex items-center justify-center gap-2 border border-gray-900 focus:bg-blue-900">
        <PlusIcon class="w-6 h-6" />
        <span class="font-serif text-xl">New Post</span>
    </button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
</script>

