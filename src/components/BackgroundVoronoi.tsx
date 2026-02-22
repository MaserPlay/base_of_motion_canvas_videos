import { Img, ImgProps, invert, Rect, View2D } from "@motion-canvas/2d";

import back from "../img/background.svg"
import { BrandColors } from "../global";

export function BackgroundVoronoi(props: ImgProps) {
    return (
        <>
            <Img
                src={back}
                filters={[invert(.3)]}
                key="background"
                height={'100%'}
                {...props}
            />
        </>
    )
}

declare module "@motion-canvas/2d" {
  interface View2D {
    addBackgroundVoronoi(props?: ImgProps): void;
  }
}

export function addBackgroundVoronoi(view: View2D, props: ImgProps = {})
{
    view.fill(BrandColors.Background)
    view.add(<BackgroundVoronoi {...props}/>)
}

View2D.prototype.addBackgroundVoronoi = function (props: ImgProps = {}) {
    addBackgroundVoronoi(this, props)
}