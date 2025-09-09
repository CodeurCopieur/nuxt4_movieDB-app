<template>
  <div class="flex flex-col bg-gray-900 text-white">
    <Header />
    <main class="w-full min-h-screen">
      <slot />
    </main>
    <Footer />
  </div>
</template>