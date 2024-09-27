const express = require("express");
const route = express.Router();
const { Document } = require("../model/document");
const { ValidateAuth } = require("../middleware/auth");


// Init New Document
route.post("/init", async (req, res) => {
  const { title } = req.body;
  try {
    const new_doc = await Document.create({ title });
    return res.status(200).json(new_doc);
  } catch (error) {
    console.error("Error creating document:", error);
    return res.status(500).json({ error: "Failed to create document" });
  }
});

// Render the All Document
route.get("/all",  ValidateAuth, async (req, res) => {
  try {
    const docs = await Document.findAll();
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetch all document:", error);
    return res.status(500).json({ error: "Failed to fetch all document" });
  }
});

// Rename the Title
route.patch("/docs/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const docs = await Document.findByPk(id);
    await docs.update({ title });
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetch document:", error);
    return res.status(500).json({ error: "Failed to fetch document" });
  }
});

// Render the specific Docs
route.get("/docs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Document.findByPk(id);
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetch document:", error);
    return res.status(500).json({ error: "Failed to fetch document" });
  }
});

// Delete the Specific file
route.delete("/docs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Document.destroy({ where: { id: id } });
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetch document:", error);
    return res.status(500).json({ error: "Failed to fetch document" });
  }
});

module.exports = route;
