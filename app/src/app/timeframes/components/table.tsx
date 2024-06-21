import React, { useState } from 'react'
import {
  Table,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
} from '@mantine/core'
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from '@tabler/icons-react'
import classes from './table.module.css'

interface RowData {
  timeFrameStart: string
  timeFrameEnd: string
  project: string
}

interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim()
  return data.filter(item =>
    keys(data[0]).some(key => item[key].toLowerCase().includes(query)),
  )
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload

  if (!sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy])
      }

      return a[sortBy].localeCompare(b[sortBy])
    }),
    payload.search,
  )
}

let data = [
  {
    timeFrameStart: '12:00:05',
    timeFrameEnd: '14:20:20',
    project: 'Where did my time go?',
  },
]

for (let index = 0; index < 20; index++) {
  data = [
    ...data,
    {
      timeFrameStart: '12:00:05',
      timeFrameEnd: '14:20:20',
      project: 'Where did my time go?',
    },
  ]
}

const TimeFrameTable = () => {
  const [search, setSearch] = useState('')
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    )
  }

  const rows = sortedData.map(row => (
    <Table.Tr key={row.timeFrameStart}>
      <Table.Td>{row.project}</Table.Td>
      <Table.Td>{row.timeFrameStart}</Table.Td>
      <Table.Td>{row.timeFrameEnd}</Table.Td>
    </Table.Tr>
  ))

  return (
    <>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        stickyHeader
        stickyHeaderOffset={60}
        horizontalSpacing="md"
        verticalSpacing="xs"
        layout="fixed"
        h={'100%'}
      >
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'project'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('project')}
            >
              Project
            </Th>
            <Th
              sorted={sortBy === 'timeFrameStart'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('timeFrameStart')}
            >
              Start
            </Th>
            <Th
              sorted={sortBy === 'timeFrameEnd'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('timeFrameEnd')}
            >
              End
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody className={classes.tableBody}>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  )
}

export default TimeFrameTable
