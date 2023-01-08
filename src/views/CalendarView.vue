<template>
  <div
    v-if="pageReady"
    class="container px-3.5">
    <div class="text-center clear-left py-3.5">
      <router-link
        v-if="!editing"
        class="float-left text-2xl"
        to="/">
        &lt;
      </router-link>

      <h1>{{ editing ? 'Update Calendar' : `${calendar.name} | ${calendar.year}` }}</h1>
    </div>

    <template v-if="editing">
      <form
        class="px-3.5"
        @submit.prevent="updateCalendar">
        <div>
          <label for="name">Calendar Name</label>
          <input
            v-model="calendar.name"
            type="text"
            required
            style="padding: 8px 12px;">
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
          <button
            class="btn rose"
            type="button"
            @click="editing = false">
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
      <Calendar 
        :month="calendar.data[monthToShow]"
        @toggle-date="toggleDate" />

      <div style="text-align: right;">
        <button
          type="button"
          class="btn blue"
          @click="edit">
          Edit Calendar
        </button>
      </div>
    </template>
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
    days: [{ day: 0, checked: false }],
  }],
});
const editing = ref(false);

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

function toggleMonth(idx: number) {
  calendar.value.shownMonth = idx;
  saveCalendar(calendar);
}

function updateCalendar() {
  saveCalendar(calendar);
  editing.value = false;
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

function edit() {
  editing.value = true;
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
h1 {
  @apply text-2xl;
}
</style>
