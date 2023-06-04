<template>
  <div class="mt-8 flex justify-center flex-col max-w-xl w-full items-center dark:text-slate-200 text-gray-900">
    <div class="flex justify-between items-center w-full mb-3">
      <span class="text-2xl">
        Posts
      </span>
      <AddPostButton @click="addOpened=true" />
    </div>
    <div v-for="post in posts" class="flex flex-col w-full gap-4 dark:bg-gray-800 bg-gray-300/50 rounded-md py-4 px-5 my-6 h-fit">
      <div class="flex justify-between">
        <span class="block text-2xl dark:text-slate-200 font-serif">{{ post.title }}</span>
        <div class="flex gap-2">
          <span class="text-md dark:text-slate-400 text-black">{{ post.user.name }}</span>
          <img :src="post.user.avatar" class="rounded w-7 h-7" >
        </div>
      </div>
      <span class="block text-md break-all dark:text-slate-200 text-black px-1">{{ post.content }}</span>
      <div class="flex gap-1 text-xs items-end justify-between">
        <span class="dark:text-slate-400 text-slate-500 text-sm">{{ dayjs(post.createdAt).format('H:m D.M.YYYY') }}</span>
        <div class="flex gap-2">
          <div class="flex items-center gap-1" @click="addLike(post)">
            <span class="text-gray-800 dark:text-slate-200">{{ post.likes }}</span>
            <HeartIcon :class="`h-4 w-4 ${post.liked ? 'dark:text-red-600 text-red-700' : 'dark:text-slate-100/60 text-gray-700'}`" />
          </div>
          <div v-if="canDeletePost(post)" class="dark:text-red-600 text-red-700" @click="deletePost(post)">
            <TrashIcon class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute top-5 right-5 dark:text-slate-300 text-gray-800" @click="changeTheme">
      <SunIcon class="w-8 h-8" />
    </div>
  </div>
  <div v-if="addOpened" class="fixed top-0 backdrop-blur-md bg-slate-100/5 w-full h-full flex justify-center">
      <div class="max-w-sm w-full h-fit fixed border top-12 rounded-2xl bg-gray-700 py-4 px-5">
        <span class="flex justify-center text-xl text-slate-100 font-serif">Add New Post</span>
        <div class="w-full flex-col justify-center my-4">
          <input v-model="title" type="text" class="block bg-gray-800 placeholder:text-slate-300 px-3 w-full mb-2 rounded-md text-slate-100 text-md" placeholder="Add title">
          <textarea @keydown.enter.shift.exact.prevent="addNewPost" v-model="content" type="text" class="block bg-gray-800 placeholder:text-slate-300 px-3 w-full rounded-md min-h-full h-24 text-slate-100 text-sm scrollbar-hide" placeholder="Add text or image url" />
        </div>
        <div class="flex justify-between px-2">
          <button @click="addOpened=false, title='', content=''" class="text-xs w-w-fit justify-center text-red-500 flex items-center gap-1 py-1 px-2 font-mono rounded-lg border-red-500 border bg-gray-700">
            <XMarkIcon class="w-6 h-6" />
            Cancel
          </button>
          <button @click="addNewPost" :class="`${disabledAddPost ? 'opacity-50' : ''} text-sm w-fit justify-center text-green-500 flex flex items-center gap-1 py-1 px-2 font-mono rounded-lg border-green-500 border bg-gray-700`" :disabled="disabledAddPost">
            <PlusIcon class="w-6 h-6" />
            <div class="flex-col text-xs">
              Add Post
              <span class="flex" style="font-size: 10px">
                (Shift+Enter)
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import AddPostButton from '../components/AddPostButton.vue';
import { PlusIcon, XMarkIcon, HeartIcon } from '@heroicons/vue/20/solid';
import { TrashIcon, SunIcon } from '@heroicons/vue/24/outline';
import { ref, computed } from 'vue';
import { type Post } from '../db';
import dayjs from 'dayjs';

const { data: posts }: {data: Ref<Post[]>} = await useFetch('/api/posts')
const user = useSupabaseUser();

const addOpened = ref(false);
const content = ref('');
const title = ref('');


const disabledAddPost = computed(() => {
  return title.value === '' || content.value === '' ? true : false;
});

const canDeletePost = (post: Post) => {
  if(!user.value){
    return;
  }

  return post.user.user_id === user.value.id;
}


const addNewPost = async() => {
  const response = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({ title: title.value, content: content.value })});
  const data = await response.json();

  addOpened.value = false;
  content.value = '';
  title.value = '';

  posts.value!.unshift(data);
}

const deletePost = async(post: any) => {
  await fetch('api/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: post.id }) })
  posts.value = posts.value.filter(thatPost => thatPost.id !== post.id);
}

const addLike = async( post: Post ) => {
  if(!posts.value){
    return;
  }

  const response = await fetch('/api/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: post.id, liked: !post.liked })})
  const data = await response.json();


  const postIndex = posts.value.findIndex(({id}) => id === post.id);

  posts.value[postIndex].likes = data;
  posts.value[postIndex].liked = !post.liked;
}


const changeTheme = () => {
  console.log(localStorage.theme);
  if (localStorage.theme === 'dark'){
    localStorage.theme = 'light';
    document.documentElement.classList.remove('dark');
  } else {
    localStorage.theme = 'dark';
    document.documentElement.classList.add('dark');
  }
}

const getTheme = () => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

definePageMeta({
  middleware: 'auth'
});

onMounted(getTheme)

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>