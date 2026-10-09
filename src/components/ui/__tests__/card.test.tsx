import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card"

describe("Card", () => {
  it("should render card with children", () => {
    render(<Card>Card content</Card>)
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("should render card header", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>
    )
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Title")).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Description")).toBeInTheDocument()
  })

  it("should render card content", () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("should render card footer", () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    // @ts-expect-error - jest-dom matchers not typed
    expect(screen.getByText("Footer")).toBeInTheDocument()
  })

  it("should apply custom className", () => {
    render(<Card className="custom-class">Content</Card>)
    const card = screen.getByText("Content").closest(".custom-class")
    // @ts-expect-error - jest-dom matchers not typed
    expect(card).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers not typed
    expect(card).toHaveClass("custom-class")
  })
})