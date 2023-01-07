<template>
  <div>
    <h1>Your EDC Calendars</h1>

    <template v-if="calendars.length">
      <ul>
        <li v-for="(calendar, c) in calendars" :key="c">
          <router-link :to="`/calendars/${calendar.id}`">
            {{ calendar.name }}
          </router-link>
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

interface Calendar {
  id: string,
  name: string,
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
      // TS ??
      num = rng.getRandomValues(new Uint32Array(1)) / 4294967296; 
    } else {
      num = Math.random();
    }
    num = Math.floor(num * avail.length);
    id += avail[num];
  }

  return id;
};
const addCalendar = () => {
  const count = calendars.value.length ? calendars.value.length + 1 : 1;
  const calendar = {
    id: getId(),
    name: `New Calendar ${count}`,
    data: Array.from(Array(365), (_, i) => ({
      day: i + 1,
      checked: false,
    })),
  };
  calendars.value.push(calendar);
  // Hacky Wacky Town
  handleUnload();
  router.push({ path: `/calendars/${calendar.id}` });
};
</script>
