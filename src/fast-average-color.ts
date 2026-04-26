import { FastAverageColor, FastAverageColorResult } from "fast-average-color"

export const AverageColor = new FastAverageColor()

export function* getAverageColorAsync(url: string) {
    const a = (yield AverageColor.getColorAsync(url)) as FastAverageColorResult
    return a
}