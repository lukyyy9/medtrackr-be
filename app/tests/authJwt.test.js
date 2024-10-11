const { verifyToken, isDoctor } = require('../middleware/authJwt.js');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models/index.js');
const Users = db.users;


describe("test authJwt", () => {

    describe("test verifyToken", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        })

        test('should pass if valid token provided', async () => {
            const token = 'validToken';
            const decoded = { userId: 1 };
        
            jest.spyOn(jwt, 'verify').mockImplementation((token, config, callback) => {
                callback(null, decoded);
            });
        
            jest.spyOn(Users, 'findOne').mockResolvedValue({
              id: 1,
              // Add other user properties as needed
            });
        
            const req = {
              headers: {
                'x-access-token': token,
              },
            };
            const res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            };
            const next = jest.fn();
        
            await verifyToken(req, res, next);
        
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            expect(req.userId).toBe(1);
        });
        
        test('should return 403 if no token provided', async () => {
            const req = {
              headers: {},
            };
            const res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            };
            const next = jest.fn();
        
            await verifyToken(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
              message: "No token provided!",
            });
            expect(next).not.toHaveBeenCalled();
        });
        
        test('should return 401 if token verification fails', async () => {
            const token = 'invalidToken';
        
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
              callback(new Error('Invalid token'), null);
            });
        
            const req = {
              headers: {
                'x-access-token': token,
              },
            };
            const res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            };
            const next = jest.fn();
        
            await verifyToken(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({
              message: "Unauthorized!",
            });
            expect(next).not.toHaveBeenCalled();
        });
        
        test('should return 400 if user with decoded userId does not exist', async () => {
            const token = 'validToken';
            const decoded = { userId: 2 };
        
            jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
              callback(null, decoded);
            });
        
            jest.spyOn(Users, 'findOne').mockResolvedValue(null);
        
            const req = {
              headers: {
                'x-access-token': token,
              },
            };
            const res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            };
            const next = jest.fn();
        
            await verifyToken(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
              message: "User doesn't exist",
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
