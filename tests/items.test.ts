import { prisma } from "../src/database";
import * as itemFactory from '../tests/factories/itemFactory'
import supertest from 'supertest'
import app from "../src/app";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`
})

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = itemFactory.createItem()

    const result = await supertest(app).post('/items').send(item)

    expect(result.status).toBe(201)
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = await itemFactory.insertItem()
    delete item.id

    const result = await supertest(app).post('/items').send(item)

    expect(result.status).toBe(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get('/items')

    expect(result.status).toBe(200)
    expect(result.body).toBeInstanceOf(Array)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const item = await itemFactory.insertItem()

    const result = await supertest(app).get(`/items/${item.id}`)

    expect(result.status).toBe(200)
    expect(result.body).toEqual(expect.objectContaining(item))
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get('/items/-1')

    expect(result.status).toBe(404)
  });
});

afterAll(async () => {
  await prisma.$disconnect()
})
