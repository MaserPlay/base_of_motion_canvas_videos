import { makeProject, ProjectSettings, useLogger } from '@motion-canvas/core';

// import MultiTrack from 'motion-canvas-multitrack/editor-plugin';

const scenes = ["01_hello"]

const promiseScenes = (await Promise.all(scenes.map(n => import( /* @vite-ignore */ `../scenes/${n}?scene`)))).map(v => v?.default)

var settings : ProjectSettings = {
  // plugins: [MultiTrack()],
  // experimentalFeatures: true,
  scenes: promiseScenes
}
if (await fetch("/audio.mp3").then(r => r.ok)) {
  settings.audio = "/public/audio.mp3"
} else {
  useLogger().error(`/public/audio.mp3 is not found. Create public/audio.mp3 in the root to add audio in this project`)
}

export default makeProject(settings);