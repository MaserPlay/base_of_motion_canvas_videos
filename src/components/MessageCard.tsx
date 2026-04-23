import { Filter, filtersSignal, FiltersSignal, Img, initial, invert, Layout, LayoutProps, PossibleCanvasStyle, Rect, signal, Txt } from "@motion-canvas/2d";
import { createDeferredEffect, createEffect, createRef, range, SignalValue, SimpleSignal, unwrap, useLogger, useRandom } from "@motion-canvas/core";

import { BrandColors, getRandomElement, ResourceUrls } from "../global"

export type Reactions = Map<string, number> | [string, number][]

export interface MessageCardProps extends LayoutProps {
    text: SignalValue<string>;
    author?: SignalValue<string>;
    icon?: SignalValue<string>;
    addImage?: SignalValue<string>;
    addImageOpacity?: SignalValue<number>;
    fill?: SignalValue<PossibleCanvasStyle>
    authorNicknameColor?: SignalValue<PossibleCanvasStyle>
    lineLenght?: SignalValue<number>
    imageFilters?: SignalValue<Filter[]>
    side?: SignalValue<MessageCard_Side>
    inline?: SignalValue<string>
    reactions?: SignalValue<Reactions>
}

let authorsColor = new Map<string, string>()
export enum MessageCard_Side {
  Left,
  Right,
}
function reactionsToMap(react:Reactions): Map<string, number> {
    return react instanceof Map ? react : new Map(react)
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

    @initial(new Map<string, number>())
    @signal()
    public declare readonly reactions: SimpleSignal<Reactions, this>;

    @initial(undefined)
    @signal()
    public declare readonly inline: SimpleSignal<string, this>;

    @initial("")
    @signal()
    public declare readonly icon: SimpleSignal<string, this>;

    @initial("")
    @signal()
    public declare readonly addImage: SimpleSignal<string, this>;

    @initial(1)
    @signal()
    public declare readonly addImageOpacity: SimpleSignal<number, this>;

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

        const colors = ["#4f0396", "#ea868f", "#75b798", "#00a396"]

        if (authorNickname != undefined && authorNickname != null && authorsColor.has(authorNickname))
        {
            return authorsColor.get(authorNickname)!!
        } else {
            const color = getRandomElement(colors, random)
            if (!(authorNickname == undefined || authorNickname == null)) {
                authorsColor.set(authorNickname, color)
            }
            return color
        }
    } 

    static authorProps = (name:string) => {
        return {
            author: name,
            image: `https://ui-avatars.com/api/?background=${MessageCard.telegramAuthorsColor(name).substring(1)}&size=512&color=fff&name=${encodeURIComponent(name)}&rounded=true&format=svg`
        };
    }

    public constructor(props: MessageCardProps) {

        props.fontSize ??= 30
        props.lineHeight ??= 30
        props.layout = true
        props.gap = 20
        props.alignItems = 'end'

        super(props);

        const ffontFamily = ""

        const reactionsRef = createRef<Layout>()

        this.add(
            <>
                <Img
                    src={this.icon}
                    radius={999}
                    size={() => {
                        var isVisible = this.icon().length != 0
                        isVisible = isVisible && this.side() == MessageCard_Side.Left
                        return isVisible ? 150 : 0
                    }}
                    filters={this.imageFilters}
                />
                <Layout
                    layout
                    direction={'column'}
                    gap={10}
                >
                    <Img
                        src={this.addImage}
                        width={'100%'}
                        opacity={this.addImageOpacity}
                        radius={40}
                    />
                    <Rect
                        layout
                        fill={this.fill}
                        radius={40}
                        direction={'column'}
                        padding={40}
                    >
                        <Txt
                            text={this.author}
                            fontFamily={ffontFamily}
                            fill={this.authorNicknameColor()}
                            fontSize={40}
                        />
                        <Txt
                            text={() => insertLineBreaksPreserveWords(this.text(), this.lineLenght())}
                            lineHeight={() => this.text().trim().length == 0 ? 0 : this.lineHeight()}
                            fontFamily={ffontFamily}
                            fill={BrandColors.FontColor}
                            fontSize={() => this.text().trim().length == 0 ? 0 : this.fontSize()}
                            margin={() => this.text().trim().length == 0 ? 0 : [this.author().trim().length == 0 ? 0 : 20, 0, 0, 0]}
                        />
                        <Layout
                            layout
                            ref={reactionsRef}
                            margin={() => reactionsToMap(this.reactions()).size == 0 ? 0 : [20, 0, 0, 0]}
                        />
                    </Rect>
                    <Rect
                        layout
                        fill={BrandColors.Secondary + "60"}
                        radius={40}
                        direction={'column'}
                        gap={40}
                        padding={() => this.inline()?.trim()?.length > 0 ? 40 : 0}
                    >
                        <Txt
                            text={this.inline}
                            fontFamily={ffontFamily}
                            fill={BrandColors.FontColor}
                            fontSize={this.fontSize}
                            textAlign={"center"}
                        />
                    </Rect>
                </Layout>
                <Img
                    src={this.icon}
                    size={() => {
                        var isVisible = this.icon().length != 0
                        isVisible = isVisible && this.side() == MessageCard_Side.Right
                        return isVisible ? 150 : 0
                    }}
                    filters={this.imageFilters}
                />
            </>
        )

        createDeferredEffect(() => {
            const reactions = reactionsToMap(this.reactions())
            
            const container = reactionsRef();
            if (!container) {
                useLogger().warn("container == null")
                return
            }

            container.removeChildren()

            reactions.forEach((count, emoji) => {
                container.add(
                    <Rect
                        fill={BrandColors.Secondary}
                        margin={10}
                        padding={10}
                        radius={20}
                    >
                        <Txt
                            fill={BrandColors.FontColor}
                            text={emoji + " " + count}
                        />
                    </Rect>
                )
            })

        })
    }
}

export function insertLineBreaksPreserveWords(text: string, lineLength: number = 25, transferOverflow = true): string {
    let result = '';

    for (const line of text.trim().split("\n")) {
        let currentlineLenght = 0;

        for (const word of line.trim().split(" ")) {
            if (transferOverflow && word.length > lineLength) {
                if (currentlineLenght > 0) {
                    result += "\n"
                }
                for (let start = 0; start < word.length; start = start + lineLength) {
                    result += word.substring(start, start + lineLength)
                    result += "\n"
                }
                currentlineLenght = 0
            }
            else if (currentlineLenght + word.length > lineLength) {
                result += "\n"
                currentlineLenght = 0
                currentlineLenght += word.length + 1
                result += word + " "
            } else {                
                currentlineLenght += word.length + 1
                result += word + " "
            }
        }
        result += "\n"
    }

    return result;
}