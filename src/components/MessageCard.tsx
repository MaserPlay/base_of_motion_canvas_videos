import { Filter, filtersSignal, FiltersSignal, Img, initial, invert, Layout, LayoutProps, PossibleCanvasStyle, Rect, signal, Txt } from "@motion-canvas/2d";
import { createSignal, SignalValue, SimpleSignal, useRandom } from "@motion-canvas/core";

import { BrandColors, getRandomElement, ResourceUrls } from "../global"

export interface MessageCardProps extends LayoutProps {
    text: SignalValue<string>;
    author?: SignalValue<string>;
    image?: SignalValue<string>;
    fill?: SignalValue<PossibleCanvasStyle>
    authorNicknameColor?: SignalValue<PossibleCanvasStyle>
    lineLenght?: SignalValue<number>
    imageFilters?: SignalValue<Filter[]>
    side?: SignalValue<MessageCard_Side>
}

let authorsColor = new Map<string, PossibleCanvasStyle>()
export enum MessageCard_Side {
  Left,
  Right,
}

export class MessageCard extends Layout {
    
    @signal()
    public declare readonly text: SimpleSignal<string, this>;

    @initial(25)
    @signal()
    public declare readonly lineLenght: SimpleSignal<number, this>;

    @initial(MessageCard_Side.Left)
    @signal()
    public declare readonly side: SimpleSignal<MessageCard_Side, this>;

    @initial("")
    @signal()
    public declare readonly author: SimpleSignal<string, this>;

    @initial("")
    @signal()
    public declare readonly image: SimpleSignal<string, this>;

    @filtersSignal()
    public declare readonly imageFilters: FiltersSignal<this>;

    @initial(BrandColors.Primary)
    @signal()
    public declare readonly fill: SimpleSignal<PossibleCanvasStyle, this>;

    @initial(BrandColors.FontColor)
    @signal()
    public declare readonly authorNicknameColor: SimpleSignal<PossibleCanvasStyle, this>;

    static user = {
        author:"Пользователь",
        image:"https://cdn-icons-png.flaticon.com/512/10412/10412528.png",
        imageFilters:[invert(1)]
    };

    static maserplay = {
        author:"MaserPlay",
        image:ResourceUrls.maserplayIco
    };

    static telegramAuthorsColor = (authorNickname?: string) => {
        const random = useRandom()

        const colors = ["#FFFF", "#ea868f", "#75b798"]

        return createSignal(() => {
            if (authorsColor.has(authorNickname))
            {
                return authorsColor.get(authorNickname)
            } else {
                const color = getRandomElement(colors, random)
                if (!(authorNickname == undefined || authorNickname == null)) {
                    authorsColor.set(authorNickname, color)
                }
                return color
            }
        })
    } 

    public constructor(props?: MessageCardProps) {

        props.fontSize = props.fontSize ?? 30
        props.lineHeight = props.lineHeight ?? 30
        props.layout = true
        props.gap = 20
        props.alignItems = 'end'

        super(props);

        const ffontFamily = ""


        this.add(
            <>
                <Img
                    src={this.image}
                    size={() => {
                        var isVisible = this.image().length != 0
                        isVisible = isVisible && this.side() == MessageCard_Side.Left
                        return isVisible ? 150 : 0
                    }}
                    filters={this.imageFilters}
                />
                <Rect
                    layout
                    fill={this.fill}
                    radius={40}
                    direction={'column'}
                    gap={40}
                    padding={40}
                >
                    <Txt
                        text={this.author}
                        fontFamily={ffontFamily}
                        fill={this.authorNicknameColor()}
                        fontSize={50}
                    />
                    <Txt
                        text={() => insertLineBreaksPreserveWords(this.text(), this.lineLenght())}
                        lineHeight={this.lineHeight}
                        fontFamily={ffontFamily}
                        fill={BrandColors.FontColor}
                        fontSize={this.fontSize}
                    />
                </Rect>
                <Img
                    src={this.image}
                    size={() => {
                        var isVisible = this.image().length != 0
                        isVisible = isVisible && this.side() == MessageCard_Side.Right
                        return isVisible ? 150 : 0
                    }}
                    filters={this.imageFilters}
                />
            </>
        )
    }
}

export function insertLineBreaksPreserveWords(text: string, lineLengthh : number = 25): string {
    let result = '';
    let lineLength = 0;

    const words = text.trim().split(/(?=\n)|(?<=\n)/g); // Разделяем с сохранением переносов

    for (let word of words) {

        word = word.trim()

        if (word === '\n') {
            result += word;
            lineLength = 0;
            continue;
        }

        if (lineLength + word.length > lineLengthh) {
            if (lineLength > 0) {
                result += '\n';
                lineLength = 0;
            }

            if (word.length > lineLengthh) {
                let remaining = word;
                while (remaining.length > 0) {
                    const chunk = remaining.slice(0, lineLengthh);
                    result += chunk;
                    remaining = remaining.slice(lineLengthh);

                    if (remaining.length > 0) {
                        result += '\n';
                        lineLength = 0;
                    } else {
                        lineLength = chunk.length;
                    }
                }
            } else {
                result += word;
                lineLength = word.length;
            }
        } else {
            result += word;
            lineLength += word.length;
        }
    }

    return result;
}