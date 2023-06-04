<template>
    <button class="w-40 h-12 bg-blue-800 text-slate-200 rounded-xl flex items-center justify-center gap-3 border border-gray-900 focus:bg-blue-900">
        <PlusIcon class="w-5 h-5" />
        <span class="font-serif text-xl">New Post</span>
    </button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
</script>

