<template>
  <div class="container mt-5 mx-auto px-3.5">
    <h1 class="text-2xl">
      {{ addingCalendar ? 'Create Calendar' : 'Your Calendars' }}
    </h1>

    <template v-if="addingCalendar">
      <form @submit.prevent="saveCalendar">
        <div>
          <label for="name">Calendar Name</label>
          <input 
            id="name" 
            v-model="calendarName" 
            type="text"
            required>
        </div>

        <div
          style="margin-top: 15px;"
          class="form-actions">
          <button
            class="btn rose"
            @click="cancel">
            Cancel
          </button>
          <button
            type="submit"
            class="btn emerald">
            Save
          </button>
        </div>
      </form>
    </template>
    <template v-else>
      <template v-if="calendars.length">
        <ul class="my-5">
          <li
            v-for="(calendar, c) in calendars"
            :key="c"
            class="calendar-list-item">
            <router-link :to="`/calendars/${calendar.id}`">
              {{ calendar.name }}
            </router-link>
            <button
              class="btn rose"
              @click="removeCalendar(c)">
              &times;
            </button>
          </li>
        </ul>
        <div class="text-right">
          <button
            class="btn emerald"
            @click="addCalendar">
            Add Calendar
          </button>
        </div>
      </template>
      <template v-else>
        <div>
          <p>Looks like you don't have any calendars setup!</p>
          <button
            style="margin-top: 15px;"
            @click="addCalendar">
            Add Calendar
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { 
  onBeforeMount,
  onBeforeUnmount,
  ref,
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
const addingCalendar = ref(false);
const calendarName = ref('');
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

function getId(): string {
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
}

function buildMonths(year: number): Array<Month> {
  function daysInMonth (month: number, year: number) {
    return 32 - (new Date(year, month, 32))
.getDate();
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
  addingCalendar.value = true;
}

function cancel() {
  addingCalendar.value = false;
}

function saveCalendar() {
  const currentYear = (new Date())
.getFullYear();
  const calendar: Calendar = {
    id: getId(),
    name: calendarName.value,
    year: currentYear,
    data: buildMonths(currentYear),
  };
  calendars.value.push(calendar);
  //
  handleUnload();
  router.push({ path: `/calendars/${calendar.id}` });
}

function removeCalendar(idx: number) {
  calendars.value.splice(idx, 1);
}
</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: space-between;
}
.calendar-list-item {
  @apply flex items-center py-3 px-3.5 odd:bg-purple-600 even:bg-purple-700;
  cursor: pointer;
}
.calendar-list-item a {
  width: 100%;
}
.calendar-list-item button {
  @apply py-0 px-2.5 text-2xl bg-rose-600 rounded-full;
}
</style>
