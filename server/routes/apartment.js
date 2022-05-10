import { Router } from "express";
import apartmentModel from "../models/apartment.js";

const apartment = Router();

apartment.get('/', async (req, res) => {
    const result = await apartmentModel.findAll();
    res.json(result);
});
// apartment.get('/:id', async (req, res) => {
//     const result = await apartment.findById();
//     res.json(result);
// });
// apartment.post('/', async (req, res) => {
//     const result = await apartment.create(req.body);
//     res.json(result);
// });
// apartment.put('/:id', async (req, res) => {
//     const result = await apartment.updateById();
//     res.json(result);
// });
// apartment.delete('/:id', async (req, res) => {
//     const result = await apartment.deleteById();
//     res.json(result);
// });

export default apartment;