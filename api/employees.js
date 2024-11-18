const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/employees", async (req, res, next) => {     // GET /employees sends array of all employees
    try {
      const employees = await prisma.employee.findMany();
      res.json(employees);
    } catch (e) {
      next(e);
    }
});


router.post("/employees", async (req, res, next) => {        // POST /employees adds a new employee with the provided name
    const { title } = req.body;
    if (!title) {
      return next({
        status: 400,
        message: "Title must be provided for a new employee.",
      });
    }
    try {
      const employee = await prisma.employee.create({ data: { title } });
      res.status(201).json(employee);
    } catch (e) {
      next(e);
    }
});



router.get("/employees/:id", async (req, res, next) => {        // GEt /employees/:id sends an employee with specified ID
    const { id } = req.params;
  
    try {
      // `id` has to be converted into a number before looking for it!
      const employee = await prisma.employee.findUnique({ where: { id: +id } });
      if (employee) {
        res.json(employee);
      } else {
        next({ status: 404, message: `Employee with id ${id} does not exist.` });       //Sends 404 if employee does not exist 
      }
    } catch (e) {
      next(e);
    }
});



router.put("/employees/:id", async (req, res, next) => {      // PUT /employees/:id update the employee record with specified ID
    const { id } = req.params;
    const { title } = req.body;
  
    // Check if title was provided
    if (!title) {
      return next({
        status: 400,
        message: "A new title must be provided.",
      });
    }
  
    try {
      // Check if the employee exists
      const employee = await prisma.employee.findUnique({ where: { id: +id } });
      if (!employee) {
        return next({
          status: 404,
          message: `Employee with id ${id} does not exist.`,
        });
      }
  
      // Update the employee
      const updatedEmployee = await prisma.employee.update({
        where: { id: +id },
        data: { title },
      });
      res.json(updatedEmployee);
    } catch (e) {
      next(e);
    }
});



router.delete("/employees:id", async (req, res, next) => {      //Delete employee
    const { id } = req.params;
  
    try {
      // Check if the employee exists
      const employee = await prisma.employee.findUnique({ where: { id: +id } });
      if (!employee) {
        return next({
          status: 404,
          message: `Employee with id ${id} does not exist.`,
        });
      }
  
      // Delete the employee
      await prisma.employee.delete({ where: { id: +id } });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
});