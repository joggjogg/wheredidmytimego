'use client'
import React from 'react'
import TimeFrameActive from './components/TimeFrameActive'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'
import TimeFrameList from './components/TimeFrameList'
import styles from './timeFrames.module.css'

export default function Timeframes() {
  return (
    <>
      <h1>TimeFrames</h1>
      <div className={styles.grid}>
        <div className={styles.itemOne}>
          <TimeFrameActive />
        </div>
        <div className={styles.itemTwo}>
          <TimeFrameStart />
        </div>
        <div className={styles.itemThree}>
          <TimeFrameStop />
        </div>
        <div className={styles.itemFour}>
          <TimeFrameList />
        </div>
      </div>
    </>
  )
}
