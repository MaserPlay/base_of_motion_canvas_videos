import { Txt, TxtProps, View2D, Node } from "@motion-canvas/2d";
import { loop, Random, Reference, SimpleSignal, ThreadGenerator, Vector2 } from "@motion-canvas/core";
import { FastAverageColor, FastAverageColorResult } from "fast-average-color";

export function rescaleToFullHdFactor(view: View2D)
{
    return new Vector2(view.width() / 1920, view.height() / 1080)
}

export function rescaleToFullHd(view: View2D) {
    view.scale(() => rescaleToFullHdFactor(view))
}

export function screenAppTimestampsToTimestamps(input: {
    speaker_id: number;
    timestamp: number;
    uuid: string;
    text: (string | number)[][];
    id: number;
}[]) {
    return input.map(s => s.text.map(t => ({
        start: (t[0] as number),
        end: (t[1] as number),
        word: (t[3] as string)
    })))
}

export function screenApp2TimestampsToTimestamps(input: {
    speaker_id: number;
    timestamp: number;
    uuid: string;
    text: (string | number)[][];
    id: number;
}[]) {
    return input.map(s => s.text.map(t => ({
        start: (t[0] as number),
        end: (t[1] as number),
        word: (t[3] as string)
    })))
}

export function getRandomElement<T>(array: T[], random?: Random): T {
    let randomIndex: number

    if (random) {
        randomIndex = Math.floor(random.nextFloat(0, 1) * array.length)
    } else {
        randomIndex = Math.floor(Math.random() * array.length);
    }

    return array[randomIndex];
}

export const AverageColor = new FastAverageColor()

export function* getAverageColorAsync(url : string)
{
    const a = (yield AverageColor.getColorAsync(url)) as FastAverageColorResult
    return a
}

export enum Colors {
    BLACK = "#000000ff",
    WHITE = "#ffffffff"
}
export const BrandColors = {
    Background: "hsl(210, 11%, 8%)",
    FontColor: Colors.WHITE,
    Primary: "#0d6efd",
    Secondary: "#6c757d",
    Accent: "#56ff3fff"
}
export const ResourceUrls = {
    maserplayIco: "https://avatars.githubusercontent.com/u/88372261?v=4",
    dadIco: "https://gitlab.m2023.ru/uploads/-/system/user/avatar/1/avatar.png?width=400"
}
export function onlyReference(view: View2D, props?: TxtProps) {
    return new Txt({
        text: "Демонстрация только для примера, реализация может отличаться!",
        fill: BrandColors.Secondary,
        topRight: () => [view.middle().x, -view.middle().y],
        fontSize: 30,
        key: "onlyReference",
        ...props
    })
}

export function* animateClone<T extends Node>(
    scene: Node,
    node: T,
    callback: (clone: T) => ThreadGenerator
) {
    const clone = node.clone();
    scene.add(clone);
    clone.absolutePosition(node.absolutePosition());
    node.opacity(0);

    yield* callback(clone);

    clone.remove();
    node.opacity(1);
}

export function* shaking(intensity: number, component: Reference<Node>, duration: number = 0.8, shakeCount: number = 8) {
    const originalPosition = component().position();
    const shakeDuration = duration / shakeCount;
    
    yield* loop(shakeCount, function* (i) {
        const decay = 1 - (i / shakeCount);
        const offsetX = (i % 2 === 0 ? 1 : -1) * intensity * decay;
        const offsetY = (i % 3 === 0 ? 1 : -1) * intensity * decay * 0.7;
        yield* component().position(originalPosition.add(new Vector2(offsetX, offsetY)), shakeDuration);
    });
    
    // Возвращаем в исходное положение
    yield* component().position(originalPosition, shakeDuration);
}