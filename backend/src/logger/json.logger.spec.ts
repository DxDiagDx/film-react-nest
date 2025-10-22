import { JsonLogger } from "./json.logger";

describe('JsonLogger', () => {
    let logger: JsonLogger;
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new JsonLogger;
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    describe('log method', () => {
        it('should format log message as JSON with correct level', () => {
            logger.log('test message', 'param1', 123);

            expect(consoleLogSpy).toHaveBeenCalled();
            const logCall = consoleLogSpy.mock.calls[0][0];
            const parsedLog = JSON.parse(logCall);

            expect(parsedLog.level).toBe('log');
            expect(parsedLog.message).toBe('test message');
            expect(parsedLog.timestamp).toBeDefined;
        });
    });

    describe('error method', () => {
        it('should format error message as JSON with error level', () => {
            logger.error('error message', 'error param');
            
            expect(consoleErrorSpy).toHaveBeenCalled();
            const errorCall = consoleErrorSpy.mock.calls[0][0];
            const parsedError = JSON.parse(errorCall);
            
            expect(parsedError.level).toBe('error');
            expect(parsedError.message).toBe('error message');
        });
    });    

    describe('warn method', () => {
        it('should format warn message as JSON with warn level', () => {
            logger.warn('warning message');
            
            expect(consoleWarnSpy).toHaveBeenCalled();
            const warnCall = consoleWarnSpy.mock.calls[0][0];
            const parsedWarn = JSON.parse(warnCall);
            
            expect(parsedWarn.level).toBe('warn');
            expect(parsedWarn.message).toBe('warning message');
        });
    });
});