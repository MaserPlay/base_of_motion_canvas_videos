import { Img, initial, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import { Colors } from "../global";
import { insertLineBreaksPreserveWords, MessageCard } from "./MessageCard";

export interface YoutubeCommentsProps extends RectProps {
    placeholderText?: SignalValue<string>;
    comments?: SignalValue<string[]>;
}

export class YoutubeComments extends Rect {

    @signal()
    @initial("Очень крутой комментарий")
    public declare readonly placeholderText: SimpleSignal<string, this>;
    
    @signal()
    @initial(["Очень крутой комментарий", "Комментарий сомнительного содержания"])
    public declare readonly comments: SimpleSignal<string[], this>;

    public constructor(props?: YoutubeCommentsProps) {

        props.layout = true
        props.direction = 'column'
        props.fill = Colors.WHITE
        props.offsetY = -1
        props.radius = 30
        props.padding = 20
        props.width = props.width ?? 1000

        super(props)

        this.add(
            <Rect
                stroke={"#969696ff"}
                lineWidth={10}
                radius={90}
                padding={50}
                layout
            >
                <Txt
                    text={() => insertLineBreaksPreserveWords(this.placeholderText(), 35)}
                />
            </Rect>
        )
        this.add(
            this.comments().map(c => (
                <Layout layout margin={20}>
                    <Img
                        src={MessageCard.user.image}
                        size={100}
                        margin={10}
                    />
                    <Txt
                        text={() => insertLineBreaksPreserveWords(c, 30, true)}
                    />
                </Layout>
            ))
        )
    }
}