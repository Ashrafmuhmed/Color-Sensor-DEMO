const mockSynth = {
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn()
};

const mockTone = {
    start: jest.fn().mockResolvedValue(undefined),
    PolySynth: jest.fn().mockImplementation(() => mockSynth),
    Synth: jest.fn(),
    Reverb: jest.fn().mockImplementation(() => ({
        toDestination: jest.fn().mockReturnThis(),
        connect: jest.fn().mockReturnThis()
    }))
};

export { mockTone as default };