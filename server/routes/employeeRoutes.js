const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, searchEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addEmployee);
router.get('/', protect, getEmployees);
router.get('/search', protect, searchEmployees);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;