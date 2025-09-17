-- #1
INSERT INTO account('account_firstname', 'account_lastname', 'account_email', 'account_password')
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- #2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;


-- #3
DELETE FROM account
WHERE account_id = 1;


-- #4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') -- Added 'the' as well so it makes grammatical sense
WHERE inv_id = 10;


-- #5
SELECT inv_make, inv_model, classification_name
FROM inventory as i
	inner join classification as c on i.classification_id = c.classification_id
WHERE
	c.classification_id = 2;


-- #6
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');