import {expect, Assertion} from 'chai'
import Rule                from '../src/rule'

function makeRule(value) {
    return new Rule().value(value)
}

Assertion.addProperty('rule', function () {})

Assertion.addMethod('errors', function () {
    new Assertion(this._obj).to.be.instanceof(Rule)

    this.assert(
        this._obj._messages.length > 0,
        `expected '${this._obj._value}' to generate an error`,
        `expected '${this._obj._value}' to not generate an errors`,
        null,
        this._obj._messages[0],
    )
})

describe('Rules', () => {
    describe.skip('valid input values', () => {
        it('empty values are considered invalid', () => {
            expect(() => makeRule().integer()).to.throw()
            expect(() => makeRule(null).integer()).to.throw()
            expect(() => makeRule(undefined).integer()).to.throw()
            expect(() => makeRule('').integer()).to.throw()
            expect(() => makeRule(' ').integer()).to.throw()
        })
    })

    describe('integer', () => {
        it('valid integer values', () => {
            [1, 1.0, -1, +1, -1.0, +1.0, 10]
                .forEach(value => expect(makeRule(value).integer()).to.not.have.rule.errors())
        })

        it('string equivalents are considered integers', () => {
            ['1', '01', '0', '+1', '-1']
                .forEach(value => expect(makeRule(value).integer()).to.not.have.rule.errors())
        })

        it('will fail if a float value is provided', () => {
            [1.1, '01.1', '1.0', '0.', '-1.0', '+1.0']
                .forEach(value => expect(makeRule(value).integer()).to.have.rule.errors())
        })

        it('does not allow characters', () => {
            ['a', '1a', 'a1', '1a1']
                .forEach(value => expect(makeRule(value).integer()).to.have.rule.errors())
        })
    })

    describe('float', () => {
        it('valid float values', () => {
            [0, 1, -1, +1, 1.0, -1.0, +1.0, 1.1, -1.1, +1.1]
                .forEach(value => expect(makeRule(value).float()).to.not.have.rule.errors())
        })

        it('string equivalents are considered floats', () => {
            ['0', '1', '-1', '+1', '1.0', '-1.0', '+1.0', '1.1', '-1.1', '+1.1', '01.1', '-01.1', '+01.1']
                .forEach(value => expect(makeRule(value).float()).to.not.have.rule.errors())
        })

        it('does not allow characters', () => {
            ['a', '1a', 'a1', '1a1']
                .forEach(value => expect(makeRule(value).float()).to.have.rule.errors())
        })
    })

    describe('size', () => {
        it('should accept any size array', () => {
            expect(makeRule([]).size(0)).to.not.have.rule.errors()
            expect(makeRule(['']).size(1)).to.not.have.rule.errors()
            expect(makeRule([[]]).size(1)).to.not.have.rule.errors()
            expect(makeRule([null]).size(1)).to.not.have.rule.errors()
        })

        it('treats strings like arrays', () => {
            expect(makeRule('hello world').size(11)).to.not.have.rule.errors()
            expect(makeRule('').size(0)).to.not.have.rule.errors()
        })

        it.skip('does not treat null like an array', () => {
            expect(makeRule(null).size(0)).to.have.rule.errors()
        })
    })
})
