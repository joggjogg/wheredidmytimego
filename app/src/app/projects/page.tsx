import React from 'react'
import styles from './projects.module.css'
import ProjectList from './components/ProjectList'
import ProjectCreate from './components/ProjectCreate'

const Projects = () => {
  return (
    <>
      <h1>Projects</h1>
      <div className={styles.grid}>
        <div className={styles.itemOne}>
          <ProjectList />
        </div>
        <div className={styles.itemTwo}>
          <ProjectCreate />
        </div>
      </div>
    </>
  )
}

export default Projects
