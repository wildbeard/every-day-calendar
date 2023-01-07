<template>
  <div class="wrapper">
    <div class="month" >
      <div class="month-name">
        {{ month.full }}
      </div>
      <div class="week" v-for="(week, w) in weeks" :key="w">
        <div class="day"
          v-for="(day, d) in week"
          :key="`${month.short}-${d}`"
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
const emits = defineEmits(['toggleDate']);

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
</script>

<style>
.wrapper {
  display: flex;
}
.month-name {
  margin-bottom: 15px;
  font-size: 1.75rem;
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
