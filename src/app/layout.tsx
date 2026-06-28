import './globals.css'

type Props = {
  children: React.ReactNode
}

/** Required root layout — locale and Payload route groups supply their own document shells. */
export default function RootLayout({ children }: Props) {
  return children
}