import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { useToast } from "../useToast"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

function TestComponent() {
  const { toast, toasts, dismiss } = useToast()
  return (
    <div>
      <button onClick={() => toast({ title: "Test Toast", description: "Test Description" })}>Show Toast</button>
      <button onClick={() => dismiss()}>Dismiss All</button>
      <div data-testid="toast-count">{toasts.length}</div>
    </div>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should provide toast function", () => {
    render(<Wrapper><TestComponent /></Wrapper>)
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Show Toast")).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Dismiss All")).toBeInTheDocument()
  })

  it("should render ToastViewport", () => {
    render(<Wrapper><TestComponent /></Wrapper>)
    const viewport = screen.getByRole("region", { name: "Notifications (F8)" })
    // @ts-expect-error - jest-dom matchers not typed
    expect(viewport).toBeInTheDocument()
  })
})