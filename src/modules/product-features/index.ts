import { Module } from "@medusajs/framework/utils"
import ProductFeaturesModuleService from "./service"

export const PRODUCT_FEATURES_MODULE = "productFeatures"

export default Module(PRODUCT_FEATURES_MODULE, {
  service: ProductFeaturesModuleService,
})
