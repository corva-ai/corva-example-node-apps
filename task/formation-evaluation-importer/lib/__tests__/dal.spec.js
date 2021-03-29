const DAL = require('../dal');
const { FORMATION_EVALUATION_COLLECTION } = require('../constants');

beforeAll(() => {
    jest.resetAllMocks();
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Data access layer', () => {
    test('deleteDataByFilename', async () => {
        const apiClientMock = {
            request: jest
                .fn()
                .mockResolvedValueOnce({ body: { data: '1' } })
                .mockResolvedValueOnce({ body: { metadata: '1' } }),
        };
        const provider = 'foo';
        const dal = new DAL({
            apiClient: apiClientMock,
            provider,
        });

        await expect(
            dal.deleteDataByFilename({
                file: 'file',
                assetId: 1,
                collection: FORMATION_EVALUATION_COLLECTION,
            })
        ).resolves.toBeUndefined();

        expect(apiClientMock.request).toBeCalledWith(`v1/data/${provider}/${FORMATION_EVALUATION_COLLECTION}.data`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
            searchParams: {
                asset_id: 1,
                query: `{asset_id#eq#1}AND{metadata.file#eq#'file'}`,
            },
        });

        expect(apiClientMock.request).toBeCalledWith(`v1/data/${provider}/${FORMATION_EVALUATION_COLLECTION}.metadata`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
            searchParams: {
                asset_id: 1,
                query: `{asset_id#eq#1}AND{file#eq#'file'}`,
            },
        });
    });

    test('saveData', async () => {
        const apiClientMock = {
            request: jest.fn().mockResolvedValue({ statusCode: 200, body: { id: 1 } }),
        };
        const provider = 'foo';
        const dal = new DAL({
            apiClient: apiClientMock,
            provider,
        });

        await expect(dal.saveData({
            data: [{ foo: 'bar' }],
            collection: FORMATION_EVALUATION_COLLECTION,
        })).resolves.toMatchObject({ id: 1 });

        expect(apiClientMock.request).toBeCalledWith(`v1/data/${provider}/${FORMATION_EVALUATION_COLLECTION}`, {
            method: 'POST',
            json: [
                {
                    foo: 'bar',
                },
            ],
        });
    });
});
