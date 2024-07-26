import { Faker } from '@faker-js/faker'
import { User } from '../libs/User'

export function createRandomUser(index: number, faker: Faker): User {
    switch (faker.getMetadata().code) {
        case 'ru':
            let fullnameRu = faker.person.firstName() + " " + faker.person.middleName() + " " + faker.person.lastName()
            return {
                index: index,
                id: faker.string.uuid(),
                fullname: fullnameRu,
                address: fullnameRu + " " + faker.location.streetAddress() + " " + faker.location.city() + " " + faker.location.state() + ", " + faker.location.zipCode(),
                phone: faker.phone.number()
            }
        case 'uk':
            let fullnameUk = faker.person.firstName() + " " + faker.person.middleName() + " " + faker.person.lastName()
            return {
                index: index,
                id: faker.string.uuid(),
                fullname: fullnameUk,
                address: fullnameUk + " " + faker.location.streetAddress() + " " + faker.location.city() + " " + faker.location.state() + ", " + faker.location.zipCode(),
                phone: faker.phone.number()
            }
        default:
            return {
                index: index,
                id: faker.string.uuid(),
                fullname: faker.person.firstName() + " " + faker.person.middleName() + " " + faker.person.lastName(),
                address: faker.location.streetAddress() + " " + faker.location.city() + ", " + faker.location.state({ abbreviated: true }) + " " + faker.location.zipCode(),
                phone: faker.phone.number()
            }
    }
}