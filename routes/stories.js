const router = require("express").Router();

const { ensureAuth } = require("../middleware/auth");
const {
  index,
  store,
  create,
  edit,
  update,
  destroy,
  show,
} = require("../controllers/index");

// show add page
router.get("/add", ensureAuth, create);

// POST add
router.post("/", ensureAuth, store);

//GET all stories
router.get("/", ensureAuth, index);

// show single story
router.get("/:id", ensureAuth, show);

// show edit page
router.get("/edit/:id", ensureAuth, edit);

// PUT edit
router.put("/:id", ensureAuth, update);

// delete page
router.delete("/:id", ensureAuth, destroy);

module.exports = router;
