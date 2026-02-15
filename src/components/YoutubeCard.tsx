import { Img, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { all, chain, createRef, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { Colors } from "../global";

import bell from "../img/bell.svg"

export interface YoutubeCardProps extends RectProps {
    channelname: SignalValue<string>;
    channelIco: SignalValue<string>;
    subCount: SignalValue<string>;
}

export class YoutubeCard extends Rect {

    @signal()
    public declare readonly channelIco: SimpleSignal<string, this>;
    @signal()
    public declare readonly channelname: SimpleSignal<string, this>;
    @signal()
    public declare readonly subCount: SimpleSignal<string, this>;

    readonly isSubColor = "#a1a1a1ff"
    readonly notSubColor = "#ff3535ff"
    
    readonly isSubText = "Подписан"
    readonly notSubText = "Подписаться"

    readonly subButton = createRef<Rect>();
    readonly subLayout = createRef<Layout>();
    readonly subText = createRef<Txt>();
    readonly bell = createRef<Img>();

    public constructor(props?: YoutubeCardProps) {

        props.layout = true
        props.fill = Colors.WHITE
        props.radius = 50
        props.padding = 30

        super(props)

        this.add(
            new Img({
                src: this.channelIco,
                radius: 150,
                size: 400,
                margin: 50
            })
        )
        this.add(
            <Layout layout direction={'column'} padding={30}>
                <Txt
                    text={this.channelname}
                    padding={30}
                    fontWeight={700}
                />
                <Txt
                    text={() => this.subCount() + " подписчиков"}
                    padding={30}
                />
                <Rect
                    ref={this.subButton}
                    fill={this.notSubColor}
                    layout
                    radius={90}
                    padding={50}
                >
                    <Layout
                        ref={this.subLayout}
                        layout
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Txt
                            ref={this.subText}
                            text={"Подписаться"}
                            fill={Colors.WHITE}
                        />
                        <Img   
                            ref={this.bell}
                            src={bell}
                            size={100}
                            opacity={0}
                        />
                    </Layout>
                </Rect>
            </Layout>
        )
    }
    public * subscribe() {
        yield* all(
            this.subButton().fill(this.isSubColor, .5),
            this.subText().text(this.isSubText, .5),
            this.bell().opacity(1, .5),
        )
    }
    public * clickBell() {
        yield* all(
            chain(
                this.bell().rotation(20, .5),
                this.bell().rotation(-20, .5),
                this.bell().rotation(0, .5),
            ),
            chain(
                this.bell().scale(1.1, .75),
                this.bell().scale(1, .75)
            )
        )
    }
    public * unSubscribe() {
        yield* all(
            this.subButton().fill(this.notSubColor, .5),
            this.subText().text(this.notSubText, .5),
            this.bell().opacity(0, .5),
        )
    }
}