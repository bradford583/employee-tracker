INSERT INTO department(department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles(title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 60000, 2),
('Software Engineer', 123456, 2),
('Account Manager', 654321, 2),
('Accountant', 142536, 3),
('Legal Team Lead', 135153, 4);

INSERT INTO manager (first_name, last_name)
VALUES
('John', 'Doe'),
('Ashley', 'Rodriguez');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, 2),
('Mike', 'Chan', 2, NULL),
('Ashley', 'Rodriguez', 3, NULL),
('Kevin', 'Tupik', 4, NULL),
('Malia', 'Brown', 6, NULL),
('Sarah', ' Lourd', 7, NULL),
('Tom', 'Allen', 7, NULL);
