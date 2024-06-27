import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  MantineProvider,
  Stack,
  Tooltip,
  UnstyledButton,
  rem,
} from '@mantine/core'
import Link from 'next/link'
import {
  IconClipboardList,
  IconClock,
  IconHome,
  IconLogout,
} from '@tabler/icons-react'
import './globals.css'
import classes from './layout.module.css'
import '@mantine/core/styles.css'
import StoreProvider from './storeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Where did my time go',
  description: 'A project time tracking tool',
}

interface NavbarLinkProps {
  href: string
  label: string
  children: React.ReactNode
}

const NavbarLink = ({ label, href, children }: NavbarLinkProps) => {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link href={href}>
        <UnstyledButton className={classes.link} data-active={undefined}>
          {children}
        </UnstyledButton>
      </Link>
    </Tooltip>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <MantineProvider>
            <section id={classes.app}>
              <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                  <Stack justify="center" gap={0}>
                    <NavbarLink label="Dashboard" href="/dashboard">
                      <IconHome
                        style={{ width: rem(20), height: rem(20) }}
                        stroke={1.5}
                      />
                    </NavbarLink>
                    <NavbarLink label="Projects" href="/projects">
                      <IconClipboardList
                        style={{ width: rem(20), height: rem(20) }}
                        stroke={1.5}
                      />
                    </NavbarLink>
                    <NavbarLink label="Time frames" href="/timeframes">
                      <IconClock
                        style={{ width: rem(20), height: rem(20) }}
                        stroke={1.5}
                      />
                    </NavbarLink>
                  </Stack>
                </div>
                <Stack justify="center" gap={0}>
                  <NavbarLink label="Logout" href="/logout">
                    <IconLogout
                      style={{ width: rem(20), height: rem(20) }}
                      stroke={1.5}
                    />
                  </NavbarLink>
                </Stack>
              </nav>
              <section id={classes.content}>{children}</section>
            </section>
          </MantineProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
