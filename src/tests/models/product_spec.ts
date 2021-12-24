import { Product, ProductStore } from '../../models/product';
import { mockProduct, mockUpdatedProductName } from '../../mocks/product';
import { TIMEOUT_INTERVAL } from '../../utils/common-utils';

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let product: Product;
const store = new ProductStore();

describe('Tests for Product Model', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a product', async () => {
    product = await store.create({
      name: mockProduct.name,
      price: mockProduct.price,
      category: mockProduct.category
    });

    expect(product).toBeDefined();
    expect(product.name).toEqual(mockProduct.name);
    expect(Number(product.price)).toEqual(mockProduct.price);
    expect(product.category).toEqual(mockProduct.category);
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].name).toEqual(mockProduct.name);
    expect(Number(result[0].price)).toEqual(mockProduct.price);
    expect(result[0].category).toEqual(mockProduct.category);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(String(product.id));

    expect(result).toBeDefined();
    expect(result.name).toEqual(mockProduct.name);
    expect(Number(result.price)).toEqual(mockProduct.price);
    expect(result.category).toEqual(mockProduct.category);
  });

  it('update method should update a product', async () => {
    const result = await store.update(String(product.id), {
      ...mockProduct,
      name: mockUpdatedProductName
    });

    expect(result).toBeDefined();
    expect(result.name).toEqual(mockUpdatedProductName);
    expect(Number(result.price)).toEqual(mockProduct.price);
    expect(result.category).toEqual(mockProduct.category);
  });

  it('delete method should remove the product', async () => {
    const result = await store.delete(String(product.id));

    expect(result).toBeDefined();
    expect(result.id).toEqual(product.id);
  });
});
