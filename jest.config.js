export default {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^tone$': '<rootDir>/tests/__mocks__/tone.js'
    },
    transformIgnorePatterns: [
        'node_modules/(?!tone)'
    ]
};