import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Skeleton, SkeletonText, SkeletonCard, SkeletonPropertyCard, SkeletonDashboardStats } from "../skeleton"

describe("Skeleton", () => {
  it("should render skeleton with default classes", () => {
    render(<Skeleton />)
    const skeleton = screen.getByTestId("skeleton")
    // @ts-expect-error - jest-dom matchers not typed
    expect(skeleton).toHaveClass("animate-pulse")
    // @ts-expect-error - jest-dom matchers not typed
    expect(skeleton).toHaveClass("bg-muted")
  })

  it("should render skeleton text with multiple lines", () => {
    render(<SkeletonText lines={3} />)
    const skeletons = screen.getAllByTestId("skeleton")
    expect(skeletons).toHaveLength(3)
  })

  it("should render skeleton card", () => {
    render(<SkeletonCard />)
    const skeletons = screen.getAllByTestId("skeleton")
    const card = skeletons[0].closest(".rounded-lg.border")
    // @ts-expect-error - jest-dom matchers not typed
    expect(card).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers not typed
    expect(card).toHaveClass("rounded-lg")
    // @ts-expect-error - jest-dom matchers not typed
    expect(card).toHaveClass("border")
  })

  it("should render skeleton property card", () => {
    render(<SkeletonPropertyCard />)
    const skeletons = screen.getAllByTestId("skeleton")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("should render skeleton dashboard stats with default count", () => {
    render(<SkeletonDashboardStats />)
    const skeletons = screen.getAllByTestId("skeleton")
    const grid = skeletons[0].closest(".grid")
    // @ts-expect-error - jest-dom matchers not typed
    expect(grid).toBeInTheDocument()
    // @ts-expect-error - jest-dom matchers not typed
    expect(grid).toHaveClass("grid")
  })

  it("should render skeleton dashboard stats with custom count", () => {
    render(<SkeletonDashboardStats count={2} />)
    const stats = screen.getAllByTestId("skeleton")
    expect(stats.length).toBeGreaterThanOrEqual(2)
  })
})