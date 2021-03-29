const fs = require('fs').promises;
const parser = require('../parser');
beforeEach(() => {
    jest.clearAllMocks();
});

describe('parser', () => {
    describe('LAS v1.2', () => {
        test('ok', async () => {
            const lasFile = await fs.readFile('./lib/__fixtures__/test-v1.2.las', {
                encoding: 'utf8',
            });
            await expect(parser(lasFile, {})).resolves.toMatchSnapshot();
        });
    });
    describe('LAS v2.0', () => {
        test('ok', async () => {
            const lasFile = await fs.readFile('./lib/__fixtures__/test-v2.0.las', {
                encoding: 'utf8',
            });
            await expect(parser(lasFile, {})).resolves.toMatchSnapshot();
        });

        test('ok (Curve LOGNAME contains dashes/numbers/square brackets', async () => {
            const lasFile = await fs.readFile('./lib/__fixtures__/test-v2.0.dashes.las', {
                encoding: 'utf8',
            });

            await expect(parser(lasFile, {})).resolves.toMatchSnapshot();
        });

        test('invalid format', async () => {
            const lasFile = await fs.readFile('./lib/__fixtures__/test-v2.0.invalid.las', {
                encoding: 'utf8',
            });
            await expect(parser(lasFile, {})).rejects.toEqual(
                Error('Measured depth should be first column')
            );
        });
    });
});
