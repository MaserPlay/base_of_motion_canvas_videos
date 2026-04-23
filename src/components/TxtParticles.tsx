import { canvasStyleSignal, Circle, CircleProps, initial, Layout, LayoutProps, Length, PossibleCanvasStyle, signal, Txt } from "@motion-canvas/2d";
import { all, createRef, createSignal, easeOutCubic, PossibleSpacing, PossibleVector2, range, Reference, SignalValue, SimpleSignal, useRandom, waitFor } from "@motion-canvas/core";

export type PropertyGenerator<T> = () => T

type Range = { min: number; max: number };

export interface TxtParticlesProps extends LayoutProps {
    count?: number;
    radius?: PossibleVector2<Length>;
    text?: string;
    duration?: number;
    fill?: SignalValue<PossibleCanvasStyle>;

    delay?: Range;
    radiusStart?: Range;
    radiusEnd?: Range;
    rotationStart?: Range;
    rotationEnd?: Range;
    fadeIn?: number;
    fadeOut?: number;
}
export class TxtParticles extends Layout {
    @initial(20)
    @signal()
    private declare readonly count: SimpleSignal<number, this>;

    @initial(500)
    @signal()
    private declare readonly radius: SimpleSignal<PossibleVector2<Length>, this>;

    @initial("✨")
    @signal()
    private declare readonly text: SimpleSignal<string, this>;

    @initial(1)
    @signal()
    private declare readonly duration: SimpleSignal<number, this>;

    @canvasStyleSignal()
    public declare readonly fill: SimpleSignal<PossibleCanvasStyle, this>;

    @initial({ min: 0, max: 0.3 }) @signal() public declare readonly delay: SimpleSignal<Range, this>;
    @initial({ min: 0.2, max: 1 }) @signal() public declare readonly radiusStart: SimpleSignal<Range, this>;
    @initial({ min: 1.5, max: 3 }) @signal() public declare readonly radiusEnd: SimpleSignal<Range, this>;
    @initial({ min: -20, max: 20 }) @signal() public declare readonly rotationStart: SimpleSignal<Range, this>;
    @initial({ min: -60, max: 60 }) @signal() public declare readonly rotationEnd: SimpleSignal<Range, this>;
    @initial(0.2) @signal() public declare readonly fadeIn: SimpleSignal<number, this>;
    @initial(0.3) @signal() public declare readonly fadeOut: SimpleSignal<number, this>;

    private emitterRef = createRef<Circle>();
    private particles: {
        ref: Reference<Txt>;
        percent: number;
        radiusMul: SimpleSignal<number, TxtParticles>;
        opacity: SimpleSignal<number, TxtParticles>;
        rotation: SimpleSignal<number, TxtParticles>;
    }[] = [];

    public constructor(props: TxtParticlesProps) {
        super({
            ...props,
            layout: false,
        });

        const random = useRandom();

        const count = props?.count ?? 20;

        this.particles = range(0, 1, 1 / count).map(v => ({
            ref: createRef<Txt>(),
            percent: v,
            radiusMul: createSignal(1),
            opacity: createSignal(0),
            rotation: createSignal(0),
        }));

        this.add(
            <>
                <Circle
                    ref={this.emitterRef}
                    size={() => this.radius()}
                    opacity={0}
                />

                {
                    this.particles.map(p => (
                        <Txt
                            ref={p.ref}
                            text={() => this.text()}
                            position={() =>
                                this.emitterRef()
                                    .getPointAtPercentage(p.percent)
                                    .position.mul(p.radiusMul())
                            }
                            opacity={() => p.opacity()}
                            rotation={() => p.rotation()}
                            fontFamily={() => this.fontFamily()}
                            fontStyle={() => this.fontStyle()}
                            fill={this.fill}
                        />
                    ))
                }
            </>
        );
    }

    private rand(range: Range) {
        const r = useRandom();
        return r.nextFloat(range.min, range.max);
    }

    public *burst() {
        const duration = this.duration();

        yield* all(
            ...this.particles.map(p =>
                (function* (self: TxtParticles) {
                    const delay = self.rand(self.delay());

                    p.radiusMul(self.rand(self.radiusStart()));
                    p.rotation(self.rand(self.rotationStart()));
                    p.opacity(0);

                    yield* waitFor(delay);

                    yield p.opacity(1, self.fadeIn());

                    yield* all(
                        p.radiusMul(self.rand(self.radiusEnd()), duration, easeOutCubic),
                        p.rotation(self.rand(self.rotationEnd()), duration)
                    );

                    yield* p.opacity(0, self.fadeOut());
                })(this)
            )
        );
    }
}