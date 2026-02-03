<script setup>
import 'swiper/css'
import 'swiper/css/pagination'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'movie'
  },
  ariaLabel: {
    type: String,
    default: ''
  }
})

const swiperRef = ref(null)
const paginationRef = ref(null)
const swiperInstance = ref(null)
const initializing = ref(false)

const generateImageUrl = (path, size = 'w342') => {
  if (!path) return 'https://via.placeholder.com/342x513/1f2937/6b7280?text=+'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const getItemTitle = (item) => item?.title || item?.name || 'Titre indisponible'

const initSwiper = async () => {
  if (!swiperRef.value || props.items.length === 0 || swiperInstance.value || initializing.value) return
  initializing.value = true
  await nextTick()
  try {
    const SwiperModule = await import('swiper')
    const Swiper = SwiperModule.default
    const { Pagination } = await import('swiper/modules')

    swiperInstance.value = new Swiper(swiperRef.value, {
      modules: [Pagination],
      slidesPerView: 2,
      spaceBetween: 12,
      grabCursor: true,
      pagination: {
        el: paginationRef.value,
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active'
      },
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 12 },
        640: { slidesPerView: 3, spaceBetween: 16 },
        768: { slidesPerView: 4, spaceBetween: 16 },
        1024: { slidesPerView: 5, spaceBetween: 20 },
        1280: { slidesPerView: 6, spaceBetween: 24 }
      }
    })
  } catch (err) {
    console.error('MediaCarousel Swiper init error:', err)
  } finally {
    initializing.value = false
  }
}

watch(
  () => props.items.length,
  (len) => {
    if (len > 0 && swiperRef.value && !swiperInstance.value) {
      nextTick(() => initSwiper())
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.items.length > 0) nextTick(() => initSwiper())
})

onBeforeUnmount(() => {
  if (swiperInstance.value?.destroy) {
    swiperInstance.value.destroy(true, true)
  }
})
</script>

<template>
  <ClientOnly>
    <div
      class="relative w-full"
      :aria-label="ariaLabel || 'Carousel'"
      role="region"
      aria-roledescription="carousel"
    >
      <div
        ref="swiperRef"
        class="swiper media-carousel overflow-hidden rounded-xl"
        style="padding: .5rem"
      >
        <div class="swiper-wrapper">
          <div
            v-for="item in props.items"
            :key="`${props.type}-${item.id}`"
            class="swiper-slide"
            role="listitem"
          >
            <NuxtLink
              :to="`/${props.type}/${item.id}`"
              class="group block overflow-hidden rounded-lg bg-gray-900/60 transition duration-200 hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <div class="relative aspect-[2/3] overflow-hidden">
                <img
                  :src="generateImageUrl(item.poster_path || item.backdrop_path)"
                  :alt="`Affiche de ${getItemTitle(item)}`"
                  class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                >
                <div
                  class="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white"
                >
                  <span aria-hidden="true">★</span>
                  {{ item.vote_average?.toFixed(1) ?? '–' }}
                </div>
              </div>
              <h3 class="mt-2 line-clamp-2 px-1 text-sm font-medium text-white text-center">
                {{ getItemTitle(item) }}
              </h3>
            </NuxtLink>
          </div>
        </div>
        <div
          v-if="props.items.length > 0"
          ref="paginationRef"
          class="swiper-pagination mt-4"
          role="tablist"
          aria-label="Pagination du carousel"
        />
      </div>

      <p
        v-if="props.items.length === 0"
        class="rounded-xl bg-gray-900/40 py-12 text-center text-sm text-white/60"
      >
        Aucun contenu disponible.
      </p>
    </div>
  </ClientOnly>
</template>

<style scoped>
.media-carousel :deep(.swiper-pagination) {
  position: relative;
  bottom: auto;
  left: auto;
}

.media-carousel :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
  transition: all 0.2s ease;
}

.media-carousel :deep(.swiper-pagination-bullet-active) {
  width: 24px;
  border-radius: 4px;
  background: rgb(16, 185, 129);
}
</style>
