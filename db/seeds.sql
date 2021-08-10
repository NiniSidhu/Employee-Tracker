INSERT INTO department (department_name)
VALUES 
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');



INSERT INTO employee_role (title, salary, department_id)
VALUES 
    ('Sales Lead', 50000, 1),
    ('Salesperson', 35000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 175000, 2),
    ('Account Manager', 140000, 1),
    ('Accountant', 125000, 1),
    ('Lawyer', 190000, 4),
    ('Legal Team Lead', 250000, 4);

INSERT INTO employee (first_name, last_name, employee_role_id, manager_id)
VALUES 
    ('Jaswinder', 'Deol', 1, NULL),
    ('Mintu', 'Batra', 2, 1),
    ('Amrinder', 'Randhawa', 3, NULL),
    ('Kulwinder', 'Billa', 4, NULL),
    ('Manpreet', 'Sidhu', 5, NULL),
    ('Surinder', 'Pannu', 6, NULL),
    ('Talwinder', 'Aulakh', 7, NULL);
