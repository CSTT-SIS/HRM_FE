import { isPositive } from ".";

describe('department module', () => {
    it('should return true when n>0', () => {
        expect(isPositive(1)).toBe(true)
    });
    it('should return false when n = 0', () => {
        expect(isPositive(0)).toBe(false)
    });
    it('should return false when < 0', () => {
        expect(isPositive(-1)).toBe(false)
    });
})