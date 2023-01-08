<template>
  <div class="wrapper">
    <div class="month">
      <div class="month-name">
        <button
          type="button"
          class="btn blue previous-btn"
          @click="prev">
          &lt;
        </button>

        {{ month.full }}

        <button
          type="button"
          class="btn blue next-btn"
          @click="next">
          &gt;
        </button>
      </div>
      <div
        v-for="(week, w) in weeks"
        :key="w"
        class="week">
        <div
          v-for="(day, d) in week"
          :key="`${month.short}-${d}`"
          class="day"
          :class="{ checked: day.checked }"
          @click="toggleCheck(day.day - 1)">
          {{ day.day }} <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

interface Day {
  day: number,
  checked: boolean,
}
interface Month {
  short: string,
  full: string,
  days: Day[],
}
interface Props {
  month: Month,
}

const props = defineProps<Props>();
const emits = defineEmits(['toggleDate', 'switchMonth']);

const weeks = computed(() => {
  const days = props.month.days;
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
   weeks.push([...days.slice(i, i + 7)]); 
  }

  return weeks;
});

function toggleCheck(day: number) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months.indexOf(props.month.short);
  emits('toggleDate', { month, day });
}

function prev() {
  emits('switchMonth', -1);
}

function next() {
  emits('switchMonth', 1);
}
</script>

<style scoped>
.wrapper {
  @apply flex mt-5;
}
.month {
  @apply mx-auto;
}
.month-name {
  @apply flex justify-between items-center mb-5 text-2xl;
}
.month-name .btn {
  @apply py-1 rounded-full text-base;
}
.week {
  @apply flex mb-3;
}
.day {
  @apply p-2 text-slate-700 leading-4 text-center bg-slate-200 rounded-full;
  width: 35px;
  height: 35px;
}
.day:not(:last-child) {
  margin-right: 10px;
}
.day.checked {
  @apply text-slate-200 bg-emerald-400;
}
</style>
