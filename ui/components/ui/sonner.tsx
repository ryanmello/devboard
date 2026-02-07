"use client"

import * as React from "react"
import { Toaster } from "sonner"

type SonnerProps = React.ComponentProps<typeof Toaster>

function Sonner(props: SonnerProps) {
  return <Toaster richColors closeButton {...props} />
}

export { Sonner }
