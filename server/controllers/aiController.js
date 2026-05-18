const Employee = require('../models/Employee');
const axios = require('axios');

const getAIRecommendation = async (req, res) => {
  const { employeeId } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const prompt = `
      You are an HR AI assistant. Analyze this employee and give structured recommendations.
      
      Employee Details:
      - Name: ${employee.name}
      - Department: ${employee.department}
      - Skills: ${employee.skills.join(', ')}
      - Performance Score: ${employee.performanceScore}/100
      - Years of Experience: ${employee.experience}
      
      Provide:
      1. Promotion Recommendation (Yes/No and why)
      2. Training Suggestions (specific courses or skills)
      3. Overall Feedback
      4. Performance Rating (Excellent/Good/Average/Needs Improvement)
      
      Keep response concise and professional.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'EmployeeAI'
        }
      }
    );

    const recommendation = response.data.choices[0].message.content;
    res.json({ employee, recommendation });

  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.error?.message || error.message });
  }
};

const rankEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    const sorted = employees.sort((a, b) => b.performanceScore - a.performanceScore);

    const prompt = `
      Rank and analyze these employees:
      ${sorted.map((e, i) => `${i + 1}. ${e.name} - Score: ${e.performanceScore}, Dept: ${e.department}, Experience: ${e.experience} yrs`).join('\n')}
      
      Give a brief overall analysis and top 3 recommendations for the organization.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'EmployeeAI'
        }
      }
    );

    res.json({ rankedEmployees: sorted, aiAnalysis: response.data.choices[0].message.content });

  } catch (error) {
    console.error('AI Rank Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.error?.message || error.message });
  }
};

module.exports = { getAIRecommendation, rankEmployees };