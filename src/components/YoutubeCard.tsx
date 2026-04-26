import { Img, initial, invert, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { all, chain, createRef, SignalValue, SimpleSignal } from "@motion-canvas/core";

const bell = "https://raw.githubusercontent.com/google/material-design-icons/master/png/social/notifications/materialiconsoutlined/48dp/2x/outline_notifications_black_48dp.png"

// or data uri
// const bell = "data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20height=%2224%22%20viewBox=%220%200%2024%2024%22%20width=%2224%22%3E%3Cpath%20d=%22M0%200h24v24H0V0z%22%20fill=%22none%22/%3E%3Cpath%20d=%22M12%2022c1.1%200%202-.9%202-2h-4c0%201.1.9%202%202%202zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5%201.5v.68C7.64%205.36%206%207.92%206%2011v5l-2%202v1h16v-1l-2-2zm-2%201H8v-6c0-2.48%201.51-4.5%204-4.5s4%202.02%204%204.5v6z%22/%3E%3C/svg%3E"

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
    @initial(false)
    @signal()
    private declare readonly isSub: SimpleSignal<boolean, this>;

    private readonly isSubColor = "#a1a1a1ff"
    private readonly notSubColor = "#ff3535ff"
    
    private readonly isSubText = "Подписан"
    private readonly notSubText = "Подписаться"

    private readonly subButton = createRef<Rect>();
    private readonly subLayout = createRef<Layout>();
    private readonly subText = createRef<Txt>();
    private readonly bell = createRef<Img>();

    public constructor(props: YoutubeCardProps) {

        props.layout = true
        props.fill = 'white'
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
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Txt
                        ref={this.subText}
                        text={"Подписаться"}
                        fill={'white'}
                    />
                    <Img   
                        ref={this.bell}
                        src={bell}
                        size={0}
                        opacity={0}
                        filters={[invert(1)]}
                    />
                </Rect>
            </Layout>
        )
    }
    public * subscribe() {
        if (this.isSub()) {
            return
        }
        yield* all(
            this.subButton().fill(this.isSubColor, .5),
            this.subText().text(this.isSubText, .5),
            this.bell().opacity(1, .5),
            this.bell().size(100, .5)
        )
        this.isSub(true)
    }
    public * clickBell() {
        if (!this.isSub()) {
            return
        }
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
        if (!this.isSub()) {
            return
        }
        yield* all(
            this.subButton().fill(this.notSubColor, .5),
            this.subText().text(this.notSubText, .5),
            this.bell().opacity(0, .5),
            this.bell().size(0, .5)
        )
        this.isSub(false)
    }
}