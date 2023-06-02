import React from 'react'
import { Checkbox, Flex, Tooltip } from '@mantine/core';
import styles from './Calendar.module.css'

const Calendar = ({ user, variant = "small" }) => {
  const rows = variant === "small"? 6 : 7;
  const columns = variant === "small"? 1 : 20;

  return <Flex>
    { [...Array(columns)].map((x, i) => {
      return <Flex key={`calendar-${variant}-${i}`} direction={variant === 'small' ? 'row' : 'column'}>
        { [...Array(rows)].map((x, j) => {
          const date = new Date();
          if (variant !== "small") {
            date.setDate(date.getDate() + (7+(7-date.getDay())) % 7) // make it next sunday
          }

          const days = (7*i) + j
          date.setDate(date.getDate() - days);
          const dayWorkouts = []// TODO user.workouts && user.workouts
          const checked = dayWorkouts && dayWorkouts.some(w => w.every(e => e.completed))

          const isToday = (new Date().toDateString() === date.toDateString())
          const isFuture = (new Date() < date)
          const className = isToday
            ? styles.today
            : isFuture ? styles.future : ''

          return <Tooltip label={date.toDateString()} key={`calendar-${variant}-${j}-${i}`}>
            <Checkbox
              color="green"
              checked={checked || false}
              mr={3}
              mb={3}
              className={className}
              readOnly
            />
          </Tooltip>
        }).reverse()}
      </Flex>
    }).reverse() }
  </Flex>
}

export default Calendar
