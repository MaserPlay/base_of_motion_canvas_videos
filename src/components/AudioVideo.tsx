import { Video, VideoProps } from "@motion-canvas/2d";
import { signal, initial } from "@motion-canvas/2d";
import { createEffect, Logger, SignalValue, SimpleSignal, useLogger } from "@motion-canvas/core";

export interface AudioVideoProps extends VideoProps {
    muted?: SignalValue<boolean>;
    volume?: SignalValue<number>;
}

export class AudioVideo extends Video {
    @initial(false)
    @signal()
    public declare readonly muted: SimpleSignal<boolean, this>;

    @initial(1)
    @signal()
    public declare readonly volume: SimpleSignal<number, this>;

    private readonly logger: Logger | Console

    public constructor(props: AudioVideoProps) {
        super(props);
        this.logger = useLogger()
        
        this.createEffects()
    }

    private createEffects() {
        createEffect(() => {
            const video = this.video();
            video.muted = this.muted();
            // this.logger.info("video now " + (video.muted ? "muted" : "no longer muted"))
        });

        createEffect(() => {
            const video = this.video();
            video.volume = this.volume();

            // this.logger.info("video volume "  + video.volume)
        });
    }

    protected override collectAsyncResources() {
        super.collectAsyncResources();

        this.createEffects()
    }
}

