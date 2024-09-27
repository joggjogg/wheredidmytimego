import React from 'react'

const Breadcrumbs = ({
  items,
}: {
  items: { title: string; href: string }[]
}) => {
  return (
    <ol itemScope itemType="https://schema.org/BreadcrumbList">
      {items.map((item, index) => (
        <li
          key={index}
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <a itemProp="item" href={item.href}>
            <span itemProp="name">{item.title}</span>
          </a>
          <meta itemProp="position" content={`${index}`} />
        </li>
      ))}
    </ol>
  )
}

export default Breadcrumbs
