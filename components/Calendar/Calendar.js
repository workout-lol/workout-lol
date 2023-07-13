import React from 'react'
import { Checkbox, Flex, Tooltip, Text } from '@mantine/core'
import useWindowSize from '../../utils/useWindowSize'
import styles from './Calendar.module.css'

const Calendar = ({ workouts = [], variant = 'small' }) => {
  const size = useWindowSize()
  const rows = variant === 'small' ? 6 : 7
  const columns = variant === 'small' ? 1 : size.width >= 520 ? 20 : 10
  const allWorkouts = workouts

  return (
    <>
      {variant !== 'small' && (
        <Flex justify='center'>
          <Checkbox mr={3} className={styles.future} readOnly />
          {[...Array(columns)]
            .map((x, i) => {
              const date = new Date()
              date.setDate(date.getDate() + ((7 + (7 - date.getDay())) % 7))
              const days = 7 * i
              date.setDate(date.getDate() - days)
              const month = date.toLocaleString('en-US', { month: 'short' })
              date.setDate(date.getDate() - 7)

              return (
                <Text
                  key={`month-${i}`}
                  c='dimmed'
                  mr={3}
                  style={{
                    fontSize: '0.7em',
                    width: '20px',
                    overflow: 'visible',
                  }}
                >
                  {date.getDate() <= 7 ? month : ''}
                </Text>
              )
            })
            .reverse()}
        </Flex>
      )}
      <Flex justify='center'>
        {variant !== 'small' && (
          <Flex direction='column' mr='sm'>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              Mo
            </Text>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              Tu
            </Text>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              We
            </Text>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              Th
            </Text>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              Fr
            </Text>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              Sa
            </Text>
            <Text c='dimmed' style={{ fontSize: '0.7em', lineHeight: '2em' }}>
              Su
            </Text>
          </Flex>
        )}
        {[...Array(columns)]
          .map((x, i) => {
            return (
              <Flex
                key={`calendar-${variant}-${i}`}
                direction={variant === 'small' ? 'row' : 'column'}
              >
                {[...Array(rows)]
                  .map((x, j) => {
                    const date = new Date()
                    if (variant !== 'small') {
                      date.setDate(
                        date.getDate() + ((7 + (7 - date.getDay())) % 7)
                      ) // make it next sunday
                    }

                    const days = 7 * i + j
                    date.setDate(date.getDate() - days)
                    const dayWorkouts = allWorkouts.filter(
                      (w) =>
                        w.created_at.slice(0, 10) ===
                        date.toISOString().slice(0, 10)
                    )
                    const checked = dayWorkouts.some((w) =>
                      w.exercises.every((e) => e.completed)
                    )

                    const isToday =
                      new Date().toDateString() === date.toDateString()
                    const isFuture = new Date() < date
                    const className = isToday
                      ? styles.today
                      : isFuture
                      ? styles.future
                      : ''

                    return (
                      <Tooltip
                        label={date.toDateString()}
                        key={`calendar-${variant}-${j}-${i}`}
                      >
                        <Checkbox
                          color='green'
                          checked={checked || false}
                          mr={3}
                          mb={3}
                          className={className}
                          readOnly
                        />
                      </Tooltip>
                    )
                  })
                  .reverse()}
              </Flex>
            )
          })
          .reverse()}
      </Flex>
    </>
  )
}

export default Calendar
