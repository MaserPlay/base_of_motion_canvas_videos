import {
    Img,
    Layout,
    Rect,
    Txt,
    signal,
    initial,
    LayoutProps,
    ImgProps,
    Icon,
} from "@motion-canvas/2d";
import {
    SimpleSignal,
    SignalValue,
    createRef,
    Reference,
    createDeferredEffect,
    Vector2,
    all,
    tween,
    useRandom,
    useThread,
} from "@motion-canvas/core";

import { BrandColors } from "../global";

export interface VirtualKeyboardProps extends ImgProps {
    selectedLetter?: SignalValue<string | null>;
    showFinger?: SignalValue<boolean>
}

export class VirtualKeyboard extends Img {

    @initial(null)
    @signal()
    public declare readonly selectedLetter: SimpleSignal<string | null, this>;

    @initial(false)
    @signal()
    public declare readonly showFinger: SimpleSignal<boolean, this>;

    private declare readonly fingerRef: Reference<Txt>
    private keyPositions = new Map<string, () => Vector2>();

    public constructor(props: VirtualKeyboardProps) {
        props.layout = false
        super(props);

        this.fingerRef = createRef<Txt>()

        const segmenter = new Intl.Segmenter()

        const keyboardLetters = "йцукенгшщзх\nфывапролджэ\n\u{eef6}ячсмитьбю\u{e14a}\n?,\u{e894} .\u{e5d9}"

        const letterHeight = this.height() / keyboardLetters.split("\n").length
        const letterWidth = (this.width() / [...segmenter.segment(keyboardLetters.split("\n")[0])].map(s => s.segment).length) - 2

        this.add(
            <>
                <Layout
                    layout
                    direction={"column"}
                    alignContent={"center"}
                    alignItems={"stretch"}
                    alignSelf={"center"}
                    textAlign={"center"}
                    size={this.size}
                    gap={2}
                >
                    {
                        ...keyboardLetters.split("\n").map(line => (
                            <Layout
                                layout
                                direction={"row"}
                                gap={2}
                                grow={1}
                                alignContent={"center"}
                                alignItems={"stretch"}
                                alignSelf={"center"}
                                textAlign={"center"}
                            >
                                {
                                    ...[...segmenter.segment(line)].map(s => s.segment).map(l => (
                                        <Rect
                                            ref={ref => {
                                                if (ref) {
                                                    this.keyPositions.set(l, () => ref.absolutePosition());
                                                }
                                            }}
                                            width={l == " " ? letterWidth * 6 : letterWidth}
                                            height={letterHeight}
                                            fill={() => (this.selectedLetter() == l) ? (BrandColors.Secondary) : (BrandColors.Secondary + "90")}
                                            radius={10}
                                            grow={1}
                                            layout
                                            alignContent={"center"}
                                            alignItems={"stretch"}
                                            alignSelf={"center"}
                                            textAlign={"center"}
                                        >
                                            <Txt
                                                text={l}
                                                fill={BrandColors.FontColor}
                                                fontFamily={"Material Symbols Outlined"}
                                            />
                                        </Rect>
                                    ))
                                }
                            </Layout>
                        ))
                    }
                </Layout>
                <Txt
                    ref={this.fingerRef}
                    text={"\u{ef4a}"}
                    fill={BrandColors.FontColor}
                    fontFamily={"Material Symbols Outlined"}

                    opacity={() => this.showFinger() ? 1 : 0}
                />
            </>
        );
    }

    public *moveFingerTo(
        key: string,
        duration = 0.0,
        options?: {
            curve?: number;     // степень кривизны
            randomize?: number; // "дрожание бабушки"
        }
    ) {
        const random = useRandom()
        const target = this.keyPositions.get(key)?.();
        if (!target) return;

        const start = this.fingerRef().absolutePosition();
        const end = target;

        const jitter = options?.randomize ?? 0;

        const curve = options?.curve ?? 0;
        const mid = start.lerp(end, 0.5).add([
            random.nextInt(-.5,.5) * curve,
            random.nextInt(-.5,.5) * curve,
        ]);

        function recalcNextPos(t:number) {

            const base = start
                .lerp(mid, t)
                .lerp(mid.lerp(end, t), t);

            return base.add([
                random.nextInt(-.5,.5) * jitter,
                random.nextInt(-.5,.5) * jitter,
            ]);
        }
        
        const thread = useThread();
        const startTime = thread.time();
        const endTime = thread.time() + duration;
        while (endTime > thread.fixed) {
            const time = thread.fixed - startTime;
            const value = time / duration;
            if (time > 0) {
                yield* this.fingerRef().absolutePosition(recalcNextPos(value), .1);
            }
            yield;
        }
        thread.time(endTime);
        this.fingerRef().absolutePosition(end)


        yield* all(
            this.fingerRef().scale(0.8, 0.1),
            this.selectedLetter(key, 0.1)
        );

        yield* this.fingerRef().scale(1, 0.1);
    }
}