import {
    Circle,
    Img,
    Layout,
    Rect,
    Node,
    NodeProps,
    initial,
    signal,
} from "@motion-canvas/2d";
import {
    createRef,
    SignalValue,
    SimpleSignal,
    waitFor,
} from "@motion-canvas/core";
import { useTime } from "@motion-canvas/core";

export interface CallingPhoneProps extends NodeProps {
    src?: SignalValue<string | null>;
    shaking?: boolean;
}

export class CallingPhone extends Node {
    private readonly callingRef = createRef<Img>();
    private readonly circles = Array.from({ length: 5 }, () =>
        createRef<Circle>()
    );

    @initial(0)
    @signal()
    public declare readonly vibrationStrength: SimpleSignal<number, this>;

    public constructor(props: CallingPhoneProps) {
        super(props);

        this.add(
            <Layout>
                {
                    ...this.circles.map(r => (
                        <Circle
                            ref={r}
                            stroke={"#474747"}
                            lineWidth={10}
                            size={0}
                        />
                    ))
                }

                <Rect
                    size={() => this.callingRef()?.size()?.add(20)}
                    rotation={() => this.callingRef()?.rotation()}
                    position={() => this.callingRef()?.position()}
                    radius={() => this.callingRef()?.radius()}
                    fill={"#8b8b8b"}
                />

                <Img
                    ref={this.callingRef}
                    src={props.src}
                    radius={70}
                    height={900}
                />
            </Layout>
        );
    }

    public *rippleEffect() {
        for (const r of this.circles) {
            r().size(0);

            yield r().size(2220, 0.8);
            yield* waitFor(0.3);
        }

        yield* waitFor(.3)
    }

    public *vibrationEffect() {
        const t = useTime();

        const intensity = 4;

        this.callingRef().position([
            Math.sin(t * 18) * intensity,
            Math.sin(t * 22) * intensity,
        ]);

        this.callingRef().rotation(Math.sin(t * 15) * 1.5);

        yield;
    }
}