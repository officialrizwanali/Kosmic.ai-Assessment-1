const videoFilterParameters = {
  grayscale: { name: "Grayscale", description: "Convert video to grayscale", params: "hue=s=0" },
  negate: { name: "Negate", description: "Negate colors in the video", params: "negate" },
  sepia: {
    name: "Sepia",
    description: "Apply sepia effect to the video",
    params: "colorchannelmixer=0.393:0.769:0.189:0:0.349:0.686:0.168:0:0.272:0.534:0.131",
  },
  blur: { name: "Blur", description: "Apply blur effect to the video", params: "boxblur=10" },
  sharpen: { name: "Sharpen", description: "Apply sharpen effect to the video", params: "unsharp=5:5:1.0:5:5:0.0" },
};

module.exports = { videoFilterParameters };
