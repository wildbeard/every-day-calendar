<template>
  <div v-if="pageReady">
    <router-link to="/">Back</router-link>
    <br>
    <h1 class="calendar-name">{{ `${calendar.name} (${calendar.year})` }}</h1>
    <div class="d-flex">
      <div>
        <div v-for="m in 12" :key="m">
          <button 
            class="month-toggle" 
            @click="toggleMonth(m - 1)">
            {{ getMonthName(m - 1) }}
          </button>
        </div>
      </div>

      <div>
        <Calendar 
          :month="calendar.data[monthToShow]"
          @toggle-date="toggleDate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
//
import Calendar from '../components/Calendar.vue';

interface Day {
  day: number,
  checked: boolean,
}
interface Month {
  short: string,
  full: string,
  days: Day[],
}
interface CalendarInterface {
  id?: string,
  name?: string,
  year?: number,
  shownMonth?: number,
  data: Month[],
}

const props = defineProps({
  id: String,
});
const router = useRouter();
const pageReady = ref(false);
const calendar = ref<CalendarInterface>({
  id: '',
  name: '',
  data: [{
    short: '',
    full: '',
    days: [{ day: 0, checked: false, }],
  }],
});

onBeforeMount(() => {
  const stored = localStorage.getItem('calendars');

  if (!stored) {
    router.push({ path: '/calendars?notFound=true' });
    return;
  }

  const storedCalendar = JSON.parse(stored as string)
    .find((c: CalendarInterface) => c.id === props.id);

  if (!storedCalendar) {
    router.push({ path: '/calendars?notFound=true' });
    return;
  }

  calendar.value = storedCalendar;
});

const monthToShow = computed(() => {
  return calendar.value.shownMonth ?? 0;
});
pageReady.value = true;

function getMonthName(idx: number): String {
  return (new Date(0, idx)).toLocaleString('en-us', { month: 'long' });
}

function toggleMonth(idx: number) {
  calendar.value.shownMonth = idx;
  saveCalendar(calendar);
}

function saveCalendar(calendar: Ref<CalendarInterface>) {
  const cals: Array<CalendarInterface> = JSON.parse(localStorage.getItem('calendars') ?? '');
  const calIdx = cals.findIndex(c => c.id === calendar.value.id);

  if (calIdx !== -1) {
    cals[calIdx] = calendar.value;
    localStorage.setItem('calendars', JSON.stringify(cals));
  }
}

function toggleDate({ month, day }: { month: number, day: number }) {
  calendar.value.data[month].days[day].checked = !calendar.value.data[month].days[day].checked;
  saveCalendar(calendar);
}
</script>

<style scoped>
.d-flex {
  display: flex;
  margin-top: 25px;
}
.d-flex > div:first-child {
  margin-right: 25px;
}
.month-toggle {
  width: 100%;
  margin-bottom: 5px;
}
.calendar-name {
  font-size: 1.75rem;
}
</style>
