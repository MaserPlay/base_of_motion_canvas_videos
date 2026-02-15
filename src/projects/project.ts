import { makeProject } from '@motion-canvas/core';

import audio from "../../audio/audio.mp3"

// import MultiTrack from 'motion-canvas-multitrack/editor-plugin';

const scenes = ["01_hello"]

const promiseScenes = (await Promise.all(scenes.map(n => import( /* @vite-ignore */ `../scenes/${n}?scene`)))).map(v => v?.default)

export default makeProject({
  // plugins: [MultiTrack()],
  // experimentalFeatures: true,
  scenes: promiseScenes,
  audio: audio
});