const Story = require("../models/Story");

const catchHandler = () => {
  console.error(error);
  res.render("error/500");
};

module.exports = {
  create: (req, res) => {
    res.render("stories/add");
  },
  store: async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Story.create(req.body);
      res.redirect("/");
    } catch (error) {
      catchHandler();
    }
  },
  index: async (req, res) => {
    try {
      const stories = await Story.find({ status: "public" })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();
      res.render("stories/index", { stories });
    } catch (error) {
      catchHandler();
    }
  },
  edit: async (req, res) => {
    try {
      const story = await Story.findOne({
        _id: req.params.id,
      }).lean();

      if (!story) {
        return res.render("error/404");
      }

      if (story.user != req.user.id) {
        res.redirect("/stories");
      } else {
        res.render("stories/edit", {
          story,
        });
      }
    } catch (error) {
      catchHandler();
    }
  },
  update: async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean();

      if (!story) {
        return res.render("error/404");
      }

      if (story.user != req.user.id) {
        res.redirect("/stories");
      } else {
        story = await Story.findByIdAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

        res.redirect("/");
      }
    } catch (error) {
      catchHandler();
    }
  },
  destroy: async (req, res) => {
    try {
      await Story.findOneAndRemove({ _id: req.params.id });
      res.redirect("/");
    } catch (error) {
      catchHandler();
    }
  },
  show: async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate("user").lean();

      if (!story) {
        return res.render("error/404");
      }

      res.render("stories/show", {
        story,
      });
    } catch (error) {
      catchHandler();
    }
  },
  userStories: async (req, res) => {
    try {
      const stories = await Story.find({
        status: "public",
        user: req.params.id,
      })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();
      res.render("stories/index", { stories });
    } catch (error) {
      catchHandler();
    }
  },
};
