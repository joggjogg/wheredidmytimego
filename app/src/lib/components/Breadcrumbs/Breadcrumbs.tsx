import React from 'react'
import styles from './Breadcrumbs.module.css'
import { IconArrowRight } from '@tabler/icons-react'
import { Loader } from '@mantine/core'

const Breadcrumbs = ({
  items,
}: {
  items: { title?: string; href: string }[]
}) => {
  return (
    <ol
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className={styles.ol}
    >
      {items.map((item, index) => (
        <>
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <a itemProp="item" href={item.href}>
              <span itemProp="name">
                {item.title || <Loader color="black" type="dots" size={'sm'} />}
              </span>
            </a>
            <meta itemProp="position" content={`${index}`} />
          </li>
          {index < items.length - 1 && <IconArrowRight />}
        </>
      ))}
    </ol>
  )
}

export default Breadcrumbs
