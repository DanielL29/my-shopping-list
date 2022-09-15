import { faker } from '@faker-js/faker'
import { prisma } from '../../src/database'

export function createItem() {
    const item = {
        title: faker.animal.lion(),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(),
        amount: faker.datatype.number(),
    }

    return item
}

export async function insertItem() {
    const item = createItem()

    const insertedItem = await prisma.items.create({ data: item })

    return insertedItem
}

