import { Img, Layout, makeScene2D } from "@motion-canvas/2d";
import { createRef, easeOutElastic, useDuration, waitUntil } from "@motion-canvas/core";
import { BrandColors, ResourceUrls } from "../global";


export default makeScene2D(function* (view) {

    const layout = createRef<Layout>()
    const logo = createRef<Img>()

    view.fill(BrandColors.Background)

    view.add(
        <>
            <Layout 
                layout={true}
                ref={layout}
                direction={'column'}
                alignItems={"center"}
                gap={10}
            >
                <Img
                    ref={logo}
                    src={ResourceUrls.maserplayIco}
                    scale={.1}
                    shadowBlur={300}
                    shadowColor={BrandColors.Primary}
                />
            </Layout>
        </>
    )

    yield logo().scale(3, useDuration("hello"), easeOutElastic);

    yield* waitUntil("NextScene");

});