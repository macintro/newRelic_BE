const { getCustomerByName } = require('./customers'); 
const mysql = require('../utilities/mysqlClient');
const logger = require('../utilities/logger')(module);

jest.mock('../utilities/mysqlClient');
jest.mock('../utilities/logger', () => () => ({
    error: jest.fn(),
}));

describe('getCustomerByName', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                searchTerm: 'test'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis(),
        };
    });

    it('should return 200 and customer data when successful', async () => {
        const mockData = [{ firstName: 'John', lastName: 'Doe' }];
        mysql.fetchArray.mockResolvedValue(mockData);

        await getCustomerByName(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
        expect(res.end).toHaveBeenCalled();
    });

    it('should return 204 when no data found', async () => {
        mysql.fetchArray.mockResolvedValue([]);

        await getCustomerByName(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith("No data");
        expect(res.end).toHaveBeenCalled();
    });

    it('should return 400 for validation error', async () => {
        req.query.searchTerm = ''; 
        req.query.search = '';// Example of an invalid searchTerm

        await getCustomerByName(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '"search" is not allowed' // Adjust message based on your Joi validation
        });
    });

    it('should return 500 for server error', async () => {
        mysql.fetchArray.mockRejectedValue(new Error('Server error'));

        await getCustomerByName(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
});
