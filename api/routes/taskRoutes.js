/**
 * Task Management Routes
 * 
 * This handles all CRUD: creating, updating, and deleting events routes
 *  operations for calendar tasks including:
 * - Creating new tasks (POST /)
 * - Retrieving user's tasks (GET /)
 * - Updating existing tasks (PUT /:id)
 * - Deleting tasks (DELETE /:id)
 **/

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const requireAuth = require('../middleware/requireAuth'); // Authentication middleware

const router = express.Router();
const prisma = new PrismaClient();

// Test route to confirm task routes are working
router.get('/test', (req, res) => {
  res.json({ message: "Task routes are working!" });
});

// GET: Fetch all tasks for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        // Fetch only tasks belonging to the authenticated user
        const tasks = await prisma.task.findMany({
            where: { user_id: req.user.id }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// POST: Create a new task
router.post('/', requireAuth, async (req, res) => {
    try {
        const { task_name, description, dueDate, status, event_id } = req.body;
        // Validate required fields
        if (!task_name || !dueDate) {
            return res.status(400).json({ message: "Task name and dueDate are required" });
        }
        // Prepare task data with user ownership
        const newTaskData = {
            user_id: req.user.id,
            task_name,
            description,
            dueDate: new Date(dueDate),
            status: status || "PENDING",  // Default to PENDING if not provided
            event_id: event_id || null      // Allow null if no event is linked
        };

        const newTask = await prisma.task.create({
            data: newTaskData
        });

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});

// PUT: Update an existing task by ID
router.put('/:id', requireAuth, async (req, res) => {
    const taskId = req.params.id;
    try {
        // Ensure the task exists and belongs to the authenticated user
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });
        if (!task || task.user_id !== req.user.id) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        // Partial update - only change provided fields
        const { task_name, description, dueDate, status, event_id } = req.body;
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                task_name: task_name || task.task_name,
                description: description !== undefined ? description : task.description,
                dueDate: dueDate ? new Date(dueDate) : task.dueDate,
                status: status || task.status,
                event_id: event_id !== undefined ? event_id : task.event_id,
            }
        });

        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// DELETE: Delete an existing task by ID
router.delete('/:id', requireAuth, async (req, res) => {
    const taskId = req.params.id;
    try {
        // Ensure the task exists and belongs to the authenticated user
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });
        if (!task || task.user_id !== req.user.id) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }
        // Delete the task
        const deletedTask = await prisma.task.delete({
            where: { id: taskId }
        });

        res.json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
});

module.exports = router;


