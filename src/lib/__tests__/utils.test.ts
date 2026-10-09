import { describe, it, expect } from "vitest"
import { cn } from "../utils"

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("base", "additional")).toBe("base additional")
    })

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional")
      expect(cn("base", false && "conditional")).toBe("base")
    })

    it("should handle tailwind conflicts with tailwind-merge", () => {
      expect(cn("p-2 p-4")).toBe("p-4")
      expect(cn("text-red-500 text-blue-500")).toBe("text-blue-500")
    })

    it("should handle arrays and objects", () => {
      expect(cn(["base", "additional"])).toBe("base additional")
      expect(cn({ "conditional-class": true, "other-class": false })).toBe("conditional-class")
    })

    it("should handle empty inputs", () => {
      expect(cn()).toBe("")
      expect(cn("")).toBe("")
      expect(cn(null as any, undefined as any)).toBe("")
    })
  })
})