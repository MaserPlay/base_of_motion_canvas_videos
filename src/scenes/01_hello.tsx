import { Img, Layout, makeScene2D, Txt } from "@motion-canvas/2d";
import { createRef, waitUntil } from "@motion-canvas/core";
import { addBackgroundVoronoi } from "../components/BackgroundVoronoi";
import { BrandColors, rescaleToFullHdFactor, ResourceUrls } from "../global";

export default makeScene2D(function* (view) {

    const layout = createRef<Layout>()
    const tittle = createRef<Txt>()
    const logo = createRef<Img>()

    addBackgroundVoronoi(view)

    view.add(
        <>
            <Layout 
                layout={true}
                ref={layout}
                direction={'column'}
                alignItems={"center"}
                scale={() => rescaleToFullHdFactor(view)}
                gap={10}
            >
                <Img
                    ref={logo}
                    src={ResourceUrls.maserplayIco}
                />
                <Txt
                    ref={tittle}
                    text={""}
                    fill={BrandColors.FontColor}
                    fontSize={200}
                />
            </Layout>
        </>
    )
    
    yield* waitUntil("NextScene");

});