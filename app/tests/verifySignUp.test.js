const { checkDuplicateEmail, checkDuplicatePhone, checkRoleExists, checkDoctorEmailExists, checkRelativeEmailExists } = require('../middleware/verifySignUp.js');
const db = require('../models/index.js');
const Users = db.users;
const Roles = db.roles;
const Doctors = db.doctors;
const Relatives = db.relatives;


  describe("test verifySignUp", () => {
    describe("test checkDuplicateEmail", () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('checkDuplicateEmail should work', async () => {
      jest.spyOn(Users, 'findOne').mockResolvedValue(null);

      const req = {
        body: {
          email: 'newuser@gmail.com'
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      const next = jest.fn();

      jest.mock('../middleware/verifySignUp.js', () => ({
        checkDuplicateEmail: jest.fn(),
      }));

      await checkDuplicateEmail(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('should return 400 if email is already in use', async () => {
      jest.spyOn(Users, 'findOne').mockResolvedValue({ email: 'existing@gmail.com' });

      const req = {
        body: {
          email: 'existing@gmail.com'
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      await checkDuplicateEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Failed! Email provided is already in use!' });
      expect(next).not.toHaveBeenCalled();
    });
  }),

  describe("test checkDuplicatePhone", () => {

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should call next() if phone is not in use', async () => {
      jest.spyOn(Users, 'findOne').mockResolvedValue(null);

      const req = {
        body: {
          phoneNumber: '1234567890'
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      await checkDuplicatePhone(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('should return 400 if phone is already in use', async () => {
      jest.spyOn(Users, 'findOne').mockResolvedValue({
        phoneNumber: '1234567890'
      });

      const req = {
        body: {
          phoneNumber: '1234567890'
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      await checkDuplicatePhone(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Failed! Phone provided is already in use!' });
      expect(next).not.toHaveBeenCalled();
    });
  }),

  describe("test checkRolesExist", () => {

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('checkRolesExist should pass', async () => {
      jest.spyOn(Roles, 'findOne').mockResolvedValue({ name: 'existingRole', id: 1 });
  
      const req = {
        body: {
          role: 'existingRole',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRoleExists(req, res, next);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(req.roleId).toBe(1);
    });
  
    test('should return 400 if role does not exist', async () => {
      jest.spyOn(Roles, 'findOne').mockResolvedValue(null);
  
      const req = {
        body: {
          role: 'nonExistingRole',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRoleExists(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed! Role does not exist = nonExistingRole',
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test('should return 400 if no role provided', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRoleExists(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Failed! Provided no role.',
      });
      expect(next).not.toHaveBeenCalled();
    });
  }),

  describe("test checkDoctorEmailExists", () => {

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should pass if patient role and doctor email exists', async () => {
      jest.spyOn(Doctors, 'findOne').mockResolvedValue({
        id: 1,
        user: {
          email: 'existingDoctor@gmail.com',
        },
      });
  
      const req = {
        body: {
          role: 'Patient',
          doctorEmail: 'existingDoctor@gmail.com',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkDoctorEmailExists(req, res, next);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(req.doctorId).toBe(1);
    });
  
    test('should return 400 if patient role and doctor email does not exist', async () => {
      jest.spyOn(Doctors, 'findOne').mockResolvedValue(null);
  
      const req = {
        body: {
          role: 'Patient',
          doctorEmail: 'nonExistingDoctor@gmail.com',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkDoctorEmailExists(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "The email you provided is not used by any doctor !",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test('should return 400 if patient role and no doctor email provided', async () => {
      const req = {
        body: {
          role: 'Patient',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkDoctorEmailExists(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "To sign up as a patient, you need to provide the Email of your doctor !",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test('should pass if role is not patient', async () => {
      const req = {
        body: {
          role: 'SomeOtherRole',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkDoctorEmailExists(req, res, next);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  }),

  describe("test checkRelativeEmailExists", () => {

    beforeEach(() => {
      jest.resetAllMocks();
    });
    
    test('should pass if patient role and relative email exists', async () => {
      jest.spyOn(Relatives, 'findOne').mockResolvedValue({
        id: 1,
        user: {
          email: 'existingRelative@gmail.com',
        },
      });
  
      const req = {
        body: {
          role: 'Patient',
          relativeEmail: 'existingRelative@gmail.com',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRelativeEmailExists(req, res, next);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(req.relativeId).toBe(1);
    });
  
    test('should pass if patient role and no relative email provided', async () => {
      const req = {
        body: {
          role: 'Patient',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRelativeEmailExists(req, res, next);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  
    test('should pass if role is not patient', async () => {
      const req = {
        body: {
          role: 'SomeOtherRole',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRelativeEmailExists(req, res, next);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  
    test('should return 400 if patient role and relative email does not exist', async () => {
      jest.spyOn(Relatives, 'findOne').mockResolvedValue(null);
  
      const req = {
        body: {
          role: 'Patient',
          relativeEmail: 'nonExistingRelative@gmail.com',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await checkRelativeEmailExists(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "The email you provided is not used by any relative user !",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
