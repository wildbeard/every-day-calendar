<template>
  <div class="wrapper">
    <div class="month" 
      v-for="(month, m) in months"
      :key="m">
      <div class="month-name">
        {{ month.month }}
      </div>
      <div class="week" v-for="(week, w) in weeks" :key="w">
        <div class="day"
          v-for="(day, d) in week"
          :key="`${m}-${d}`"
          :class="{ checked: day.checked }"
          @click="toggleCheck(m, day.day - 1)">
          {{ day.day }} <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

interface Props {
  month: Number,
  monthData: Array<{}>,
}

const props = defineProps<Props>();

const currentYear = (new Date()).getFullYear();
const daysInMonth = (month: number, year: number) => {
  return 32 - (new Date(year, month, 32)).getDate();
};
const months = ref(Array.from([props.month], (_, i) => {
  const m = new Date(0, i).toLocaleString('en-us', { month: 'short' });
  return {
    month: m,
    days: Array.from(Array(daysInMonth(i, currentYear)), (_, d) => ({ day: d + 1, checked: false, })),
  };
}));

const weeks = computed(() => {
  const days = months.value[0].days;
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
   weeks.push([...days.slice(i, i + 7)]); 
  }

  return weeks;
});

const toggleCheck = (month: number, day: number) => {
  months.value[month].days[day].checked = !months.value[month].days[day].checked;
};
</script>

<style>
.wrapper {
  display: flex;
}
.month-name {
  margin-bottom: 15px;
}
.month {
  padding: 0 10px;
  text-align: center;
}
.week {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.day {
  width: 35px;
  height: 35px;
  padding: .5rem;
  color: #333;
  line-height: 1;
  background-color: #f2f2f2;
  border-radius: 50%;
}
.day:not(:last-child) {
  margin-right: 10px;
}
.day:hover {
  cursor: pointer;
}
.day.checked {
  color: #fff;
  background-color: hsla(160, 100%, 37%, 0.2);
}
</style>
