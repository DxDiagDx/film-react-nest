import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  describe('log method', () => {
    it('should format log message in TSKV format', () => {
      logger.log('test message');
      
      expect(stdoutSpy).toHaveBeenCalled();
      const logCall = stdoutSpy.mock.calls[0][0] as string;
      
      expect(logCall).toContain('level=log');
      expect(logCall).toContain('message="test message"');
      expect(logCall).toContain('timestamp=');
      expect(logCall).toMatch(/level=log\tmessage=.*\ttimestamp=.*\n/);
    });
  });

  describe('error method', () => {
    it('should format error message in TSKV format with error level', () => {
      logger.error('error message', 'param1');
      
      expect(stderrSpy).toHaveBeenCalled();
      const errorCall = stderrSpy.mock.calls[0][0] as string;
      
      expect(errorCall).toContain('level=error');
      expect(errorCall).toContain('message="error message"');
    });
  });
});