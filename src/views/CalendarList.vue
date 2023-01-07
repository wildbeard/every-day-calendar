<template>
  <div>
    <h1>Your EDC Calendars</h1>

    <template v-if="calendars.length">
      <ul>
        <li v-for="(calendar, c) in calendars" :key="c">
          <router-link :to="`/calendars/${calendar.id}`">
            {{ calendar.name }}
          </router-link>
          <button style="margin-left: 15px;" @click="removeCalendar(c)">x</button>
        </li>
        <li>
          <button @click="addCalendar">Add Calendar</button>
        </li>
      </ul>
    </template>
    <template v-else>
      <div>
        <p>Looks like you don't have any calendars setup!</p>
        <button @click="addCalendar">Add Calendar</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { 
  onBeforeMount,
  onBeforeUnmount,
  ref
} from 'vue';
import { useRouter } from 'vue-router';

interface Day {
  day: number,
  checked: boolean,
}
interface Month {
  short: string,
  full: string,
  days: Day[],
}
interface Calendar {
  id: string,
  name: string,
  year: number,
  data: Month[],
}

const router = useRouter();
const calendars = ref<Array<Calendar>>([]); 
const handleUnload = () => {
  localStorage.setItem('calendars', JSON.stringify(calendars.value));
};

onBeforeMount(() => {
  const storedCalendars = localStorage.getItem('calendars');
  calendars.value = storedCalendars ? JSON.parse(storedCalendars) : [];
  window.addEventListener('beforeunload', handleUnload);
});
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleUnload);
});

const getId = (): string => {
  const rng = window.crypto;
  const avail = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';

  for (let i = 0; i < 32; i++) {
    let num = 0;

    if (rng !== undefined) {
      // @ts-ignore
      num = rng.getRandomValues(new Uint32Array(1)) / 4294967296; 
    } else {
      num = Math.random();
    }
    num = Math.floor(num * avail.length);
    id += avail[num];
  }

  return id;
};
function buildMonths(year: number): Array<Month> {
  function daysInMonth (month: number, year: number) {
    return 32 - (new Date(year, month, 32)).getDate();
  }
    return Array.from(Array(12), (_, i) => {
      const month = new Date(0, i);
      return {
        short: month.toLocaleString('en-us', { month: 'short' }),
        full: month.toLocaleString('en-us', { month: 'long' }),
        days: Array.from(Array(daysInMonth(i, year)), (_, d) => ({ day: d + 1, checked: false })),
      };
    });
}

function addCalendar() {
  const count = calendars.value.length ? calendars.value.length + 1 : 1;
  const currentYear = (new Date()).getFullYear();
  const calendar: Calendar = {
    id: getId(),
    name: `New Calendar ${count}`,
    year: currentYear,
    data: buildMonths(currentYear),
  };
  calendars.value.push(calendar);
  // Hacky Wacky Town
  handleUnload();
  router.push({ path: `/calendars/${calendar.id}` });
}

function removeCalendar(idx: number) {
  calendars.value.splice(idx, 1);
}
</script>