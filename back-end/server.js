const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
require('dotenv').config();
const path = require('path');
const app = express();
app.use(cors());
app.use(bodyParser.json());



// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../front-end')));

// Add your existing routes and logic here

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../front-end/index.html'));
// });


/*
// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, 'dist')));

// All other routes should serve the React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
*/
const dbname = 'mediDB'
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: dbname
});

const dbcreate = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// const dbcreate = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
// });


// Function to start MySQL server
// const startMySQLServer = (callback) => {
//     // Command to start MySQL server
//     const startCommand = 'C:\\xampp\\xampp_start.exe'; // Use the appropriate command to start MySQL service
//     exec(startCommand, (err, stdout, stderr) => {
//         if (err) {
//             console.error(`Error starting MySQL server: ${err}`);
//             //return callback(err);
//         }
//         console.log('MySQL server started successfully.');
//         //callback();
//     });
// };




// startMySQLServer((err) => {
//     if (err) {
//         console.error('Failed to start MySQL server. Exiting...');
//         process.exit(1);
//     }

// });






    // Connect to the database and initialize
dbcreate.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
    //initializeDatabase();
});



// New POST route to create BD
// app.post('/dbcreate', (req, res) => {
//     const {user_name, password} = req.body;
//     if(user_name == "Nex7Medi" && password == "doc7xen"){
//         try{
//             initializeDatabase();
//         }
//         catch (error){
//             console.error('DB is not created', error);
//             return res.status(500).json({ message: 'DB is not created'});
//         }
//         //process.env.IS_DB_CREATED = true;
//         return res.status(201).json({ message: 'DB is created'});
//     }
//     return res.status(201).json({ message: 'Unauthorized Access'});
// });

// Function to initialize the database and tables
const initializeDatabase = () => {
    dbcreate.query(`CREATE DATABASE IF NOT EXISTS ${dbname}`, (err, result) => {
        if (err) throw err;
        console.log("Database created or already exists.");

        dbcreate.query(`USE ${dbname}`, (err, result) => {
            if (err) throw err;
            console.log(`Using database ${dbname}.`);

            const createPatientsTable = `
            CREATE TABLE IF NOT EXISTS Patients (
                p_id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                age VARCHAR(255),
                gender VARCHAR(255),
                phone_no VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        dbcreate.query(createPatientsTable, (err, result) => {
                if (err) throw err;
                console.log("Users table created or already exists.");
            });

            // create drugs table
            const createDrugsTable = `
            CREATE TABLE IF NOT EXISTS Drugs (
                d_id INT AUTO_INCREMENT PRIMARY KEY,
                drug_name VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        dbcreate.query(createDrugsTable, (err, result) => {
                if (err) throw err;
                console.log("Drug table created or already exists.");
            });

            // create treatment history table
            const createTreatmentHistoryTable = `
            CREATE TABLE IF NOT EXISTS TreatmentHistory (
                t_id INT AUTO_INCREMENT PRIMARY KEY,
                p_id INT,
                created_at VARCHAR(255),
                diagnosis VARCHAR(255) NOT NULL,
                FOREIGN KEY (p_id) REFERENCES Patients(p_id)
            )
        `;
        dbcreate.query(createTreatmentHistoryTable, (err, result) => {
                if (err) throw err;
                console.log("TreatmentHistory table created or already exists.");
            });

            // create DrugsTreatmentMapping table
            const createDrugsTreatmentMappingTable = `
            CREATE TABLE IF NOT EXISTS DrugsTreatmentMapping (
                td_id INT AUTO_INCREMENT PRIMARY KEY,
                t_id INT,
                d_id INT,
                note VARCHAR(255),
                FOREIGN KEY (t_id) REFERENCES TreatmentHistory(t_id),
                FOREIGN KEY (d_id) REFERENCES Drugs(d_id)
            )
        `;

        dbcreate.query(createDrugsTreatmentMappingTable, (err, result) => {
                if (err) throw err;
                console.log("DrugsTreatmentMapping table created or already exists.");
            });
        });
    });
};
initializeDatabase();

app.post('/add-patient', (req, res) => {
    const { "Full Name":full_name, "Age":age, "Gender":gender, "Telephone Number":phone_no } = req.body;
    const sql = "INSERT INTO Patients (full_name, age, gender, phone_no) VALUES (?, ?, ?, ?)";
    db.query(sql, [full_name, age, gender, phone_no], (err, result) => {
        if (err) {
            console.error('An error occurred while inserting patient data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Patient added successfully', id: result.insertId });
    });
});


// New POST route to insert drug data
app.post('/add-drug', (req, res) => {
    const { drug_name} = req.body;
    const sql = "INSERT INTO Drugs (drug_name) VALUES (?)";
    db.query(sql, [drug_name], (err, result) => {
        if (err) {
            console.error('An error occurred while inserting drug data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Drug added successfully', id: result.insertId });
    });
});


// New POST route to insert treatment data
app.post('/add-treatment', (req, res) => {
    const {"patientId":p_id, date, diagnosis, drugs} = req.body;
    //const created_at = new Date(date);
    let treatmentId;

    if (!Array.isArray(drugs)) {
        return res.status(400).json({ error: 'Drugs must be an array' });
    }


    const treatmentsql = "INSERT INTO TreatmentHistory (p_id, created_at, diagnosis) VALUES (?,?,?)";
    db.query(treatmentsql, [p_id, date, diagnosis], (err, result) => {
        if (err) {
            console.error('An error occurred while inserting TreatmentHistory data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        treatmentId =result.insertId;
       // return res.status(201).json({ message: 'TreatmentHistory added successfully', id: result.insertId });
        // Process each drug in the drugs array
        for (let i = 0; i < drugs.length; i++) {
            const { "id":Drug_id, Comments } = drugs[i];
            if (Drug_id === "") {
                //console.log("Drug_id = 0");
                continue;
            }
            //console.log("Drug_id != 0");
 
        const drugSql = "INSERT INTO DrugsTreatmentMapping (t_id, d_id, note) VALUES (?,?,?)";
        db.query(drugSql, [treatmentId, Drug_id, Comments], (err, result) => {
            if (err) {
                console.error('An error occurred while inserting drug mapping data: ', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    };
    return res.status(201).json({ message: 'Treatment added successfully'});
    });


            

});

// New POST route to get all active drug data
app.get('/get-active-drugs', (req, res) => {
    const sql = "SELECT d_id, drug_name,is_active FROM Drugs where is_active = '1' ";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('An error occurred while fetching active drugs: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(data);
    });
});

// New POST route to get all drug data
app.get('/get-all-drugs', (req, res) => {
    const sql = "SELECT d_id, drug_name, is_active FROM Drugs ORDER BY drug_name";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('An error occurred while fetching drugs: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(data);
    });
});



app.post('/patient-treatments', (req, res) => {
    const { p_id } = req.body;

    // Query to get treatment history for the patient
    const treatmentHistorySql = "SELECT * FROM TreatmentHistory WHERE p_id = ? ORDER BY t_id DESC";
    db.query(treatmentHistorySql, [p_id], (err, treatmentHistory) => {
        if (err) {
            console.error('An error occurred while fetching treatment history: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (treatmentHistory.length === 0) {
            return res.status(404).json({ message: 'No treatment history found for the given patient.' });
        }

        // For each treatment, get the corresponding drugs
        const treatmentIds = treatmentHistory.map(treatment => treatment.t_id);
        const drugsSql = `
            SELECT dtm.t_id, d.drug_name, d.d_id, dtm.note
            FROM DrugsTreatmentMapping dtm
            JOIN Drugs d ON dtm.d_id = d.d_id
            WHERE dtm.t_id IN (?)
        `;

        db.query(drugsSql, [treatmentIds], (err, drugs) => {
            if (err) {
                console.error('An error occurred while fetching drugs: ', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Merge the treatment history and corresponding drugs
            const result = treatmentHistory.map(treatment => {
                return {
                    ...treatment,
                    drugs: drugs.filter(drug => drug.t_id === treatment.t_id)
                };
            });

            return res.status(200).json(result);
        });
    });
});

// New POST route to get patient profile data by p_id
app.post('/get-patient-byid', (req, res) => {
    const {id} = req.body;
    const sql = "SELECT p_id, full_name, age, gender, phone_no FROM Patients WHERE  p_id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('An error occurred while fetching patient profile data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json(data);
    });
});

// New POST route to get all patient list
app.get('/get-all-patient', (req, res) => {
    
    const sql = "SELECT p_id, full_name, age, gender, phone_no FROM Patients";
    db.query(sql,(err, data) => {
        if (err) {
            console.error('An error occurred while fetching all patients data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Patients not found' });
        }
        return res.status(200).json(data);
    });
});


// New POST route to retrieve patient data by name and age number 
app.post('/get-patient', (req, res) => {
    const { name,age } = req.body;
    if(name!="" && age==""){
    const sql = "SELECT p_id, full_name, age, gender, phone_no FROM Patients WHERE LOWER(full_name) LIKE ?";
    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('An error occurred while retrieving patient data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json(results);
    });
}
else if(age!="" && name==""){
    const sql = "SELECT p_id, full_name, age, gender, phone_no FROM Patients WHERE LOWER(age) LIKE LOWER(?)";
    db.query(sql, [`%${age}%`], (err, results) => {
        if (err) {
            console.error('An error occurred while retrieving patient data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json(results);
    });
}
else if(age!="" && name!=""){
    const sql = "SELECT p_id, full_name, age, gender, phone_no FROM Patients WHERE LOWER(full_name) LIKE LOWER(?) AND LOWER(age) LIKE LOWER(?)";
    db.query(sql, [`%${name}%`, `%${age}%`], (err, results) => {
        if (err) {
            console.error('An error occurred while retrieving patient data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json(results);
    });
}
else {
    return res.status(400).json({ message: 'Please provide either full_name or age or both' });
}
});


app.post('/update-patient', (req, res) => {
    const { "Id":p_id, "Full Name":full_name, "Age":age, "Gender":gender, "Telephone Number":phone_no } = req.body;

    const sql = `
        UPDATE Patients 
        SET full_name = ?, age = ?, gender = ?, phone_no = ?
        WHERE p_id = ?
    `;
    const values = [full_name, age, gender, phone_no, p_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('An error occurred while updating patient details: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        return res.status(200).json({ message: 'Patient details updated successfully' });
    });
});

// New POST route to change the drug active status data
app.post('/update-drugs-status', (req, res) => {
    const {"id":d_id,is_active} = req.body;
    let tem=false;
    if(is_active==0){
        tem=true;
    }
    const sql = "UPDATE Drugs SET is_active = ? WHERE d_id = ?";
    db.query(sql, [tem, d_id],(err, data) => {
        if (err) {
            console.error('An error occurred while updating the drug active status: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(data);
    });
});

app.post('/update-drugs-name', (req, res) => {
    const {"id":d_id,drug_name} = req.body;
   
    const sql = "UPDATE Drugs SET drug_name = ? WHERE d_id = ?";
    db.query(sql, [drug_name, d_id],(err, data) => {
        if (err) {
            console.error('An error occurred while updating the drug name: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(data);
    });
});

////////////////////////////////////////////////////////////////FROM HERE ON/////////////////////////////////
app.get('/get-all-patient-count',(req,res) => {
    const sql = 'SELECT COUNT(*) AS size FROM Patients';
    db.query(sql,(err, data) => {
        if (err) {
            console.error('An error occurred while fetching all patients data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // if (data.length === 0) {
        //     return res.status(404).json({ message: 'Patients not found' });
        // }
        return res.status(200).json(data[0]);
    });
})
app.post('/get-rangeof-patients',(req,res)=>{
    const {from,to} = req.body;
    const sql = 'SELECT p_id, full_name, age, gender, phone_no FROM Patients LIMIT ? OFFSET ?';
    db.query(sql,[to,from],(err,data)=>{
        if (err) {
            console.error('An error occurred while fetching all patients data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(data);
    })
})

app.post('/Search-Patient-from-table',(req,res)=>{
    const {name} = req.body;
    if(name.length > 0){
    const sql = 'SELECT p_id, full_name, age, gender, phone_no FROM Patients WHERE LOWER(full_name) LIKE LOWER(?)';
    db.query(sql,[`%${name}%`],(err,data)=>{
        if (err) {
            console.error('An error occurred while fetching all patients data: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(data);
    })
}else{
    return res.status(404);
}
})


app.post('/bulk-patients',(req,res)=>{

    if(req.body.length > 0){
        console.log(req.body)
        req.body.forEach((value,index)=>{
            const { "Full Name":full_name, "Age":age, "Gender":gender, "Telephone Number":phone_no } = value;
            const sql = "INSERT INTO Patients (full_name, age, gender, phone_no) VALUES (?, ?, ?, ?)";
            db.query(sql, [full_name, age, gender, phone_no], (err, result) => {
                if (err) {
                    
                    console.error('An error occurred while inserting patient data: ', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                return
            });
        })
        res.status(200).json({text:"Success"})
    }else{

        res.status(400).json({error:"No data"})
    }
})

app.listen(8081, () => {
    console.log("listening on port 8081");
});
