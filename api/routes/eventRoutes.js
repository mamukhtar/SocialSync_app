/**
 * Event Management Routes
 * 
 * This handles all CRUD: creating, updating, and deleting events routes
 *  operations for calendar events including:
 * - Creating new events (POST /)
 * - Retrieving user's events (GET /)
 * - Updating existing events (PUT /:id)
 * - Deleting events (DELETE /:id)
 **/

const express = require('express');
const { PrismaClient } = require('@prisma/client'); 
const requireAuth = require('../middleware/requireAuth'); // Authentication middleware

// Initialize router and database client
const router = express.Router();
const prisma = new PrismaClient();

// Test route to confirm the file is loaded
router.get('/test', (req, res) => {
  res.json({ message: "Event routes are working!" });
});

// GET: Fetch all events for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        // Fetch events from the database where the user_id matches the authenticated user's ID
        const events = await prisma.event.findMany({
            where: { user_id: req.user.id }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
    }
});

// POST: Create a new event
router.post('/', requireAuth, async (req, res) => {
    
    try {
        const { title, description, event_date, location, category, imageUrl } = req.body;
        // Check for required fields
        if (!title || !event_date || !category) {
            return res.status(400).json({ message: "Title, event_date, and category are required" });
        }

        // Prepare new event data
        const newEventData = {
            user_id: req.user.id,
            title,
            description,
            event_date: new Date(event_date),
            location,
            category,
            imageUrl: imageUrl || null, // store the image URL
        };

        // Insert new event into the database
        const newEvent = await prisma.event.create({
            data: newEventData
        });

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
});

    

// PUT: Update an existing event by ID
router.put('/:id', requireAuth, async (req, res) => {
    const eventId = req.params.id;
    try {
        // Fetch the event to ensure it exists and belongs to the authenticated user
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event || event.user_id !== req.user.id) {
            return res.status(404).json({ message: "Event not found or not authorized" });
        }
        
        // Update fields from request body; only update if provided
        const { title, description, event_date, location, category, customLabel, imageUrl } = req.body;
        // Update the event in the database
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                title: title || event.title,
                description: description !== undefined ? description : event.description,
                event_date: event_date ? new Date(event_date) : event.event_date,
                location: location !== undefined ? location : event.location,
                category: category || event.category,
                customLabel: customLabel !== undefined ? customLabel : event.customLabel,
                imageUrl: imageUrl || null, // store the image URL
            }
        });

        res.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
});

// DELETE: Delete an existing event by ID
router.delete('/:id', requireAuth, async (req, res) => {
    const eventId = req.params.id;

    try {
        // Ensure the event exists and belongs to the authenticated user
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event || event.user_id !== req.user.id) {
            return res.status(404).json({ message: "Event not found or not authorized" });
        }

        // Delete the event from the database
        const deletedEvent = await prisma.event.delete({
            where: { id: eventId }
        });

        res.json({ message: "Event deleted successfully", event: deletedEvent });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
});

module.exports = router;


