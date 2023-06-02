<template>
    <div class="mt-10 flex flex-col items-center">
      <span class="text-2xl font-semibold dark:text-gray-100 mb-10">
        You have to register/login first
      </span>
      <button
        class="p-2 rounded-md bg-blue-600 text-gray-100"
        @click="login"
      >
        Register/Login
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const user = useSupabaseUser();
  const client = useSupabaseAuthClient();

  watch(() => user.value, (newValue) => {
    if(newValue){
      navigateTo('/');
    }
  }, {immediate: true})


  const login = async () => {
    await client.auth.signInWithOAuth({ provider: 'google' });
  }
  
  </script>