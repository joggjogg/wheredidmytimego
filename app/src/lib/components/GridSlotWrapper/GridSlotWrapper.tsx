import { Center, Loader, Stack } from '@mantine/core'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React from 'react'
import { errorToMessage } from '../services/helpers'

const GridSlotWrapper = ({
  children,
  isLoading,
  isError,
  isSuccess,
  error,
}: {
  children: JSX.Element | undefined
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  error: FetchBaseQueryError | SerializedError | undefined
}) => {
  return (
    <>
      {isLoading && (
        <Stack h={'100%'} justify="space-around">
          <Center>
            <Loader size={'sm'} color="gray" />
          </Center>
        </Stack>
      )}
      {isError && errorToMessage(error)}
      {isSuccess && children}
    </>
  )
}

export default GridSlotWrapper
