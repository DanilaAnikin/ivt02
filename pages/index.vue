<template>
  <div class="mt-10 flex justify-center flex-col max-w-2xl w-full items-center text-slate-200">
    <div class="flex justify-between items-center w-full">
      <span v-if="posts.length" class="text-2xl">
        Posts
      </span>
      <AddPostButton @click="addOpened=true" />
    </div>
    <div v-for="post in posts" class="flex flex-col w-full gap-4 bg-gray-800 rounded-md py-4 px-5 my-9 h-fit">
      <div class="flex justify-between">
        <span class="block text-2xl text-slate-200 font-serif">{{ post.title }}</span>
        <div class="flex gap-2">
          <span class="text-md text-slate-400">{{ post.user.name }}</span>
          <img :src="post.user.avatar" class="rounded w-7 h-7" >
        </div>
      </div>
      <span class="block text-md break-all px-1">{{ post.content }}</span>
      <div class="flex gap-1 text-xs items-end justify-between">
        <span class="text-slate-400 text-sm">{{ dayjs(post.createdAt).format('H:m D.M.YYYY') }}</span>
        <div class="flex gap-1" @click="addLike(post)">
          {{ post.likes }}
          <HeartIcon :class="`h-4 w-4 ${post.liked ? 'text-red-600' : 'text-slate-100/60'}`" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="addOpened" class="fixed top-0 backdrop-blur-md bg-slate-100/5 w-full h-full flex justify-center">
      <div class="w-fit h-fit fixed border top-12 rounded-2xl bg-gray-700 py-4 px-5">
        <span class="flex justify-center text-xl text-slate-100 font-serif">Add New Post</span>
        <div class="w-full flex-col justify-center my-4">
          <input v-model="title" type="text" class="block bg-gray-800 placeholder:text-slate-300 px-3 w-full mb-2 rounded-md text-slate-100 text-md" placeholder="Add title">
          <textarea @keydown.enter.shift.exact.prevent="addNewPost" v-model="content" type="text" class="block bg-gray-800 placeholder:text-slate-300 px-3 w-full rounded-md min-h-full h-24 text-slate-100 text-sm scrollbar-hide" placeholder="Add text or image url" />
        </div>
        <div class="flex gap-3 justify-center">
          <button @click="addOpened=false, title='', content=''" class="text-sm w-w-fit justify-center text-red-500 flex items-center gap-1 py-1 px-2 font-mono rounded-lg border-red-500 border bg-gray-700 focus:bg-red-800 focus:text-slate-100 focus:border-slate-100">
            <XMarkIcon class="w-6 h-6" />
            Cancel
          </button>
          <button @click="addNewPost" :class="`${disabled ? 'opacity-50' : ''} text-sm w-fit justify-center text-green-500 flex items-center gap-1 py-1 px-2 font-mono rounded-lg border-green-500 border bg-gray-700 focus:bg-green-700 focus:text-slate-100 focus:border-slate-100`" :disabled="disabled">
            <PlusIcon class="w-6 h-6" />
            Add Post
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import AddPostButton from '../components/AddPostButton.vue';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { HeartIcon } from '@heroicons/vue/24/solid';
import { ref, computed } from 'vue';
import { type Post } from '../db';
import dayjs from 'dayjs'; 

const { data: posts }: {data: Ref<Post[]>} = await useFetch('/api/posts')

const addOpened = ref(false);
const content = ref('');
const title = ref('');
const disabled = computed(() => {
  return title.value === '' || content.value === '' ? true : false;
});

const addNewPost = async() => {
  const response = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({ title: title.value, content: content.value })});
  const data = await response.json();

  addOpened.value = false;
  content.value = '';
  title.value = '';

  posts.value!.unshift(data);
}

const addLike = async(post: any) => {
    if(!posts.value){
      return;
    }

    console.log(post);

  const response = await fetch('/api/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: post.id, liked: !post.liked })})
  const data = await response.json();


  const postIndex = posts.value.findIndex(({id}) => id === post.id);

  posts.value[postIndex].likes = data;
  posts.value[postIndex].liked = !post.liked;

}

definePageMeta({
  middleware: 'auth'
});


</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>