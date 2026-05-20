const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Task = require('../models/Task');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { expect } = chai;

chai.use(chaiHttp);

describe('Task Controller Unit Tests', () => {

  describe('GetTask Function Test', () => {
    it('should return tasks for the given user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const tasks = [
        { taskName: "Task 1", startDate: "2026-03-31", dueDate: "2026-04-30", user: userId }
      ];

      // Controller uses .find().sort(), so we must stub the sort chain
      const findStub = sinon.stub(Task, 'find').returns({
        sort: sinon.stub().resolves(tasks)
      });

      const req = { user: { _id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getTasks(req, res);

      expect(findStub.calledOnceWith({ user: userId })).to.be.true;
      expect(res.json.calledWith(tasks)).to.be.true;

      findStub.restore();
    });

    it('should return 500 if fetching tasks fails', async () => {
      const findStub = sinon.stub(Task, 'find').throws(new Error('Fetch Error'));
      const req = { user: { _id: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getTasks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to fetch tasks' })).to.be.true;

      findStub.restore();
    });
  });
  
  describe('AddTask Function Test', () => {
    it('should create a new task successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const req = {
        user: { _id: userId },
        body: { 
          taskName: "New Task", 
          category: "Work", 
          startDate: "2026-03-31", 
          dueDate: "2026-04-30" 
        }
      };

      const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, user: userId };
      const createStub = sinon.stub(Task, 'create').resolves(createdTask);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createTask(req, res);

      // Matches the taskData object and user reference in taskController.js
      expect(createStub.calledOnceWith({ 
        taskName: "New Task",
        category: "Work",
        startDate: "2026-03-31",
        dueDate: "2026-04-30",
        user: userId 
      })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdTask)).to.be.true;

      createStub.restore();
    });

    it('should return 500 if an error occurs during creation', async () => {
      const createStub = sinon.stub(Task, 'create').throws(new Error('Database Failure'));
      const req = {
        user: { _id: new mongoose.Types.ObjectId() },
        body: { taskName: "Fail Task", startDate: "2026-03-31", dueDate: "2026-04-30" }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createTask(req, res);

      // Matches the catch block message: 'Failed to create task'
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to create task' })).to.be.true;

      createStub.restore();
    });
  });

  describe('Update Function Test', () => {
    it('should update task successfully', async () => {
      const taskId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      
      const existingTask = {
        _id: taskId,
        taskName: "Old Name",
        category: "Personal",
        status: "To Do",
        startDate: "2026-03-31",
        dueDate: "2026-04-30",
        save: sinon.stub().resolvesArg(0) 
      };

      // Controller uses findOne with both _id and user for security
      const findOneStub = sinon.stub(Task, 'findOne').resolves(existingTask);

      const req = {
        user: { _id: userId },
        params: { id: taskId },
        body: { 
          taskName: "Updated Name", 
          category: "Work", 
          status: "In Progress", 
          startDate: "2026-03-31", 
          dueDate: "2026-04-30" 
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateTask(req, res);

      expect(existingTask.taskName).to.equal("Updated Name");
      expect(existingTask.status).to.equal("In Progress");
      expect(res.json.calledOnce).to.be.true;

      findOneStub.restore();
    });

    it('should return 404 if task to update is not found', async () => {
      const findOneStub = sinon.stub(Task, 'findOne').resolves(null);
      const req = { 
          user: { _id: new mongoose.Types.ObjectId() }, 
          params: { id: new mongoose.Types.ObjectId() }, 
          body: { 
              taskName: "Test", 
              category: "Work", 
              status: "Done", 
              startDate: "2026-03-31", 
              dueDate: "2026-04-30" 
          } 
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateTask(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

      findOneStub.restore();
    });
  });

  describe('DeleteTask Function Test', () => {
    it('should delete a task successfully', async () => {
      const taskId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const mockTask = { 
          _id: taskId, 
          deleteOne: sinon.stub().resolves() // Matches .deleteOne() in your controller
      };

      const findOneStub = sinon.stub(Task, 'findOne').resolves(mockTask);
      const req = { params: { id: taskId }, user: { _id: userId } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteTask(req, res);

      expect(mockTask.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Task deleted' })).to.be.true;

      findOneStub.restore();
    });

    it('should return 404 if task to delete is not found', async () => {
      const findOneStub = sinon.stub(Task, 'findOne').resolves(null);
      const req = { 
        params: { id: new mongoose.Types.ObjectId() }, 
        user: { _id: new mongoose.Types.ObjectId() } 
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteTask(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

      findOneStub.restore();
    });
  });
});