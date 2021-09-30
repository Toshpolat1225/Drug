module.exports = {
    ifeq(a, b, options) {
        if (a == b) {
            return options.fn(this)
        }
        return options.inverse(this)

    },
    elseeq(a, b, options) {
        if (a == b) {
            return options.inverse(this)
        }
        return options.fn(this)
    }
}