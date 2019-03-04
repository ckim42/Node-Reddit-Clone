module.exports = field => { // Recursively calls itself, so fields populate every time a model is loaded
    return function (next) {
        this.populate(field);
        next();
    }
}