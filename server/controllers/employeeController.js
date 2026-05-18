const Employee = require('../models/Employee');

// Add Employee
const addEmployee = async (req, res) => {
  const { name, email, department, skills, performanceScore, experience } = req.body;
  try {
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Employee with this email already exists' });

    const employee = await Employee.create({ name, email, department, skills, performanceScore, experience });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Employee by department
const searchEmployees = async (req, res) => {
  const { department } = req.query;
  try {
    const query = department ? { department: { $regex: department, $options: 'i' } } : {};
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEmployee, getEmployees, searchEmployees, updateEmployee, deleteEmployee };