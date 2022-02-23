import { async } from '../../store';
import { product } from '../';
import {
  CATEGORIES,
  CATEGORY_CREATE,
  CATEGORY_DELETE,
  CATEGORY_UPDATE,
  CATEGORY,
  CERTIFICATE_CREATE,
  CERTIFICATE,
  PRODUCT_CREATE,
  PRODUCT_UPDATE,
  PRODUCT,
  PRODUCTS,
  PRODUCTS_COUNT_ALL,
  PRODUCTS_COUNT_AIRCRAFT_MAKES,
  PRODUCTS_COUNT_AIRCRAFT_MODELS,
  PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES,
  PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS,
  PRODUCTS_COUNT_CATEGORIES,
  PRODUCTS_TRACK,
  PRODUCTS_TRACKED,
  PRODUCTS_RELOAD,
  PRODUCT_DELETE
} from './actions';

export default [
  ...async(CATEGORIES, product.getCategories),
  ...async(CATEGORY_CREATE, product.postCategory),
  ...async(CATEGORY_DELETE, product.deleteCategory),
  ...async(CATEGORY_UPDATE, product.putCategory),
  ...async(CATEGORY, product.getCategory),
  ...async(CERTIFICATE_CREATE, product.postCertificate),
  ...async(PRODUCT_CREATE, product.postProduct),
  ...async(PRODUCT_UPDATE, product.putProduct),
  ...async(PRODUCT_DELETE, product.deleteProduct),
  ...async(PRODUCT, product.getProduct),
  ...async(PRODUCTS, product.getProducts),
  ...async(PRODUCTS_COUNT_ALL, product.getProductsCount),
  ...async(PRODUCTS_COUNT_AIRCRAFT_MAKES, product.getProductsCount, ({ payload }) => {
    let filterObject = {};
    filterObject.aircraft_make = payload.make || payload;

    if (payload.category != undefined && payload.category.length > 0) {
      filterObject.aircraft_make = payload.make;
      filterObject.category = payload.category;
    }

    if (payload.certificate != undefined && payload.certificate.length > 0) {
      filterObject.aircraft_make = payload.make;
      filterObject.certificate = payload.certificate;
    }

    if (payload.manufacturer != undefined && payload.manufacturer.length > 0) {
        filterObject.aircraft_make = payload.make;
        filterObject.manufacturer = payload.manufacturer;
    }

    if (payload.year != undefined && payload.year.length > 0) {
        filterObject.year = payload.year;
    }

    return [filterObject];

  }),
  ...async(PRODUCTS_COUNT_AIRCRAFT_MODELS, product.getProductsCount, ({ payload }) => {
    let filterObject = { aircraft_model: payload.model || payload };

    if (payload.category != undefined && payload.category.length > 0) {
      filterObject.model = payload.model;
      filterObject.category = payload.category;
    }

    if (payload.certificate != undefined && payload.certificate.length > 0) {
      filterObject.model = payload.model;
      filterObject.certificate = payload.certificate;
    }

    if (payload.manufacturer != undefined && payload.manufacturer.length > 0) {
      filterObject.model = payload.model;
      filterObject.manufacturer = payload.manufacturer;
    }

    return filterObject;
  }),
  ...async(PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES, product.getProductsCount, ({ payload }) => {

      let filterObject = {};
      filterObject.approved = true;
      filterObject.aircraft_make = payload.make || payload;
      
      if (payload.category != undefined && payload.category.length > 0) {
        filterObject.aircraft_make = payload.make;
        filterObject.category = payload.category;
      }

      if (payload.certificate != undefined && payload.certificate.length > 0) {
        filterObject.aircraft_make = payload.make;
        filterObject.certificate = payload.certificate;
      }

      if (payload.manufacturer != undefined && payload.manufacturer.length > 0) {
        filterObject.aircraft_make = payload.make;
        filterObject.manufacturer = payload.manufacturer;
      }

      if (payload.year != undefined && payload.year.length > 0) {
          filterObject.year = payload.year;
      }

      return [filterObject];
  }),
  ...async(PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS, product.getProductsCount, ({ payload }) => {
      console.log(payload);
      console.log("111");

      let filterObject = {
        approved: true, 
        aircraft_model: payload.model || payload,
      };

      if (payload.category != undefined && payload.category.length > 0) {
        filterObject.category = payload.category;
      }

      if (payload.certificate != undefined && payload.certificate.length > 0) {
        filterObject.certificate = payload.certificate;
      }

      if (payload.manufacturer != undefined && payload.manufacturer.length > 0) {
        filterObject.manufacturer = payload.manufacturer;
      }

      if (payload.year != undefined && payload.year.length > 0) {
        filterObject.year = payload.year;
      }

      return [filterObject];
    }),
  ...async(PRODUCTS_COUNT_CATEGORIES, product.getProductsCount, ({payload}) => ([{ category: payload }])),
  ...async(PRODUCTS_TRACK, product.track),
  ...async(PRODUCTS_TRACKED, product.getTracked),
  ...async(PRODUCTS_RELOAD, product.getProducts)
];
