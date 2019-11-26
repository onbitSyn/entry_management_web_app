const {Client} = require('pg');

const client = new Client({
    "user": "on_bit_syn",
    "password":"123",
    "host":"localhost",
    "port":5432,
    "database":"entry_management"
});


async function start(){
    try{
        await client.connect();
        console.log('successfully connecteed to database entry_management');
    }
    catch(err){
        console.log(__filename + ' on line number 17' + err);
    }
}


async function stop(){
    try{
        await client.end();
        console.log('successfully disconnectd from database');
    }
    catch(err){
        console.log(__filename + ' on line number 29' + err);
    }
}


async function entry(values){
    try{
        let result = await check_entry([values[0]]);
        if(result!==0){
            if(result !== null ) {
                let text = 'INSERT INTO history(phone_no,checkin_time,entry_gate,isemployee) VALUES($1,$2,$3,$4)';
                await client.query(text,values);
                console.log('successful');
                return {"status":1};
            }
            else{
                console.log('entry before exit');
                return {"status":2};
            }
        }
        else {
            console.log('error');
            return {"status":0};
        } 
    }
    catch(err){
        console.log(__filename + ' on line number 54' + err);
        return {"status":0};
    }
}

async function check_entry(values){
    try{
        let id = await getMaxId(values);
        console.log(id);
        if(id!==0){
            if(id !== null) {
                let text=`SELECT checkout_time FROM history WHERE id=${id}`;
                let result = await client.query(text);
                console.log(result.rows[0].checkout_time);
                return result.rows[0].checkout_time;
            }
            else{
                console.log("here");
                return 1;
            }
        }

    }
    catch(err){
        console.log(__filename + ' on line number 51' + err);
        return 0;
    }
}
async function getMaxId(values){
    try{
        let text = `SELECT MAX(id) FROM history WHERE phone_no=$1`;
        let result = await client.query(text,values);
        return result.rows[0].max;
    }
    catch(err){
        console.log(__filename + ' on line number 71' + err);
        return 0;
    }
}

async function exit(values){
    try{
        let result = await check_exit([values[0]]);
        if(result!==0){
            if(result[0] === null ) {
                let text = 'UPDATE history SET checkout_time=$2,exit_gate=$3 WHERE id=$1';
                values[0] = result[1];
                await client.query(text,values);
                console.log('successful for exit');
                return {"status":3};
            }
            else{
                console.log('exit before entry');
                return {"status":4};
            }
        }
        else {
            console.log('error');
            return {"status":0};
        }   
    }
    catch(err){
        console.log(__filename + ' on line number 54' + err);
        return {"status":0};
    }
}

async function check_exit(values){
    try{
        let id = await getMaxId(values);
        console.log(id);
        if(id!==0){
            if(id !== null) {
                let text=`SELECT checkout_time FROM history WHERE id=${id}`;
                let result = await client.query(text);
                console.log(result.rows[0].checkout_time);
                return [result.rows[0].checkout_time,id];
            }
            else{
                console.log("here");
                return 1;
            }
        }

    }
    catch(err){
        console.log(__filename + ' on line number 51' + err);
        return 0;
    }
}


//start();
//entry(['8708823287','2019-07-23 06:36:45',2,'1']);
//exit(['8708823287','2017-09-06 08:45:34',3]);
//exit(['9415436545','2017-08-06 09:42:20',4])


module.exports.start = start;
module.exports.stop = stop;
module.exports.entry = entry;
module.exports.exit = exit;