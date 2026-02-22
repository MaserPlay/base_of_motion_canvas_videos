import { Txt, View2D } from "@motion-canvas/2d";
import { chain, createRef, range, Reference, ThreadGenerator, useRandom, useTransition, Vector2 } from "@motion-canvas/core";
import { getRandomElement, randomMix } from "../global";

export function* fillTransition(
    emojis : string[] | string = ["?", "🤔", "👀"],
    waitDuration = 0
): ThreadGenerator {
    
    const emojisArray = 
        typeof emojis === "string" ? Array.from(emojis) : emojis;
        
    let questions: {
        ref: Reference<Txt>;
    }[];

    const random = useRandom()
    
    // set up the transition
    const endTransition = useTransition(
        /* current */ ctx => {
            const view = ctx.view as View2D
                
            {
                const gridWidth = 1900;
                const gridHeight = 1000;
                const cols = 10;
                const rows = 6;
                const cellWidth = gridWidth / cols;
                const cellHeight = gridHeight / rows;
        
                questions = range(cols * rows).map(i => ({ref: createRef<Txt>()}))
        
                view.add(
                    <>
                        {
                            questions.map((q, index) => {
                                const col = index % cols;
                                const row = Math.floor(index / cols);
                                const baseX = (col - cols / 2 + 0.5) * cellWidth;
                                const baseY = (row - rows / 2 + 0.5) * cellHeight;
            
                                // Случайное отклонение от центра ячейки
                                const offsetX = (random.nextFloat() - 0.5) * cellWidth * 0.1;
                                const offsetY = (random.nextFloat() - 0.5) * cellHeight * 0.1;
            
                                return (
                                    <Txt
                                        ref={q.ref}
                                        text={getRandomElement(["?", "🤔", "👀"])}
                                        fill={"white"}
                                        fontSize={(random.nextFloat() + .3) * 130}
                                        position={new Vector2(baseX + offsetX, baseY + offsetY)}
                                        opacity={0}
                                    />
                                );
                            })
                        }
                    </>
                );
            }
        },
        /* previous */ ctx => {
        },
        /* previousOnTop */ false
    );
    

    yield* chain(
        ...questions.map(i => i.ref().opacity(1, .01))
    )

    // perform animations

    // finish the transition
    endTransition();
}

export function fillFade(
    view: View2D,
    emojis : string[] | string = ["?", "🤔", "👀"]
): { show: () => ThreadGenerator, hide: () => ThreadGenerator } {    
    
    const emojisArray = 
        typeof emojis === "string" ? Array.from(emojis) : emojis;
        
    let questions: Reference<Txt>[] = [];

    const random = useRandom()
    
    {
        const gridWidth = 1900;
        const gridHeight = 1000;
        const cols = 13;
        const rows = 7;
        const cellWidth = gridWidth / cols;
        const cellHeight = gridHeight / rows;

        const newQuestions = (range(cols * rows).map(i => (createRef<Txt>())))

        view.add(
            newQuestions.map((q, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                const baseX = (col - cols / 2 + 0.5) * cellWidth;
                const baseY = (row - rows / 2 + 0.5) * cellHeight;

                // Случайное отклонение от центра ячейки
                const offsetX = (random.nextFloat() - 0.5) * cellWidth * 0.1;
                const offsetY = (random.nextFloat() - 0.5) * cellHeight * 0.1;

                return (
                    <Txt
                        ref={q}
                        text={getRandomElement((emojisArray))}
                        fill={"white"}
                        fontSize={random.nextFloat(150, 180)}
                        position={new Vector2(baseX + offsetX, baseY + offsetY)}
                        rotation={random.nextFloat(-30, 30)}
                        opacity={0}
                    />
                );
            })
        );

        questions = questions.concat(newQuestions)
    }

    questions = randomMix(questions, random)

    return {
        show: (function* () {
            yield* chain(
                ...questions.map(q => q().opacity(1, .003))
            )
        }),
        hide: (function* () {
            yield* chain(
                ...questions.map(q => q().opacity(0, .003))
            )
        }),
    }
}

export function filterEmoji(array: string[]) {
    const emojiRegex = /\p{Emoji}/u;
    return array.filter(char => emojiRegex.test(char));
}