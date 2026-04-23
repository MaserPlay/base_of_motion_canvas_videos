import { Code, CodeHighlighter, codeSignal, CodeSignal, defaultStyle, initial, PossibleCodeScope, Rect, RectProps, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";


export interface CodeCardProps extends RectProps {
    highlighter?: SignalValue<CodeHighlighter | null>;
    code: SignalValue<PossibleCodeScope>;
    codeFontSize?: SignalValue<number>;
}


export class CodeCard extends Rect {

    @initial(() => Code.defaultHighlighter)
    @signal()
    public declare readonly highlighter: SimpleSignal<
        CodeHighlighter | null,
        this
    >;

    @signal()
    public declare readonly code: SimpleSignal<PossibleCodeScope, this>;

    @defaultStyle('font-size', parseFloat)
    @signal()
    public declare readonly codeFontSize: SimpleSignal<number, this>;

    public constructor(props: CodeCardProps) {

        props.radius ??= 18
        props.padding ??= 20
        props.fill ??= "#161616ff"
        props.layout ??= true

        super(props);


        this.add(
            <Code
                code={() => this.code()}
                highlighter={() => this.highlighter()}
                fontSize={() => this.codeFontSize()}
            />
        )
    }
}