<template>
  <div v-if="pageReady">
    <h1>{{ calendar.name }}</h1>
    <Calendar 
    :month="selectedMonth"
    :month-data="monthData" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
//
import Calendar from '../components/Calendar.vue';

interface CalendarInterface {
  id?: string,
  name?: string,
}

const props = defineProps({
  id: String,
});
const router = useRouter();
const pageReady = ref(false);
const calendar = ref<CalendarInterface>({});

onBeforeMount(() => {
  const stored = localStorage.getItem('calendars');

  if (!stored) {
    console.log('no stored');
    router.push({ path: '/calendars?notFound=true' });
    return;
  }

  const storedCalendar = JSON.parse(stored as string)
    .find((c: CalendarInterface) => c.id === props.id);

  if (!storedCalendar) {
    console.log('specific not found');
    router.push({ path: '/calendars?notFound=true' });
    return;
  }

  calendar.value = storedCalendar;
});

pageReady.value = true;

const selectedMonth = ref((new Date().getMonth()));
const monthData = ref([{}]);
</script>
