const router = require("express").Router();
const Video = require("./video.model");
const upload = require("./multer");

router.post("/upload", upload.single("video"), async (req, res) => {
  const video = await Video.create({
    company: req.body.company,
    location: req.body.location,
    deviceId: req.body.deviceId,
    title: req.body.title,
    videoUrl: req.file.path,
  });
  res.json(video);
});

router.get("/", async (req, res) => {
  res.json(await Video.find());
});

router.delete("/:id", async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.put("/play/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.status = "RUNNING";
  await video.save();
  res.json(video);
});

router.put("/stop/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.status = "STOPPED";
  await video.save();
  res.json(video);
});

module.exports = router;
