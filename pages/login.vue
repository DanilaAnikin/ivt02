<template>
    <div class="mt-10 flex flex-col items-center">
      <span class="text-2xl font-semibold dark:text-gray-100 mb-10">
        Nejdrive se musite registrovat/prihlasit!
      </span>
      <button
        class="p-2 rounded-md bg-cyan-600 text-gray-100"
        @click="login"
      >
        Registrovat/Prihlasit
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const user = useSupabaseUser();
  const client = useSupabaseAuthClient();
  const router = useRouter();
  

  watch(() => user.value, (newValue) => {
    if(newValue){
      navigateTo('/');
    }
  }, {immediate: true})


  const login = async () => {
    await client.auth.signInWithOAuth({ provider: 'google' });
  }
  
  </script>