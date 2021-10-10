SELECT 
    employee.role_id AS role_id, roles.title AS title
    FROM employee 
    JOIN roles ON employee.role_id = roles.id;