import { type NextRequest } from 'next/server'
import { DataErrors } from '../../libs/errors'
import { createRandomUser } from '../../libs/createUser'
import { ru, en, uk, Faker } from '@faker-js/faker'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const limit = Number(searchParams.get('limit'))
    const offset = Number(searchParams.get('offset'))
    const region = searchParams.get('region')
    const seed = Number(searchParams.get('seed'))
    const errors = Number(searchParams.get('errors'))
    let locale = en
    switch (region) {
        case 'ru':
            locale = ru
            break;
        case 'uk':
            locale = uk
            break;
        default:
            locale = en
            break;
    }
    let users = []
    let index = 0

    let customFaker = new Faker({
        locale: [locale]
    })
    customFaker.seed(seed)

    let createErrors = new DataErrors(customFaker, seed)
    let errorFuncs = [
        createErrors.deleteChar.bind(createErrors),
        createErrors.swapChar.bind(createErrors),
        createErrors.addChar.bind(createErrors)
    ]

    for (let i = 0; i < offset + limit; i++) {
        index = index + 1
        const user = createRandomUser(index, customFaker)
        if (i >= offset) {
            users.push(user)
        }
    }

    users.forEach((user, i) => {
        let userFields = [user.fullname, user.address, user.phone]


        for (let j = 0; j < Math.floor(errors); j++) {
            let tChoose = createErrors.randNumber(3)
            let fChoose = createErrors.randNumber(3)
            let userField = userFields[fChoose]
            userFields[fChoose] = errorFuncs[tChoose](userField, fChoose)
        }
        if (createErrors.randFloat() < errors % 1 && errors > 0) {
            let tChoose = createErrors.randNumber(3)
            let fChoose = createErrors.randNumber(3)
            let userField = userFields[fChoose]
            userFields[fChoose] = errorFuncs[tChoose](userField, fChoose)
        }

        user.fullname = userFields[0];
        user.address = userFields[1];
        user.phone = userFields[2];
        users[i] = user
    })
    return Response.json(users)
}