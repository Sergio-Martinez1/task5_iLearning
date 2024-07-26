import { Faker, faker } from '@faker-js/faker'
import { UkranianAlphabet, RussianAlphabet, EnglishAlphabet } from '../libs/alphabets'

export class DataErrors {

    customFaker = faker;
    alphabet: string[];

    constructor(customFaker: Faker, seed: number) {
        this.customFaker.seed(seed)
        this.alphabet = EnglishAlphabet

        switch (this.customFaker.getMetadata().code) {
            case 'ru':
                this.alphabet = RussianAlphabet
                break;
            case 'uk':
                this.alphabet = UkranianAlphabet
                break;
        }
    }

    randNumber(dataLenght: number) {
        return faker.number.int({ min: 0, max: dataLenght - 1 })
    }

    randFloat() {
        return faker.number.float({ fractionDigits: 1 })
    }

    deleteChar(data: string, type: number) {
        if(data.length <= 8) return data
        let position = this.randNumber(data.length)
        let a = data.split('');
        a.splice(position, 1);
        return a.join('');
    }

    addChar(data: string, type: number) {
        if(data.length >= 20) return data
        let position = this.randNumber(data.length)
        let letterChoose = this.randNumber(this.alphabet.length)
        let number = this.randNumber(10).toString()
        let letter = this.randNumber(2) > 0 ? this.alphabet[letterChoose] : this.alphabet[letterChoose].toLowerCase()
        let a = data.split('');
        if (type === 2) {
            a.splice(position, 0, number)
        } else {
            a.splice(position, 0, letter)
        }
        return a.join('');
    }

    swapChar(data: string, type: number) {
        let position = this.randNumber(data.length)
        let a = data.split('');
        let lft = a[position - 1];
        let rht = a[position];
        a[position - 1] = rht;
        a[position] = lft;
        return a.join('');
    }

}