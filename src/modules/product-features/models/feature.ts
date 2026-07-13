import { model } from "@medusajs/framework/utils"

const Feature = model.define("feature", {
  id: model.id().primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  // URL of the uploaded icon image (stored via the File Module)
  icon: model.text().nullable(),
})

export default Feature
